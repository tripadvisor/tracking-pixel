/**
 * Error Listener
 *
 * Listens for errors broadcast from the tracking library
 * and hands them off to the background script.
 *
 * @author mtownsend
 * @since Dec 2015
 **/

(function(window, document, chrome) {

  console.log('attached');

  var ERROR_EVENT = '__ta_tracking_error'; // Matches definition in taevents.js

  window.addEventListener('message', function(event) {

    if (event.source !== window || event.data.type !== ERROR_EVENT) {
      return;
    }

    chrome.runtime.sendMessage({
      type: 'error',
      msg: event.data.msg,
      params: event.data.params
    });

  })

})(window, document, chrome);