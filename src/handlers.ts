import { Config, getConfig, } from './config'
import { queryString, serialize, each, parseHash, warn, splitGroup, } from './utils/tools'
import { getCommonMsg } from './utils/index'
import { report } from './reporter'
import { setGlobalPage, setGlobalSid, setGlobalHealth, GlobalVal, resetGlobalHealth,} from './config/global'

// 处理pv
export function handlePv(): void {
  if (!Config.autoSendPv) return
  let commonMsg = getCommonMsg()
  let msg: pvMsg = {
    ...commonMsg,
    ...{
      t: 'pv',
      dt: document.title,
      dl: location.href,
      dr: document.referrer,
      dpr: window.devicePixelRatio,
      de: document.charset,
    }
  }
  report(msg)
}

// 处理html node
const normalTarget = function (e) {
  var t, n, r, a, i, o = [];
  if (!e || !e.tagName) return "";
  if (o.push(e.tagName.toLowerCase()), e.id && o.push("#".concat(e.id)), (t = e.className) &&
      "[object String]" === Object.prototype.toString.call(t))
      for (n = t.split(/\s+/), i = 0; i < n.length; i++) o.push(".".concat(n[i]));
  var s = ["type", "name", "title", "alt"];
  for (i = 0; i < s.length; i++) r = s[i], (a = e.getAttribute(r)) && o.push("[".concat(
      r, '="').concat(a, '"]'));
  return o.join("")
}

// 获取元素路径，最多保留5层
const getElmPath = function (e) {
  if (!e || 1 !== e.nodeType) return "";
  var ret = [],
      deepLength = 0, // 层数，最多5层
      elm = '' // 元素
  for (var t = e || null; t && deepLength++ < 5 &&!("html" === (elm = normalTarget(t)));) {
    ret.push(elm), t = t.parentNode;
  }
  return ret.reverse().join(" > ")
}

export function handleClick(event) {
  var target;
  try {
    target = event.target
  } catch (u) {
    target = "<unknown>"
  }
  if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') return

  if (0 !== target.length) {
    var behavior: eventBehavior = {
      type: 'ui.click',
      data: {
        path: getElmPath(target),
        message: '',
      }
    }
    // 空信息不上报
    if (!behavior.data.path) return
    let commonMsg = getCommonMsg()
    let msg: behaviorMsg = {
      ...commonMsg,
      ...{
        t: 'behavior',
        behavior,
      }
    }
    report(msg)
  }
}

export function handleBlur(event) {
  var target;
  try {
    target = event.target
  } catch (u) {
    target = "<unknown>"
  }
  if (target.nodeName !== 'INPUT' && target.nodeName !== 'TEXTAREA') return

  if (0 !== target.length) {
    var behavior: eventBehavior = {
      type: 'ui.blur',
      data: {
        path: getElmPath(target),
        message: target.value
      }
    }
    // 空信息不上报
    if (!behavior.data.path || !behavior.data.message) return
    let commonMsg = getCommonMsg()
    let msg: behaviorMsg = {
      ...commonMsg,
      ...{
        t: 'behavior',
        behavior,
      }
    }
    report(msg)
  }
}

export function handleBehavior(behavior: Behavior): void {
  let commonMsg = getCommonMsg()
  let msg: behaviorMsg = {
    ...commonMsg,
    ...{
      t: 'behavior',
      behavior,
    }
  }
  report(msg)
}

const TIMING_KEYS = ["", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart",
  "connectEnd", "requestStart", "responseStart", "responseEnd", "", "domInteractive", "",
  "domContentLoadedEventEnd", "", "loadEventStart", "", "msFirstPaint",
  "secureConnectionStart"]

// 处理性能
export function handlePerf(): void {
  const performance = window.performance
  if (!performance || 'object' !== typeof performance) return

  let data: any = {},
    timing = performance.timing || {},
    now = Date.now(),
    type = 1;

  // 根据PerformanceNavigationTiming计算更准确
  if ("function" == typeof window.PerformanceNavigationTiming) {
      var c = performance.getEntriesByType("navigation")[0];
      c && (timing = c, type = 2)
  }

  // 计算data
  each({
    dns: [3, 2],
    tcp: [5, 4],
    ssl: [5, 17],
    ttfb: [7, 6],
    trans: [8, 7],
    dom: [10, 8],
    res: [14, 12],
    firstbyte: [7, 2],
    fpt: [8, 1],
    tti: [10, 1],
    ready: [12, 1],
    load: [14, 1]
  }, function (e, t) {
      var r = timing[TIMING_KEYS[e[1]]],
          o = timing[TIMING_KEYS[e[0]]];
      if (2 === type || r > 0 && o > 0) {
          var c = Math.round(o - r);
          c >= 0 && c < 36e5 && (data[t] = c)
      }
  });

  var u = window.navigator.connection,
      f = performance.navigation || { type: undefined };
  data.ct = u ? u.effectiveType || u.type : "";
  var l = u ? u.downlink || u.downlinkMax || u.bandwidth || null : null;
  if ((l = l > 999 ? 999 : l) && (data.bandwidth = l), data.navtype = 1 === f.type ? "Reload" :"Other", 1 === type && timing[TIMING_KEYS[16]] > 0 && timing[TIMING_KEYS[1]] > 0) {
      var h = timing[TIMING_KEYS[16]] - timing[TIMING_KEYS[1]];
      h >= 0 && h < 36e5 && (data.fpt = h)
  }
  1 === type && timing[TIMING_KEYS[1]] > 0 
        ? data.begin = timing[TIMING_KEYS[1]] 
        : 2 === type && data.load > 0 ? data.begin = now -
        data.load : data.begin = now
  let commonMsg = getCommonMsg()
  let msg: perfMsg = {
    ...commonMsg,
    t: 'perf',
    ...data,
  }
  report(msg)
}

// 处理hash变化
// 注意在路由栈的路由不会触发
export function handleHashchange(e): void {
  let page = Config.enableSPA ? parseHash(location.hash.toLowerCase()) : location.pathname.toLowerCase()
  page && setPage(page, false)
}

// 处理hash变化
export function handleHistorystatechange(e): void {
  let page = Config.enableSPA ? parseHash(e.detail.toLowerCase()) : e.detail.toLowerCase()
  page && setPage(page, false)
}

export function setPage(page, isFirst?: boolean) {
  !isFirst && handleHealth()
  setTimeout(()=> {
    setGlobalPage(page)
    setGlobalSid()
    handlePv()
  }, 300)
}

export function handleHealth() {
  let healthy = GlobalVal._health.errcount ? 0 : 1
  let commonMsg = getCommonMsg()
  let ret: healthMsg = {
    ...commonMsg,
    ...GlobalVal._health,
    ...{
      t: 'health',
      healthy, // 健康？ 0/1
      stay: Date.now() - GlobalVal.sBegin, // 停留时间
    }
  }
  resetGlobalHealth()
  report(ret)
}

// 处理错误
export function handleErr(error): void {
  switch (error.type) {
    case 'error':
        error instanceof ErrorEvent ? reportCaughtError(error)  : reportResourceError(error)
      break;
    case 'unhandledrejection':
      reportPromiseError(error)
    break;
    // case 'httpError':
    //     reportHttpError(error)
    //   break;
  }
  setGlobalHealth('error')
}

// 捕获js异常
function reportCaughtError(error:any):void{
  let commonMsg = getCommonMsg()
  let n = error.name || "CustomError",
      a = error.message || "",
      i = error.error.stack || ""
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      st: 'caughterror',
      cate: n, // 类别
      msg: a && a.substring(0, 1e3), // 信息
      detail: i && i.substring(0, 1e3), // 错误栈
      file: error.filename || "", // 出错文件
      line: error.lineno || "", // 行
      col: error.colno || "", // 列
    }
  }
  report(msg)
}

// 捕获资源异常
function reportResourceError(error:any):void{
  let commonMsg = getCommonMsg()
  let target = error.target
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      st: 'resource',
      msg: target.outerHTML,
      file: target.src,
      stack: target.localName.toUpperCase(),
    }
  }
  report(msg)
}

// 捕获promise异常
function reportPromiseError(error:any):void{
  let commonMsg = getCommonMsg()
  let msg: ErrorMsg = {
    ...commonMsg,
    ...{
      t: 'error',
      st: 'promise',
      msg: error.reason,
    }
  }
  report(msg)
}

function reportHttpError(msg:CommonMsg,data:any):void{
  // msg.records = [
  //     {
  //         type:'httpError',
  //         data:{
  //             occurTime:new Date().getTime(),
  //             title:document.title,
  //             url:window.location.href,
  //             userAgent:window.navigator.userAgent,
  //             method:data.method ? data.method : 'GET',
  //             status:data.status,
  //             statusText:data.statusText,
  //             response:data.response,
  //             requestUrl:data.url || data.requestUrl
  //         }
  //     }
  // ]
  // console.log(msg)
  // // console.log('httpError :' + queryString(msg))
  // new Image().src = `${Config.reportUrl}?commit=${queryString(msg)}`
}

export function handleResource() {
  var performance = window.performance
  if (!performance || "object" != typeof performance || "function" != typeof performance.getEntriesByType) return null;
  let commonMsg = getCommonMsg()
  let msg: ResourceMsg = {
    ...commonMsg,
    ...{
      dom: 0,
      load: 0,
      t: 'res',
      res: [],
    }
  }
  var i = performance.timing || {},
      o = performance.getEntriesByType("resource") || [];
  if ("function" == typeof window.PerformanceNavigationTiming) {
    var s = performance.getEntriesByType("navigation")[0];
    s && (i = s)
  }
  each({
    dom: [10, 8],
    load: [14, 1]
  }, function (e, t) {
      var r = i[TIMING_KEYS[e[1]]],
          o = i[TIMING_KEYS[e[0]]];
      if (r > 0 && o > 0) {
          var s = Math.round(o - r);
          s >= 0 && s < 36e5 && (msg[t] = s)
      }
  })
  // 过滤忽略的url
  o = o.filter(item => {
    var include = getConfig('ignore').ignoreApis.findIndex(ignoreApi => item.name.indexOf(ignoreApi) > -1)
    return include > -1 ? false : true
  })
  msg.res = o
  report(msg)
}

export function handleApi(url, success, time, code, msg, beigin) {
  if (!url) {
    warn('[retcode] api is null')
    return
  }
  // 设置健康状态
  setGlobalHealth('api', success)

  let commonMsg = getCommonMsg()
  let apiMsg: ApiMsg = {
    ...commonMsg,
    ...{
      t: 'api',
      beigin,
      url, // 接口
      success, // 成功？
      time, // 耗时
      code, // 接口返回的code
      msg, // 信息
    }
  }
  // 过滤忽略的url
  var include = getConfig('ignore').ignoreApis.findIndex(ignoreApi => url.indexOf(ignoreApi) > -1)
  if (include > -1) return
  report(apiMsg)
}

export function handleSum(key: string, val: number = 1) {
  let commonMsg = getCommonMsg()
  let g = splitGroup(key)
  let ret: sumMsg = {
    ...commonMsg,
    ...g,
    ...{
      t: 'sum',
      val,
    }
  }
  report(ret)
}

export function handleAvg(key: string, val: number = 1) {
  let commonMsg = getCommonMsg()
  let g = splitGroup(key)
  let ret: avgMsg = {
    ...commonMsg,
    ...g,
    ...{
      t: 'avg',
      val,
    }
  }
  report(ret)
}

export function handleMsg(key: string) {
  let commonMsg = getCommonMsg()
  let g = splitGroup(key)
  let ret: msgMsg = {
    ...commonMsg,
    ...{
      t: 'msg',
      group: g.group,
      msg: g.key.substr(0, Config.maxLength)
    }
  }
  report(ret)
}

// export function handlePercent(key: string, val: number = 1) {
//   let commonMsg = getCommonMsg()
//   let g = splitGroup(key)
//   let ret: sumMsg = {
//     ...commonMsg,
//     ...g,
//     ...{
//       t: 'avg',
//       val,
//     }
//   }
//   report(ret)
// }