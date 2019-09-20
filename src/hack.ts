import { parseUrl, fnToString, warn, dispatchCustomEvent, } from './utils/tools'

// hack console
export function hackConsole() {

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