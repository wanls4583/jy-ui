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
        var store = {};
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
            this.init();
        }

        Class.prototype.init = function () {
            var $elem = $(this.option.elem);
            var firstRender = false;
            var storeData = null;
            this.filter = this.filter || $elem.attr('song-filter') || 'pager_' + Math.random();
            store[this.filter] = store[this.filter] || {};
            storeData = store[this.filter];
            if (!$elem.length) {
                return;
            }
            if (!storeData.$pager) {
                storeData.$pager = $('<div class="' + [pageClass.pager, 'song-clear'].join(' ') + '"></div>');
                storeData.$pager.insertAfter($elem);
                $elem.hide();
                firstRender = true;
            }
            this.option = Object.assign({}, this.option);
            this.option.count = this.option.count || 0;
            this.option.limit = this.option.limit || 10;
            this.option.pages = Math.ceil(this.option.count / this.option.limit) || 1;
            this.option.nowPage = this.option.nowPage || 1;
            this.option.nowPage = this.option.nowPage > this.option.pages ? this.option.pages : this.option.nowPage;
            this.option.limits = this.option.limits || [10, 20, 50];
            this.option.groups = this.option.groups || 5;
            this.option.layout = this.option.layout || ['count', 'prev', 'page', 'next', 'limit', 'jump'];
            this.option.prev = this.option.prev || '上一页';
            this.option.next = this.option.next || '下一页';
            this.option.size = this.option.size || 'normal';
            switch (this.option.size) {
                case 'small':
                    storeData.$pager.addClass('song-pager-small');
                    break;
            }
            // 是否显示总数
            if (this.option.layout.indexOf('count') > -1) {
                if (!storeData.$count) {
                    storeData.$count = $('<span class="' + pageClass.count + '"></span>');
                    storeData.$pager.append(storeData.$count);
                }
                storeData.$count.html('共' + this.option.count + '条');
            } else if (storeData.$count) {
                storeData.$count.remove();
                storeData.$count = undefined;
            }
            // 是否显示上一页
            if (this.option.layout.indexOf('prev') > -1) {
                if (!storeData.$prev) {
                    storeData.$prev = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.prev, (this.option.nowPage == 1 ? pageClass.prevDisabled : '')].join(' ') + '"></a>');
                    storeData.$pager.append(storeData.$prev);
                }
                storeData.$prev.html(this.option.prev);
            } else if (storeData.$prev) {
                storeData.$prev.remove();
                storeData.$prev = undefined;
            }
            // 是否显示页码
            if (this.option.layout.indexOf('page') > -1) {
                if (!storeData.$page) {
                    storeData.$page = $('<div class="' + pageClass.nums + '"></div>');
                    storeData.$pager.append(storeData.$page);
                }
            } else if (storeData.$page) {
                storeData.$page.remove();
                storeData.$page = undefined;
            }
            // 是否显示下一页
            if (this.option.layout.indexOf('next') > -1) {
                if (!storeData.$next) {
                    storeData.$next = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.next, (this.option.nowPage == 1 ? pageClass.nextDisabled : '')].join(' ') + '"></a>');
                    storeData.$pager.append(storeData.$next);
                }
                storeData.$next.html(this.option.next);
            } else if (storeData.$next) {
                storeData.$next.remove();
                storeData.$next = undefined;
            }
            // 是否显示每页数量
            if (this.option.layout.indexOf('limit') > -1) {
                if (!storeData.$select) {
                    storeData.$select = $('<select class="' + pageClass.limit + '" song-ignore></select>');
                    storeData.$pager.append(storeData.$select);
                }
                storeData.$select.empty();
                for (var i = 0; i < this.option.limits.length; i++) {
                    storeData.$select.append('<option value="' + this.option.limits[i] + '" ' + (this.option.limit == this.option.limits[i] ? 'selected' : '') + '>' + this.option.limits[i] + '条每页</option>');
                }
            } else if (storeData.$select) {
                storeData.$select.remove();
                storeData.$select = undefined;
            }
            // 是否显示跳转
            if (this.option.layout.indexOf('jump') > -1) {
                if (!storeData.$jump) {
                    storeData.$jump = $('\
                    <div class="' + pageClass.jump + '">\
                        <span>到</span>\
                        <input type="text" class="' + pageClass.input + '">\
                        <span>页</span>\
                        <button class="' + pageClass.confirm + '">确定</button>\
                    </div>');
                    storeData.$pager.append(storeData.$jump);
                }
                storeData.$jump.find('input.' + pageClass.input).val(this.option.nowPage);
            } else if (storeData.$jump) {
                storeData.$jump.remove();
                storeData.$jump = undefined;
            }
            this.renderNowPage(firstRender);
            this.bindEvent();
        }

        // 渲染当前页码
        Class.prototype.renderNowPage = function (firstRender) {
            var that = this;
            var storeData = store[this.filter];
            // 首次渲染时不需要触发
            if (!firstRender) {
                clearTimeout(this.triggerTimer);
                this.triggerTimer = setTimeout(function () {
                    that.trigger('page', that.option.nowPage);
                }, 0)
            }
            if (!storeData.$page) {
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
            storeData.$page.html(html);
            storeData.$page.find('a.' + pageClass.num + '[data-page="' + this.option.nowPage + '"]').addClass(pageClass.now);
            storeData.$jump && storeData.$jump.find('input.' + pageClass.input).val(this.option.nowPage);
            if (this.option.nowPage == 1) {
                storeData.$prev && storeData.$prev.addClass(pageClass.prevDisabled);
            } else {
                storeData.$prev && storeData.$prev.removeClass(pageClass.prevDisabled);
            }
            if (this.option.nowPage == this.option.pages) {
                storeData.$next && storeData.$next.addClass(pageClass.nextDisabled);
            } else {
                storeData.$next && storeData.$next.removeClass(pageClass.nextDisabled);
            }
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign(this.option, option);
            this.init();
        }

        // 绑定事件
        Class.prototype.bindEvent = function () {
            if (this.binded) {
                return;
            }
            var that = this;
            var storeData = store[this.filter];
            this.binded = true;
            // 上一页
            storeData.$pager.delegate('a.' + pageClass.prev, 'click', function () {
                if (that.option.nowPage > 1) {
                    that.option.nowPage--;
                    that.renderNowPage();
                }
            });
            // 下一页
            storeData.$pager.delegate('a.' + pageClass.next, 'click', function () {
                if (that.option.nowPage < that.option.pages) {
                    that.option.nowPage++;
                    that.renderNowPage();
                }
            });
            // 点击页码
            storeData.$pager.delegate('a.' + pageClass.num, 'click', function () {
                var $that = $(this);
                var page = $that.attr('data-page');
                that.option.nowPage = page;
                that.renderNowPage();
            });
            // 跳转
            storeData.$pager.delegate('button.' + pageClass.confirm, 'click', function () {
                var page = storeData.$jump.find('input.' + pageClass.input).val();
                if (page >= 1 && page <= that.option.pages) {
                    that.option.nowPage = page;
                    that.renderNowPage();
                }
            });
            storeData.$pager.delegate('input.' + pageClass.input, 'keydown', function (e) {
                if (e.keyCode == 13) {
                    storeData.$jump.find('button.' + pageClass.confirm).trigger('click');
                }
            });
            // 每页数量变化
            storeData.$pager.delegate('select.' + pageClass.limit, 'change', function () {
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