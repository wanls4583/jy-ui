!(function (window) {
    function factory($, Common) {
        var tpl = {
            date: '<div class="song-date">\
                <div class="song-date-main">\
                    <div class="song-date-header">\
                        <div class="song-date-header-left">\
                            <i class="song-icon song-date-prev-year-btn">&#xe612;</i>\
                            <i class="song-icon song-date-prev-month-btn">&#xe733;</i>\
                        </div>\
                        <div class="song-date-header-center">\
                            <div class="song-date-header-year"></div>\
                            <div class="song-date-header-month"></div>\
                        </div>\
                        <div class="song-date-header-right">\
                            <i class="song-icon song-date-next-month-btn">&#xe734;</i>\
                            <i class="song-icon song-date-next-year-btn">&#xe61a;</i>\
                        </div>\
                    </div>\
                    <div class="song-date-content">\
                        <table>\
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
                        </table>\
                    </div>\
                </div>\
                <div class="song-date-footer">\
                    <div class="song-date-footer-left">\
                        <span class="song-date-result"></span>\
                    </div>\
                    <div class="song-date-footer-right">\
                        <span class="song-date-btn song-date-cancel">清空</span><span class="song-date-btn song-date-now">现在</span><span class="song-date-btn song-date-confirm">确定</span>\
                    </div>\
                </div>\
            </div>',
            timeBtn: '<span class="song-date-btn song-date-time-btn">选择时间</span>'
        }

        var dateClass = {
            year: 'song-date-header-year',
            month: 'song-date-header-month',
            preMonth: 'song-date-prev-month',
            preMonthBtn: 'song-date-prev-month-btn',
            preYearBtn: 'song-date-prev-year-btn',
            nextMonth: 'song-date-next-month',
            nextMonthBtn: 'song-date-next-month-btn',
            nextYearBtn: 'song-date-next-year-btn',
            result: 'song-date-result',
            cancel: 'song-date-cancel',
            now: 'song-date-now',
            confirm: 'song-date-confirm',
            active: 'song-date-active'
        }

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var store = {};
        var layerCount = 0;

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
            this.option = option;
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.value = this.option.value;
            this.type = this.type || 'date';
            this.$elem = $(this.option.elem);
            this.trigger = ['change', 'focus', 'click'].indexOf(this.option.trigger) > -1 ? this.option.trigger : 'click';
            if (this.$elem && this.$elem.length) {
                this.$elem.on(this.trigger, function () {
                    if (!that.rendered) {
                        _render();
                        that.rendered = true;
                    }
                });
                this.$elem.on('click', function () {
                    return false;
                });
                $(docBody).on('click', function () {
                    switch (that.type) {
                        case 'date':
                        case 'datetime':
                            that.cancDateTime();
                            break;
                    }
                });
            } else {
                _render();
            }

            function _render() {
                layerCount++;
                switch (that.type) {
                    case 'date':
                    case 'datetime':
                        that.renderDate();
                        break;
                }
                if (that.option.position == 'static') {
                    if (that.$elem && that.$elem.length) {
                        that.$elem.append(that.$date);
                    } else {
                        $(docBody).append(that.$date);
                    }
                } else {
                    $(docBody).append(that.$date);
                    that.setPosition();
                }
            }
        }

        // 渲染日期选择器
        Class.prototype.renderDate = function () {
            var that = this;
            if (typeof this.value === 'string') {
                this.value = Date.prototype.parseDateTime(this.value);
            }
            if (!(this.value instanceof Date)) {
                this.value = new Date();
            }
            this.year = this.value.getFullYear();
            this.month = this.value.getMonth();
            this.date = this.value.getDate();
            var day = new Date(this.year, this.month, 1).getDay();
            var days = this.getMonthDays(this.year, this.month);
            var preMonthDays = 0;
            if (this.month == 0) {
                preMonthDays = this.getMonthDays(this.year - 1, 11);
            } else {
                preMonthDays = this.getMonthDays(this.year, this.month - 1);
            }
            this.formatTime = this.value.formatTime();
            if (!this.$date) {
                this.$date = $(tpl.date);
                this.$table = this.$date.find('tbody');
                this.$year = this.$date.find('.' + dateClass.year);
                this.$month = this.$date.find('.' + dateClass.month);
                this.$result = this.$date.find('.' + dateClass.result);
                this.$now = this.$date.find('.' + dateClass.now);
                if (this.type === 'datetime') {
                    this.$timeBtn = $(tpl.timeBtn);
                    this.$result.html(this.$timeBtn);
                    this.$result = null;
                }
            }
            this.$year.text(this.year + '年');
            this.$month.text(this.month + 1 + '月');
            this.$result && this.$result.text(this.formatTime);
            this.$date.addClass('date-layer' + layerCount);
            var count = 0;
            var dateNum = 0;
            var next = false;
            var html = '';
            for (var i = 0; i < 42; i++) { //总共渲染6周
                var cn = '';
                if (count == 0) {
                    html += '<tr>';
                }
                if (i < day) {
                    dateNum = preMonthDays - (day - 1) + i;
                } else if (i == day) {
                    dateNum = 1;
                } else if (dateNum == days) {
                    next = true;
                    dateNum = 1;
                } else {
                    dateNum++;
                }
                if (next) {
                    cn = dateClass.nextMonth;
                } else if (i < day) {
                    cn = dateClass.preMonth;
                } else if (dateNum == this.date) {
                    cn = dateClass.active;
                }
                html += '<td class="' + cn + '">' + dateNum + '</td>';
                if (++count == 7) { // 满一周
                    html += '</tr>';
                    count = 0;
                }
            }
            this.$table.html(html);
            _bindEvent();

            function _bindEvent() {
                if (that.rendered) {
                    return;
                }
                that.$date.on('click', function () {
                    return false;
                });
                // 选中日期
                that.$date.delegate('td', 'click', function () {
                    var date = this.innerText;
                    var $this = $(this);
                    if ($this.hasClass(dateClass.preMonth)) {
                        if (that.month == 0) {
                            that.year--;
                            that.month = 12;
                        } else {
                            that.month--;
                        }
                        that.value = new Date(that.year, that.month, date);
                        if (that.type === 'date') {
                            that.confirmDateTime();
                        } else {
                            that.renderDate();
                        }
                    } else if ($this.hasClass(dateClass.nextMonth)) {
                        if (that.month == 11) {
                            that.year++;
                            that.month = 0
                        } else {
                            that.month++;
                        }
                        that.value = new Date(that.year, that.month, date);
                        if (that.type === 'date') {
                            that.confirmDateTime();
                        } else {
                            that.renderDate();
                        }
                    } else {
                        that.value = new Date(that.year, that.month, date);
                        if (that.type === 'date') {
                            that.confirmDateTime();
                        } else {
                            that.$result && that.$result.text(that.value.formatTime());
                            that.$table.find('.' + dateClass.active).removeClass(dateClass.active);
                            $this.addClass(dateClass.active);
                        }
                    }
                });
                // 前一个月
                that.$date.delegate('.' + dateClass.preMonthBtn, 'click', function () {
                    if (that.month == 0) {
                        that.month = 11;
                        that.year--;
                    } else {
                        that.month--;
                    }
                    that.value = new Date(that.year, that.month, that.date);
                    that.renderDate();
                });
                // 后一个月
                that.$date.delegate('.' + dateClass.nextMonthBtn, 'click', function () {
                    if (that.month == 11) {
                        that.month = 0;
                        that.year++;
                    } else {
                        that.month++;
                    }
                    that.value = new Date(that.year, that.month, that.date);
                    that.renderDate();
                });
                // 前一年
                that.$date.delegate('.' + dateClass.preYearBtn, 'click', function () {
                    that.year--;
                    that.value = new Date(that.year, that.month, that.date);
                    that.renderDate();
                });
                // 后一年
                that.$date.delegate('.' + dateClass.nextYearBtn, 'click', function () {
                    that.year++;
                    that.value = new Date(that.year, that.month, that.date);
                    that.renderDate();
                });
                // 确定
                that.$date.delegate('.' + dateClass.confirm, 'click', function () {
                    that.confirmDateTime();
                });
                // 清空
                that.$date.delegate('.' + dateClass.cancel, 'click', function () {
                    if (that.option.position != 'static') {
                        that.$elem.val('');
                    }
                    that.cancDateTime();
                });
                // 现在
                that.$date.delegate('.' + dateClass.now, 'click', function () {
                    that.value = new Date();
                    that.confirmDateTime();
                });
            }
        }

        Class.prototype.confirmDateTime = function () {
            this.formatTime = this.value.formatTime(this.type === 'datetime' ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd');
            this.rendered = false;
            if (this.option.position != 'static') {
                this.$elem.val(this.formatTime);
                this.$date && this.$date.remove();
                this.$time && this.$time.remove();
            }
            typeof this.option.change === 'function' && this.option.change(this.formatTime);
        }

        Class.prototype.cancDateTime = function () {
            this.rendered = false;
            if (this.option.position != 'position') {
                this.$date && this.$date.remove();
                this.$time && this.$time.remove();
            }
        }

        // 渲染时间选择器
        Class.prototype.renderTime = function () {

        }

        Class.prototype.setPosition = function () {
            if (this.$elem.length) {
                var offset = this.$elem.offset();
                this.$date.css({
                    top: offset.top + this.$elem[0].offsetHeight + 5,
                    left: offset.left
                })
                if (ieVersion <= 6) {
                    var ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                    var ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                    this.$date.css({
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