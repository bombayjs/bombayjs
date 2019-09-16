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

    function randomString(len) {
        len = len || 10;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd + new Date().getTime();
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
    //# sourceMappingURL=tools.js.map

    function getCommonMsg() {
        var u = navigator.connection;
        var data = {
            guid: randomString(11),
            t: '',
            page: Config.enableSPA && location.hash ? location.hash.replace('#', '') : location.pathname,
            times: 1,
            v: Config.appVersion,
            token: Config.token,
            e: Config.environment,
            begin: new Date().getTime(),
            uid: getUid(),
            sid: getSid(),
            dt: document.title,
            dl: location.href,
            dr: document.referrer,
            dpr: window.devicePixelRatio,
            de: document.charset,
            sr: screen.width + "x" + screen.height,
            vp: getScreen(),
            ul: getLang(),
            ct: u ? u.effectiveType : '',
            _v: '1.0.2',
        };
        return data;
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
    function getSid() {
        var sid = sessionStorage.getItem('bombay_sid') || '';
        if (!sid) {
            sid = randomString();
            sessionStorage.setItem('bombay_sid', sid);
        }
        return sid;
    }
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
    // 上报错误
    function report(msg) {
        new Image().src = Config.reportUrl + "?" + serialize(msg);
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
            Config.isError && this.addListenJs();
            Config.isAjax && this.addListenAjax();
            Config.isRecord && this.addRrweb();
        };
        Bombay.prototype.addListenJs = function () {
            // js错误或静态资源加载错误
            window.addEventListener("error", handleErr, true);
            //promise错误
            window.addEventListener("unhandledrejection", handleErr);
            // window.addEventListener('rejectionhandled', rejectionhandled, true);
        };
        Bombay.prototype.addListenAjax = function () {
        };
        Bombay.prototype.addRrweb = function () {
        };
        Bombay.prototype.removeListenJs = function () {
            window.removeEventListener("error", handleErr, true);
            window.removeEventListener("unhandledrejection", handleErr);
        };
        Bombay.prototype.removeListenAjax = function () {
        };
        Bombay.prototype.removeRrweb = function () {
        };
        Bombay.prototype.destroy = function () {
            Config.isError && this.removeListenJs();
            Config.isAjax && this.removeListenAjax();
            Config.isRecord && this.removeRrweb();
        };
        return Bombay;
    }());
    //# sourceMappingURL=index.js.map

    return Bombay;

}));
