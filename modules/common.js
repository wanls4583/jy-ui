/*
 * @Author: lisong
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($) {
        var Common = {
            on: on,
            once: once,
            trigger: trigger,
            getNum: getNum
        }

        // 监听事件
        function on(filter, callback) {
            on[filter] = on[filter] || [];
            on[filter].push(callback);
        }

        // 监听事件
        function once(filter, callback) {
            if (!on[filter]) {
                on[filter] = [callback];
            }
        }

        // 触发事件
        function trigger(filter, event) {
            var arr = on[filter];
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i](event);
                }
            }
        }

        // 获取纯数字
        function getNum(str, noParse, dot) {
            if (typeof str == 'number') {
                str = str.toString();
            }
            if (dot === undefined) {
                dot = 2;
            }
            str = (str || '') + '';
            str = str.replace(/\,/g, '');
            str = str.replace(/。/g, '.');
            var reg = new RegExp('\\-?\\d+' + (dot ? '(\\.\\d{0,' + dot + '})?' : ''));
            reg = str.match(reg);
            if (noParse) {
                return reg && reg[0] || (str == '-' ? '-' : '');
            } else {
                return reg && Number(reg[0]) || 0;
            }
        }

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (item) {
                for (var i = 0; i < this.length; i++) {
                    if (item == this[i]) {
                        return i;
                    }
                }
                return -1;
            }
        }
        if (!Object.assign) {
            Object.assign = function (a, b) {
                for (var key in b) {
                    a[key] = b[key];
                }
                return a;
            }
        }
        if (!Object.keys) {
            Object.keys = function (obj) {
                var keys = [];
                for (var key in obj) {
                    if (key != 'keys') {
                        keys.push(key);
                    }
                }
                return keys;
            }
        }
        if (!Array.prototype.map) {
            Array.prototype.map = function (callback) {
                var results = [];
                for (var i = 0; i < this.length; i++) {
                    results.push(callback(this[i], i));
                }
                return results;
            }
        }
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (callback) {
                var results = [];
                for (var i = 0; i < this.length; i++) {
                    if (callback(this[i])) {
                        results.push(this[i]);
                    }
                }
                return results;
            }
        }
        Array.prototype.remove = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) {
                    this.splice(i, 1);
                    i--;
                }
            }
        }

        Date.prototype.formatTime = function (formatStr) {
            var date = this;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            formatStr = formatStr.replace(/yyyy/i, year);
            formatStr = formatStr.replace('MM', ('0' + month).slice(-2));
            formatStr = formatStr.replace(/dd/i, ('0' + day).slice(-2));
            formatStr = formatStr.replace(/hh/i, ('0' + hour).slice(-2));
            formatStr = formatStr.replace('mm', ('0' + minute).slice(-2));
            formatStr = formatStr.replace(/ss/i, ('0' + second).slice(-2));
            return formatStr;
        };

        var _parseInt = window.parseInt;
        //ie8 默认会将前面有0的字符串以8进制来解析
        window.parseInt = function (str, base) {
            return _parseInt(str, base || 10);
        }

        return Common;
    }


    if ("function" == typeof define && define.amd) {
        define("common", ['jquery'], function ($) {
            return factory($);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Common = factory(window.$);
    }
})(window)