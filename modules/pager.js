/*
 * @Author: lisong
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($, Common) {
        var pageClass = {
            pager: 'song-pager',
            prev: 'song-pager-prev',
            prevDisabled: 'song-pager-prev-disabled',
            next: 'song-pager-next',
            nextDisabled: 'song-pager-next-disabled',
            limit: 'song-pager-limits',
            nums: 'song-pager-nums',
            num: 'song-pager-num',
            dot: 'song-pager-dot',
            now: 'song-pager-now',
            jump: 'song-pager-jump',
            input: 'song-pager-input',
            confirm: 'song-pager-confirm',
            count: 'song-pager-count'
        }
        var ieVersion = Common.getIeVersion();
        var Pager = {
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
            var $elem = $(this.option.elem);
            var firstRender = false;
            if (!$elem.length) {
                return;
            }
            if (!this.$pager) {
                this.$pager = $('<div class="' + [pageClass.pager, 'song-clear'].join(' ') + '"></div>');
                this.$pager.insertAfter($elem);
                $elem.hide();
                firstRender = true;
            }
            this.option = Object.assign({}, this.option);
            this.option.count = this.option.count || 0;
            this.option.limit = this.option.limit || 10;
            this.option.pages = Math.ceil(this.option.count / this.option.limit) || 1;
            this.option.nowPage = this.option.nowPage || 1;
            this.option.nowPage = this.option.nowPage > this.option.pages ? this.option.pages : this.option.nowPage;
            this.option.limits = this.option.limits || [10, 20, 50, 100];
            this.option.groups = this.option.groups || 5;
            this.option.layout = this.option.layout || ['count', 'prev', 'page', 'next', 'limit', 'jump'];
            this.option.prev = this.option.prev || '上一页';
            this.option.next = this.option.next || '下一页';
            this.option.size = this.option.size || 'normal';
            if (this.option.limits.indexOf(this.option.limit) == -1) {
                this.option.limits.push(this.option.limit);
                this.option.limits.sort(function (a, b) {
                    return a - b
                });
            }
            switch (this.option.size) {
                case 'small':
                    this.$pager.addClass('song-pager-small');
                    break;
            }
            // 是否显示总数
            if (this.option.layout.indexOf('count') > -1) {
                if (!this.$count) {
                    this.$count = $('<span class="' + pageClass.count + '"></span>');
                    this.$pager.append(this.$count);
                }
                this.$count.html('共' + this.option.count + '条');
            } else if (this.$count) {
                this.$count.remove();
                this.$count = undefined;
            }
            // 是否显示上一页
            if (this.option.layout.indexOf('prev') > -1) {
                if (!this.$prev) {
                    this.$prev = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.prev, (this.option.nowPage == 1 ? pageClass.prevDisabled : '')].join(' ') + '"></a>');
                    this.$pager.append(this.$prev);
                }
                this.$prev.html(this.option.prev);
            } else if (this.$prev) {
                this.$prev.remove();
                this.$prev = undefined;
            }
            // 是否显示页码
            if (this.option.layout.indexOf('page') > -1) {
                if (!this.$page) {
                    this.$page = $('<div class="' + pageClass.nums + '"></div>');
                    this.$pager.append(this.$page);
                }
            } else if (this.$page) {
                this.$page.remove();
                this.$page = undefined;
            }
            // 是否显示下一页
            if (this.option.layout.indexOf('next') > -1) {
                if (!this.$next) {
                    this.$next = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.next, (this.option.nowPage == 1 ? pageClass.nextDisabled : '')].join(' ') + '"></a>');
                    this.$pager.append(this.$next);
                }
                this.$next.html(this.option.next);
            } else if (this.$next) {
                this.$next.remove();
                this.$next = undefined;
            }
            // 是否显示每页数量
            if (this.option.layout.indexOf('limit') > -1) {
                if (!this.$select) {
                    this.$select = $('<select class="' + pageClass.limit + '" song-ignore></select>');
                    this.$pager.append(this.$select);
                }
                this.$select.empty();
                for (var i = 0; i < this.option.limits.length; i++) {
                    this.$select.append('<option value="' + this.option.limits[i] + '" ' + (this.option.limit == this.option.limits[i] ? 'selected' : '') + '>' + this.option.limits[i] + '条每页</option>');
                    if (ieVersion <= 11) {
                        var limit = this.option.limit;
                        $(function () {
                            that.$select.val(limit);
                        });
                    }
                }
            } else if (this.$select) {
                this.$select.remove();
                this.$select = undefined;
            }
            // 是否显示跳转
            if (this.option.layout.indexOf('jump') > -1) {
                if (!this.$jump) {
                    this.$jump = $('\
                    <div class="' + pageClass.jump + '">\
                        <span>到</span>\
                        <input type="text" class="' + pageClass.input + '">\
                        <span>页</span>\
                        <button class="' + pageClass.confirm + '">确定</button>\
                    </div>');
                    this.$pager.append(this.$jump);
                }
                this.$jump.find('input.' + pageClass.input).val(this.option.nowPage);
                if (ieVersion <= 11) {
                    var nowPage = this.option.nowPage;
                    $(function () {
                        that.$jump.find('input.' + pageClass.input).val(nowPage);
                    });
                }
            } else if (this.$jump) {
                this.$jump.remove();
                this.$jump = undefined;
            }
            this.renderNowPage(firstRender);
            this.bindEvent();
        }

        // 渲染当前页码
        Class.prototype.renderNowPage = function (firstRender) {
            var that = this;
            // 首次渲染时不需要触发
            if (!firstRender) {
                Common.cancelNextFrame(this.triggerTimer);
                this.triggerTimer = Common.nextFrame(function () {
                    that.trigger('page', that.option.nowPage);
                })
            }
            if (!this.$page) {
                return;
            }
            var html = '';
            if (this.option.pages > this.option.groups) { // 有省略号
                var half = Math.floor((this.option.groups) / 2);
                var start = this.option.nowPage - half;
                // 避免超过最大页码
                start = start + this.option.groups - 1 >= this.option.pages - 1 ? this.option.pages - this.option.groups + 1 : start;
                // 避免1和2之间生成省略号
                start = start == 2 && this.option.groups > 3 ? 1 : start;
                // 避免生成负页码
                start = start > 0 ? start : 1;
                if (this.option.first !== false) {
                    if (start > 1) {
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="1">' + (this.option.first || 1) + '</a>';
                    }
                    if (start > 2) { // 左侧省略号
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.dot + '">...</a>';
                    }
                }
                for (j = 0; j < this.option.groups && start <= this.option.pages; start++, j++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + start + '">' + (start == 1 && this.option.first ? this.option.first : start) + '</a>';
                }
                if (this.option.last !== false) {
                    if (start <= this.option.pages) {
                        if (start <= this.option.pages - 1) { //右侧省略号
                            html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.dot + '">...</a>';
                        }
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + this.option.pages + '">' + (this.option.last || this.option.pages) + '</a>';
                    }
                }
            } else {
                for (var i = 0; i < this.option.pages; i++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
                }
            }
            this.$page.html(html);
            this.$page.find('a.' + pageClass.num + '[data-page="' + this.option.nowPage + '"]').addClass(pageClass.now);
            this.$jump && this.$jump.find('input.' + pageClass.input).val(this.option.nowPage);
            if (this.option.nowPage == 1) {
                this.$prev && this.$prev.addClass(pageClass.prevDisabled);
            } else {
                this.$prev && this.$prev.removeClass(pageClass.prevDisabled);
            }
            if (this.option.nowPage == this.option.pages) {
                this.$next && this.$next.addClass(pageClass.nextDisabled);
            } else {
                this.$next && this.$next.removeClass(pageClass.nextDisabled);
            }
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign(this.option, option);
            this.render();
        }

        // 绑定事件
        Class.prototype.bindEvent = function () {
            if (this.binded) {
                return;
            }
            var that = this;
            this.binded = true;
            // 上一页
            this.$pager.delegate('a.' + pageClass.prev, 'click', function () {
                if (that.option.nowPage > 1) {
                    that.option.nowPage--;
                    that.renderNowPage();
                }
            });
            // 下一页
            this.$pager.delegate('a.' + pageClass.next, 'click', function () {
                if (that.option.nowPage < that.option.pages) {
                    that.option.nowPage++;
                    that.renderNowPage();
                }
            });
            // 点击页码
            this.$pager.delegate('a.' + pageClass.num, 'click', function () {
                var $that = $(this);
                var page = $that.attr('data-page');
                that.option.nowPage = page;
                that.renderNowPage();
            });
            // 跳转
            this.$pager.delegate('button.' + pageClass.confirm, 'click', function () {
                var page = that.$jump.find('input.' + pageClass.input).val();
                if (page >= 1 && page <= that.option.pages) {
                    that.option.nowPage = page;
                    that.renderNowPage();
                }
            });
            this.$pager.delegate('input.' + pageClass.input, 'keydown', function (e) {
                if (e.keyCode == 13) {
                    that.$jump.find('button.' + pageClass.confirm).trigger('click');
                }
            });
            // 每页数量变化
            this.$pager.delegate('select.' + pageClass.limit, 'change', function () {
                var limit = Number($(this).val()) || 0;
                that.trigger('limit', limit);
                that.reload({
                    limit: limit
                });
            });
        }

        return Pager;
    }

    if ("function" == typeof define && define.amd) {
        define('pager', ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Pager = factory(window.$, window.SongUi.Common);
    }
})(window)