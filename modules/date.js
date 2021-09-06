!(function (window) {
    function factory($, Common) {
        var tpl = {
            date: '<div class="jy-date">\
                <div class="jy-date-main">\
                    <div class="jy-date-header">\
                        <div class="jy-date-header-left">\
                            <i class="jy-icon jy-date-prev-year-btn">&#xe612;</i>\
                            <i class="jy-icon jy-date-prev-month-btn">&#xe733;</i>\
                        </div>\
                        <div class="jy-date-header-center">\
                            <div class="jy-date-header-year"></div>\
                            <div class="jy-date-header-month"></div>\
                            <div class="jy-date-header-year-range"></div>\
                            <div class="jy-date-header-time-label">选择时间</div>\
                            <div class="jy-date-header-month-label">选择月份</div>\
                        </div>\
                        <div class="jy-date-header-right">\
                            <i class="jy-icon jy-date-next-month-btn">&#xe734;</i>\
                            <i class="jy-icon jy-date-next-year-btn">&#xe61a;</i>\
                        </div>\
                    </div>\
                    <div class="jy-date-content">\
                    </div>\
                </div>\
                <div class="jy-date-footer">\
                    <div class="jy-date-footer-left">\
                        <span class="jy-date-result"></span>\
                    </div>\
                    <div class="jy-date-footer-right">\
                        <span class="jy-date-btn jy-date-empty">清空</span><span class="jy-date-btn jy-date-now">现在</span><span class="jy-date-btn jy-date-confirm">确定</span>\
                    </div>\
                </div>\
            </div>',
            dateRange: '<div class="jy-date-range">\
                <div class="jy-date-range-content">\
                </div>\
                <div class="jy-date-range-footer">\
                    <div class="jy-date-range-footer-left">\
                        <span class="jy-date-range-result"></span>\
                    </div>\
                    <div class="jy-date-range-footer-right">\
                        <span class="jy-date-btn jy-date-range-empty">清空</span><span class="jy-date-btn jy-date-range-confirm">确定</span>\
                    </div>\
                </div>\
            </div>',
            dateTable: '<table class="jy-date-date">\
                <thead>\
                    <tr>\
                        <th>日</th>\
                        <th>一</th>\
                        <th>二</th>\
                        <th>三</th>\
                        <th>四</th>\
                        <th>五</th>\
                        <th>六</th>\
                    </tr>\
                </thead>\
                <tbody>\
                </tbody>\
            </table>',
            time: '<div class="jy-date-time">\
                <ul>\
                    <li>时</li>\
                    <li>分</li>\
                    <li>秒</li>\
                </ul>\
                <ul>\
                    <li>\
                        <ol class="jy-date-time-hour">\
                        </ol>\
                    </li>\
                    <li>\
                        <ol class="jy-date-time-minute">\
                        </ol>\
                    </li>\
                    <li>\
                        <ol class="jy-date-time-second">\
                        </ol>\
                    </li>\
                </ul>\
            </div>',
            year: '<div class="jy-date-year"><ul></ul></div>',
            month: '<div class="jy-date-month"><ul></ul></div>',
            childBtn: '<span class="jy-date-btn jy-date-child"></span>',
            rangeChildBtn: '<span class="jy-date-btn jy-date-range-child"></span>',
            tip: '<span class="jy-date-tip"></span>'
        }

        var dateClass = {
            date: 'jy-date',
            dateRange: 'jy-date-range',
            static: 'jy-date-static',
            header: 'jy-date-header',
            headerLeft: 'jy-date-header-left',
            headerCenter: 'jy-date-header-center',
            headerRight: 'jy-date-header-right',
            content: 'jy-date-content',
            rangeContent: 'jy-date-range-content',
            year: 'jy-date-header-year',
            yearRange: 'jy-date-header-year-range',
            month: 'jy-date-header-month',
            hour: 'jy-date-time-hour',
            minute: 'jy-date-time-minute',
            second: 'jy-date-time-second',
            preMonth: 'jy-date-prev-month',
            preMonthBtn: 'jy-date-prev-month-btn',
            preYearBtn: 'jy-date-prev-year-btn',
            nextMonth: 'jy-date-next-month',
            nextMonthBtn: 'jy-date-next-month-btn',
            nextYearBtn: 'jy-date-next-year-btn',
            result: 'jy-date-result',
            rangeResult: 'jy-date-range-result',
            footer: 'jy-date-footer',
            rangeFooter: 'jy-date-range-footer',
            empty: 'jy-date-empty',
            rangeEmpty: 'jy-date-range-empty',
            now: 'jy-date-now',
            confirm: 'jy-date-confirm',
            rangeConfirm: 'jy-date-range-confirm',
            child: 'jy-date-child',
            rangeChild: 'jy-date-range-child',
            active: 'jy-date-active',
            showYear: 'jy-date-show-year',
            showMonth: 'jy-date-show-month',
            showYearMonth: 'jy-date-show-year-month',
            showDate: 'jy-date-show-date',
            showTime: 'jy-date-show-time',
            disabled: 'jy-date-btn-disabled',
            downAnimation: 'jy-date-animation-hover-down'
        }

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var layerCount = 0;
        var $docBody = $(docBody);
        var months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

        var JyDate = {
            render: function (option) {
                var date = new Class(option);
                return {

                };
            }
        }

        // 页码类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = Common.deepAssign({}, option);
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.$elem = $(this.option.elem);
            this.triggerEvent = ['change', 'focus', 'click'].indexOf(this.option.trigger) > -1 ? this.option.trigger : 'click';
            if (this.$elem && this.$elem.length) {
                if (this.option.position === 'static') {
                    _render();
                } else {
                    this.$elem.on(this.triggerEvent, function () {
                        _render();
                        that.data.$date.addClass(dateClass.downAnimation);
                    });
                    $(docBody).on('click', function () {
                        that.cancel();
                    });
                    if(this.option.focus) {
                        setTimeout(function() {
                            that.$elem.trigger(that.triggerEvent);
                        }, 100);
                    }
                }
                this.$elem.on('click', function () {
                    return false;
                });
            } else {
                this.option.position = 'static';
                _render();
            }

            function _render() {
                if (that.data && that.data.$date.is(':visible')) {
                    return;
                }
                _init();
                if (that.option.range) {
                    that.renderRange();
                } else {
                    switch (that.data.type) {
                        case 'year':
                            that.renderYear();
                            break;
                        case 'month':
                        case 'yearmonth':
                            that.renderMonth();
                            break;
                        case 'date':
                        case 'datetime':
                            that.renderDate();
                            break;
                        case 'time':
                            that.renderTime();
                            break;
                    }
                }
                if (that.option.position == 'static') {
                    if (that.$elem && that.$elem.length) {
                        that.$elem.append(that.data.$date);
                    } else {
                        $(docBody).append(that.data.$date);
                    }
                    that.data.$date.addClass(dateClass.static);
                } else {
                    $(docBody).append(that.data.$date);
                    that.setPosition();
                }
                that.data.$date.on('click', function () {
                    return false;
                });
                if (!that.option.range) {
                    that.bindHeaderEvent();
                }
                that.bindFooterEvent();
            }

            function _init() {
                that.data = {};
                that.data.type = that.option.type || 'date';
                that.data.split = that.option.split || '-';
                that.data.originType = that.data.type;
                layerCount++;
                $docBody.children('.' + dateClass.date + ',.' + dateClass.dateRange).each(function (i, dom) {
                    var $dom = $(dom);
                    if (!$dom.hasClass(dateClass.static)) {
                        $dom.remove();
                    }
                });
                if (that.option.range) {
                    that.data.value = [];
                    if (that.$elem.length >= 2) {
                        that.$elem.each(function (i, dom) {
                            that.data.value.push($(dom).val());
                        });
                    } else {
                        that.data.value = that.$elem.val() && that.$elem.val().split(that.data.split) || [];
                    }
                    if (that.option.value) {
                        that.data.value[0] = that.data.value[0] || that.option.value[0];
                        that.data.value[1] = that.data.value[1] || that.option.value[1];
                    }
                } else {
                    that.data.value = that.$elem.val() || that.option.value;
                }
            }
        }

        // 渲染日期选择器
        Class.prototype.renderDate = function () {
            if (typeof this.data.value === 'string' && this.data.value) {
                this.data.value = Date.prototype.parseDateTime(this.data.value);
            } else if (typeof this.data.value === 'number') {
                this.data.value = new Date(this.data.value);
            } else if (!(this.data.value instanceof Date)) {
                this.data.value = new Date();
            }
            this.data.format = this.option.format || (this.data.type == 'datetime' ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd');
            this.data.$date = $(tpl.date);
            this.data.$table = $(tpl.dateTable);
            this.data.$content = this.data.$date.find('.' + dateClass.content);
            this.data.$header = this.data.$date.find('.' + dateClass.header);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$content.append(this.data.$table);
            this.data.$date.addClass('date-layer' + layerCount).addClass(dateClass.showDate);
            if (this.data.type === 'datetime') {
                this.data.$childBtn = $(tpl.childBtn).text('选择时间');
                this.data.$result.html(this.data.$childBtn);
                this.data.$result = null;
            }
            this.renderDateTable();
            this.bindDateTableEvent();
        }

        Class.prototype.renderDateTable = function () {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            var date = this.data.value.getDate();
            this.setResult();
            var day = new Date(year, month, 1).getDay();
            var days = this.getMonthDays(year, month);
            var preMonthDays = 0;
            if (month == 0) {
                preMonthDays = this.getMonthDays(year - 1, 11);
            } else {
                preMonthDays = this.getMonthDays(year, month - 1);
            }
            var count = 0;
            var dateNum = 0;
            var next = false;
            var html = '';
            for (var i = 0; i < 42; i++) { //总共渲染6周
                var cn = '';
                if (count === 0) {
                    html += '<tr>';
                }
                if (i < day) {
                    dateNum = preMonthDays - (day - 1) + i;
                } else if (i === day) {
                    dateNum = 1;
                } else if (dateNum === days) {
                    next = true;
                    dateNum = 1;
                } else {
                    dateNum++;
                }
                if (next) {
                    cn = dateClass.nextMonth;
                } else if (i < day) {
                    cn = dateClass.preMonth;
                } else if (dateNum === date) {
                    cn = dateClass.active;
                }
                html += '<td class="' + cn + '">' + dateNum + '</td>';
                if (++count === 7) { // 满一周
                    html += '</tr>';
                    count = 0;
                }
            }
            this.data.$table.children('tbody').html(html);
            this.setHeader();
        }

        Class.prototype.bindDateTableEvent = function () {
            var that = this;
            // 选中日期
            this.data.$content.delegate('td', 'click', function () {
                var date = Number(this.innerText);
                var $this = $(this);
                if ($this.hasClass(dateClass.preMonth)) {
                    if (that.option.position === 'static') {
                        that.renderPreMonth(date);
                    } else {
                        that.setPreMonth(date);
                    }
                } else if ($this.hasClass(dateClass.nextMonth)) {
                    if (that.option.position === 'static') {
                        that.renderNextMonth(date);
                    } else {
                        that.setNextMonth(date);
                    }
                } else {
                    that.data.value.setDate(date);
                    that.data.$table.find('.' + dateClass.active).removeClass(dateClass.active);
                    $this.addClass(dateClass.active);
                }
                that.confirm();
            });
        }

        // 渲染时间选择器
        Class.prototype.renderTime = function () {
            this.data.format = this.option.format || 'hh:mm:ss';
            if (typeof this.data.value === 'string' && this.data.value) {
                this.data.value = Date.prototype.parseDateTime(this.data.value, this.data.format);;
            } else if (typeof this.data.value === 'number') {
                this.data.value = new Date(this.data.value);
            } else if (!(this.data.value instanceof Date)) {
                this.data.value = new Date();
            }
            this.data.$date = $(tpl.date);
            this.data.$time = $(tpl.time);
            this.data.$hour = this.data.$time.find('.' + dateClass.hour);
            this.data.$minute = this.data.$time.find('.' + dateClass.minute);
            this.data.$second = this.data.$time.find('.' + dateClass.second);
            this.data.$content = this.data.$date.find('.' + dateClass.content);
            this.data.$header = this.data.$date.find('.' + dateClass.header);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$content.append(this.data.$time);
            this.data.$date.addClass('date-layer' + layerCount).addClass(dateClass.showTime);;
            this.renderTimeList();
            this.bindTimeListEvent();
        }

        Class.prototype.renderTimeList = function () {
            var that = this;
            var hour = this.data.value.getHours();
            var minute = this.data.value.getMinutes();
            var second = this.data.value.getSeconds();
            var html = '';
            for (var i = 0; i < 24; i++) {
                html += '<li ' + (i === hour ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$hour.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === minute ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$minute.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === second ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$second.append(html);
            Common.nextFrame(function () {
                that.data.$hour[0].scrollTop = hour * 30 - 150 / 2;
                that.data.$minute[0].scrollTop = minute * 30 - 150 / 2;
                that.data.$second[0].scrollTop = second * 30 - 150 / 2;
            });
            this.setResult();
        }

        Class.prototype.bindTimeListEvent = function () {
            var that = this;
            this.data.$hour.delegate('li', 'click', function () {
                var hour = Number(this.innerText);
                that.data.value.setHours(hour);
                that.data.$hour.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.setResult();
            });
            this.data.$minute.delegate('li', 'click', function () {
                var minute = Number(this.innerText);
                that.data.value.setMinutes(minute);
                that.data.$minute.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.setResult();
            });
            this.data.$second.delegate('li', 'click', function () {
                var second = Number(this.innerText);
                that.data.value.setSeconds(second);
                that.data.$second.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.setResult();
            });
        }

        // 渲染年选择器
        Class.prototype.renderYear = function () {
            this.data.format = this.option.format || 'yyyy';
            if (typeof this.data.value === 'string' && this.data.value) {
                this.data.value = Date.prototype.parseDateTime(this.data.value, this.data.format);;
            } else if (typeof this.data.value === 'number') {
                this.data.value = new Date(this.data.value);
            } else if (!(this.data.value instanceof Date)) {
                this.data.value = new Date();
            }
            this.data.$date = $(tpl.date);
            this.data.$year = $(tpl.year);
            this.data.$yearList = this.data.$year.children('ul');
            this.data.$content = this.data.$date.find('.' + dateClass.content);
            this.data.$header = this.data.$date.find('.' + dateClass.header);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$content.append(this.data.$year);
            this.data.$date.addClass('date-layer' + layerCount).addClass(dateClass.showYear);;
            this.renderYearList();
            this.bindYearListEvent();
        }

        Class.prototype.renderYearList = function () {
            var year = this.data.value.getFullYear();
            var html = '';
            var startYear = year - 7;
            var endYear = year + 7;
            for (var i = startYear; i <= endYear; i++) {
                html += '<li data-year="' + i + '" ' + (i === year ? 'class="' + dateClass.active + '"' : '') + '>' + i + '年</li>';
            }
            this.setHeader();
            this.data.$yearList.html(html);
            this.setResult();
        }

        Class.prototype.bindYearListEvent = function () {
            var that = this;
            this.data.$yearList.delegate('li', 'click', function () {
                var $this = $(this);
                var year = Number($this.attr('data-year'));
                that.data.value.setFullYear(year);
                that.data.$yearList.find('.' + dateClass.active).removeClass(dateClass.active);
                $this.addClass(dateClass.active);
                that.confirm();
            });
        }

        // 渲染年月选择器
        Class.prototype.renderMonth = function () {
            this.data.format = this.option.format || (this.data.type === 'yearmonth' ? 'yyyy-MM' : 'MM');
            if (typeof this.data.value === 'string' && this.data.value) {
                this.data.value = Date.prototype.parseDateTime(this.data.value, this.data.format);;
            } else if (typeof this.data.value === 'number') {
                this.data.value = new Date(this.data.value);
            } else if (!(this.data.value instanceof Date)) {
                this.data.value = new Date();
            }
            this.data.$date = $(tpl.date);
            this.data.$month = $(tpl.month);
            this.data.$monthList = this.data.$month.children('ul');
            this.data.$content = this.data.$date.find('.' + dateClass.content);
            this.data.$header = this.data.$date.find('.' + dateClass.header);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$content.append(this.data.$month);
            this.data.$date.addClass('date-layer' + layerCount).addClass(this.data.type === 'yearmonth' ? dateClass.showYearMonth : dateClass.showMonth);;
            this.renderMonthList();
            this.bindMonthListEvent();
        }

        Class.prototype.renderMonthList = function () {
            var month = this.data.value.getMonth();
            var html = '';
            for (var i = 0; i < 12; i++) {
                html += '<li data-month="' + i + '" ' + (i === month ? 'class="' + dateClass.active + '"' : '') + '>' + months[i] + '月</li>';
            }
            this.setHeader();
            this.data.$monthList.html(html);
            this.setResult();
        }

        Class.prototype.bindMonthListEvent = function () {
            var that = this;
            this.data.$monthList.delegate('li', 'click', function () {
                var $this = $(this);
                var month = Number($this.attr('data-month'));
                that.data.value.setMonth(month);
                that.data.$monthList.find('.' + dateClass.active).removeClass(dateClass.active);
                $this.addClass(dateClass.active);
                that.confirm();
            });
        }

        // 渲染范围选择器
        Class.prototype.renderRange = function () {
            this.data.$date = $(tpl.dateRange);
            this.data.$content = this.data.$date.find('.' + dateClass.rangeContent);
            this.data.$footer = this.data.$date.find('.' + dateClass.rangeFooter);
            this.data.$result = this.data.$date.find('.' + dateClass.rangeResult);
            this.data.$date.addClass('date-layer' + layerCount);
            this.data.childs = [new Class({
                elem: this.data.$content,
                type: this.data.originType,
                value: this.data.value[0],
                position: 'static'
            }), new Class({
                elem: this.data.$content,
                type: this.data.originType,
                value: this.data.value[1],
                position: 'static'
            })];
            this.data.childs[0].data.parent = this;
            this.data.childs[1].data.parent = this;
            this.setResult();
            if (this.data.type === 'datetime') {
                this.data.$childBtn = $(tpl.rangeChildBtn).text('选择时间');
                this.data.$childBtn.insertBefore(this.data.$result);
            }
        }

        Class.prototype.setPosition = function () {
            if (this.$elem.length) {
                var offset = this.$elem.offset();
                this.data.$date.css({
                    top: offset.top + this.$elem[0].offsetHeight + 5,
                    left: offset.left
                })
                if (ieVersion <= 6) {
                    var ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                    var ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                    this.data.$date.css({
                        marginTop: ie6MarginTop,
                        marginLeft: ie6MarginLeft
                    })
                }
            }
        }

        // 设置标题内容
        Class.prototype.setHeader = function () {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth() + 1;
            var $headerCenter = this.data.$header.children('.' + dateClass.headerCenter);
            $headerCenter.find('.' + dateClass.year).text(year + '年');
            $headerCenter.find('.' + dateClass.month).text(month + '月');
            $headerCenter.children('.' + dateClass.yearRange).text((year - 7) + '年 - ' + (year + 7) + '年');
        }

        // 设置弹框左下角时间
        Class.prototype.setResult = function () {
            var formatTime = '';
            if (this.data.$result) {
                if (this.option.range) {
                    this.data.value = [this.data.childs[0].data.value, this.data.childs[1].data.value];
                    formatTime = this.data.value[0].formatTime(this.data.childs[0].data.format) + ' - ' + this.data.value[1].formatTime(this.data.childs[0].data.format);
                    if (this.data.value[0] > this.data.value[1]) {
                        this.data.$footer.find('.' + dateClass.rangeConfirm).addClass(dateClass.disabled);
                    } else {
                        this.data.$footer.find('.' + dateClass.rangeConfirm).removeClass(dateClass.disabled);
                    }
                } else {
                    formatTime = this.data.value.formatTime(this.data.format);
                }
                this.data.$result.text(formatTime);
            }
            if (this.data.parent && !this.data.parent.data.parent) {
                this.data.parent.setResult();
            }
        }

        // 显示当前选择器
        Class.prototype.showType = function () {
            var className = this.data.$date[0].className;
            className = className
                .replace(' ' + dateClass.showYearMonth, '')
                .replace(' ' + dateClass.showMonth, '')
                .replace(' ' + dateClass.showYear, '')
                .replace(' ' + dateClass.showDate, '')
                .replace(' ' + dateClass.showTime, '');
            switch (this.data.type) {
                case 'year':
                    className += ' ' + dateClass.showYear;
                    break;
                case 'month':
                    className += ' ' + dateClass.showMonth;
                    break;
                case 'yearmonth':
                    className += ' ' + dateClass.showYearMonth;
                    break;
                case 'date':
                case 'datetime':
                    className += ' ' + dateClass.showDate;
                    break;
                case 'time':
                    className += ' ' + dateClass.showTime;
                    break;
            }
            this.data.$date[0].className = className;
        }

        // 获取月份有多少天
        Class.prototype.getMonthDays = function (year, month) {
            var date = null;
            if (month == 11) {
                year = year + 1;
                month = 0;
            } else {
                month += 1;
            }
            date = new Date(year, month, 1) - 1000;
            return new Date(date).getDate();
        }

        // 绑定头部按钮事件
        Class.prototype.bindHeaderEvent = function () {
            var that = this;
            // 前一个月
            this.data.$header.delegate('.' + dateClass.preMonthBtn, 'click', function () {
                that.renderPreMonth();
            });
            // 后一个月
            this.data.$header.delegate('.' + dateClass.nextMonthBtn, 'click', function () {
                that.renderNextMonth();
            });
            // 前一年
            this.data.$header.delegate('.' + dateClass.preYearBtn, 'click', function () {
                that.renderPrevYear();
            });
            // 后一年
            this.data.$header.delegate('.' + dateClass.nextYearBtn, 'click', function () {
                that.renderNextYear();
            });
            // 点击年份
            this.data.$header.delegate('.' + dateClass.year, 'click', function () {
                that.renderChild('year');
            });
            // 点击月份
            this.data.$header.delegate('.' + dateClass.month, 'click', function () {
                that.renderChild('yearmonth');
            });
        }

        // 绑定底部按钮事件
        Class.prototype.bindFooterEvent = function () {
            var that = this;
            // 子选择器
            this.data.$footer.delegate('.' + dateClass.child, 'click', function () {
                switch (that.data.originType) {
                    case 'datetime':
                        that.renderChild('time');
                        break;
                }
            });
            // 清空
            this.data.$footer.delegate('.' + dateClass.empty, 'click', function () {
                that.empty();
            });
            // 现在
            this.data.$footer.delegate('.' + dateClass.now, 'click', function () {
                that.now();
            });
            // 确定
            this.data.$footer.delegate('.' + dateClass.confirm, 'click', function () {
                that.confirm(true);
            });
            // 范围选择器子选择器
            this.data.$footer.delegate('.' + dateClass.rangeChild, 'click', function () {
                switch (that.data.originType) {
                    case 'datetime':
                        that.data.childs[0].renderChild('time');
                        that.data.childs[1].renderChild('time');
                        break;
                }
            });
            // 范围选择器清空
            this.data.$footer.delegate('.' + dateClass.rangeEmpty, 'click', function () {
                that.emptyRange();
            });
            // 范围选择器确定
            this.data.$footer.delegate('.' + dateClass.rangeConfirm, 'click', function () {
                that.confirmRange(true);
            });
        }

        // 渲染上一个月
        Class.prototype.renderPreMonth = function (date) {
            this.setPreMonth(date);
            switch (this.data.type) {
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        // 设置成上一个月
        Class.prototype.setPreMonth = function (originDate) {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            var date = this.data.value.getDate();
            if (month == 0) {
                month = 11;
                year = year - 1;
            } else {
                month = month - 1;
            }
            var days = this.getMonthDays(year, month);
            if (days < date) {
                this.data.value.setDate(days);
            }
            this.data.value.setMonth(month);
            this.data.value.setFullYear(year);
            if (originDate) {
                this.data.value.setDate(originDate);
            }
        }

        // 渲染下一个月
        Class.prototype.renderNextMonth = function (date) {
            this.setNextMonth(date);
            switch (this.data.type) {
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        // 设置成下一个月
        Class.prototype.setNextMonth = function (originDate) {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            var date = this.data.value.getDate();
            if (month == 11) {
                month = 0;
                year = year + 1;
            } else {
                month = month + 1;
            }
            var days = this.getMonthDays(year, month);
            if (days < date) {
                this.data.value.setDate(days);
            }
            this.data.value.setMonth(month);
            this.data.value.setFullYear(year);
            if (originDate) {
                this.data.value.setDate(originDate);
            }
        }

        // 上一年
        Class.prototype.renderPrevYear = function () {
            var year = this.data.value.getFullYear();
            this.data.value.setFullYear(year - 1);
            switch (this.data.type) {
                case 'year':
                    this.renderYearList();
                    break;
                case 'yearmonth':
                    this.renderMonthList();
                    break;
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        // 下一年
        Class.prototype.renderNextYear = function () {
            var year = this.data.value.getFullYear();
            this.data.value.setFullYear(year + 1);
            switch (this.data.type) {
                case 'year':
                    this.renderYearList();
                    break;
                case 'yearmonth':
                    this.renderMonthList();
                    break;
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        Class.prototype.renderChild = function (type) {
            switch (type) {
                case 'year':
                    this.renderYearChild()
                    break;
                case 'yearmonth':
                    this.renderMonthChild()
                    break;
                case 'time':
                    this.renderTimeChild();
                    break;
            }
        }

        Class.prototype.renderYearChild = function () {
            this.data.type = 'year';
            if (!this.data.$year) {
                this.data.$year = $(tpl.year);
                this.data.$yearList = this.data.$year.children('ul');
                this.data.$content.append(this.data.$year);
                this.renderYearList();
                this.bindYearListEvent();
            }
            this.showType();
        }

        Class.prototype.renderMonthChild = function () {
            this.data.type = 'yearmonth';
            if (!this.data.$month) {
                this.data.$month = $(tpl.month);
                this.data.$monthList = this.data.$month.children('ul');
                this.data.$content.append(this.data.$month);
                this.renderMonthList();
                this.bindMonthListEvent();
            }
            this.showType();
        }

        Class.prototype.renderTimeChild = function () {
            var preType = this.data.type;
            this.data.type = 'time';
            if (!this.data.$time) {
                this.data.$time = $(tpl.time);
                this.data.$hour = this.data.$time.find('.' + dateClass.hour);
                this.data.$minute = this.data.$time.find('.' + dateClass.minute);
                this.data.$second = this.data.$time.find('.' + dateClass.second);
                this.data.$content.append(this.data.$time);
                this.renderTimeList();
                this.bindTimeListEvent();
            }
            if (this.data.type != preType) {
                this.data.$childBtn && this.data.$childBtn.text('返回日期');
            } else {
                this.data.$childBtn && this.data.$childBtn.text('选择时间');
                this.data.type = this.data.originType;
            }
            this.showType();
        }

        // 销毁弹框
        Class.prototype.cancel = function () {
            if (this.option.position != 'position') {
                this.data && this.data.$date && this.data.$date.remove();
                this.data = null;
            }
        }

        // 清空
        Class.prototype.empty = function () {
            if (this.option.position != 'position') {
                this.$elem.val('');
            }
            this.cancel();
        }

        // 现在
        Class.prototype.now = function () {
            this.data.value = new Date();
            this.confirm(true);
        }

        /**
         * 确认
         * @param {Boolean} force 是否为确认按钮触发的确认
         */
        Class.prototype.confirm = function (force) {
            var formatTime = this.data.value.formatTime(this.data.format);
            if (!force && this.data.type !== this.data.originType || this.data.parent) { // 子选择器触发的确认
                this.data.type = this.data.originType;
                this.showType();
                this.setResult();
            } else {
                if (this.option.position !== 'static') {
                    this.$elem.val(formatTime);
                    this.data.$date.remove();
                }
                typeof this.option.change === 'function' && this.option.change(this.data.value, formatTime);
            }
            this.setHeader();
        }

        // 情况范围选择器
        Class.prototype.emptyRange = function () {
            if (this.option.position != 'position') {
                this.$elem.val('');
            }
            this.cancel();
        }

        // 确认选择范围
        Class.prototype.confirmRange = function () {
            var formatTime = [this.data.value[0].formatTime(this.data.childs[0].data.format), this.data.value[1].formatTime(this.data.childs[1].data.format)];
            if (this.data.value[0] > this.data.value[1]) {
                this.showTip('开始时间不能大于结束时间');
                return;
            }
            if (this.option.position !== 'static') {
                if (this.$elem.length == 1) {
                    this.$elem.val(formatTime.join(this.data.split));
                } else {
                    $(this.$elem[0]).val(formatTime[0]);
                    $(this.$elem[1]).val(formatTime[1]);
                }
                this.data.$date.remove();
            }
            typeof this.option.change === 'function' && this.option.change(this.data.value, formatTime);
        }

        Class.prototype.showTip = function (tip) {
            var $tip = $(tpl.tip).text(tip);
            this.data.$date.append($tip);
            $tip.css({
                marginLeft: -$tip[0].offsetWidth / 2,
                marginTop: -$tip[0].offsetHeight / 2
            });
            setTimeout(function () {
                $tip.remove();
            }, 1500);
        }

        return JyDate;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Date = factory(window.$, window.JyUi.Common);
    }
})(window)