if (typeof jQuery === 'undefined') {
    throw new Error('JoindIN requires jQuery to function propertly');
}

if (typeof Array.prototype.unique === 'undefined') {
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };
}

(function($){
    'use strict';

    /**
     * JoindIN constructor
     *
     * @param options Object - Optional options to modify
     *
     * @return void
     */
    function JoindIN(options) {
        if (typeof options === 'undefined') {
            options = {};
        }

        this.options = {
            weighted: true, // when true, the more you comment, the more chance you have of being picked
            api: {
                version: 'v2.1',
                nameField: 'user_display_name', // what's the name of the field which holds the commenter's name?
                amountPerPage: 20, // amount of comments per page of comments
                url: {
                    base: 'http://api.joind.in/{api.version}',
                    event: '{api.url.base}/events/{eventID}',
                    events: '{api.url.base}/events',
                    eventComments: '{api.url.event}/comments',
                    talks: '{api.url.event}/talks'
                }
            }
        };

        this._mergeObjectData(this.options, options);
    }

    /**
     * Returns a list of all commenters of given event
     *
     * @param eventID int - The ID of the event
     *
     * @return void
     */
    JoindIN.prototype.getAllEventCommenters = function getAllEventCommenters(eventID) {
        var self = this;

        var commentsPromise = this._collectCommenters(eventID);

        // create deferred object:
        var dfrd = $.Deferred();

        // create promise to return:
        var promise = dfrd.promise();

        commentsPromise.done(function(commenters){
            if (!self.options.weighted) {
                commenters = commenters.unique();
            }

            dfrd.resolve(commenters);
        });

        return promise;
    };

    /**
     * Returns a list of events matching given query
     *
     * @param query string - The search query
     *
     * @return void
     */
    JoindIN.prototype.searchEventsByTitle = function searchEventsByTitle(query) {
        var self = this;

        var eventsPromise = this._collectEvents(query);

        // create deferred object:
        var dfrd = $.Deferred();

        // create promise to return:
        var promise = dfrd.promise();

        eventsPromise.done(function(events){
            dfrd.resolve(events);
        });

        return promise;
    };

    /**
     * Collects the events matching given query
     *
     * @param query string - The query to search for
     *
     * @return Object - A promise
     */
    JoindIN.prototype._collectEvents = function _collectEvents(query) {
        var urlEvents = this._getUrl(
            'events',
            this.options
        );
        urlEvents += '&filter=hot&title=' + encodeURIComponent(query);

        // create deferred object:
        var dfrd = $.Deferred();

        // create promise to return:
        var promise = dfrd.promise();

        $.when(
            this._doRequest(urlEvents)
        ).done(function(data){
            var events = data.events;
            dfrd.resolve(events);
        });
        return promise;
    };

    /**
     * Collects the commenters of an event and all its talks
     *
     * @param eventID int - The ID of the event
     *
     * @return Object - A promise
     */
    JoindIN.prototype._collectCommenters = function _collectCommenters(eventID) {
        // collect event commentors
        var urlEventComments = this._getUrl(
            'eventComments',
            this._mergeObjectData({eventID: eventID}, this.options)
        );
        var urlTalks = this._getUrl(
            'talks',
            this._mergeObjectData({eventID: eventID}, this.options)
        );

        var self = this;

        // global list of commenters:
        var commenters = [];

        // create deferred object:
        var dfrd = $.Deferred();

        // create promise to return:
        var promise = dfrd.promise();

        // async get the event comments & all the talk URL's:
        $.when(
            this._doRequest(urlEventComments),
            this._doRequest(urlTalks)
        ).done(function(resultEventComments, resultTalks){
            // extract comments from the Event:
            if (resultEventComments[1] === 'success') {
                commenters = commenters.concat(self._extractComments(resultEventComments[0]));
            }

            // fetch all talks with comments:
            if (resultTalks[1] === 'success') {
                var talksWithComments = self._extractTalksWithComments(resultTalks[0]);

                // keep track of al list of deffered objects. Each object is a deferred AJAX call to the API
                var deferredCalls = [];
                for (var i = 0; i < talksWithComments.length; i++) {
                    deferredCalls.push(self._doRequest(talksWithComments[i]));
                }

                // Group the deferred calls:
                var grouped = $.when.apply(self, deferredCalls);

                // When all deferred objects are resolved, extract comments and trigger
                // the "done" method on the returned promise
                grouped.done(function() {
                    for (var i = 0; i < arguments.length; i++) {
                        commenters = commenters.concat(self._extractComments(arguments[i][0]));
                    }

                    commenters = commenters.filter(function(el){
                        return (el !== null);
                    });
                    dfrd.resolve(commenters);
                });
            }
        });

        return promise;
    };

    /**
     * Extracts a list of talks with comments from the given data
     *
     * @param data Array
     *
     * @return Array - List of URL's of talks with comments
     */
    JoindIN.prototype._extractTalksWithComments = function _extractTalksWithComments(data) {
        var talks = [];
        for (var i = 0; i < data.meta.count; i++) {
            if (data.talks[i].comment_count === 0) {
                continue;
            }

            var url = data.talks[i].comments_uri;

            if (-1 === url.indexOf('?')) {
                url += '?callback=?';
            } else {
                url += '&callback=?';
            }

            talks.push(url);
        }

        return talks;
    };

    /**
     * Extracts the commenters from given data
     *
     * @param data Array
     *
     * @return Array - List of commenters
     */
    JoindIN.prototype._extractComments = function _extractComments(data) {
        var commenters = [];
        for (var i = 0; i < data.comments.length; i++) {
            commenters.push(data.comments[i][this.options.api.nameField]);
        }

        // Only unique commenters per data set are returned:
        return commenters.unique();
    };

    /**
     * Executes a JSONP request to given URL and on success executes fnSuccess
     * with the returned data as a parameter
     *
     * @param url string - The URL
     * @param fnSuccess Function - On success function
     *
     * @return jqXhr
     */
    JoindIN.prototype._doRequest = function _doRequest(url, fnSuccess) {
        if (typeof fnSuccess === 'undefined') {
            fnSuccess = function(data) {};
        }

        var promise = $.getJSON(url, null, function(data) {
            fnSuccess(data);
        });

        return promise;
    };

    /*
     * Returns the requested url from the options
     *
     * @param urlName string - The name of the url
     * @param data Object - Replacement data for in the url templates
     *
     * @return string
     */
    JoindIN.prototype._getUrl = function _getUrl(urlName, data) {
        var url = this.options.api.url[urlName];
        var varPattern = /\{([a-zA-Z\.-_]+)\}/;
        var matches;
        while(matches = url.match(varPattern)) {
            for (var i = 0; i < (matches.length / 2); i += 2) {
                var search = matches[i];
                var replace = data;
                var replaceParts = matches[i+1].split('.');
                for (var j = 0; j < replaceParts.length; j++) {
                    replace = replace[replaceParts[j]];
                }

                url = url.replace(search, replace);
            }
        }

        if (-1 === url.indexOf('?')) {
            url += '?callback=?';
        } else {
            url += '&callback=?';
        }

        return url;
    };

    /**
     * Recursively merge values in an object
     *
     * Method allows to set individual settings, without overwriting
     * existing other values in the settings.
     *
     * @param obj1 Object - The object to modify
     * @param obj2 Object - New values for obj1
     *
     * @return JoindIN - Current instance for chaining
     */
    JoindIN.prototype._mergeObjectData = function _mergeObjectData(obj1, obj2) {
        var self = this;
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if ( obj2[p].constructor == Object ) {
                    obj1[p] = self._mergeObjectData(obj1[p], obj2[p]);
                } else {
                    if ( obj2[p].constructor !== Function ) {
                        var getValue = obj2[p];
                        obj1[p] = getValue;
                    }
                }
            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }

        return obj1;
    };

    window.JoindIN = JoindIN;

})(jQuery);
