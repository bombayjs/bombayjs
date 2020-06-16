export const noop = function () {}

export function queryString(obj:object):string{
  return encodeURIComponent(JSON.stringify(obj));
}


export function isObject(obj:any):boolean{
  if(Object.prototype.toString.call(obj) == "[object Object]" || Object.prototype.toString.call(obj) == "[object Array]"){
      return true
  }
  return false;
}


export function randomString() {
  for (var e, t, n = 20, r = new Array(n), a = Date.now().toString(36).split(""); n--> 0;) 
    t = (e = 36 * Math.random() | 0).toString(36), r[n] = e % 3 ? t : t.toUpperCase();
  for (var i = 0; i < 8; i++) r.splice(3 * i + 2, 0, a[i]);
  return r.join("")
}

// 将{ method: 'get', state: '200' }转为?method=get&state=200
export function serialize(obj) {
  var str = [];
  for (var p in obj)
   if (obj.hasOwnProperty(p)) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
   }
  return str.join("&");
}


export function each (data, fn) {
  var n = 0, r = data.length;
  if (isTypeOf(data, 'Array'))
    for (; n < r && !1 !== fn.call(data[n], data[n], n); n++);
  else
    for (var m in data)
      if (!1 === fn.call(data[m], data[m], m)) break;
  return data
}

/**
 * 是否是某类型
 *
 * @export
 * @param {*} data
 * @param {*} type
 * @returns 有type就返回true/false,没有就返回对于类型
 */
export function isTypeOf (data: any, type?: string) {
  var n = Object.prototype.toString.call(data).substring(8).replace("]", "");
  return type ? n === type : n
}

export const on = function (event, fn, remove?) {
  window.addEventListener ? window.addEventListener(event, function a(i) {
    remove && window.removeEventListener(event, a, true), fn.call(this, i)
  }, true) : window.attachEvent && window.attachEvent("on" + event, function i(a) {
    remove && window.detachEvent("on" + event, i), fn.call(this, a)
  })
}

export const off = function (event, fn) {
  return fn ? (window.removeEventListener ? window.removeEventListener(event, fn) : window.detachEvent &&
  window.detachEvent(event, fn), this) : this
}

export const parseHash = function (e:string) {
  return (e ? parseUrl(e.replace(/^#\/?/, "")) : "") || "[index]"
}

export const parseUrl = function (e: string) {
  return e && "string" == typeof e ? e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "") : ""
}

// 函数toString方法
export const fnToString = function (e: string) {
  return function () {
      return e + "() { [native code] }"
  }
}

export const warn: any = function () {
  var e = "object" == typeof console ? console.warn : noop;
  try {
      var t = {
          warn: e
      };
      t.warn.call(t)
  } catch (n) {
      return noop
  }
  return e
}()

// 自定义事件，并dispatch
export const dispatchCustomEvent = function (e, t) {
  var r;
  window.CustomEvent 
    ?  r = new CustomEvent(e, {
          detail: t
      }) 
    : ((r = window.document.createEvent("HTMLEvents")).initEvent(e, !1, !0), r.detail = t)
  
    window.dispatchEvent(r)
}

// group::key
export const splitGroup = function (e: string) {
  var n = e.split("::");
  return n.length > 1 ? {
    group: n[0],
    key: n[1]
} : {
  group: "default_group",
  key: n[0]
}
}

// HACK: 在IE浏览器及猎豹浏览器中，对象不支持findIndex的问题
export const findIndex = function(arr, fn) { 
  return arr.reduce(function(carry, item, idx) { 
   if (fn(item, idx)) { 
    return idx
   } 
   return carry
  } , -1)
}

// 检查是否是Edge浏览器
export const checkEdge = function() { 
  var isEdge = navigator.userAgent.indexOf("Edge") > -1
  return isEdge
}

export const isInIframe = self != top