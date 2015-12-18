/**
 * TA Tracking Library
 *
 * Lightweight library for allowing parters to
 * send customer behaviour events to TA.
 *
 * @author mtownsend
 * @since Dec 2015
 **/

(function(window, document, undefined) {
  'use strict';

  var URL = 'http://localhost';

  var _id = null;

  function _error(e) {
    console.log('ERROR! ', e.message, e.stack);
  }

  function _request(data, callback) {
    var x = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0')
    ,   url = URL
    ,   i
    ;

    for (i in data) {
      url += (url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(i) + '=' + encodeURIComponent(data[i]);
    }

    x.open('GET', url, 1);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send();
  }

  function _init(id) {
    _id = id;
  }

  function _track(event, data) {

    if (!_id) {
      console.error('TripAdvisor partner ID must be specified before tracking');
    }

    data = data || {};
    data.id = _id;
    data.command = 'track';
    data.event = event;
    _request(data, function(r) { console.log('RESPONSE!', r); });
  }

  try {
    var queue = window.taq ? window.taq.queue : []
    ,   i
    ;

    window.taq = function (command) {
      try {
        var args = Array.prototype.slice.call(arguments, 1);

        switch(command.toLowerCase()) {
          case "init":
            return _init(args[0]);
          case "track":
            return _track(args[0], args[1]);
        }

      } catch(e) {
        // Some problem in event execution
        _error(e);
      }
    };

    // Run all the queued stuff now that we're loaded
    for (i in queue) {
      window.taq.apply(null, queue[i]);
    }
  } catch(e) {
    // Some problem in library definition
    _error(e);
  }

})(window, document);