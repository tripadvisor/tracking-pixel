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

  var URL = 'http://10.110.255.252/';
  var POST_MAX = 1024; // Max size of the POST payload (TBD)

  var _id = null;

  function _error(e) {
    // TODO: Send error to TA and/or log somewhere that the browser extension can pick up
    console.error(e.message, e.stack);
  }

  function _userError(msg) {
    // TODO: Log this somewhere that the browser extension can pick up
    console.error(msg);
  }

  function _request(data, callback) {
    var x = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0')
    ,   params = ''
    ,   i
    ;

    for (i in data) {
      params += (params.length > 0 ? '&' : '') + encodeURIComponent(i) + '=' + encodeURIComponent(data[i]);
      if (params.length >= POST_MAX) {
        _userError('Tracking parameters too long');
        return;
      }
    }

    x.open('POST', URL, 1);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(params);
  }

  function _init(id) {
    _id = id;
  }

  function _track(event, data) {

    if (!_id) {
      _userError('Partner ID not specified');
      return;
    }

    data = data || {};
    data.id = _id;
    data.event = event;
    _request(data, function(r) { document.write('RESPONSE! ' + r); }); // TODO: Remove
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