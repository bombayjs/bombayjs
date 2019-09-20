import { parseUrl, fnToString, warn, dispatchCustomEvent, } from './utils/tools'
import { handleBehavior } from './handlers'

// hack console
export function hackConsole() {
  if (window && window.console) {
    for (var e = ["debug", "info", "warn", "log", "error"], n = 0; e.length; n++) {
      var r = e[n];
      var action = window.console[r]
      if (!window.console[r]) return;
        (function (r, action) {
          window.console[r] = function() {
            var i = Array.prototype.slice.apply(arguments)
            var s: consoleBehavior = {
              type: "console",
              data: {
                level: r,
                message: JSON.stringify(i),
              }
            };
            handleBehavior(s)
            action && action.apply(null, i)
          }
        })(r, action)
    }
  }
}

// hack ajax
export function hackAjax() {

}

/**
 * hack pushstate replaceState
 * 派送historystatechange historystatechange事件
 * @export
 * @param {('pushState' | 'replaceState')} e
 */
export function hackState(e: 'pushState' | 'replaceState') {
  var t = history[e]
  "function" == typeof t && (history[e] = function (n, i, s) {
    var c = 1 === arguments.length ? [arguments[0]] : Array.apply(null,
            arguments),
        u = location.href,
        f = t.apply(history, c);
    if (!s || "string" != typeof s) return f;
    if (s === u) return f;
    try {
        var l = u.split("#"),
            h = s.split("#"),
            p = parseUrl(l[0]),
            d = parseUrl(h[0]),
            g = l[1] && l[1].replace(/^\/?(.*)/, "$1"),
            v = h[1] && h[1].replace(/^\/?(.*)/, "$1");
        p !== d ? dispatchCustomEvent("historystatechange", d) : g !== v && dispatchCustomEvent(
            "historystatechange", v)
    } catch (m) {
      warn("[retcode] error in " + e + ": " + m)
    }
    return f
  }, history[e].toString = fnToString(e))
}
