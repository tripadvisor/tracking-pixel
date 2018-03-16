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

  var URL_PATTERN = "*://*.tamgrt.com/RT*";

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function isPixelRequest(details) {

    // Pixel requests can only get GET or POST
    if (['GET', 'POST'].indexOf(details.method) < 0) { return false; }

    // These are special requests, and not pixels
    if (details.url.indexOf('?-sync') >= 0 || details.url.indexOf('?-redirect') >= 0) { return false; }

    // It must be a pixel!
    return true;
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

  function validateConversion(params) {
    if (!params.event || params.event.toUpperCase() !== "BOOKING_CONFIRMATION") { return null; }

    var requiredParams = ['partner', 'refid', 'gbv', 'currency', 'order_id'];

    for (var i in requiredParams) {
      if (!requiredParams.hasOwnProperty(i)) { continue; }
      if (!params[requiredParams[i]]) {
        return false;
      }
    }

    return true;
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.tabId < 0 || !isPixelRequest(details)) { return; }

      var params = getParams(details);

      TabManager.logPixel(details.tabId, details.requestId, {
        url: details.url,
        status: -1,
        params: params,
        conversionStatus: validateConversion(params)
      });

    },
    { urls: [URL_PATTERN] },
    [ 'requestBody' ]
  );

  chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.tabId < 0 || !isPixelRequest(details)) { return; }

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
