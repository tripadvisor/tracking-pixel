/**
 * TA Pixel Helper
 *
 * Helps validate TripAdvisor Custom Audience pixels.
 *
 * @author mtownsend
 * @since Dec 2015
 */
(function() {

  'use strict';

  function log() {
    chrome.extension.getBackgroundPage().console.log.apply(chrome.extension.getBackgroundPage().console, arguments);
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      log('BEFORE REQUEST', details);
    },
    { urls: ["*://*.tripadvisor.com/*"] }
  );

  chrome.webRequest.onCompleted.addListener(
    function(details) {
      log('REQUEST COMPLETE', details);
    },
    { urls: ["*://*.tripadvisor.com/*"] }
  );

  chrome.webRequest.onErrorOccurred.addListener(
    function(details) {
      log('REQUEST ERROR', details);
    },
    { urls: ["*://*.tripadvisor.com/*"] }
  );

  log('THIS IS A TEST');

})();