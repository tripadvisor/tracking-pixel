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

  function _error(e) {
    console.log('ERROR! ', e.message, e.stack);
  }

  try {
    var queue = window.taq ? window.taq.queue : []
    ,   i
    ;

    window.taq = function (command) {
      try {
        var args = Array.prototype.slice.call(arguments, 1);

        // TODO: All the things!

        console.log(command, args);
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