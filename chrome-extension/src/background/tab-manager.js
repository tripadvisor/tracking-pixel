/**
 * Tab Manager
 *
 * Keeps track of pixels per active tab
 *
 * @author mtownsend
 * @since Dec 2015
 */
(function(window, chrome) {

  'use strict';

  var tabs = {};

  function newTab(tabId) {
    if (tabId === chrome.tabs.TAB_ID_NONE) { return; }
    tabs[tabId] = {
      id: tabId,
      error: false,
      pixels: {}
    };
    Icon.update(tabs[tabId], 0);
  }

  // New tab opened
  chrome.tabs.onCreated.addListener(function(tab) {
    newTab(tab.id);
  });

  // Tab closed
  chrome.tabs.onRemoved.addListener(function(tabId) {
    tabs[tabId] = null;
  });

  // Tab url updated
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
      newTab(tabId);
    }
  });

  // Export
  window.TabManager = {

    /**
     * Logs a pixel request, updating values if the request id has already been logged
     * @param tabId Id of the tab related to the pixel
     * @param requestId Id of the request
     * @param data Request data
     * @param error Was the response an error code
     */
    logPixel: function(tabId, requestId, data) {
      if (!tabs[tabId]) { return; }
      var tab = tabs[tabId]
      ,   pixel = tab.pixels[requestId]
      ,   error = data.status < 200 || data.status >= 300
      ;

      if (!pixel) {
        pixel = tab.pixels[requestId] = {};
      }

      Object.assign(pixel, data);
      tab.error = tab.error || error;
      Icon.update(tab);
    },

    /**
     * Returns the tab data for a tab id
     * @param tabId The id to retrieve
     * @returns {*}
     */
    get: function(tabId) {
      return tabs[tabId];
    }
  };

})(window, chrome);
