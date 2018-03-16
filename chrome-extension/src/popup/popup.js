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
    ,   conversionStatus = document.createElement('span')
    ,   isConversion = data.conversionStatus !== null
    ;

    if (data.status !== 200) {
      pixel.querySelector('.pixel').classList.add('error');
      pixel.querySelector(".pixel-status").innerText = data.errorMsg || chrome.i18n.getMessage("failure");
    } else {
      pixel.querySelector(".pixel-status").innerText = chrome.i18n.getMessage("success") + (isConversion ? '*' : '');
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

    conversionStatus.className = 'conversion-status';
    if (data.conversionStatus === false && data.status === 200) {
      conversionStatus.innerText = '* ' + chrome.i18n.getMessage('conversionFail');
      pixel.querySelector('.pixel').classList.add('problem');
      details.appendChild(conversionStatus);
    } else if (data.conversionStatus === true && data.status === 200) {
      conversionStatus.innerText = '* ' + chrome.i18n.getMessage('conversionSuccess');
      details.appendChild(conversionStatus);
    }

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
      while (target && target.className !== 'pixel') {
        target = target.parentNode;
      }
      if (!target || target.className !== 'pixel') { return; }
      target.querySelector('summary').click();
    });
  }

  document.addEventListener('DOMContentLoaded', render);

})(window, document, chrome);
