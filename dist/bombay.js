(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Bombay = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // 默认参数
    var Config = {
        // 上报地址
        reportUrl: 'http://localhost:10000',
        // 提交参数
        token: '',
        // app版本
        appVersion: '1.0.0',
        // 环境
        environment: 'production',
        // 脚本延迟上报时间
        outtime: 300,
        // 开启单页面？
        enableSPA: true,
        // 是否自动上报pv
        autoSendPv: true,
        // 是否上报页面性能数据
        isPage: true,
        // 是否上报ajax性能数据
        isAjax: true,
        // 是否上报页面资源数据
        isResource: true,
        // 是否上报错误信息
        isError: true,
        // 是否录屏
        isRecord: true,
        // 是否上报行为
        isBehavior: true,
        ignore: {
            ignoreErrors: [],
            ignoreUrls: [],
            ignoreApis: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
        },
        behavior: {
            console: ['log', 'error'],
            click: true,
        },
        // 最长上报数据长度
        maxLength: 1000,
    };
    // 设置参数
    function setConfig(options) {
        Config = __assign(__assign({}, Config), options);
    }
    function getConfig(e) {
        return e ? Config[e] ? Config[e] : {} : {};
    }
    //# sourceMappingURL=index.js.map

    var noop = function () { };
    function randomString() {
        for (var e, t, n = 20, r = new Array(n), a = Date.now().toString(36).split(""); n-- > 0;)
            t = (e = 36 * Math.random() | 0).toString(36), r[n] = e % 3 ? t : t.toUpperCase();
        for (var i = 0; i < 8; i++)
            r.splice(3 * i + 2, 0, a[i]);
        return r.join("");
    }
    // 将{ method: 'get', state: '200' }转为?method=get&state=200
    function serialize(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }
    function each(data, fn) {
        var n = 0, r = data.length;
        if (isTypeOf(data, 'Array'))
            for (; n < r && !1 !== fn.call(data[n], data[n], n); n++)
                ;
        else
            for (var m in data)
                if (!1 === fn.call(data[m], data[m], m))
                    break;
        return data;
    }
    /**
     * 是否是某类型
     *
     * @export
     * @param {*} data
     * @param {*} type
     * @returns 有type就返回true/false,没有就返回对于类型
     */
    function isTypeOf(data, type) {
        var n = Object.prototype.toString.call(data).substring(8).replace("]", "");
        return type ? n === type : n;
    }
    var on = function (event, fn, remove) {
        window.addEventListener ? window.addEventListener(event, function a(i) {
            remove && window.removeEventListener(event, a, true), fn.call(this, i);
        }, true) : window.attachEvent && window.attachEvent("on" + event, function i(a) {
            remove && window.detachEvent("on" + event, i), fn.call(this, a);
        });
    };
    var off = function (event, fn) {
        return fn ? (window.removeEventListener ? window.removeEventListener(event, fn) : window.detachEvent &&
            window.detachEvent(event, fn), this) : this;
    };
    var parseHash = function (e) {
        return (e ? parseUrl(e.replace(/^#\/?/, "")) : "") || "[index]";
    };
    var parseUrl = function (e) {
        return e && "string" == typeof e ? e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "") : "";
    };
    // 函数toString方法
    var fnToString = function (e) {
        return function () {
            return e + "() { [native code] }";
        };
    };
    var warn = function () {
        var e = "object" == typeof console ? console.warn : noop;
        try {
            var t = {
                warn: e
            };
            t.warn.call(t);
        }
        catch (n) {
            return noop;
        }
        return e;
    }();
    // 自定义事件，并dispatch
    var dispatchCustomEvent = function (e, t) {
        var r;
        window.CustomEvent
            ? r = new CustomEvent(e, {
                detail: t
            })
            : ((r = window.document.createEvent("HTMLEvents")).initEvent(e, !1, !0), r.detail = t);
        window.dispatchEvent(r);
    };
    // group::key
    var splitGroup = function (e) {
        var n = e.split("::");
        return n.length > 1 ? {
            group: n[0],
            key: n[1]
        } : {
            group: "default_group",
            key: n[0]
        };
    };
    // HACK: 在IE浏览器及猎豹浏览器中，对象不支持findIndex的问题
    var findIndex = function (arr, fn) {
        return arr.reduce(function (carry, item, idx) {
            if (fn(item, idx)) {
                return idx;
            }
            return carry;
        }, -1);
    };
    // 检查是否是Edge浏览器
    var checkEdge = function () {
        var isEdge = navigator.userAgent.indexOf("Edge") > -1;
        return isEdge;
    };
    var isInIframe = self != top;
    //# sourceMappingURL=tools.js.map

    // 默认参数
    var GlobalVal = {
        page: '',
        sid: '',
        sBegin: Date.now(),
        _health: {
            errcount: 0,
            apisucc: 0,
            apifail: 0
        },
        circle: false,
        cssInserted: false,
    };
    function setGlobalPage(page) {
        GlobalVal.page = page;
    }
    function setGlobalSid() {
        GlobalVal.sid = randomString();
        GlobalVal.sBegin = Date.now();
    }
    function setGlobalHealth(type, success) {
        if (type === 'error')
            GlobalVal._health.errcount++;
        if (type === 'api' && success)
            GlobalVal._health.apisucc++;
        if (type === 'api' && !success)
            GlobalVal._health.apifail++;
    }
    function resetGlobalHealth() {
        GlobalVal._health = {
            errcount: 0,
            apisucc: 0,
            apifail: 0
        };
    }
    //# sourceMappingURL=global.js.map

    function getCommonMsg() {
        var u = navigator.connection;
        var data = {
            t: '',
            page: getPage(),
            times: 1,
            v: Config.appVersion,
            token: Config.token,
            e: Config.environment,
            begin: new Date().getTime(),
            uid: getUid(),
            sid: GlobalVal.sid,
            sr: screen.width + "x" + screen.height,
            vp: getScreen(),
            ct: u ? u.effectiveType : '',
            ul: getLang(),
            _v: '1.0.9',
            o: location.href,
        };
        return data;
    }
    // 获取页面
    function getPage() {
        if (GlobalVal.page)
            return GlobalVal.page;
        else {
            return location.pathname.toLowerCase();
        }
    }
    // 获取uid
    function getUid() {
        var uid = localStorage.getItem('bombay_uid') || '';
        if (!uid) {
            uid = randomString();
            localStorage.setItem('bombay_uid', uid);
        }
        return uid;
    }
    // 获得sid
    // TODO: 单页面
    // function getSid() {
    //   const date = new Date();
    //   let sid = sessionStorage.getItem('bombay_sid') || '';
    //   if (!sid) {
    //       sid = randomString();
    //       sessionStorage.setItem('bombay_sid', sid);
    //   }
    //   return sid;
    // }
    // 获取浏览器默认语言
    function getLang() {
        var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
        lang = lang.substr(0, 2); //截取lang前2位字符
        return lang;
    }
    function getScreen() {
        var w = document.documentElement.clientWidth || document.body.clientWidth;
        var h = document.documentElement.clientHeight || document.body.clientHeight;
        return w + 'x' + h;
    }
    //# sourceMappingURL=index.js.map

    // 上报
    function report(e) {
        "res" === e.t ?
            send(e)
            : "error" === e.t ? send(e)
                : "behavior" === e.t ? send(e)
                    : "health" === e.t && window && window.navigator && "function" == typeof window.navigator.sendBeacon ? sendBeacon(e)
                        : send(e);
        return this;
    }
    // post上报
    function send(msg) {
        var _a;
        var body = msg[msg.t];
        delete msg[msg.t];
        var url = Config.reportUrl + "?" + serialize(msg);
        post(url, (_a = {},
            _a[msg.t] = body,
            _a));
        // new Image().src = `${Config.reportUrl}?${serialize(msg)}`
    }
    function post(url, body) {
        var XMLHttpRequest = window.__oXMLHttpRequest_ || window.XMLHttpRequest;
        if (typeof XMLHttpRequest === 'function') {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url, !0);
                xhr.setRequestHeader("Content-Type", "text/plain");
                xhr.send(JSON.stringify(body));
            }
            catch (e) {
                warn('[bombayjs] Failed to log, POST请求失败');
            }
        }
        else {
            warn('[bombayjs] Failed to log, 浏览器不支持XMLHttpRequest');
        }
    }
    // 健康检查上报
    function sendBeacon(e) {
        "object" == typeof e && (e = serialize(e));
        e = Config.reportUrl + "?" + e;
        window && window.navigator && "function" == typeof window.navigator.sendBeacon
            ? window.navigator.sendBeacon(e)
            : warn("[arms] navigator.sendBeacon not surported");
    }
    //# sourceMappingURL=reporter.js.map

    var CIRCLECLS = 'bombayjs-circle-active'; // circle class类名
    var CIRCLESTYLEID = 'bombayjs-circle-css'; // 插入的style标签id
    // 处理pv
    function handlePv() {
        if (!Config.autoSendPv)
            return;
        var commonMsg = getCommonMsg();
        var msg = __assign(__assign({}, commonMsg), {
            t: 'pv',
            dt: document.title,
            dl: location.href,
            dr: document.referrer,
            dpr: window.devicePixelRatio,
            de: document.charset,
        });
        report(msg);
    }
    // 处理html node
    var normalTarget = function (e) {
        var t, n, r, a, i, o = [];
        if (!e || !e.tagName)
            return "";
        if (o.push(e.tagName.toLowerCase()), e.id && o.push("#".concat(e.id)), (t = e.className) && "[object String]" === Object.prototype.toString.call(t)) {
            for (n = t.split(/\s+/), i = 0; i < n.length; i++) {
                // className包含active的不加入路径
                if (n[i].indexOf('active') < 0)
                    o.push(".".concat(n[i]));
            }
        }
        var s = ["type", "name", "title", "alt"];
        for (i = 0; i < s.length; i++)
            r = s[i], (a = e.getAttribute(r)) && o.push("[".concat(r, '="').concat(a, '"]'));
        return o.join("");
    };
    // 获取元素路径，最多保留5层
    var getElmPath = function (e) {
        if (!e || 1 !== e.nodeType)
            return "";
        var ret = [], deepLength = 0, // 层数，最多5层
        elm = ''; // 元素
        ret.push("(" + e.innerText.substr(0, 50) + ")");
        for (var t = e || null; t && deepLength++ < 5 && !("html" === (elm = normalTarget(t)));) {
            ret.push(elm), t = t.parentNode;
        }
        return ret.reverse().join(" > ");
    };
    function handleClick(event) {
        // 正在圈选
        if (GlobalVal.circle) {
            var target_1 = event.target;
            var clsArray = target_1.className.split(/\s+/);
            var path = getElmPath(event.target);
            // clsArray 为 ['bombayjs-circle-active] 或 ['', 'bombayjs-circle-active]时
            if (clsArray.length === 1 || (clsArray.length === 2 && clsArray[0] === '')) {
                path = path.replace(/\.\.bombayjs-circle-active/, '');
            }
            else {
                path = path.replace(/\.bombayjs-circle-active/, '');
            }
            window.parent.postMessage({
                t: 'setElmPath',
                path: path,
                page: GlobalVal.page,
            }, '*');
            event.stopPropagation();
            return;
        }
        var target;
        try {
            target = event.target;
        }
        catch (u) {
            target = "<unknown>";
        }
        if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA')
            return;
        if (0 !== target.length) {
            var behavior = {
                type: 'ui.click',
                data: {
                    path: getElmPath(target),
                    message: '',
                }
            };
            // 空信息不上报
            if (!behavior.data.path)
                return;
            var commonMsg = getCommonMsg();
            var msg = __assign(__assign({}, commonMsg), {
                t: 'behavior',
                behavior: behavior,
            });
            report(msg);
        }
    }
    function handleBlur(event) {
        var target;
        try {
            target = event.target;
        }
        catch (u) {
            target = "<unknown>";
        }
        if (target.nodeName !== 'INPUT' && target.nodeName !== 'TEXTAREA')
            return;
        if (0 !== target.length) {
            var behavior = {
                type: 'ui.blur',
                data: {
                    path: getElmPath(target),
                    message: target.value
                }
            };
            // 空信息不上报
            if (!behavior.data.path || !behavior.data.message)
                return;
            var commonMsg = getCommonMsg();
            var msg = __assign(__assign({}, commonMsg), {
                t: 'behavior',
                behavior: behavior,
            });
            report(msg);
        }
    }
    function handleBehavior(behavior) {
        var commonMsg = getCommonMsg();
        var msg = __assign(__assign({}, commonMsg), {
            t: 'behavior',
            behavior: behavior,
        });
        report(msg);
    }
    var TIMING_KEYS = ["", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart",
        "connectEnd", "requestStart", "responseStart", "responseEnd", "", "domInteractive", "",
        "domContentLoadedEventEnd", "", "loadEventStart", "", "msFirstPaint",
        "secureConnectionStart"];
    // 处理性能
    function handlePerf() {
        var performance = window.performance;
        if (!performance || 'object' !== typeof performance)
            return;
        var data = {
            dns: 0,
            tcp: 0,
            ssl: 0,
            ttfb: 0,
            trans: 0,
            dom: 0,
            res: 0,
            firstbyte: 0,
            fpt: 0,
            tti: 0,
            ready: 0,
            load: 0 // domready时间 
        }, timing = performance.timing || {}, now = Date.now(), type = 1;
        var stateCheck = setInterval(function () {
            if (timing.loadEventEnd) {
                clearInterval(stateCheck);
                // 根据PerformanceNavigationTiming计算更准确
                if ("function" == typeof window.PerformanceNavigationTiming) {
                    var c = performance.getEntriesByType("navigation")[0];
                    c && (timing = c, type = 2);
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
                    var r = timing[TIMING_KEYS[e[1]]], o = timing[TIMING_KEYS[e[0]]];
                    var c = Math.round(o - r);
                    if (2 === type || r !== undefined && o !== undefined) {
                        if (t === 'dom') {
                            var c = Math.round(o - r);
                        }
                        c >= 0 && c < 36e5 && (data[t] = c);
                    }
                });
                var u = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection, f = performance.navigation || { type: undefined };
                data.ct = u ? u.effectiveType || u.type : "";
                var l = u ? u.downlink || u.downlinkMax || u.bandwidth || null : null;
                if ((l = l > 999 ? 999 : l) && (data.bandwidth = l), data.navtype = 1 === f.type ? "Reload" : "Other", 1 === type && timing[TIMING_KEYS[16]] > 0 && timing[TIMING_KEYS[1]] > 0) {
                    var h = timing[TIMING_KEYS[16]] - timing[TIMING_KEYS[1]];
                    h >= 0 && h < 36e5 && (data.fpt = h);
                }
                1 === type && timing[TIMING_KEYS[1]] > 0
                    ? data.begin = timing[TIMING_KEYS[1]]
                    : 2 === type && data.load > 0 ? data.begin = now -
                        data.load : data.begin = now;
                var commonMsg = getCommonMsg();
                var msg = __assign(__assign(__assign({}, commonMsg), { t: 'perf' }), data);
                report(msg);
            }
        }, 50);
    }
    // 处理hash变化
    // 注意在路由栈的路由不会触发
    function handleHashchange(e) {
        var page = Config.enableSPA ? parseHash(location.hash.toLowerCase()) : location.pathname.toLowerCase();
        page && setPage(page, false);
    }
    // 处理hash变化
    function handleHistorystatechange(e) {
        var page = Config.enableSPA ? parseHash(e.detail.toLowerCase()) : e.detail.toLowerCase();
        page && setPage(page, false);
    }
    // 处理pv
    function handleNavigation(page) {
        var commonMsg = getCommonMsg();
        var msg = __assign(__assign({}, commonMsg), {
            t: 'behavior',
            behavior: {
                type: 'navigation',
                data: {
                    from: commonMsg.page,
                    to: page,
                },
            }
        });
        report(msg);
    }
    function setPage(page, isFirst) {
        !isFirst && handleHealth();
        handleNavigation(page);
        if (isInIframe) {
            window.parent.postMessage({
                t: 'setPage',
                href: location.href,
                page: page,
            }, '*');
        }
        setGlobalPage(page);
        setGlobalSid();
        handlePv();
    }
    function handleHealth() {
        var healthy = GlobalVal._health.errcount ? 0 : 1;
        var commonMsg = getCommonMsg();
        var ret = __assign(__assign(__assign({}, commonMsg), GlobalVal._health), {
            t: 'health',
            healthy: healthy,
            stay: Date.now() - GlobalVal.sBegin,
        });
        resetGlobalHealth();
        report(ret);
    }
    // 处理错误
    function handleErr(error) {
        switch (error.type) {
            case 'error':
                error instanceof ErrorEvent ? reportCaughtError(error) : reportResourceError(error);
                break;
            case 'unhandledrejection':
                reportPromiseError(error);
                break;
            // case 'httpError':
            //     reportHttpError(error)
            //   break;
        }
        setGlobalHealth('error');
    }
    // 捕获js异常
    function reportCaughtError(error) {
        var commonMsg = getCommonMsg();
        var n = error.name || "CustomError", a = error.message || "", i = error.error.stack || "";
        var msg = __assign(__assign({}, commonMsg), {
            t: 'error',
            st: 'caughterror',
            cate: n,
            msg: a && a.substring(0, 1e3),
            detail: i && i.substring(0, 1e3),
            file: error.filename || "",
            line: error.lineno || "",
            col: error.colno || "",
        });
        report(msg);
    }
    // 捕获资源异常
    function reportResourceError(error) {
        var commonMsg = getCommonMsg();
        var target = error.target;
        var msg = __assign(__assign({}, commonMsg), {
            t: 'error',
            st: 'resource',
            msg: target.outerHTML,
            file: target.src,
            stack: target.localName.toUpperCase(),
        });
        report(msg);
    }
    // 捕获promise异常
    function reportPromiseError(error) {
        var commonMsg = getCommonMsg();
        var msg = __assign(__assign({}, commonMsg), {
            t: 'error',
            st: 'promise',
            msg: error.reason,
        });
        report(msg);
    }
    function handleResource() {
        var performance = window.performance;
        if (!performance || "object" != typeof performance || "function" != typeof performance.getEntriesByType)
            return null;
        var commonMsg = getCommonMsg();
        var msg = __assign(__assign({}, commonMsg), {
            dom: 0,
            load: 0,
            t: 'res',
            res: [],
        });
        var i = performance.timing || {}, o = performance.getEntriesByType("resource") || [];
        if ("function" == typeof window.PerformanceNavigationTiming) {
            var s = performance.getEntriesByType("navigation")[0];
            s && (i = s);
        }
        each({
            dom: [10, 8],
            load: [14, 1]
        }, function (e, t) {
            var r = i[TIMING_KEYS[e[1]]], o = i[TIMING_KEYS[e[0]]];
            if (r !== undefined && o !== undefined) {
                var s = Math.round(o - r);
                s >= 0 && s < 36e5 && (msg[t] = s);
            }
        });
        // 过滤忽略的url
        o = o.filter(function (item) {
            var include = findIndex(getConfig('ignore').ignoreApis, function (ignoreApi) { return item.name.indexOf(ignoreApi) > -1; });
            return include > -1 ? false : true;
        });
        // 兼容Edge浏览器无法直接使用PerformanceResourceTiming对象类型的数据进行上报，处理方式是定义变量重新赋值
        if (checkEdge()) {
            var edgeResources = [];
            each(o, function (oItem) {
                edgeResources.push({
                    connectEnd: oItem.connectEnd,
                    connectStart: oItem.connectStart,
                    domainLookupEnd: oItem.connectStart,
                    domainLookupStart: oItem.domainLookupStart,
                    duration: oItem.duration,
                    entryType: oItem.entryType,
                    fetchStart: oItem.fetchStart,
                    initiatorType: oItem.initiatorType,
                    name: oItem.name,
                    redirectEnd: oItem.redirectEnd,
                    redirectStart: oItem.redirectStart,
                    responseEnd: oItem.responseEnd,
                    responseStart: oItem.responseStart,
                    startTime: oItem.startTime
                });
            });
            o = edgeResources;
        }
        msg.res = o;
        report(msg);
    }
    function handleApi(url, success, time, code, msg, beigin) {
        if (!url) {
            warn('[retcode] api is null');
            return;
        }
        // 设置健康状态
        setGlobalHealth('api', success);
        var commonMsg = getCommonMsg();
        var apiMsg = __assign(__assign({}, commonMsg), {
            t: 'api',
            beigin: beigin,
            url: url,
            success: success,
            time: time,
            code: code,
            msg: msg,
        });
        // 过滤忽略的url
        var include = findIndex(getConfig('ignore').ignoreApis, function (ignoreApi) { return url.indexOf(ignoreApi) > -1; });
        if (include > -1)
            return;
        report(apiMsg);
    }
    function handleSum(key, val) {
        if (val === void 0) { val = 1; }
        var commonMsg = getCommonMsg();
        var g = splitGroup(key);
        var ret = __assign(__assign(__assign({}, commonMsg), g), {
            t: 'sum',
            val: val,
        });
        report(ret);
    }
    function handleAvg(key, val) {
        if (val === void 0) { val = 1; }
        var commonMsg = getCommonMsg();
        var g = splitGroup(key);
        var ret = __assign(__assign(__assign({}, commonMsg), g), {
            t: 'avg',
            val: val,
        });
        report(ret);
    }
    function handleMsg(key) {
        var commonMsg = getCommonMsg();
        var g = splitGroup(key);
        var ret = __assign(__assign({}, commonMsg), {
            t: 'msg',
            group: g.group,
            msg: g.key.substr(0, Config.maxLength)
        });
        report(ret);
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
    function handleHover(e) {
        var cls = document.getElementsByClassName(CIRCLECLS);
        if (cls.length > 0) {
            for (var i = 0; i < cls.length; i++) {
                cls[i].className = cls[i].className.replace(/ bombayjs-circle-active/g, '');
            }
        }
        e.target.className += " " + CIRCLECLS;
    }
    function insertCss() {
        var content = "." + CIRCLECLS + "{border: #ff0000 2px solid;}";
        var style = document.createElement("style");
        style.type = "text/css";
        style.id = CIRCLESTYLEID;
        try {
            style.appendChild(document.createTextNode(content));
        }
        catch (ex) {
            style.styleSheet.cssText = content; //针对IE
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }
    function removeCss() {
        var style = document.getElementById(CIRCLESTYLEID);
        style.parentNode.removeChild(style);
    }
    function listenCircleListener() {
        insertCss();
        GlobalVal.cssInserted = true;
        GlobalVal.circle = true;
        on('mouseover', handleHover);
    }
    function removeCircleListener() {
        removeCss();
        GlobalVal.cssInserted = false;
        GlobalVal.circle = false;
        off('mouseover', handleHover);
    }
    function listenMessageListener() {
        on('message', handleMessage);
    }
    /**
     *
     * @param {*} event {t: '', v: ''}
     *  t: type
     *  v: value
     */
    function handleMessage(event) {
        // 防止其他message的干扰
        if (!event.data || !event.data.t)
            return;
        if (event.data.t === 'setCircle') {
            if (Boolean(event.data.v)) {
                listenCircleListener();
            }
            else {
                removeCircleListener();
            }
        }
        else if (event.data.t === 'back') {
            window.history.back();
        }
        else if (event.data.t === 'forward') {
            window.history.forward();
        }
    }
    //# sourceMappingURL=handlers.js.map

    // hack console
    // "debug", "info", "warn", "log", "error"
    function hackConsole() {
        if (window && window.console) {
            for (var e = Config.behavior.console, n = 0; e.length; n++) {
                var r = e[n];
                var action = window.console[r];
                if (!window.console[r])
                    return;
                (function (r, action) {
                    window.console[r] = function () {
                        var i = Array.prototype.slice.apply(arguments);
                        var s = {
                            type: "console",
                            data: {
                                level: r,
                                message: JSON.stringify(i),
                            }
                        };
                        handleBehavior(s);
                        action && action.apply(null, i);
                    };
                })(r, action);
            }
        }
    }
    /**
     * hack pushstate replaceState
     * 派送historystatechange historystatechange事件
     * @export
     * @param {('pushState' | 'replaceState')} e
     */
    function hackState(e) {
        var t = history[e];
        "function" == typeof t && (history[e] = function (n, i, s) {
            !window['__bb_onpopstate_'] && hackOnpopstate(); // 调用pushState或replaceState时hack Onpopstate
            var c = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments), u = location.href, f = t.apply(history, c);
            if (!s || "string" != typeof s)
                return f;
            if (s === u)
                return f;
            try {
                var l = u.split("#"), h = s.split("#"), p = parseUrl(l[0]), d = parseUrl(h[0]), g = l[1] && l[1].replace(/^\/?(.*)/, "$1"), v = h[1] && h[1].replace(/^\/?(.*)/, "$1");
                p !== d ? dispatchCustomEvent("historystatechanged", d) : g !== v && dispatchCustomEvent("historystatechanged", v);
            }
            catch (m) {
                warn("[retcode] error in " + e + ": " + m);
            }
            return f;
        }, history[e].toString = fnToString(e));
    }
    function hackhook() {
        hackFetch();
        hackAjax();
    }
    function hackFetch() {
        if ("function" == typeof window.fetch) {
            var __oFetch_ = window.fetch;
            window['__oFetch_'] = __oFetch_;
            window.fetch = function (t, o) {
                var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                var begin = Date.now(), url = (t && "string" != typeof t ? t.url : t) || "", page = parseUrl(url);
                if (!page)
                    return __oFetch_.apply(window, a);
                return __oFetch_.apply(window, a).then(function (e) {
                    var response = e.clone(), headers = response.headers;
                    if (headers && 'function' === typeof headers.get) {
                        var ct = headers.get('content-type');
                        if (ct && !/(text)|(json)/.test(ct))
                            return e;
                    }
                    var time = Date.now() - begin;
                    response.text().then(function (res) {
                        if (response.ok) {
                            handleApi(page, !0, time, status, res.substr(0, 1000) || '', begin);
                        }
                        else {
                            handleApi(page, !1, time, status, res.substr(0, 1000) || '', begin);
                        }
                    });
                    return e;
                });
            };
        }
    }
    // 如果返回过长，会被截断，最长1000个字符
    function hackAjax() {
        if ("function" == typeof window.XMLHttpRequest) {
            var begin = 0, page = '';
            var __oXMLHttpRequest_ = window.XMLHttpRequest;
            window['__oXMLHttpRequest_'] = __oXMLHttpRequest_;
            window.XMLHttpRequest = function (t) {
                var xhr = new __oXMLHttpRequest_(t);
                if (!xhr.addEventListener)
                    return xhr;
                var open = xhr.open, send = xhr.send;
                xhr.open = function (method, url) {
                    var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                    url = url;
                    page = parseUrl(url);
                    open.apply(xhr, a);
                };
                xhr.send = function () {
                    begin = Date.now();
                    var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                    send.apply(xhr, a);
                };
                xhr.onreadystatechange = function () {
                    if (page && 4 === xhr.readyState) {
                        var time = Date.now() - begin;
                        if (xhr.status >= 200 && xhr.status <= 299) {
                            var status = xhr.status || 200;
                            if ("function" == typeof xhr.getResponseHeader) {
                                var r = xhr.getResponseHeader("Content-Type");
                                if (r && !/(text)|(json)/.test(r))
                                    return;
                            }
                            handleApi(page, !0, time, status, xhr.responseText.substr(0, Config.maxLength) || '', begin);
                        }
                        else {
                            handleApi(page, !1, time, status || 'FAILED', xhr.responseText.substr(0, Config.maxLength) || '', begin);
                        }
                    }
                };
                return xhr;
            };
        }
    }
    function hackOnpopstate() {
        window['__bb_onpopstate_'] = window.onpopstate;
        window.onpopstate = function () {
            for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++)
                a[o] = arguments[o];
            var page = Config.enableSPA ? parseHash(location.hash.toLowerCase()) : location.pathname.toLowerCase();
            setPage(page, false);
            if (window.__bb_onpopstate_)
                return window.__bb_onpopstate_.apply(this, a);
        };
    }
    //# sourceMappingURL=hack.js.map

    var Bombay = /** @class */ (function () {
        function Bombay(options, fn) {
            this.init(options);
        }
        Bombay.prototype.init = function (options) {
            // 没有token,则不监听任何事件
            if (options && !options.token) {
                console.warn('请输入一个token');
                return;
            }
            setConfig(options);
            var page = Config.enableSPA ? parseHash(location.hash.toLowerCase()) : location.pathname.toLowerCase();
            setPage(page, true);
            Config.isPage && this.sendPerf();
            Config.enableSPA && this.addListenRouterChange();
            Config.isError && this.addListenJs();
            Config.isAjax && this.addListenAjax();
            Config.isRecord && this.addRrweb();
            // 行为是一个页面内的操作
            Config.isBehavior && this.addListenBehavior();
            Config.isResource && this.sendResource();
            // 绑定全局变量
            window.__bb = this;
            this.addListenUnload();
            // 监听message
            listenMessageListener();
            if (GlobalVal.circle) {
                listenCircleListener();
            }
        };
        Bombay.prototype.sendPerf = function () {
            handlePerf();
        };
        // 发送资源
        Bombay.prototype.sendResource = function () {
            'complete' === window.document.readyState ? handleResource() : this.addListenResource();
        };
        // 监听资源
        Bombay.prototype.addListenResource = function () {
            on('load', handleResource);
        };
        // 监听行为
        Bombay.prototype.addListenBehavior = function () {
            hackConsole();
            Config.behavior.click && this.addListenClick();
        };
        // 监听click
        Bombay.prototype.addListenClick = function () {
            on('click', handleClick); // 非输入框点击，会过滤掉点击输入框
            on('blur', handleBlur); // 输入框失焦
        };
        // 监听路由
        Bombay.prototype.addListenRouterChange = function () {
            hackState('pushState');
            hackState('replaceState');
            on('hashchange', handleHashchange);
            on('historystatechanged', handleHistorystatechange);
        };
        Bombay.prototype.addListenJs = function () {
            // js错误或静态资源加载错误
            on('error', handleErr);
            //promise错误
            on('unhandledrejection', handleErr);
            // window.addEventListener('rejectionhandled', rejectionhandled, true);
        };
        Bombay.prototype.addListenAjax = function () {
            hackhook();
        };
        // beforeunload
        Bombay.prototype.addListenUnload = function () {
            on('beforeunload', handleHealth);
            this.destroy();
        };
        Bombay.prototype.addRrweb = function () {
        };
        // 移除路由
        Bombay.prototype.removeListenRouterChange = function () {
            off('hashchange', handleHashchange);
            off('historystatechanged', handleHistorystatechange);
        };
        Bombay.prototype.removeListenJs = function () {
            off('error', handleErr);
            off('unhandledrejection', handleErr);
        };
        // 监听资源
        Bombay.prototype.removeListenResource = function () {
            off('beforeunload', handleHealth);
        };
        Bombay.prototype.removeListenAjax = function () {
        };
        Bombay.prototype.removeListenUnload = function () {
            off('load', handleResource);
        };
        Bombay.prototype.removeRrweb = function () {
        };
        Bombay.prototype.sum = function (key, val) {
            handleSum(key, val);
        };
        Bombay.prototype.avg = function (key, val) {
            handleAvg(key, val);
        };
        Bombay.prototype.msg = function (key) {
            handleMsg(key);
        };
        Bombay.prototype.api = function (api, success, time, code, msg) {
            handleApi(api, success, time, code, msg, Date.now());
        };
        Bombay.prototype.destroy = function () {
            Config.enableSPA && this.removeListenRouterChange();
            Config.isError && this.removeListenJs();
            Config.isAjax && this.removeListenAjax();
            Config.isRecord && this.removeRrweb();
            Config.isResource && this.removeListenResource();
            this.removeListenResource();
        };
        return Bombay;
    }());
    //# sourceMappingURL=index.js.map

    return Bombay;

}));
