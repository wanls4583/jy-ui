/*
 * @Author: lijy
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($) {
        var Common = {
            getEvent: getEvent,
            getIeVersion: getIeVersion,
            indexOf: indexOf,
            getNum: getNum,
            insertRule: insertRule,
            deleteRule: deleteRule,
            getScrBarWidth: getScrBarWidth,
            getMarginPadding: getMarginPadding,
            getComputedStyle: getComputedStyle,
            nextFrame: nextFrame,
            cancelNextFrame: cancelNextFrame,
            htmlTemplate: htmlTemplate,
            checkOverflow: checkOverflow,
            deepAssign: deepAssign,
            delInnerProperty: delInnerProperty,
            stopPropagation: stopPropagation,
            parseDateTime: parseDateTime,
            showMsg: showMsg
        }


        function getEvent() {
            // 监听事件
            function on(filter, callback, container) {
                var filters = filter.split(/\s+/);
                filters.map(function (filter) {
                    container = container || on;
                    container[filter + '_event'] = container[filter + '_event'] || [];
                    container[filter + '_event'].push(callback);
                });
            }

            // 监听事件
            function once(filter, callback, container) {
                container = container || on;
                if (!container[filter + '_event']) {
                    container[filter + '_event'] = [callback];
                }
            }

            // 触发事件
            function trigger(filter, event, container) {
                var filters = filter.split(/\s+/);
                filters.map(function (filter) {
                    container = container || on;
                    var arr = container[filter + '_event'];
                    arr && arr.map(function (fun) {
                        fun(event);
                    });
                })
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

        // 插入样式
        function insertRule(sheet, selectorText, cssText) {
            var index = sheet.rules.length;
            //如果是非IE
            if (sheet.insertRule) {
                sheet.insertRule(selectorText + "{" + cssText + "}", index);
                //如果是IE
            } else if (sheet.addRule) {
                sheet.addRule(selectorText, cssText, index);
            }
            return index;
        }

        // 删除样式
        function deleteRule(sheet, selector) {
            var rules = sheet.cssRules || sheet.rules;
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].selectorText == selector) {
                    if (sheet.deleteRule) {
                        sheet.deleteRule(i);
                    } else {
                        sheet.removeRule(i);
                    }
                    i--;
                }
            }
        }

        // 查找数组内容
        function indexOf(arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == value) {
                    return i;
                }
            }
            return -1;
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

        function getComputedStyle(dom) {
            var styles = null;
            if (window.getComputedStyle) {
                styles = window.getComputedStyle(dom, null);
            } else {
                styles = dom.currentStyle;
            }
            return styles;
        }

        function getMarginPadding(dom) {
            var styles = getComputedStyle(dom);
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
            return {
                paddingTop: _pt,
                paddingBottom: _pb,
                paddingLeft: _pl,
                paddingRight: _pr,
                marginTop: _mt,
                marginBottom: _mb,
                marginLeft: _ml,
                marginRight: _mr
            }
        }

        //请求下一帧
        function nextFrame(callback, duration) {
            if (window.requestAnimationFrame) {
                return window.requestAnimationFrame(callback);
            } else {
                return setTimeout(function () {
                    callback();
                }, isNaN(duration) ? 30 : duration);
            }
        }
        //取消下一帧
        function cancelNextFrame(id) {
            if (window.requestAnimationFrame) {
                window.cancelAnimationFrame(id);
            } else {
                clearTimeout(id);
            }
        }

        // 检测文本是否溢出
        function checkOverflow(dom) {
            if (dom.scrollWidth > dom.clientWidth) {
                return true;
            }
            var $dom = $(dom);
            var ieVerjy = getIeVersion();
            var $temp = $dom.clone().css({
                position: 'absolute',
                top: '0',
                overflow: 'visible',
                visiblity: 'hidden',
                width: 'auto',
                height: ieVerjy <= 6 ? $dom[0].offsetHeight : $dom.height()
            }).appendTo(window.document.body).addClass('jy-inline-block');
            var overflow = $temp[0].scrollWidth > $dom[0].scrollWidth;
            $temp.remove();
            return overflow;
        }

        //获取滚动条宽度
        function getScrBarWidth() {
            var wrap = $('<div style="height:30px;overflow:auto;"><div style="height:100px;"></div></div>')
            $(window.document.body).append(wrap[0]);
            var w = wrap[0].offsetWidth - wrap[0].clientWidth;
            wrap.remove();
            return w || 17;
        }

        function htmlTemplate(str, data) {
            var result = htmlTemplate[str];
            var func = null;
            var args = [];
            var params = '';
            //拼接参数
            for (var key in data) {
                params += key + ',';
                args.push(data[key]);
            }
            params = params.slice(0, -1);
            if (!result) {
                var reg = /<%(.*?)%>/g,
                    match = null,
                    start = 0;
                result = 'var str="";';
                //拼接代码
                while (match = reg.exec(str)) {
                    if (start < match.index) {
                        result += 'str+=\'' + str.slice(start, match.index).replace(/\n|\r/g, '').replace(/'/g, '\\\'') + '\';';
                    }
                    if (match[1].charAt(0) == '-') { //如果是赋值语句<%-data%>
                        result += 'str+=' + match[1].slice(1) + ';';
                    } else { //如果是流程语句
                        result += match[1];
                    }
                    start = match.index + match[0].length;
                }
                result += 'str+=\'' + str.slice(start).replace(/\n|\r/g, '') + '\';';
                result += 'return str;';
                func = new Function(params, result);
                // 缓存结果
                htmlTemplate[str] = result;
                // 缓存函数，性能提升明显
                htmlTemplate[str + params] = func;
            } else {
                func = htmlTemplate[str + params] || new Function(params, result);
            }

            //执行代码
            return func.apply(window, args);
        }

        // 深度克隆
        function deepAssign(targetObj, originObj, excludeKeys) {
            var assigned = [];
            return _assign(targetObj, originObj, excludeKeys);

            function _assign(targetObj, originObj, excludeKeys) {
                excludeKeys = excludeKeys || [];
                for (var key in originObj) {
                    var value = originObj[key];
                    if (excludeKeys.indexOf(key) > -1) {
                        continue;
                    }
                    if (typeof value === 'object' && value !== null && (!value.nodeName || !value.nodeType) && assigned.indexOf(value) == -1) {
                        assigned.push(value);
                        if (value instanceof Array) {
                            targetObj[key] = _assign(targetObj[key] || [], value);
                        } else {
                            targetObj[key] = _assign(targetObj[key] || {}, value);
                        }
                    } else {
                        targetObj[key] = value;
                    }
                }
                return targetObj;
            }
        }

        function delInnerProperty(originObj) {
            var assigned = [];
            var targetObj = originObj instanceof Array ? [] : {};
            return _assign(targetObj, originObj);

            function _assign(targetObj, originObj) {
                for (var key in originObj) {
                    var value = originObj[key];
                    var isInnerProp = key.slice(0, 3) == '_jy'
                    if (typeof value === 'object' && value !== null && assigned.indexOf(value) == -1) {
                        if (isInnerProp) {
                            continue;
                        }
                        assigned.push(value);
                        if (value instanceof Array) {
                            targetObj[key] = _assign([], value);
                        } else {
                            targetObj[key] = _assign({}, value);
                        }
                    } else if (!isInnerProp) {
                        targetObj[key] = value;
                    }
                }
                return targetObj;
            }
        }

        function stopPropagation(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }

        // 显示提示
        function showMsg(tip, option) {
            var docBody = window.document.body;
            var docElement = window.document.documentElement;
            var ieVersion = Common.getIeVersion();
            var $tip = $('<div class="jy-msg"><span></span></div>');
            var width = 0;
            var height = 0;
            var ie6MarginTop = 0;
            var ie6MarginLeft = 0;
            var containerWidth = 0;
            var containerHeight = 0;
            var $container = null;
            option = option || {};
            $container = $(option.container || docBody);
            if (option.icon) {
                var icon = '';
                var successIcon = '&#xe615;';
                var warnIcon = '&#xe60a;';
                var errorIcon = '&#xe60b;';
                var questionIcon = '&#xe613;';
                switch (icon) {
                    case 'danger':
                        icon = errorIcon;
                        break;
                    case 'warn':
                        icon = warnIcon;
                        break;
                    case 'question':
                        icon = questionIcon;
                        break;
                    default:
                        icon = successIcon;
                        break;
                }
                $tip.prepend('<i class="jy-msg-icon">' + icon + '</i>').addClass('jy-msg-with-icon');
            }
            if (option.container) {
                containerWidth = $container[0].clientWidth;
                containerHeight = $container[0].clientHeight;
            } else {
                containerWidth = docElement.clientWidth || docBody.clientWidth;
                containerHeight = docElement.clientHeight || docBody.clientHeight;
                if (ieVersion <= 6) {
                    ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                    ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                } else {
                    $tip.css('position', 'fixed');
                }
            }
            $tip.children('span').text(tip);
            $container.append($tip);
            width = $tip[0].offsetWidth;
            height = $tip[0].offsetHeight;
            $tip.css({
                left: (containerWidth - width) / 2,
                top: (containerHeight - height) / 2,
                marginLeft: ie6MarginLeft,
                marginTop: ie6MarginTop
            });
            setTimeout(function () {
                $tip.remove();
            }, 1500);
        }

        function parseDateTime(str, formatStr) {
            formatStr = formatStr || 'yyyy-MM-dd hh:mm:ss';
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var year = now.getMonth();
            var date = now.getDate();
            var hours = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            for (var i = 0; i < formatStr.length && str.length; i++) {
                if (formatStr.slice(i, i + 4) == 'yyyy') {
                    year = _getNum();
                    if (!year) {
                        break;
                    } else {
                        year = Number(year);
                    }
                } else if (formatStr.slice(i, i + 2) === 'MM') {
                    month = _getNum();
                    if (!month) {
                        break;
                    } else {
                        month = Number(month) - 1;
                    }
                } else if (formatStr.slice(i, i + 2) === 'dd') {
                    date = _getNum();
                    if (!date) {
                        break;
                    } else {
                        date = Number(date);
                    }
                } else if (formatStr.slice(i, i + 2) === 'hh') {
                    hours = _getNum();
                    if (!hours) {
                        break;
                    } else {
                        hours = Number(hours);
                    }
                } else if (formatStr.slice(i, i + 2) === 'mm') {
                    minute = _getNum();
                    if (!minute) {
                        break;
                    } else {
                        minute = Number(minute);
                    }
                } else if (formatStr.slice(i, i + 2) === 'ss') {
                    second = _getNum();
                    if (!second) {
                        break;
                    } else {
                        second = Number(second);
                    }
                }
            }

            return new Date(year, month, date, hours, minute, second)

            function _getNum() {
                var num = '';
                var start = /\d/.exec(str);
                if (start) {
                    start = start.index;
                } else {
                    start = Infinity;
                }
                for (var i = start; i < str.length; i++) {
                    if (str.charAt(i).match(/\d/)) {
                        num += str.charAt(i);
                    } else {
                        break;
                    }
                }
                str = str.slice(i + 1);
                return num;
            }
        }

        if (!Function.prototype.bind) {
            Function.prototype.bind = function (context) {
                var self = this;
                return function () {
                    return self.apply(context, arguments);
                }
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
            formatStr = formatStr || 'yyyy-MM-dd';
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
        define(['./jquery'], function ($) {
            return factory($);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Common = factory(window.$);
    }
})(window)