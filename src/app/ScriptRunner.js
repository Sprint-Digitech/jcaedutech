"use client";
import React, { useEffect, useRef } from 'react';

// React logs this once for every raw <script> tag it commits. ScriptRunner
// deliberately renders WP's scripts as literal <script> elements so it can
// find and replay them below, so this warning is an expected side effect,
// not a sign the scripts failed to run.
if (typeof window !== 'undefined' && !window.__wpScriptWarningPatched) {
  window.__wpScriptWarningPatched = true;
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag while rendering React component')) {
      return;
    }
    // WP plugin bundles (e.g. contact-form-7's index.js) call REST endpoints
    // like /wp-json/contact-form-7/v1/contact-forms/<id>/refill that only
    // exist on a real WordPress backend. This clone has none, so those
    // fetches 404 and the vendor code logs the raw failed Response via
    // console.error(response) - not a bug in this app, just a missing backend.
    if (args.some((a) => typeof Response !== 'undefined' && a instanceof Response)) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

// burst-statistics/endpoint.php and /wp-json/sliderrevolution/... only exist on
// a real WordPress backend, which this static clone doesn't have. Letting the
// browser actually attempt those requests logs a "Failed to load resource"
// network error the console can't otherwise suppress. Short-circuit them
// before they hit the network instead - the vendor code (burst's beacon,
// RevSlider's cloud-thumbnail fetch) already handles a failed/empty response
// gracefully.
if (typeof window !== 'undefined' && !window.__wpNetworkPatched) {
  window.__wpNetworkPatched = true;
  const isStubbedUrl = (url) => typeof url === 'string' &&
    (url.includes('/wp-content/plugins/burst-statistics/endpoint.php') ||
     url.includes('/wp-json/sliderrevolution/'));

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (isStubbedUrl(url)) {
      return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content' }));
    }
    return originalFetch.call(this, input, init);
  };

  if (navigator.sendBeacon) {
    const originalSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      if (isStubbedUrl(url)) return true;
      return originalSendBeacon(url, data);
    };
  }
}

export default function ScriptRunner({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    // Suppress Next.js overlays for missing WP files (chunks, css)
    const handleRejection = (event) => {
      if (event.reason) {
        if (event.reason.name === 'ChunkLoadError' ||
            (event.reason.message && event.reason.message.includes('Failed to load CSS')) ||
            (typeof Response !== 'undefined' && event.reason instanceof Response) ||
            // RevSlider's Slider Revolution "cloud" fetch (/wp-json/sliderrevolution/...)
            // rejects with an Error whose message is literally the HTTP status text
            // ("Not Found") when there's no real WP backend to serve it - same
            // missing-backend category as the two checks above.
            event.reason.message === 'Not Found') {
          event.preventDefault(); // Prevents the Next.js overlay
        }
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);

    if (!ref.current) return;

    // We only want to run this once on mount
    if (ref.current.dataset.scriptsRun) return;
    ref.current.dataset.scriptsRun = "true";

    // By the time these scripts replay, the real page has already finished
    // loading, so document.readyState is "complete". That means
    // jQuery(document).ready(fn) / jQuery(fn) would fire immediately instead
    // of waiting - breaking WP init scripts that appear (in DOM order)
    // before the plugin <script src> tags they depend on (e.g. a slider
    // init that runs before slick.min.js has loaded). Queue ready callbacks
    // and flush them only once every script below has finished loading, so
    // they see fully-loaded plugins just like on a real page load.
    let flushReadyQueue = () => {};
    if (window.jQuery && !window.jQuery.fn._wpReadyQueued) {
      const $ = window.jQuery;
      const readyQueue = [];
      const originalReady = $.fn.ready;
      $.fn._wpReadyQueued = true;
      $.fn.ready = function (fn) {
        if (typeof fn === 'function') readyQueue.push(fn);
        return this;
      };
      flushReadyQueue = () => {
        $.fn.ready = originalReady;
        delete $.fn._wpReadyQueued;
        readyQueue.forEach((fn) => {
          try { fn($); } catch (e) { console.error(e); }
        });
      };
    }

    const scripts = Array.from(ref.current.querySelectorAll('script'));

    // Function to load scripts sequentially to preserve execution order
    const loadScript = (index) => {
      if (index >= scripts.length) {
        // Force trigger document ready and window load events for WP scripts
        setTimeout(() => {
          flushReadyQueue();
          window.document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
          window.dispatchEvent(new Event('load'));

          // Also trigger jQuery ready if jQuery is loaded
          if (window.jQuery) {
            window.jQuery(document).trigger('ready');
          }

          // RevSlider's SR7.F.init() is a one-shot bootstrap: its very first
          // call permanently sets SR7.initialised, whether or not it found
          // anything. layout.js's beforeInteractive scripts run before this
          // component (and its <sr7-module> markup) ever mounts, so if
          // SR7.F.init() were called from there it would "complete" against
          // an empty DOM and never run for real. Call it here instead, now
          // that every script above (including the SR7.PMH height-prep
          // script) has actually run and the slider markup exists.
          if (window.SR7 && window.SR7.F && window.SR7.F.init) {
            window.SR7.F.init();
          }
        }, 100);
        return;
      }

      const oldScript = scripts[index];
      const newScript = document.createElement('script');

      Array.from(oldScript.attributes).forEach(attr => {
        if (attr.name !== 'data-nscript') {
            newScript.setAttribute(attr.name, attr.value);
        }
      });

      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }

      // If it has a src, wait for it to load before proceeding
      if (newScript.src) {
        newScript.onload = () => loadScript(index + 1);
        newScript.onerror = () => loadScript(index + 1);
        oldScript.parentNode.replaceChild(newScript, oldScript);
      } else {
        oldScript.parentNode.replaceChild(newScript, oldScript);
        loadScript(index + 1);
      }
    };

    loadScript(0);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return <div ref={ref} suppressHydrationWarning>{children}</div>;
}
