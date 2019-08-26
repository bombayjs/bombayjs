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
    var defaultConfig = {
        // 上报地址
        domain: 'http://localhost/api',
        // 提交参数
        appId: '',
        // 脚本延迟上报时间
        outtime: 300,
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
        defaultConfig = __assign({}, defaultConfig, options);
    }
    //# sourceMappingURL=index.js.map

    function unhandledrejection() {
        console.log('unhandledrejection');
        console.log(arguments);
    }
    function errorEvent() {
        console.log('errorEvent');
        console.log(arguments);
    }
    //# sourceMappingURL=handlers.js.map

    var Bombay = /** @class */ (function () {
        function Bombay(options, fn) {
            this.init(options);
        }
        Bombay.prototype.init = function (options) {
            setConfig(options);
            defaultConfig.isError && this.addListenJs();
            defaultConfig.isAjax && this.addListenAjax();
            defaultConfig.isRecord && this.addRrweb();
        };
        Bombay.prototype.addListenJs = function () {
            window.addEventListener("error", errorEvent, true);
            window.addEventListener("unhandledrejection", unhandledrejection);
        };
        Bombay.prototype.addListenAjax = function () {
        };
        Bombay.prototype.addRrweb = function () {
        };
        Bombay.prototype.removeListenJs = function () {
            window.removeEventListener("error", errorEvent, true);
            window.removeEventListener("unhandledrejection", unhandledrejection);
        };
        Bombay.prototype.removeListenAjax = function () {
        };
        Bombay.prototype.removeRrweb = function () {
        };
        Bombay.prototype.destroy = function () {
            defaultConfig.isError && this.removeListenJs();
            defaultConfig.isAjax && this.removeListenAjax();
            defaultConfig.isRecord && this.removeRrweb();
        };
        return Bombay;
    }());

    return Bombay;

}));
