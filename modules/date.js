!(function (window) {
    function factory($, Common) {
        var tpl = {
            date: '<div class="song-date">\
                <div class="song-date-main">\
                    <div class="song-date-header">\
                        <div class="song-date-header-left">\
                            <i class="song-icon left-du">&#xe612;</i>\
                            <i class="song-icon left">&#xe733;</i>\
                        </div>\
                        <div class="song-date-header-center">\
                            <div class="song-date-header-year"></div>\
                            <div class="song-date-header-month"></div>\
                        </div>\
                        <div class="song-date-header-right">\
                            <i class="song-icon right">&#xe734;</i>\
                            <i class="song-icon right-du">&#xe61a;</i>\
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
                        <span class="song-date-btn song-date-cancel">取消</span><span class="song-date-btn song-date-now">现在</span><span class="song-date-btn song-date-confirm">确定</span>\
                    </div>\
                </div>\
            </div>'
        }

        var dateClass = {
            year: 'song-date-header-year',
            month: 'song-date-header-month',
            preMonth: 'song-date-prev-month',
            nextMonth: 'song-date-next-month',
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
            this.$elem = $(this.option.elem);
            this.trigger = ['change', 'focus', 'click'].indexOf(this.option.trigger) > -1 ? this.option.trigger : 'click';
            if (this.$elem && this.$elem.length) {
                this.$elem.on(this.trigger, function () {
                    if (!that.rendered) {
                        _render();
                        that.rendered = true;
                    }
                });
                // this.$elem.on('blur', function () {
                //     that.$date.remove();
                //     that.$elem.val(that.formatTime);
                // });
            } else {
                _render();
            }

            function _render() {
                layerCount++;
                switch (that.option.type) {
                    default:
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

        Class.prototype.renderDate = function () {
            var that = this;
            if (typeof this.value === 'string') {
                this.value = Date.prototype.parseDateTime(this.value);
            }
            if (!(this.value instanceof Date)) {
                this.value = new Date();
            }
            var year = this.value.getFullYear();
            var month = this.value.getMonth();
            var date = this.value.getDate();
            var day = new Date(year, month, 1).getDay();
            var days = this.getMonthDays(year, month);
            var preMonthDays = 0;
            if (month == 0) {
                preMonthDays = this.getMonthDays(year - 1, 11);
            } else {
                preMonthDays = this.getMonthDays(year, month - 1);
            }
            this.formatTime = this.value.formatTime();
            this.$date = this.$date || $(tpl.date);
            this.$table = this.$date.find('tbody');
            this.$year = this.$date.find('.' + dateClass.year);
            this.$month = this.$date.find('.' + dateClass.month);
            this.$result = this.$date.find('.' + dateClass.result);
            this.$cancel = this.$date.find('.' + dateClass.cancel);
            this.$now = this.$date.find('.' + dateClass.now);
            this.$confirm = this.$date.find('.' + dateClass.confirm);
            this.$year.text(year + '年');
            this.$month.text(month + 1 + '月');
            this.$result.text(this.formatTime);
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
                } else if (dateNum == date) {
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
                if (that.bindedEvent) {
                    return;
                }
                that.bindedEvent = true;
                // 选中日期
                that.$table.delegate('td', 'click', function () {
                    var date = this.innerText;
                    var $this = $(this);
                    if ($this.hasClass(dateClass.preMonth)) {
                        if (month == 0) {
                            year--;
                            month = 12;
                        } else {
                            month--;
                        }
                        that.value = new Date(year, month, date);
                        that.renderDate();
                    } else if ($this.hasClass(dateClass.nextMonth)) {
                        if (month == 11) {
                            year++;
                            month = 0
                        } else {
                            month++;
                        }
                        that.value = new Date(year, month, date);
                        that.renderDate();
                    } else {
                        that.value = new Date(year, month, date);
                        that.$result.text(that.value.formatTime());
                        that.$table.find('.' + dateClass.active).removeClass(dateClass.active);
                        $this.addClass(dateClass.active);
                    }


                });
            }
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