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
        // ajax请求时需要过滤的url信息
        filterUrl: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
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
    };
    // 设置参数
    function setConfig(options) {
        Config = __assign({}, Config, options);
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
            remove && window.removeEventListener(event, a, !1), fn.call(this, i);
        }, !1) : window.attachEvent && window.attachEvent("on" + event, function i(a) {
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

    // 默认参数
    var GlobalVal = {
        page: '',
        sid: '',
        sBegin: Date.now(),
    };
    function setGlobalPage(page) {
        GlobalVal.page = page;
    }
    function setGlobalSid() {
        GlobalVal.sid = randomString();
        GlobalVal.sBegin = Date.now();
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
            _v: '1.0.2',
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
    function report(msg) {
        new Image().src = Config.reportUrl + "?" + serialize(msg);
    }
    //# sourceMappingURL=reporter.js.map

    // 处理pv
    function handlePv() {
        var commonMsg = getCommonMsg();
        var msg = __assign({}, commonMsg, {
            t: 'pv',
            dt: document.title,
            dl: location.href,
            dr: document.referrer,
            dpr: window.devicePixelRatio,
            de: document.charset,
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
        var data = {}, timing = performance.timing || {}, now = Date.now(), type = 1;
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
            if (2 === type || r > 0 && o > 0) {
                var c = Math.round(o - r);
                c >= 0 && c < 36e5 && (data[t] = c);
            }
        });
        var u = window.navigator.connection, f = performance.navigation || { type: undefined };
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
        var msg = __assign({}, commonMsg, { t: 'perf' }, data);
        report(msg);
    }
    // 处理hash变化
    function handleHashchange(e) {
        debugger;
        var page = parseHash(location.hash);
        page && setPage(page);
    }
    // 处理hash变化
    function handleHistorystatechange(e) {
        debugger;
        var page = parseHash(e.detail);
        page && setPage(page);
    }
    function setPage(page) {
        setGlobalPage(page);
        setGlobalSid();
        handlePv();
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
    }
    // 捕获js异常
    function reportCaughtError(error) {
        var commonMsg = getCommonMsg();
        var n = error.name || "CustomError", a = error.message || "", i = error.error.stack || "";
        var msg = __assign({}, commonMsg, {
            t: 'error',
            cate: n,
            msg: a && a.substring(0, 1e3),
            stack: i && i.substring(0, 1e3),
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
        var msg = __assign({}, commonMsg, {
            t: 'resource',
            msg: target.outerHTML,
            src: target.src,
            tagName: target.localName.toUpperCase(),
        });
        report(msg);
    }
    // 捕获promise异常
    function reportPromiseError(error) {
        console.log(error);
        var commonMsg = getCommonMsg();
        var msg = __assign({}, commonMsg, {
            t: 'promise',
            msg: error.reason,
        });
        report(msg);
    }
    //# sourceMappingURL=handlers.js.map

    /**
     * hack pushstate replaceState
     * 派送historystatechange historystatechange事件
     * @export
     * @param {('pushState' | 'replaceState')} e
     */
    function hackState(e) {
        var t = history[e];
        "function" == typeof t && (history[e] = function (n, i, s) {
            var c = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments), u = location.href, f = t.apply(history, c);
            if (!s || "string" != typeof s)
                return f;
            if (s === u)
                return f;
            try {
                var l = u.split("#"), h = s.split("#"), p = parseUrl(l[0]), d = parseUrl(h[0]), g = l[1] && l[1].replace(/^\/?(.*)/, "$1"), v = h[1] && h[1].replace(/^\/?(.*)/, "$1");
                p !== d ? dispatchCustomEvent("historystatechange", d) : g !== v && dispatchCustomEvent("historystatechange", v);
            }
            catch (m) {
                warn("[retcode] error in " + e + ": " + m);
            }
            return f;
        }, history[e].toString = fnToString(e));
    }

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
            Config.autoSendPv && this.sendPv();
            Config.isPage && this.sendPerf();
            Config.enableSPA && this.addListenRouterChange();
            Config.isError && this.addListenJs();
            Config.isAjax && this.addListenAjax();
            Config.isRecord && this.addRrweb();
        };
        Bombay.prototype.sendPv = function () {
            handlePv();
        };
        Bombay.prototype.sendPerf = function () {
            handlePerf();
        };
        // 监听路由
        Bombay.prototype.addListenRouterChange = function () {
            hackState('pushState');
            hackState('replaceState');
            on('hashchange', handleHashchange);
            on('historystatechange', handleHistorystatechange);
        };
        Bombay.prototype.addListenJs = function () {
            // js错误或静态资源加载错误
            on('error', handleErr);
            //promise错误
            on('unhandledrejection', handleErr);
            // window.addEventListener('rejectionhandled', rejectionhandled, true);
        };
        Bombay.prototype.addListenAjax = function () {
        };
        Bombay.prototype.addRrweb = function () {
        };
        // 移除路由
        Bombay.prototype.removeListenRouterChange = function () {
            off('hashchange', handleHashchange);
            off('historystatechange', handleHistorystatechange);
        };
        Bombay.prototype.removeListenJs = function () {
            off('error', handleErr);
            off('unhandledrejection', handleErr);
        };
        Bombay.prototype.removeListenAjax = function () {
        };
        Bombay.prototype.removeRrweb = function () {
        };
        Bombay.prototype.destroy = function () {
            Config.enableSPA && this.removeListenRouterChange();
            Config.isError && this.removeListenJs();
            Config.isAjax && this.removeListenAjax();
            Config.isRecord && this.removeRrweb();
        };
        return Bombay;
    }());

    return Bombay;

}));
