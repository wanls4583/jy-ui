/*
 * @Author: lisong
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($) {
        var Common = {
            getEvent: getEvent,
            getIeVersion: getIeVersion,
            getNum: getNum,
            insertRule: insertRule,
            getScrBarWidth: getScrBarWidth,
            getRect: getRect
        }


        function getEvent() {
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

            return {
                on: on,
                once: once,
                trigger: trigger
            }
        }


        // 获取ie版本
        function getIeVersion() {
            if (document.documentMode) {
                return document.documentMode;
            }
            var version = 100;
            var appVersion = navigator.appVersion;
            var arr = appVersion.split(";");
            if (arr.length > 1 && arr[1].indexOf('MSIE') > -1) {
                version = parseInt(arr[1].replace(/\s|MSIE/g, ''));
            }
            return version
        }

        function insertRule(sheet, selectorText, cssText) {
            //如果是非IE
            if (sheet.insertRule) {
                sheet.insertRule(selectorText + "{" + cssText + "}", 0);
                //如果是IE
            } else if (sheet.addRule) {
                sheet.addRule(selectorText, cssText, 0);
            }
        }

        // 获取纯数字
        function getNum(value, dot) {
            value = value.replace(/[^0123456789\.]/g, '');
            var reg = /^\d+(\.\d*)?$/;
            var r = reg.exec(value);
            var num = r && r[0] || '';
            if (dot !== undefined) { //整数
                if (dot === 0 && num) {
                    num = parseInt(num);
                }
                if (r && r[1] && r[1].length > (dot + 1)) {
                    num = num.slice(0, num.length - (r[1].length - (dot + 1)));
                }
            }
            return num;
        }

        //获取margin,padding,offset(相对页面边缘)
        function getRect(dom) {
            var _r = dom.getBoundingClientRect();
            var styles = null;
            if (window.getComputedStyle) {
                styles = window.getComputedStyle(dom, null);
            } else {
                styles = dom.currentStyle;
            }
            var _pt = styles['paddingTop'];
            _pt = getNum(_pt);
            var _pb = styles['paddingBottom'];
            _pb = getNum(_pb);
            var _pl = styles['paddingLeft'];
            _pl = getNum(_pl);
            var _pr = styles['paddingRight'];
            _pr = getNum(_pr);
            var _mt = styles['marginTop'];
            _mt = getNum(_mt);
            var _mb = styles['marginBottom'];
            _mb = getNum(_mb);
            var _ml = styles['marginLeft'];
            _ml = getNum(_ml);
            var _mr = styles['marginRight'];
            _mr = getNum(_mr);
            var _bt = styles['borderTop'];
            _bt = getNum(_bt);
            var _bb = styles['borderBottom'];
            _bb = getNum(_bb);
            var _bl = styles['borderLeft'];
            _bl = getNum(_bl);
            var _br = styles['borderRight'];
            _br = getNum(_br);
            return {
                top: _r.top,
                bottom: _r.bottom,
                left: _r.left,
                right: _r.right,
                paddingTop: _pt,
                paddingBottom: _pb,
                paddingLeft: _pl,
                paddingRight: _pr,
                marginTop: _mt,
                marginBottom: _mb,
                marginLeft: _ml,
                marginRight: _mr,
                borderTop: _bt,
                borderBottom: _bb,
                borderLeft: _bl,
                borderRight: _br,
                offsetTop: dom.offsetTop,
                offsetBottom: dom.offsetBottom,
                offsetLeft: dom.offsetLeft,
                offsetRight: dom.offsetRight
            }
        }

        //获取滚动条宽度
        function getScrBarWidth() {
            var wrap = $('<div style="height:30px;overflow:auto;"><div style="height:100px;"></div></div>')
            $(window.document.body).append(wrap[0]);
            var w = wrap[0].offsetWidth - wrap[0].clientWidth;
            wrap.remove();
            return w || 17;
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
        define("common", ['./jquery'], function ($) {
            return factory($);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Common = factory(window.$);
    }
})(window)