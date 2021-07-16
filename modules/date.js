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
            timeBtn: '<span class="song-date-btn song-date-time-btn">选择时间</span>',
            dateBtn: '<span class="song-date-btn song-date-date-btn">返回日期</span>'
        }

        var dateClass = {
            date: 'song-date',
            headerLeft: 'song-date-header-left',
            headerCnter: 'song-date-header-center',
            headerRight: 'song-date-header-right',
            content: 'song-date-content',
            year: 'song-date-header-year',
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
            cancel: 'song-date-cancel',
            now: 'song-date-now',
            confirm: 'song-date-confirm',
            active: 'song-date-active'
        }

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
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
            this.type = this.option.type || 'date';
            this.$elem = $(this.option.elem);
            this.trigger = ['change', 'focus', 'click'].indexOf(this.option.trigger) > -1 ? this.option.trigger : 'click';
            if (this.$elem && this.$elem.length) {
                this.$elem.on(this.trigger, function () {
                    if (!that.$date || !that.$date.is(':visible')) {
                        if (that.option.position != 'static') {
                            that.value = that.$elem.val();
                        }
                        _render();
                    }
                });
                this.$elem.on('click', function () {
                    return false;
                });
                $(docBody).on('click', function () {
                    that.cancel();
                });
            } else {
                _render();
            }

            function _render() {
                layerCount++;
                $(docBody).children('.song-date').remove();
                switch (that.type) {
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
                        that.$elem.append(that.$date);
                    } else {
                        $(docBody).append(that.$date);
                    }
                } else {
                    $(docBody).append(that.$date);
                    that.setPosition();
                }
                that.$date.on('click', function () {
                    return false;
                });
            }
        }

        // 销毁弹框
        Class.prototype.cancel = function () {
            if (this.option.position != 'position') {
                this.$date && this.$date.remove();
            }
        }

        // 渲染日期选择器
        Class.prototype.renderDate = function () {
            if (typeof this.value === 'string' && this.value) {
                this.value = Date.prototype.parseDateTime(this.value);
            } else if (typeof this.value === 'number') {
                this.value = new Date(this.value);
            } else if (!(this.value instanceof Date)) {
                this.value = new Date();
            }
            this.format = this.option.format || (this.type == 'datetime' ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd');
            this.$date = $(tpl.date);
            this.$table = $(tpl.dateTable);
            this.$content = this.$date.find('.' + dateClass.content);
            this.$footer = this.$date.find('.' + dateClass.footer);
            this.$year = this.$date.find('.' + dateClass.year);
            this.$month = this.$date.find('.' + dateClass.month);
            this.$result = this.$date.find('.' + dateClass.result);
            this.$now = this.$date.find('.' + dateClass.now);
            this.$content.append(this.$table);
            this.$table = this.$table.children('tbody');
            this.$date.addClass('date-layer' + layerCount);
            if (this.type === 'datetime') {
                this.$timeBtn = $(tpl.timeBtn);
                this.$result.html(this.$timeBtn);
            }
            // 隐藏底部操作栏
            if (this.option.hideFooter) {
                this.$footer.hide();
            } else {
                this.bindDateFooterEvent();
            }
            this.bindDateHeaderEvent()
            this.renderDateTable();
            this.bidnDateTableEvent();
        }

        Class.prototype.renderDateTable = function () {
            this.year = this.value.getFullYear();
            this.month = this.value.getMonth();
            this.date = this.value.getDate();
            this.formatTime = this.value.formatTime(this.format);
            this.$year.text(this.year + '年');
            this.$month.text(this.month + 1 + '月');
            if (this.type === 'date') {
                this.$result.text(this.formatTime);
            }
            var day = new Date(this.year, this.month, 1).getDay();
            var days = this.getMonthDays(this.year, this.month);
            var preMonthDays = 0;
            if (this.month == 0) {
                preMonthDays = this.getMonthDays(this.year - 1, 11);
            } else {
                preMonthDays = this.getMonthDays(this.year, this.month - 1);
            }
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
        }

        Class.prototype.bindDateHeaderEvent = function () {
            var that = this;
            // 前一个月
            this.$date.find('.' + dateClass.preMonthBtn).on('click', function () {
                if (that.month == 0) {
                    that.month = 11;
                    that.year--;
                } else {
                    that.month--;
                }
                that.value = new Date(that.year, that.month, that.date);
                that.renderDateTable();
            });
            // 后一个月
            this.$date.find('.' + dateClass.nextMonthBtn).on('click', function () {
                if (that.month == 11) {
                    that.month = 0;
                    that.year++;
                } else {
                    that.month++;
                }
                that.value = new Date(that.year, that.month, that.date);
                that.renderDateTable();
            });
            // 前一年
            this.$date.find('.' + dateClass.preYearBtn).on('click', function () {
                that.year--;
                that.value = new Date(that.year, that.month, that.date);
                that.renderDateTable();
            });
            // 后一年
            this.$date.find('.' + dateClass.nextYearBtn).on('click', function () {
                that.year++;
                that.value = new Date(that.year, that.month, that.date);
                that.renderDateTable();
            });
        }

        Class.prototype.bidnDateTableEvent = function () {
            var that = this;
            // 选中日期
            this.$date.delegate('td', 'click', function () {
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
                        that.renderDateTable();
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
                        that.renderDateTable();
                    }
                } else {
                    that.value = new Date(that.year, that.month, date);
                    if (that.type === 'date') {
                        that.confirmDateTime();
                    } else {
                        that.formatTime = that.value.formatTime(that.format);
                        that.$table.find('.' + dateClass.active).removeClass(dateClass.active);
                        $this.addClass(dateClass.active);
                    }
                }
            });
        }

        Class.prototype.bindDateFooterEvent = function () {
            var that = this;
            // 确定
            this.$footer.find('.' + dateClass.confirm).on('click', function () {
                that.confirmDateTime();
            });
            // 清空
            this.$footer.find('.' + dateClass.cancel).on('click', function () {
                if (that.option.position != 'static') {
                    that.$elem.val('');
                }
                that.cancel();
            });
            // 现在
            this.$footer.find('.' + dateClass.now).on('click', function () {
                that.value = new Date();
                that.confirmDateTime();
            });
        }

        Class.prototype.confirmDateTime = function () {
            this.formatTime = this.value.formatTime(this.format);
            if (this.option.position != 'static') {
                this.$elem.val(this.formatTime);
                this.$date.remove();
            }
            typeof this.option.change === 'function' && this.option.change(this.formatTime);
        }

        // 渲染时间选择器
        Class.prototype.renderTime = function () {
            this.format = this.option.format || 'hh:mm:ss';
            if (typeof this.value === 'string' && this.value) {
                this.value = Date.prototype.parseDateTime(this.value, this.format);;
            } else if (typeof this.value === 'number') {
                this.value = new Date(this.value);
            } else if (!(this.value instanceof Date)) {
                this.value = new Date();
            }
            this.$date = $(tpl.date);
            this.$time = $(tpl.time);
            this.$hour = this.$time.find('.' + dateClass.hour);
            this.$minute = this.$time.find('.' + dateClass.minute);
            this.$second = this.$time.find('.' + dateClass.second);
            this.$content = this.$date.find('.' + dateClass.content);
            this.$footer = this.$date.find('.' + dateClass.footer);
            this.$result = this.$date.find('.' + dateClass.result);
            this.$now = this.$date.find('.' + dateClass.now);
            this.$date.find('.' + dateClass.headerLeft).hide();
            this.$date.find('.' + dateClass.headerRight).hide();
            this.$date.find('.' + dateClass.headerCnter).html('选择时间');
            this.$content.append(this.$time);
            this.$date.addClass('date-layer' + layerCount);
            if (this.option.hideFooter) {
                this.$footer.hide();
            } else {
                this.bindTimeFooterEvent();
            }
            this.renderTimeList();
            this.bindTimeListEvent();
        }

        Class.prototype.renderTimeList = function () {
            var that = this;
            this.hour = this.value.getHours();
            this.minute = this.value.getMinutes();
            this.second = this.value.getSeconds();
            this.formatTime = this.value.formatTime(this.format);
            var html = '';
            for (var i = 0; i < 24; i++) {
                html += '<li ' + (i === this.hour ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.$hour.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === this.minute ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.$minute.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === this.second ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.$second.append(html);
            Common.nextFrame(function () {
                that.$hour[0].scrollTop = that.hour * 30 - 150 / 2;
                that.$minute[0].scrollTop = that.minute * 30 - 150 / 2;
                that.$second[0].scrollTop = that.second * 30 - 150 / 2;
            });
            if (this.type === 'time') {
                this.$result.text(this.formatTime);
            }
        }

        Class.prototype.bindTimeListEvent = function () {
            var that = this;
            this.$hour.delegate('li', 'click', function () {
                var hour = Number(this.innerText);
                that.hour = hour;
                that.$hour.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.$minute.delegate('li', 'click', function () {
                var minute = Number(this.innerText);
                that.minute = minute;
                that.$minute.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.$second.delegate('li', 'click', function () {
                var second = Number(this.innerText);
                that.second = second;
                that.$second.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
        }

        Class.prototype.bindTimeFooterEvent = function () {
            var that = this;
            this.$footer.find('.' + dateClass.confirm).on('click', function () {
                that.confirmTime(true);
            });
            // 清空
            this.$footer.find('.' + dateClass.cancel).on('click', function () {
                if (that.option.position != 'static') {
                    that.$elem.val('');
                }
                that.cancel();
            });
            // 现在
            this.$footer.find('.' + dateClass.now).on('click', function () {
                var date = new Date();
                that.hour = date.getHours();
                that.minute = date.getMinutes();
                that.second = date.getSeconds();
                that.confirmTime(true);
            });
        }

        Class.prototype.confirmTime = function (remove) {
            var date = new Date();
            date.setHours(this.hour);
            date.setMinutes(this.minute);
            date.setSeconds(this.second);
            this.formatTime = date.formatTime(this.format);
            this.value = this.formatTime;
            if (this.option.position != 'static' && remove) {
                this.$elem.val(this.formatTime);
                this.$date.remove();
            }
            typeof this.option.change === 'function' && this.option.change(this.formatTime);
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