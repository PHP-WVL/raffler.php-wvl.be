if (typeof jQuery === 'undefined') {
	throw new Error('Meetup requires jQuery to function propertly');
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
	 * Meetup constructor
	 *
	 * @param options Object - Optional options to modify
	 *
	 * @return void
	 */
	function Meetup(options) {
		if (typeof options === 'undefined') {
			options = {};
		}

		this.options = {
			api: {
				version: '2',
				key: '',
				requestKey: function() {
					var self = this;
					self.options.api.key = prompt('API Key');
				},
				nameField: 'member.name', // what's the name of the field which holds the commenter's name?
				url: {
					base: 'http://api.meetup.com/{api.version}',
					rsvps: '{api.url.base}/rsvps?key={api.key}&event_id={eventID}&rsvp=yes&sort=name'
				}
			}
		};

		this._mergeObjectData(this.options, options);
}

	/**
	 * Returns a list of names of people who RSVP'ed to the event
	 *
	 * @param url string - Meetup URL
	 *
	 * @return Object - A promise
	 */
	Meetup.prototype.getRsvpsFromEventUrl = function getRsvpsFromEventUrl(url) {
		var self = this;

		// create deferred object:
		var dfrd = $.Deferred();

		// create promise to return:
		var promise = dfrd.promise();

		var eventID = self._extractEventIDFromUrl(url);
		if (null === eventID) {
			// could not extract eventID...
			// resolve promise with empty array
			dfrd.resolve([]);
			return promise;
		}

		var urlRsvps = this._getUrl(
			'rsvps',
			this._mergeObjectData({eventID: eventID}, this.options)
		);

		$.when(
			this._doRequest(urlRsvps)
		).done(function(data){
			var rsvpNames = self.getNamesFromRsvpData(data.results);
			dfrd.resolve(rsvpNames);
		});
		return promise;
	};

	/**
	 * Extracts the Meetup EventID from given URL
	 *
	 * @param url string - Meetup URL
	 *
	 * @return int
	 */
	Meetup.prototype._extractEventIDFromUrl = function _extractEventIDFromUrl(url) {
		var self = this;

		var eventID = null;
		var varPattern = /\/(\d+)\//;
		var matches = url.match(varPattern);
		if (matches) {
			eventID = matches[1];
		}

		return eventID;
	};

	/**
	 * Reduces given list of RSVP data to a list of names
	 *
	 * @param data Array - RSVP data from the API
	 *
	 * @return Array
	 */
	Meetup.prototype.getNamesFromRsvpData = function getNamesFromRsvpData(data) {
		var self = this;

		var arrNames = [];

		for (var i = 0; i < data.length; i++) {
			arrNames.push(data[i].member.name);
		}

		return arrNames;
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
	Meetup.prototype._doRequest = function _doRequest(url, fnSuccess) {
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
	Meetup.prototype._getUrl = function _getUrl(urlName, data) {
		var self = this;

		if (self.options.api.key.length === 0) {
			self.options.api.requestKey.call(self);
		}

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
	 * @return Meetup - Current instance for chaining
	 */
	Meetup.prototype._mergeObjectData = function _mergeObjectData(obj1, obj2) {
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

	window.Meetup = Meetup;

})(jQuery);
