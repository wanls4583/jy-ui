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
            year: '<div class="song-date-year"><ul></ul></div>',
            month: '<div class="song-date-month"><ul></ul></div>',
            childBtn: '<span class="song-date-btn">选择时间</span>'
        }

        var dateClass = {
            date: 'song-date',
            headerLeft: 'song-date-header-left',
            headerCnter: 'song-date-header-center',
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
                    case 'yearmonth':
                        that.renderYear();
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
            }
        }

        // 销毁弹框
        Class.prototype.cancel = function () {
            if (this.option.position != 'position') {
                this.data && this.data.$date && this.data.$date.remove();
                this.data = null;
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
            this.data.$headerCnter = this.data.$date.find('.' + dateClass.headerCnter);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$content.append(this.data.$table);
            this.data.$date.addClass('date-layer' + layerCount);
            if (this.data.type === 'datetime') {
                this.data.$childBtn = $(tpl.childBtn).text('选择时间');
                this.data.$result.html(this.data.$childBtn);
            }
            // 隐藏底部操作栏
            if (this.option.hideFooter) {
                this.data.$footer.hide();
            } else {
                this.bindDateFooterEvent();
            }
            this.bindDateHeaderEvent()
            this.renderDateTable();
            this.bidnDateTableEvent();
        }

        Class.prototype.renderDateTable = function () {
            this.data.year = this.data.value.getFullYear();
            this.data.month = this.data.value.getMonth();
            this.data.date = this.data.value.getDate();
            this.data.hour = this.data.value.getHours();
            this.data.minute = this.data.value.getMinutes();
            this.data.second = this.data.value.getSeconds();
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            this.data.$headerCnter.html('<div class="' + dateClass.year + '">' + this.data.year + '年</div><div class="' + dateClass.month + '">' + (this.data.month + 1) + '月</div>');
            if (this.data.type === 'date') {
                this.data.$result.text(this.data.formatTime);
            }
            var day = new Date(this.data.year, this.data.month, 1).getDay();
            var days = this.getMonthDays(this.data.year, this.data.month);
            var preMonthDays = 0;
            if (this.data.month == 0) {
                preMonthDays = this.getMonthDays(this.data.year - 1, 11);
            } else {
                preMonthDays = this.getMonthDays(this.data.year, this.data.month - 1);
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
                } else if (dateNum == this.data.date) {
                    cn = dateClass.active;
                }
                html += '<td class="' + cn + '">' + dateNum + '</td>';
                if (++count == 7) { // 满一周
                    html += '</tr>';
                    count = 0;
                }
            }
            this.data.$table.children('tbody').html(html);
        }

        Class.prototype.bindDateHeaderEvent = function () {
            var that = this;
            // 前一个月
            this.data.$date.find('.' + dateClass.preMonthBtn).on('click', function () {
                if (that.data.month == 0) {
                    that.data.month = 11;
                    that.data.year--;
                } else {
                    that.data.month--;
                }
                that.data.value = new Date(that.data.year, that.data.month, that.data.date);
                that.renderDateTable();
            });
            // 后一个月
            this.data.$date.find('.' + dateClass.nextMonthBtn).on('click', function () {
                if (that.data.month == 11) {
                    that.data.month = 0;
                    that.data.year++;
                } else {
                    that.data.month++;
                }
                that.data.value = new Date(that.data.year, that.data.month, that.data.date);
                that.renderDateTable();
            });
            // 前一年
            this.data.$date.find('.' + dateClass.preYearBtn).on('click', function () {
                that.data.year--;
                that.data.value = new Date(that.data.year, that.data.month, that.data.date);
                that.renderDateTable();
            });
            // 后一年
            this.data.$date.find('.' + dateClass.nextYearBtn).on('click', function () {
                that.data.year++;
                that.data.value = new Date(that.data.year, that.data.month, that.data.date);
                that.renderDateTable();
            });
        }

        Class.prototype.bidnDateTableEvent = function () {
            var that = this;
            // 选中日期
            this.data.$date.delegate('td', 'click', function () {
                var date = this.innerText;
                var $this = $(this);
                if ($this.hasClass(dateClass.preMonth)) {
                    if (that.data.month == 0) {
                        that.data.year--;
                        that.data.month = 12;
                    } else {
                        that.data.month--;
                    }
                    that.data.value = new Date(that.data.year, that.data.month, date);
                    if (that.data.type !== 'date' || that.option.position === 'static') {
                        that.renderDateTable();
                    }
                } else if ($this.hasClass(dateClass.nextMonth)) {
                    if (that.data.month == 11) {
                        that.data.year++;
                        that.data.month = 0
                    } else {
                        that.data.month++;
                    }
                    that.data.value = new Date(that.data.year, that.data.month, date);
                    if (that.data.type !== 'date' || that.option.position === 'static') {
                        that.renderDateTable();
                    }
                } else {
                    that.data.value = new Date(that.data.year, that.data.month, date);
                    that.data.$table.find('.' + dateClass.active).removeClass(dateClass.active);
                    $this.addClass(dateClass.active);
                }
                that.confirmDateTime();
            });
        }

        Class.prototype.bindDateFooterEvent = function () {
            var that = this;
            // 确定
            this.data.$footer.find('.' + dateClass.confirm).on('click', function () {
                that.confirmDateTime();
            });
            // 清空
            this.data.$footer.find('.' + dateClass.cancel).on('click', function () {
                if (that.option.position != 'static') {
                    that.$elem.val('');
                }
                that.cancel();
            });
            // 现在
            this.data.$footer.find('.' + dateClass.now).on('click', function () {
                that.data.value = new Date();
                that.data.hour = that.data.value.getHours();
                that.data.minute = that.data.value.getMinutes();
                that.data.second = that.data.value.getSeconds();
                that.confirmDateTime();
            });
            // 选择时间
            this.data.$childBtn && this.data.$childBtn.on('click', function () {
                if (!that.data.$time) {
                    _appendTime();
                    _showTime();
                } else if (that.data.$time.is(':visible')) {
                    _hideTime();
                } else {
                    _showTime();
                }

                function _showTime() {
                    that.data.$time.show();
                    that.data.$table.hide();
                    that.data.$childBtn.text('返回日期');
                    that.data.$headerCnter.text('选择时间');
                    that.data.$headerCnter.parent().children('.' + dateClass.headerLeft).hide();
                    that.data.$headerCnter.parent().children('.' + dateClass.headerRight).hide();
                }

                function _hideTime() {
                    that.data.$table.show();
                    that.data.$time.hide();
                    that.data.$childBtn.text('选择时间');
                    that.data.$headerCnter.html('<div class="' + dateClass.year + '">' + that.data.year + '年</div><div class="' + dateClass.month + '">' + (that.data.month + 1) + '月</div>');
                    that.data.$headerCnter.parent().children('.' + dateClass.headerLeft).show();
                    that.data.$headerCnter.parent().children('.' + dateClass.headerRight).show();
                }
            });

            function _appendTime() {
                that.data.$time = $(tpl.time);
                that.data.$content.append(that.data.$time);
                that.data.$hour = that.data.$time.find('.' + dateClass.hour);
                that.data.$minute = that.data.$time.find('.' + dateClass.minute);
                that.data.$second = that.data.$time.find('.' + dateClass.second);
                that.renderTimeList();
                that.bindTimeListEvent();
            }
        }

        Class.prototype.confirmDateTime = function () {
            if (this.data.type === 'date' || this.data.type === 'datetime') {
                this.data.value.setHours(this.data.hour);
                this.data.value.setMinutes(this.data.minute);
                this.data.value.setSeconds(this.data.second);
                this.data.formatTime = this.data.value.formatTime(this.data.format);
                if (this.option.position != 'static') {
                    this.$elem.val(this.data.formatTime);
                    this.data.$date.remove();
                } else if (this.data.type === 'date') {
                    this.data.$result.text(this.data.formatTime);
                }
                typeof this.option.change === 'function' && this.option.change(this.data.formatTime);
            }
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
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$date.find('.' + dateClass.headerLeft).hide();
            this.data.$date.find('.' + dateClass.headerRight).hide();
            this.data.$date.find('.' + dateClass.headerCnter).html('选择时间');
            this.data.$content.append(this.data.$time);
            this.data.$date.addClass('date-layer' + layerCount);
            if (this.option.hideFooter) {
                this.data.$footer.hide();
            } else {
                this.bindTimeFooterEvent();
            }
            this.renderTimeList();
            this.bindTimeListEvent();
        }

        Class.prototype.renderTimeList = function () {
            var that = this;
            this.data.hour = this.data.value.getHours();
            this.data.minute = this.data.value.getMinutes();
            this.data.second = this.data.value.getSeconds();
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            var html = '';
            for (var i = 0; i < 24; i++) {
                html += '<li ' + (i === this.data.hour ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$hour.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === this.data.minute ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$minute.append(html);
            html = '';
            for (var i = 0; i < 60; i++) {
                html += '<li ' + (i === this.data.second ? 'class="' + dateClass.active + '"' : '') + '>' + i + '</li>';
            }
            this.data.$second.append(html);
            Common.nextFrame(function () {
                that.data.$hour[0].scrollTop = that.data.hour * 30 - 150 / 2;
                that.data.$minute[0].scrollTop = that.data.minute * 30 - 150 / 2;
                that.data.$second[0].scrollTop = that.data.second * 30 - 150 / 2;
            });
            if (this.data.type === 'time') {
                this.data.$result.text(this.data.formatTime);
            }
        }

        Class.prototype.bindTimeListEvent = function () {
            var that = this;
            this.data.$hour.delegate('li', 'click', function () {
                var hour = Number(this.innerText);
                that.data.hour = hour;
                that.data.$hour.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.data.$minute.delegate('li', 'click', function () {
                var minute = Number(this.innerText);
                that.data.minute = minute;
                that.data.$minute.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
            this.data.$second.delegate('li', 'click', function () {
                var second = Number(this.innerText);
                that.data.second = second;
                that.data.$second.find('.' + dateClass.active).removeClass(dateClass.active);
                $(this).addClass(dateClass.active);
                that.confirmTime();
            });
        }

        Class.prototype.bindTimeFooterEvent = function () {
            var that = this;
            this.data.$footer.find('.' + dateClass.confirm).on('click', function () {
                that.confirmTime(true);
            });
            // 清空
            this.data.$footer.find('.' + dateClass.cancel).on('click', function () {
                if (that.option.position != 'static') {
                    that.$elem.val('');
                }
                that.cancel();
            });
            // 现在
            this.data.$footer.find('.' + dateClass.now).on('click', function () {
                var date = new Date();
                that.data.hour = date.getHours();
                that.data.minute = date.getMinutes();
                that.data.second = date.getSeconds();
                that.confirmTime(true);
            });
        }

        Class.prototype.confirmTime = function (ifConfirm) {
            if (this.data.type === 'time') {
                var date = new Date();
                date.setHours(this.data.hour);
                date.setMinutes(this.data.minute);
                date.setSeconds(this.data.second);
                this.data.formatTime = date.formatTime(this.data.format);
                this.data.value = this.data.formatTime;
                if (this.option.position != 'static' && ifConfirm) {
                    this.$elem.val(this.data.formatTime);
                    this.data.$date.remove();
                } else {
                    this.data.$result.text(this.data.formatTime);
                }
                ifConfirm && typeof this.option.change === 'function' && this.option.change(this.data.formatTime);
            }
        }

        // 渲染时间选择器
        Class.prototype.renderYear = function () {
            this.data.format = this.option.format || (this.data.type == 'yearmonth' ? 'yyyy-MM' : 'yyyy');
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
            this.data.$headerCnter = this.data.$date.find('.' + dateClass.headerCnter);
            this.data.$footer = this.data.$date.find('.' + dateClass.footer);
            this.data.$result = this.data.$date.find('.' + dateClass.result);
            this.data.$date.find('.' + dateClass.preMonthBtn).hide();
            this.data.$date.find('.' + dateClass.nextMonthBtn).hide();
            this.data.$content.append(this.data.$year);
            this.data.$date.addClass('date-layer' + layerCount);
            if (this.option.hideFooter) {
                this.data.$footer.hide();
            } else {
                this.bindYearFooterEvent();
            }
            this.bindYearHeaderEvent();
            this.renderYearList();
            this.bindYearListEvent();
        }

        Class.prototype.renderYearList = function () {
            var year = this.data.value.getFullYear();
            var html = '';
            var startYear = year - 7;
            var endYear = year + 7;
            this.data.$headerCnter.html('<div class="' + dateClass.yearRange + '">' + (startYear + '年 - ' + endYear + '年') + '</div>');
            for (var i = startYear; i <= endYear; i++) {
                html += '<li data-year="' + i + '" ' + (i === year ? 'class="' + dateClass.active + '"' : '') + '>' + i + '年</li>';
            }
            this.data.$year.html(html);
            this.data.formatTime = this.data.value.formatTime(this.data.format);
            if (this.data.type === 'year') {
                this.data.$result.text(this.data.formatTime);
            }
        }

        Class.prototype.bindYearHeaderEvent = function () {
            var that = this;
            this.data.$date.find('.' + dateClass.preYearBtn).on('click', function () {
                var year = that.data.value.getFullYear();
                that.data.value.setFullYear(year - 15);
                that.renderYearList();
            });
            // 清空
            this.data.$date.find('.' + dateClass.nextYearBtn).on('click', function () {
                var year = that.data.value.getFullYear();
                that.data.value.setFullYear(year + 15);
                that.renderYearList();
            });
        }

        Class.prototype.bindYearListEvent = function () {
            var that = this;
            this.data.$year.delegate('li', 'click', function () {
                var $this = $(this);
                var year = $this.attr('data-year');
                that.data.value.setFullYear(year);
                that.data.$year.find('.' + dateClass.active).removeClass(dateClass.active);
                $this.addClass(dateClass.active);
                that.confirmYear();
            });
        }

        Class.prototype.bindYearFooterEvent = function () {
            var that = this;
            this.data.$footer.find('.' + dateClass.confirm).on('click', function () {
                that.confirmYear();
            });
            // 清空
            this.data.$footer.find('.' + dateClass.cancel).on('click', function () {
                if (that.option.position != 'static') {
                    that.$elem.val('');
                }
                that.cancel();
            });
            // 现在
            this.data.$footer.find('.' + dateClass.now).on('click', function () {
                that.data.value = new Date();
                that.confirmYear();
            });
        }

        Class.prototype.confirmYear = function () {
            if (this.data.type === 'year' || this.data.type === 'yearmonth') {
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