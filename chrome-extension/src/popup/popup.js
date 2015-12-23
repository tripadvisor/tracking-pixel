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

  var pixelTemplate;

  function createPixel(data) {
    var pixel = document.importNode(pixelTemplate.content, true);

    if (data.status !== 200) {
      pixel.classList.add('error');
      pixel.querySelector(".pixel-status").innerText = "Pixel failed to load!";
    } else {
      pixel.querySelector(".pixel-status").innerText = "Pixel loaded successfully.";
    }

    pixel.querySelector(".pixel-event").innerText = "Event ID: " + data.params.event;

    return pixel;
  }

  function renderPixels() {

    var pixelList = document.querySelector('#pixels')
    ,   summary = document.querySelector('#summary')
    ;

    pixelTemplate = document.querySelector('#pixel-template');

    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      // There will always be exactly one active tab, so this is safe
      var tab = chrome.extension.getBackgroundPage().TabManager.get(tabs[0].id)
      ,   pixels = document.createDocumentFragment()
      ;

      Object.keys(tab.pixels).forEach(function(requestId) {
        pixels.appendChild(createPixel(tab.pixels[requestId]));
      });

      pixelList.appendChild(pixels);
      summary.innerText = summary.innerText.replace("{num}", pixelList.childElementCount > 0 ? pixelList.childElementCount : 'No');
    });

    pixelList.addEventListener('click', function(e) {
      var target = e.target;
      if (target.nodeName === 'SUMMARY') { return; }
      while (target && target.nodeName !== 'LI') {
        target = target.parentNode;
      }
      if (!target || target.nodeName !== 'LI') { return; }
      target.querySelector('summary').click();
    });
  }

  document.addEventListener('DOMContentLoaded', renderPixels);

})(window, document, chrome);