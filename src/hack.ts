import { parseUrl, fnToString, warn, dispatchCustomEvent, on, } from './utils/tools'
import { handleBehavior, handleApi } from './handlers'

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


export function hackhook() {
  hackFetch()
  hackAjax()
}

function hackFetch(){
  if ("function" == typeof window.fetch) {
    var __oFetch_ = window.fetch
    window['__oFetch_'] = __oFetch_
    window.fetch = function(t, o) {
      var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
      var begin = Date.now(),
          url = (t && "string" != typeof t ? t.url : t) || "",
          page = parseUrl((url as string));
      if (!page) return __oFetch_.apply(window, a)
      return __oFetch_.apply(window, a).then(function (e) {
        var response = e.clone(),
            headers = response.headers;
        if (headers && 'function' === typeof headers.get) {
          var ct = headers.get('content-type')
          if (ct && !/(text)|(json)/.test(ct)) return e
        }
        var time = Date.now() - begin;
          response.text().then(function(res) {
            if (response.ok) {
              handleApi(page, !0, time, status, res.substr(0,1000) || '', begin)
            } else {
              handleApi(page, !1, time, status, res.substr(0,1000) || '', begin)
            }
          })
        return e
      })
    }
  }
}

// 如果返回过长，会被截断，最长1000个字符
function hackAjax() {
  if ("function" == typeof window.XMLHttpRequest) {
    var begin = 0,
        url ='',
        page = ''
        ;
    var __oXMLHttpRequest_ = window.XMLHttpRequest
    window['__oXMLHttpRequest_'] = __oXMLHttpRequest_
    window.XMLHttpRequest = function(t) {
      var xhr = new __oXMLHttpRequest_(t)
      if (!xhr.addEventListener) return xhr
      var open = xhr.open,
        send = xhr.send
      xhr.open = function (method: string, url?: string) {
        var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        url = url
        page = parseUrl(url)

        open.apply(xhr,a)
      }
      xhr.send = function() {
        begin = Date.now()
        var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
        send.apply(xhr,a)
      }
      xhr.onreadystatechange = function() {
        if (page && 4=== xhr.readyState) {
          var time = Date.now() - begin
          if (xhr.status >= 200 && xhr.status <= 299) {
            var status = xhr.status || 200
            if ("function" == typeof xhr.getResponseHeader) {
              var r = xhr.getResponseHeader("Content-Type");
              if (r && !/(text)|(json)/.test(r))return
            }
            handleApi(page, !0, time, status, xhr.responseText.substr(0,1000) || '', begin)
          } else {
            handleApi(page, !1, time, status || 'FAILED', xhr.responseText.substr(0,1000) || '', begin)
          }
        }
      }
      return xhr
    }
  }
}