/**
 * TA Tracking Loader
 *
 * Code that will be embedded on a partner's site to load
 * the full tracking library from TA's servers.
 *
 * @author mtownsend
 * @since Dec 2015
 **/

(function(window, document, navigator, script, src, taq, scriptElement, firstScript) {
  'use strict';

  // Don't load more than once
  if (window.taq) { return; }

  taq = window.taq = function() {
    // Queue calls to taq for execution once the library has loaded
    taq.queue.push(arguments);
  };

  taq.queue = [];

  // Don't load for crawler traffic
  if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) { return; }

  scriptElement = document.createElement(script);
  scriptElement.async = true;
  scriptElement.src = src;

  firstScript = document.getElementsByTagName(script)[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);

})(window, document, navigator, 'script', 'taevents.min.js');