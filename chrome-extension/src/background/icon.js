/**
 * Icon
 *
 * Manages the display of the extension icon
 *
 * @author mtownsend
 * @since Dec 2015
 */
(function(window, chrome) {

  'use strict';

  var GOOD_COLOUR = '#6BB933'
  ,   ERR_COLOUR = '#FF0000'
  ,   ACTIVE_ICON = { '19': 'icon.png', '38': 'icon.png' } // TODO
  ,   FADED_ICON = { '19': 'icon.png', '38': 'icon.png' } // TODO
  ;

  function countCompletedPixels(pixels) {
    return Object.keys(pixels).reduce(function(p,c) {
      return p + (pixels[c].status < 0 ? 0 : 1);
    }, 0);
  }

  // Export
  window.Icon = {
    /**
     * Updates the icon display
     * @param tab The tab data that changed
     */
    update: function(tab) {
      var count = countCompletedPixels(tab.pixels);
      chrome.browserAction.setBadgeText({ text: count ? '' + count : '', tabId: tab.id });
      chrome.browserAction.setBadgeBackgroundColor({ color: tab.error ? ERR_COLOUR : GOOD_COLOUR, tabId: tab.id });
      chrome.browserAction.setIcon({ path: count ? ACTIVE_ICON : FADED_ICON, tabId: tab.id });
    }
  };
})(window, chrome);