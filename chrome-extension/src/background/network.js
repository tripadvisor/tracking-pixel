/**
 * Network
 *
 * Observes network traffic and logs pixel requests
 *
 * @author mtownsend
 * @since Dec 2015
 */
(function(window, chrome) {

  'use strict';

  function getParams(details) {
    var search
    ,   index
    ;

    if (details.requestBody) {
      // This was a POST, so just flatten the map
      return Object.keys(details.requestBody.formData).reduce(function(p,c) {
        p[c] = details.requestBody.formData[c][0];
        return p;
      }, {});
    } else {
      // This was a GET, so we have to parse the URL
      index = details.url.indexOf('?');
      if (index < 0) return {};
      return details.url.substring(index + 1).split('&').reduce(function(p,c) {
        var pair = c.split('=');
        if (pair.length < 2) { pair[1] = ''; }
        p[pair[0]] = pair[1];
        return p;
      }, {});
    }
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.tabId < 0 || ['GET', 'POST'].indexOf(details.method) < 0) { return; }

      TabManager.logPixel(details.tabId, details.requestId, {
        url: details.url,
        status: -1,
        params: getParams(details)
        // TODO: Retrieve request data for GET/POST
      });

    },
    { urls: ["*://*.tripadvisor.com/*"] },
    [ 'requestBody' ]
  );

  chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.tabId < 0 || ['GET', 'POST'].indexOf(details.method) < 0) { return; }

      TabManager.logPixel(details.tabId, details.requestId, {
        url: details.url,
        status: details.statusCode
      }, details.statusCode !== 200);
    },
    { urls: ["*://*.tripadvisor.com/*"] }
  );


})(window, chrome);

// TODO: Remove this
function log() {
  chrome.extension.getBackgroundPage().console.log.apply(chrome.extension.getBackgroundPage().console, arguments);
}