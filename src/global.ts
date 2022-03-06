import "core-js/stable";
import "regenerator-runtime/runtime";

// Using require for global scope mounting because ES import does not guarantee load order
window.PIXI = require("phaser-ce/build/custom/pixi");
window.p2 = require("phaser-ce/build/custom/p2");
window.Phaser = require("phaser-ce/build/custom/phaser-split");

if (!console.table) {
  console.log("Polyfill", "console.table");
  console.table = console.log;
}

if (!window.performance || !window.performance.now) {
  console.log("Polyfill", "Performance");
  // performance exists and has the necessary methods to hack out the current DOMHighResTimestamp
  if (
    window.performance &&
    window.performance.timing &&
    window.performance.timing.navigationStart &&
    window.performance.mark &&
    window.performance.clearMarks &&
    window.performance.getEntriesByName
  ) {
    console.log("Polyfill", "Performance", "using marks");
    window.performance.now = function () {
      window.performance.clearMarks("__PERFORMANCE_NOW__");
      window.performance.mark("__PERFORMANCE_NOW__");
      return window.performance.getEntriesByName("__PERFORMANCE_NOW__")[0]
        .startTime;
    };
  } else {
    console.log("Polyfill", "Performance", "using date");
    // All else fails, can't access a DOMHighResTimestamp, use a boring old Date...
    (window.performance as any) = window.performance || {};
    var start = new Date().valueOf();
    window.performance.now = function () {
      return new Date().valueOf() - start;
    };
  }
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame) {
    console.log("Polyfill", "requestAnimationFrame");
    (window.requestAnimationFrame as any) = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();
