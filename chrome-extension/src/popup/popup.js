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
    var pixel = document.importNode(pixelTemplate.content, true)
    ,   details = pixel.querySelector('.pixel-details')
    ;

    if (data.status !== 200) {
      pixel.querySelector('.pixel').classList.add('error');
      pixel.querySelector(".pixel-status").innerText = data.errorMsg || chrome.i18n.getMessage("failure");
    } else {
      pixel.querySelector(".pixel-status").innerText = chrome.i18n.getMessage("success");
    }

    pixel.querySelector(".pixel-event").innerText = chrome.i18n.getMessage("eventId", data.params.event);
    pixel.querySelector("summary").innerText = chrome.i18n.getMessage("details");

    Object.keys(data.params).forEach(function(key) {
      var item = document.createElement('li')
      ,   keyEl = document.createElement('span')
      ;

      keyEl.innerText = key + ':';
      keyEl.className = 'key';
      item.appendChild(keyEl);
      item.appendChild(document.createTextNode(data.params[key]));
      details.appendChild(item);
    });

    return pixel;
  }

  function render() {

    var pixelList = document.querySelector('#pixels')
    ,   summary = document.querySelector('#summary')
    ;

    pixelTemplate = document.querySelector('#pixel-template');
    document.querySelector('h1').innerText = chrome.i18n.getMessage("extName");

    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      // There will always be exactly one active tab, so this is safe
      var tab = chrome.extension.getBackgroundPage().TabManager.get(tabs[0].id)
      ,   pixels = document.createDocumentFragment()
      ;

      Object.keys(tab.pixels).forEach(function(requestId) {
        pixels.appendChild(createPixel(tab.pixels[requestId]));
      });

      pixelList.appendChild(pixels);
      if (pixelList.childElementCount > 0) {
        summary.innerText = chrome.i18n.getMessage("pixelsFound", pixelList.childElementCount.toString());
      } else {
        summary.innerText = chrome.i18n.getMessage("noPixels");
      }
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

  document.addEventListener('DOMContentLoaded', render);

})(window, document, chrome);