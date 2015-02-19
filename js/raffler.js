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

define(['jquery', 'handlebars'], function ($, Handlebars) {
    'use strict';
    
    /**
     * Raffler constructor
     *
     * @param joindIN JoindIN - JoindIN object
     * @param options Object - Optional options to modify
     *
     * @return void
     */
    function Raffler(joindIN, options) {
        this.options = {
            selectors: {
                btnEventIDSubmit: '#btnRaffle',
                inputEventID: '#inputEventID',
                frmEventRaffle: '#frmRaffle',
                messagePane: '#msgPane',
                btnSearchToggle: '#btnSearch',
                frmSearch: '#frmSearch',
                btnSearchSubmit: '#btnSearchSubmit',
                btnSearchCancel: '#btnSearchCancel',
                inputQuery: '#inputQuery'
            },
            i18n: {
                // provide translations here:
                // e.g.
                // 'Retrieving data. Hang in there!' : 'De data wordt opgehaald. Even geduld...'
            },
            templates: {
                eventList: '#raffler-eventlist',
                loaderLeft: '#raffler-loaderLeft',
                loaderRight: '#raffler-loaderRight'
            },
            searchResultBtnClass: 'btnUseSearchResult',
            loader: 'assets/ajax-loader.gif',
            defaultLoaderPosition: 'left',
            hideSpeed: 'slow',
            defaultAnimationTimeout: 1500,
            uniqueWinners: true
        };

        /*
        if (typeof joindIN === 'undefined' || !(joindIN instanceof JoindIN)) {
            this._showMessage(
                this._t('No JoindIN object detected'),
                {
                    class:'bg-danger text-danger'
                }
            );
            return;
        }
        */
        this.api = joindIN;

        if (typeof options === 'undefined') {
            options = {};
        }

        this._mergeObjectData(this.options, options);

        this._init();
    }

    /**
     * Initializes the Raffler funtionality
     *
     * @return void
     */
    Raffler.prototype._init = function _init() {
        var self = this;

        this._winners = {};
        this._commenters = {};

        // Init Handlebars stuff
        this._initHandlebars();

        // Hide stuff
        this._hideMessage();
        $(this.options.selectors.frmSearch).hide();

        // Focus form element:
        var input = $(this.options.selectors.inputEventID);
        input.select();
        input.focus();

        // Handle form submissions:
        $(document).on('click', this.options.selectors.btnEventIDSubmit, function(e){
            e.preventDefault();
            self._handleFormSubmission();
        });

        // Handle search init button:
        $(document).on('click', this.options.selectors.btnSearchToggle, function(e){
            e.preventDefault();
            self._toggleSearchForm();
        });

        // Handle search cancel button:
        $(document).on('click', this.options.selectors.btnSearchCancel, function(e){
            e.preventDefault();
            self._toggleSearchForm();
        });

        // Handle search form submissions:
        $(document).on('click', this.options.selectors.btnSearchSubmit, function(e){
            e.preventDefault();
            self._handleSearchFormSubmission();
        });

        // Handle search result use btn:
        $(document).on('click', '.' + self.options.searchResultBtnClass, function(e){
            e.preventDefault();
            self._handleSearchResultSelection($(this).attr('id').replace('search-result-', ''));
        });
    };

    /**
     * Initializes all Handlebars functionality
     *
     * @return void
     */
    Raffler.prototype._initHandlebars = function _initHandlebars() {
        var self = this;

        // Translate helper:
        Handlebars.registerHelper('translate', function(s, params) {
            if (typeof params === 'undefined') {
                params = {};
            }
            return self._t(s, params);
        });

        // Compile templates:
        var tpls = ['eventList', 'loaderLeft', 'loaderRight'];
        for (var i=0; i < tpls.length; i++) {
            var tpl = tpls[i];
            var source   = $(self.options.templates[tpl]).html();
            self.options.templates[tpl] = Handlebars.compile(source);
        }
    };

    /**
     * Toggles between the search form & eventID form
     *
     * @return void
     */
    Raffler.prototype._toggleSearchForm = function _toggleSearchForm() {
        var self = this;
        self._hideMessage();
        $(this.options.selectors.frmEventRaffle).toggle();
        $(this.options.selectors.frmSearch).toggle();

        if ($(this.options.selectors.frmEventRaffle).is(':visible')) {
            $(this.options.selectors.inputEventID).select().focus();
        } else {
            $(this.options.selectors.inputQuery).select().focus();
        }
    };

    Raffler.prototype._handleSearchResultSelection = function _handleSearchResultSelection(eventID) {
        $(this.options.selectors.inputEventID).val(eventID);
        $(this.options.selectors.frmEventRaffle).parent().find('table').remove();
        $(this.options.selectors.frmEventRaffle).toggle();
        $(this.options.selectors.btnEventIDSubmit).click();
    };

    /**
     * Handles what happens on form submission
     *
     * @return void
     */
    Raffler.prototype._handleFormSubmission = function _handleFormSubmission() {
        var self = this;

        self._hideMessage();

        var eventID = $(this.options.selectors.inputEventID).val();
        if (!eventID.match(/^\d+$/)) {
            this._showMessage(
                this._t('An EventID consists only of digits'),
                {
                    class:'bg-danger text-danger',
                    autoClose: 3500
                }
            );

            return;
        }

        if (typeof this._winners[eventID] === 'undefined') {
            this._winners[eventID] = [];
        }
        if (typeof this._commenters[eventID] === 'undefined') {
            this._commenters[eventID] = [];
        }

        $(this.options.selectors.frmEventRaffle).toggle();
        if (this._commenters[eventID].length === 0) {
            this._showMessage(this._addLoader(this._t('Retrieving data. Hang in there...')));

            // Fetch the data:
            var promise = this.api.getAllEventCommenters(eventID);
            promise.done(function(commenters){
                window.setTimeout(function(){
                    self._commenters[eventID] = commenters;
                    self._hideMessage();
                    self._showMessage(self._addLoader(self._t('All commenters retrieved. Randomizing...')));
                    self._showRandomCommenter(eventID, commenters);
                },self.options.defaultAnimationTimeout);
            });
        } else {
            self._hideMessage();
            self._showMessage(self._addLoader(self._t('Commenters already retrieved. Randomizing...')));
            self._showRandomCommenter(eventID, self._commenters[eventID]);
        }
    };

    /**
     * Handles what happens on searchform submission
     *
     * @return void
     */
    Raffler.prototype._handleSearchFormSubmission = function _handleSearchFormSubmission() {
        var self = this;

        self._hideMessage();

        var query = $(this.options.selectors.inputQuery).val();

        $(this.options.selectors.frmSearch).hide();
        this._showMessage(this._addLoader(this._t('Searching events...')));

        // Fetch the data:
        var promise = this.api.searchEventsByTitle(query);
        promise.done(function(events){
            window.setTimeout(function(){
                self._hideMessage();
                self._showEventList(events);
            },self.options.defaultAnimationTimeout);
        });
    };

    Raffler.prototype._showEventList = function _showEventList(events) {
        var self = this;

        if (events.length === 0) {
            this._showMessage(
                this._t('No events found matching your query'),
                {
                    class: 'bg-danger text-danger',
                    autoClose: 3500
                }
            );
            $(this.options.selectors.frmSearch).show();
            return;
        }

        var evts = [];
        for (var i = 0; i < events.length; i++) {
            var eventID = events[i].uri.split('/').pop();
            evts.push({
                id: eventID,
                name: events[i].name,
                btnClass: self.options.searchResultBtnClass
            });
        }

        $(this.options.selectors.frmSearch).parent().append(
            self.options.templates.eventList({events: evts})
        );
    };

    /**
     * Randomly shows 1 commenter from the given list
     *
     * @param eventID int - ID of the JoindIN event
     * @param commenters Array - List of commenter names
     *
     * @return void
     */
    Raffler.prototype._showRandomCommenter = function _showRandomCommenter(eventID, commenters) {
        var self = this;

        var winner;
        while(typeof winner === 'undefined') {
            if (commenters.unique().length === self._winners[eventID].length) {
                break;
            }

            var rnd = Math.floor(Math.random() * commenters.length);
            var commenter = commenters[rnd];

            if (self.options.uniqueWinners) {
                if (self._winners[eventID].indexOf(commenter) === -1) {
                    winner = commenter;
                    break;
                }
            } else {
                winner = commenter;
                break;
            }
        }

        window.setTimeout(function(){
            if (typeof winner !== 'undefined') {
                self._winners[eventID].push(winner);
                self._hideMessage();
                self._showMessage(
                    self._t('The winner is <strong class="winner">{winner}</strong>', {winner: winner}),
                    {
                        class:'bg-success text-success',
                    }
                );
            } else {
                self._hideMessage();
                self._showMessage(
                    self._t('The list of commenters is exhausted'),
                    {
                        class:'bg-info text-info',
                        autoClose: 3500
                    }
                );
            }
            $(self.options.selectors.frmEventRaffle).toggle();
            var input = $(self.options.selectors.inputEventID);
            input.select();
            input.focus();
        },self.options.defaultAnimationTimeout);
    };

    /**
     * Shows a message
     *
     * @param message string - The message to show
     * @param options Object - Options
     *
     * @return void
     */
    Raffler.prototype._showMessage = function _showMessage(message, options){
        var self = this;
        if (typeof options === 'undefined') {
            options = {};
        }

        var msgPane = $(this.options.selectors.messagePane);
        msgPane.html(message);

        if (typeof options.class !== 'undefined') {
            msgPane.addClass(options.class);
        }

        if (typeof options.autoClose !== 'undefined') {
            window.setTimeout(function(){
                self._hideMessage({speed: self.options.hideSpeed});
            }, options.autoClose);
        }

        msgPane.show();
    };

    /**
     * Resets the Message Pane to a default state
     *
     * @param options Object - Options
     *
     * @return void
     */
    Raffler.prototype._hideMessage = function _hideMessage(options){
        var self = this;
        if (typeof options === 'undefined') {
            options = {};
        }

        var msgPane = $(this.options.selectors.messagePane);

        if (typeof options.speed !== 'undefined') {
            msgPane.hide(options.speed);
        } else {
            msgPane.hide();
        }
        msgPane.html('');
        msgPane.attr('class', '');
    };

    /**
     * Adds an Ajax Loading indicator image to given text
     *
     * @param text string - The original text
     * @param position string - 'left' or 'right'
     *
     * @return string
     */
    Raffler.prototype._addLoader = function _addLoader(text, position) {
        var self = this;
        if (typeof position === 'undefined') {
            position = this.options.defaultLoaderPosition;
        }

        switch (position) {
            case 'right':
                text = self.options.templates.loaderRight({
                    text: text,
                    path: self.options.loader
                });
                break;
            case 'left':
            default:
                text = self.options.templates.loaderLeft({
                    text: text,
                    path: self.options.loader
                });
                break;
        }

        return text;
    };

    /**
     * Translates given text, if a translation is available
     *
     * @param text string
     * @param replacements Object - Optional replacement parameters
     *
     * @return string
     */
    Raffler.prototype._t = function _t(text, replacements) {
        if (typeof this.options.i18n[text] !== 'undefined') {
            text = this.options.i18n[text];
        }

        var varPattern = /\{([a-zA-Z\.-_]+)\}/;
        var matches;
        while(matches = text.match(varPattern)) {
            for (var i = 0; i < (matches.length / 2); i += 2) {
                var search = matches[i];
                var replace = replacements;
                var replaceParts = matches[i+1].split('.');
                for (var j = 0; j < replaceParts.length; j++) {
                    replace = replace[replaceParts[j]];
                }

                text = text.replace(search, replace);
            }
        }

        return text;
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
     * @return Raffler - Current instance for chaining
     */
    Raffler.prototype._mergeObjectData = function _mergeObjectData(obj1, obj2) {
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

    return Raffler;

});
