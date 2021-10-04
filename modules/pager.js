/*
 * @Author: lijy
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($, Common) {
        var pageClass = {
            pager: 'jy-pager',
            prev: 'jy-pager-prev',
            prevDisabled: 'jy-pager-prev-disabled',
            next: 'jy-pager-next',
            nextDisabled: 'jy-pager-next-disabled',
            limit: 'jy-pager-limits',
            nums: 'jy-pager-nums',
            num: 'jy-pager-num',
            dot: 'jy-pager-dot',
            now: 'jy-pager-now',
            jump: 'jy-pager-jump',
            input: 'jy-pager-input',
            confirm: 'jy-pager-confirm',
            count: 'jy-pager-count'
        }
        var ieVersion = Common.getIeVersion();

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
            if (!$elem.length) {
                return;
            }
            if (!this.$pager) {
                this.$pager = $('<div class="' + [pageClass.pager, 'jy-clear'].join(' ') + '"></div>');
                this.$pager.insertAfter($elem);
                $elem.hide();
            }
            this.option = Object.assign({}, this.option);
            this.count = this.option.count || 0;
            this.limit = this.option.limit || 10;
            this.pages = Math.ceil(this.count / this.limit) || 1;
            this.nowPage = this.option.nowPage || 1;
            this.nowPage = this.nowPage > this.pages ? this.pages : this.nowPage;
            this.limits = this.option.limits || [10, 20, 50, 100];
            this.groups = this.option.groups || 5;
            this.layout = this.option.layout || ['count', 'prev', 'page', 'next', 'limit', 'jump'];
            this.prev = this.option.prev || '上一页';
            this.next = this.option.next || '下一页';
            this.size = this.option.size || 'normal';
            if (this.limits.indexOf(this.limit) == -1) {
                this.limits.push(this.limit);
                this.limits.sort(function (a, b) {
                    return a - b
                });
            }
            switch (this.size) {
                case 'small':
                    this.$pager.addClass('jy-pager-small');
                    break;
            }
            // 是否显示总数
            if (this.layout.indexOf('count') > -1) {
                if (!this.$count) {
                    this.$count = $('<span class="' + pageClass.count + '"></span>');
                    this.$pager.append(this.$count);
                }
                this.$count.html('共' + this.count + '条');
            } else if (this.$count) {
                this.$count.remove();
                this.$count = undefined;
            }
            // 是否显示上一页
            if (this.layout.indexOf('prev') > -1) {
                if (!this.$prev) {
                    this.$prev = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.prev, (this.nowPage == 1 ? pageClass.prevDisabled : '')].join(' ') + '"></a>');
                    this.$pager.append(this.$prev);
                }
                this.$prev.html(this.prev);
            } else if (this.$prev) {
                this.$prev.remove();
                this.$prev = undefined;
            }
            // 是否显示页码
            if (this.layout.indexOf('page') > -1) {
                if (!this.$page) {
                    this.$page = $('<div class="' + pageClass.nums + '"></div>');
                    this.$pager.append(this.$page);
                }
            } else if (this.$page) {
                this.$page.remove();
                this.$page = undefined;
            }
            // 是否显示下一页
            if (this.layout.indexOf('next') > -1) {
                if (!this.$next) {
                    this.$next = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.next, (this.nowPage == 1 ? pageClass.nextDisabled : '')].join(' ') + '"></a>');
                    this.$pager.append(this.$next);
                }
                this.$next.html(this.next);
            } else if (this.$next) {
                this.$next.remove();
                this.$next = undefined;
            }
            // 是否显示每页数量
            if (this.layout.indexOf('limit') > -1) {
                if (!this.$select) {
                    this.$select = $('<select class="' + pageClass.limit + '" jy-ignore></select>');
                    this.$pager.append(this.$select);
                }
                this.$select.empty();
                for (var i = 0; i < this.limits.length; i++) {
                    this.$select.append('<option value="' + this.limits[i] + '" ' + (this.limit == this.limits[i] ? 'selected' : '') + '>' + this.limits[i] + '条每页</option>');
                    if (ieVersion <= 11) {
                        var limit = this.limit;
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
            if (this.layout.indexOf('jump') > -1) {
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
                this.$jump.find('input.' + pageClass.input).val(this.nowPage);
                if (ieVersion <= 11) {
                    var nowPage = this.nowPage;
                    $(function () {
                        that.$jump.find('input.' + pageClass.input).val(nowPage);
                    });
                }
            } else if (this.$jump) {
                this.$jump.remove();
                this.$jump = undefined;
            }
            this.renderNowPage(true);
            this.bindEvent();
        }

        // 设置总数
        Class.prototype.setCount = function (count) {
            if (this.count != count) {
                this.count = count || 0;
                this.pages = Math.ceil(this.count / this.limit) || 1;
                this.nowPage = this.nowPage > this.pages ? this.pages : this.nowPage;
                this.renderNowPage(true);
                this.$count.html('共' + this.count + '条');
            }
        }

        // 设置每页最多数量
        Class.prototype.setLimit = function (limit) {
            this.limit = limit || 10;
            this.pages = Math.ceil(this.count / this.limit) || 1;
            this.nowPage = this.nowPage > this.pages ? this.pages : this.nowPage;
            this.renderNowPage();
        }

        // 渲染当前页码
        Class.prototype.renderNowPage = function (stopTrigger) {
            var that = this;
            // 首次渲染时不需要触发
            if (!stopTrigger) {
                Common.cancelNextFrame(this.triggerTimer);
                this.triggerTimer = Common.nextFrame(function () {
                    that.trigger('page', that.nowPage);
                    JyPager.trigger('page', that.nowPage);
                })
            }
            if (!this.$page) {
                return;
            }
            var html = '';
            if (this.pages > this.groups) { // 有省略号
                var half = Math.floor((this.groups) / 2);
                var start = this.nowPage - half;
                // 避免超过最大页码
                start = start + this.groups - 1 >= this.pages - 1 ? this.pages - this.groups + 1 : start;
                // 避免1和2之间生成省略号
                start = start == 2 && this.groups > 3 ? 1 : start;
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
                for (j = 0; j < this.groups && start <= this.pages; start++, j++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + start + '">' + (start == 1 && this.option.first ? this.option.first : start) + '</a>';
                }
                if (this.option.last !== false) {
                    if (start <= this.pages) {
                        if (start <= this.pages - 1) { //右侧省略号
                            html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.dot + '">...</a>';
                        }
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + this.pages + '">' + (this.option.last || this.pages) + '</a>';
                    }
                }
            } else {
                for (var i = 0; i < this.pages; i++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
                }
            }
            this.$page.html(html);
            this.$page.find('a.' + pageClass.num + '[data-page="' + this.nowPage + '"]').addClass(pageClass.now);
            this.$jump && this.$jump.find('input.' + pageClass.input).val(this.nowPage);
            if (this.nowPage == 1) {
                this.$prev && this.$prev.addClass(pageClass.prevDisabled);
            } else {
                this.$prev && this.$prev.removeClass(pageClass.prevDisabled);
            }
            if (this.nowPage == this.pages) {
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
                if (that.nowPage > 1) {
                    that.nowPage--;
                    that.renderNowPage();
                }
            });
            // 下一页
            this.$pager.delegate('a.' + pageClass.next, 'click', function () {
                if (that.nowPage < that.pages) {
                    that.nowPage++;
                    that.renderNowPage();
                }
            });
            // 点击页码
            this.$pager.delegate('a.' + pageClass.num, 'click', function () {
                var $that = $(this);
                var page = $that.attr('data-page');
                that.nowPage = page;
                that.renderNowPage();
            });
            // 跳转
            this.$pager.delegate('button.' + pageClass.confirm, 'click', function () {
                var page = that.$jump.find('input.' + pageClass.input).val();
                if (page >= 1 && page <= that.pages) {
                    that.nowPage = page;
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
                JyPager.trigger('limit', limit);
                that.setLimit(limit);
            });
        }

        var event = Common.getEvent();
        var JyPager = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var pager = new Class(option);
                return {
                    on: pager.on,
                    once: pager.once,
                    trigger: pager.trigger,
                    setCount: pager.setCount.bind(pager),
                    reload: pager.reload.bind(pager)
                }
            }
        }

        return JyPager;
    }

    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Pager = factory(window.$, window.JyUi.Common);
    }
})(window)