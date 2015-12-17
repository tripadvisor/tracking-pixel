/**
 * TA Tracking Loader
 *
 * Code that will be embedded on a partner's site to load
 * the full tracking library from TA's servers.
 *
 * @author mtownsend
 * @since Dec 2015
 **/

(function(window, document, script, src, taq, scriptElement, firstScript) {
  'use strict';

  if (window.taq) { return; } // Don't load more than once

  taq = window.taq = function() {
    // Queue calls to taq for execution once the library has loaded
    taq.queue.push(arguments);
  };

  taq.queue = [];

  scriptElement = document.createElement(script);
  scriptElement.async = true;
  scriptElement.src = src;

  firstScript = document.getElementsByTagName(script)[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);

})(window, document, 'script', 'taevents.min.js');