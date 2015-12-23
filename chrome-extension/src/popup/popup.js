/**
 * Popup
 *
 * Logic and rendering code for extension popup
 *
 * @author mtownsend
 * @since Dec 2015
 **/
(function(window, document, chrome) {

  'use strict';

  function renderPixels() {

    var pixelList = document.getElementById('pixels');

    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      // There will always be exactly one active tab, so this is safe
      var tab = chrome.extension.getBackgroundPage().TabManager.get(tabs[0].id);

      Object.keys(tab.pixels).forEach(function(requestId) {
        var pixelData = tab.pixels[requestId]
        ,   pixel = document.createElement('li')
        ;

        pixel.className = 'pixel';
        pixel.innerText = requestId;
        // TODO

        pixelList.appendChild(pixel);
      });

      if (pixelList.childElementCount > 0) {
        document.getElementById('no-pixels').style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', renderPixels);

})(window, document, chrome);