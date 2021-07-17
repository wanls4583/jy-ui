!(function (window) {
    function factory($, Common) {
        var tpl = {
            date: '<div class="song-date">\
                <div class="song-date-main">\
                    <div class="song-date-header">\
                    </div>\
                    <div class="song-date-content">\
                    </div>\
                </div>\
                <div class="song-date-footer">\
                    <div class="song-date-footer-left">\
                        <span class="song-date-result"></span>\
                    </div>\
                    <div class="song-date-footer-right">\
                        <span class="song-date-btn song-date-empty">清空</span><span class="song-date-btn song-date-now">现在</span><span class="song-date-btn song-date-confirm">确定</span>\
                    </div>\
                </div>\
            </div>',
            header: '\
            <%if(["date","datetime","month","year"].indexOf(type)>-1){%>\
            <div class="song-date-header-left">\
                <i class="song-icon song-date-prev-year-btn">&#xe612;</i>\
                <%if(["date","datetime"].indexOf(type)>-1){%>\
                <i class="song-icon song-date-prev-month-btn">&#xe733;</i>\
                <%}%>\
            </div>\
            <%}%>\
            <div class="song-date-header-center">\
                <%if(["date","datetime"].indexOf(type)>-1){%>\
                <div class="song-date-header-year"><%-year%>年</div>\
                <div class="song-date-header-month"><%-month+1%>年</div>\
                <%}%>\
                <%if(["month"].indexOf(type)>-1){%>\
                <div class="song-date-header-year"><%-year%>年</div>\
                <%}%>\
                <%if("year" == type){%>\
                <div class="song-date-header-year-range"><%-(year-7)+"年 - "+(year+7)+"年"%></div>\
                <%}%>\
                <%if("time" == type){%>选择时间<%}%>\
            </div>\
            <%if(["date","datetime","month","year"].indexOf(type)>-1){%>\
            <div class="song-date-header-right">\
                <%if(["date","datetime"].indexOf(type)>-1){%>\
                <i class="song-icon song-date-next-month-btn">&#xe734;</i>\
                <%}%>\
                <i class="song-icon song-date-next-year-btn">&#xe61a;</i>\
            </div>\
            <%}%>',
            dateTable: '<table class="song-date-date">\
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
            time: '<div class="song-date-time">\
                <ul>\
                    <li>时</li>\
                    <li>分</li>\
                    <li>秒</li>\
                </ul>\
                <ul>\
                    <li>\
                        <ol class="song-date-time-hour">\
                        </ol>\
                    </li>\
                    <li>\
                        <ol class="song-date-time-minute">\
                        </ol>\
                    </li>\
                    <li>\
                        <ol class="song-date-time-second">\
                        </ol>\
                    </li>\
                </ul>\
            </div>',
            year: '<div class="song-date-year"><ul></ul></div>',
            month: '<div class="song-date-month"><ul></ul></div>',
            childBtn: '<span class="song-date-btn song-date-child">选择时间</span>'
        }

        var dateClass = {
            date: 'song-date',
            header: 'song-date-header',
            headerLeft: 'song-date-header-left',
            headerCenter: 'song-date-header-center',
            headerRight: 'song-date-header-right',
            content: 'song-date-content',
            year: 'song-date-header-year',
            yearRange: 'song-date-header-year-range',
            month: 'song-date-header-month',
            hour: 'song-date-time-hour',
            minute: 'song-date-time-minute',
            second: 'song-date-time-second',
            preMonth: 'song-date-prev-month',
            preMonthBtn: 'song-date-prev-month-btn',
            preYearBtn: 'song-date-prev-year-btn',
            nextMonth: 'song-date-next-month',
            nextMonthBtn: 'song-date-next-month-btn',
            nextYearBtn: 'song-date-next-year-btn',
            result: 'song-date-result',
            footer: 'song-date-footer',
            empty: 'song-date-empty',
            now: 'song-date-now',
            confirm: 'song-date-confirm',
            child: 'song-date-child',
            active: 'song-date-active'
        }

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var layerCount = 0;
        var months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

        var SongDate = {
            render: function (option) {
                return new Class(option);
            }
        }

        // 页码类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = Object.assign({}, option);
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.$elem = $(this.option.elem);
            this.trigger = ['change', 'focus', 'click'].indexOf(this.option.trigger) > -1 ? this.option.trigger : 'click';
            if (this.$elem && this.$elem.length) {
                this.$elem.on(this.trigger, function () {
                    _render();
                });
                this.$elem.on('click', function () {
                    return false;
                });
                $(docBody).on('click', function () {
                    that.cancel();
                });
            } else {
                this.option.position = 'static';
                _render();
            }

            function _render() {
                if (that.data && that.data.$date.is(':visible')) {
                    return;
                }
                that.data = {};
                that.data.type = that.option.type || 'date';
                layerCount++;
                that.data.value = that.$elem.val() || that.option.value;
                $(docBody).children('.song-date').remove();
                switch (that.data.type) {
                    case 'year':
                        that.renderYear();
                        break;
                    case 'month':
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
                if (that.option.position == 'static') {
                    if (that.$elem && that.$elem.length) {
                        that.$elem.append(that.data.$date);
                    } else {
                        $(docBody).append(that.data.$date);
                    }
                } else {
                    $(docBody).append(that.data.$date);
                    that.setPosition();
                }
                that.data.$date.on('click', function () {
                    return false;
                });
                that.bindHeaderEvent();
                that.bindFooterEvent();
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
            this.data.$date.addClass('date-layer' + layerCount);
            if (this.data.type === 'datetime') {
                this.data.$childBtn = $(tpl.childBtn).text('选择时间');
                this.data.$result.html(this.data.$childBtn);
            }
            this.renderDateTable();
            this.bidnDateTableEvent();
        }

        Class.prototype.renderDateTable = function () {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            var date = this.data.value.getDate();
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            this.data.$header.html(Common.htmlTemplate(tpl.header, {
                type: 'date',
                year: year,
                month: month
            }));
            if (this.data.type === 'date') {
                this.data.$result.text(this.data.formatTime);
            }
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
        }

        Class.prototype.bidnDateTableEvent = function () {
            var that = this;
            // 选中日期
            this.data.$content.delegate('td', 'click', function () {
                var date = this.innerText;
                var $this = $(this);
                that.data.value.setDate(date);
                if ($this.hasClass(dateClass.preMonth)) {
                    that.setPreMonth();
                } else if ($this.hasClass(dateClass.nextMonth)) {
                    that.setNextMonth();
                } else {
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
            this.data.$date.addClass('date-layer' + layerCount);
            this.data.$header.html(Common.htmlTemplate(tpl.header, {
                type: 'time'
            }));
            this.renderTimeList();
            this.bindTimeListEvent();
        }

        Class.prototype.renderTimeList = function () {
            var that = this;
            var hour = this.data.value.getHours();
            var minute = this.data.value.getMinutes();
            var second = this.data.value.getSeconds();
            this.data.formatTime = this.data.value.formatTime(this.data.format);
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
            if (this.data.type === 'time') {
                this.data.$result.text(this.data.formatTime);
            }
        }

        Class.prototype.bindTimeListEvent = function () {
            var that = this;
            this.data.$hour.delegate('li', 'click', function () {
                var hour = Number(this.innerText);
                that.data.value.setHours(hour);
                that.data.$hour.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.data.$minute.delegate('li', 'click', function () {
                var minute = Number(this.innerText);
                that.data.value.setMinutes(minute);
                that.data.$minute.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.data.$second.delegate('li', 'click', function () {
                var second = Number(this.innerText);
                that.data.value.setSeconds(second);
                that.data.$second.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
        }

        Class.prototype.confirmTime = function (ifConfirm) {
            if (this.data.type === 'time') {
                this.data.formatTime = this.data.value.formatTime(this.data.format);
                if (this.option.position != 'static' && ifConfirm) {
                    this.$elem.val(this.data.formatTime);
                    this.data.$date.remove();
                } else {
                    this.data.$result.text(this.data.formatTime);
                }
                ifConfirm && typeof this.option.change === 'function' && this.option.change(this.data.formatTime);
            }
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
            this.data.$date.addClass('date-layer' + layerCount);
            this.renderYearList();
            this.bindYearListEvent();
        }

        Class.prototype.renderYearList = function () {
            var year = this.data.value.getFullYear();
            var html = '';
            var startYear = year - 7;
            var endYear = year + 7;
            this.data.$header.html(Common.htmlTemplate(tpl.header, {
                type: 'year',
                year: year
            }));
            for (var i = startYear; i <= endYear; i++) {
                html += '<li data-year="' + i + '" ' + (i === year ? 'class="' + dateClass.active + '"' : '') + '>' + i + '年</li>';
            }
            this.data.$yearList.html(html);
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            if (this.data.type === 'year') {
                this.data.$result.text(this.data.formatTime);
            }
        }

        Class.prototype.bindYearListEvent = function () {
            var that = this;
            this.data.$yearList.delegate('li', 'click', function () {
                var $this = $(this);
                var year = Number($this.attr('data-year'));
                that.data.value.setFullYear(year);
                that.data.$yearList.find('.' + dateClass.active).removeClass(dateClass.active);
                $this.addClass(dateClass.active);
                that.confirmYear();
            });
        }

        Class.prototype.confirmYear = function () {
            if (this.data.type === 'year') {
                this.data.formatTime = this.data.value.formatTime(this.data.format);
                if (this.option.position !== 'static') {
                    this.$elem.val(this.data.formatTime);
                    this.data.$date.remove();
                } else {
                    this.data.$result.text(this.data.formatTime);
                }
                typeof this.option.change === 'function' && this.option.change(this.data.formatTime);
            }
        }

        // 渲染年月选择器
        Class.prototype.renderMonth = function () {
            this.data.format = this.option.format || 'yyyy-MM';
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
            this.data.$date.addClass('date-layer' + layerCount);
            this.renderMonthList();
            this.bindMonthListEvent();
        }

        Class.prototype.renderMonthList = function () {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            var html = '';
            this.data.$header.html(Common.htmlTemplate(tpl.header, {
                type: 'month',
                year: year
            }));
            for (var i = 0; i < 12; i++) {
                html += '<li data-month="' + i + '" ' + (i === month ? 'class="' + dateClass.active + '"' : '') + '>' + months[i] + '月</li>';
            }
            this.data.$monthList.html(html);
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            if (this.data.type === 'month') {
                this.data.$result.text(this.data.formatTime);
            }
        }

        Class.prototype.bindMonthListEvent = function () {
            var that = this;
            this.data.$monthList.delegate('li', 'click', function () {
                var $this = $(this);
                var month = Number($this.attr('data-month'));
                that.data.value.setMonth(month);
                that.data.$monthList.find('.' + dateClass.active).removeClass(dateClass.active);
                $this.addClass(dateClass.active);
                that.confirmMonth();
            });
        }

        Class.prototype.confirmMonth = function () {
            if (this.data.type === 'month') {
                this.data.formatTime = this.data.value.formatTime(this.data.format);
                if (this.option.position !== 'static') {
                    this.$elem.val(this.data.formatTime);
                    this.data.$date.remove();
                } else {
                    this.data.$result.text(this.data.formatTime);
                }
                typeof this.option.change === 'function' && this.option.change(this.data.formatTime);
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
        }

        Class.prototype.bindFooterEvent = function () {
            var that = this;
            // 子选择器
            this.data.$header.delegate('.' + dateClass.child, 'click', function () {
                that.renderChild();
            });
            // 清空
            this.data.$header.delegate('.' + dateClass.cancel, 'click', function () {
                that.cancel();
            });
            // 现在
            this.data.$header.delegate('.' + dateClass.preYearBtn, 'click', function () {
                that.now();
            });
            // 确定
            this.data.$header.delegate('.' + dateClass.nextYearBtn, 'click', function () {
                that.confirm();
            });
        }

        // 渲染上一个月
        Class.prototype.renderPreMonth = function () {
            this.setPreMonth();
            switch (this.data.type) {
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        // 设置成上一个月
        Class.prototype.setPreMonth = function() {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            if (month == 0) {
                this.data.value.setMonth(11);
                this.data.value.setFullYear(year - 1);
            } else {
                this.data.value.setMonth(month - 1);
            }
        }

        // 渲染下一个月
        Class.prototype.renderNextMonth = function () {
            this.setNextMonth();
            switch (this.data.type) {
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        // 设置成下一个月
        Class.prototype.setNextMonth = function() {
            var year = this.data.value.getFullYear();
            var month = this.data.value.getMonth();
            if (month == 11) {
                this.data.value.setMonth(0);
                this.data.value.setFullYear(year + 1);
            } else {
                this.data.value.setMonth(month + 1);
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
                case 'month':
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
                case 'month':
                    this.renderMonthList();
                    break;
                case 'date':
                case 'datetime':
                    this.renderDateTable();
                    break;
            }
        }

        Class.prototype.renderChild = function() {

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
            this.confirm();
        }

        Class.prototype.confirm = function () {
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            if (this.option.position !== 'static') {
                this.$elem.val(this.data.formatTime);
                this.data.$date.remove();
            }
            typeof this.option.change === 'function' && this.option.change(this.data.value, this.data.formatTime);
        }

        return SongDate;
    }
    if ("function" == typeof define && define.amd) {
        define('dialog', ['./jquery', './common', './dialog'], function ($, Common) {
            return factory($, Common, Dialog);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Date = factory(window.$, window.SongUi.Common);
    }
})(window)