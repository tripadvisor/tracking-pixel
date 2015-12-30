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

  var URL_PATTERN = "*://*.tripadvisor.com/TrackingPixel*"; // TODO: Change this to the real URL

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function getParams(details) {
    var index;

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
      });

    },
    { urls: [URL_PATTERN] },
    [ 'requestBody' ]
  );

  chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.tabId < 0 || ['GET', 'POST'].indexOf(details.method) < 0) { return; }

      TabManager.logPixel(details.tabId, details.requestId, {
        url: details.url,
        status: details.statusCode
      });
    },
    { urls: [URL_PATTERN] }
  );

  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type !== 'error') { return; }
    TabManager.logPixel(sender.tab.id, guid(), {
      status: 400,
      params: request.params,
      errorMsg: request.msg
    });
  });

})(window, chrome);

// TODO: Remove this
function log() {
  chrome.extension.getBackgroundPage().console.log.apply(chrome.extension.getBackgroundPage().console, arguments);
}