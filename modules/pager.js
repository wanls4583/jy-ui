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
        var event = Common.getEvent();
        var Pager = {
            render: render,
            on: event.on,
            once: event.once,
            trigger: event.trigger
        }

        // 渲染
        function render(option) {
            var $elem = $(option.elem);
            var $pager = option.$pager;
            var firstRender = false;
            if (!$elem.length) {
                return;
            }
            if (!option.$pager) {
                $pager = $('<div class="' + [pageClass.pager, 'song-clear'].join(' ') + '"></div>');
                option = Object.assign({}, option);
                option.$pager = $pager;
                $pager.insertAfter($elem);
                $elem.hide();
                firstRender = true;
            }
            option.count = option.count || 0;
            option.limit = option.limit || 10;
            option.pages = Math.ceil(option.count / option.limit) || 1;
            option.nowPage = option.nowPage || 1;
            option.nowPage = option.nowPage > option.pages ? option.pages : option.nowPage;
            option.limits = option.limits || [10, 20, 50];
            option.groups = option.groups || 5;
            option.layout = option.layout || ['count', 'prev', 'page', 'next', 'limit', 'jump'];
            option.prev = option.prev || '上一页';
            option.next = option.next || '下一页';
            option.size = option.size || 'normal';
            option.filter = $elem.attr('song-filter') || '';
            switch (option.size) {
                case 'small':
                    $pager.addClass('song-pager-small');
                    break;
            }
            // 是否显示总数
            if (option.layout.indexOf('count') > -1) {
                if (!option.$count) {
                    option.$count = $('<span class="' + pageClass.count + '"></span>');
                    $pager.append(option.$count);
                }
                option.$count.html('共' + option.count + '条');
            } else if (option.$count) {
                option.$count.remove();
                option.$count = undefined;
            }
            // 是否显示上一页
            if (option.layout.indexOf('prev') > -1) {
                if (!option.$prev) {
                    option.$prev = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.prev, (option.nowPage == 1 ? pageClass.prevDisabled : '')].join(' ') + '"></a>');
                    $pager.append(option.$prev);
                }
                option.$prev.html(option.prev);
            } else if (option.$prev) {
                option.$prev.remove();
                option.$prev = undefined;
            }
            // 是否显示页码
            if (option.layout.indexOf('page') > -1) {
                if (!option.$page) {
                    option.$page = $('<div class="' + pageClass.nums + '"></div>');
                    $pager.append(option.$page);
                }
            } else if (option.$page) {
                option.$page.remove();
                option.$page = undefined;
            }
            // 是否显示下一页
            if (option.layout.indexOf('next') > -1) {
                if (!option.$next) {
                    option.$next = $('<a hidefocus="true" href="javascript:;" class="' + [pageClass.next, (option.nowPage == 1 ? pageClass.nextDisabled : '')].join(' ') + '"></a>');
                    $pager.append(option.$next);
                }
                option.$next.html(option.next);
            } else if (option.$next) {
                option.$next.remove();
                option.$next = undefined;
            }
            // 是否显示每页数量
            if (option.layout.indexOf('limit') > -1) {
                if (!option.$select) {
                    option.$select = $('<select class="' + pageClass.limit + '" song-ignore></select>');
                    $pager.append(option.$select);
                }
                option.$select.empty();
                for (var i = 0; i < option.limits.length; i++) {
                    option.$select.append('<option value="' + option.limits[i] + '" ' + (option.limit == option.limits[i] ? 'selected' : '') + '>' + option.limits[i] + '条每页</option>');
                }
            } else if (option.$select) {
                option.$select.remove();
                option.$select = undefined;
            }
            // 是否显示跳转
            if (option.layout.indexOf('jump') > -1) {
                if (!option.$jump) {
                    option.$jump = $('\
                    <div class="' + pageClass.jump + '">\
                        <span>到</span>\
                        <input type="text" class="' + pageClass.input + '">\
                        <span>页</span>\
                        <button class="' + pageClass.confirm + '">确定</button>\
                    </div>');
                    $pager.append(option.$jump);
                }
                option.$jump.find('input.' + pageClass.input).val(option.nowPage);
            } else if (option.$jump) {
                option.$jump.remove();
                option.$jump = undefined;
            }
            renderNowPage(option, firstRender);
            bindEvent(option);
            // 重置
            option.reload = function (_option) {
                Object.assign(option, _option);
                render(option);
            }
            return option;
        }

        // 渲染当前页码
        function renderNowPage(option, firstRender) {
            // 首次渲染时不需要触发
            if (!firstRender) {
                clearTimeout(option.triggerTimer);
                option.triggerTimer = setTimeout(function () {
                    Pager.trigger('page(' + option.filter + ')', option.nowPage);
                    Pager.trigger('page', option.nowPage);
                }, 0)
            }
            if (!option.$page) {
                return;
            }
            var html = '';
            if (option.pages > option.groups) { // 有省略号
                var half = Math.floor((option.groups) / 2);
                var start = option.nowPage - half;
                // 避免超过最大页码
                start = start + option.groups - 1 >= option.pages - 1 ? option.pages - option.groups + 1 : start;
                // 避免1和2之间生成省略号
                start = start == 2 && option.groups > 3 ? 1 : start;
                // 避免生成负页码
                start = start > 0 ? start : 1;
                if (option.first !== false) {
                    if (start > 1) {
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="1">' + (option.first || 1) + '</a>';
                    }
                    if (start > 2) { // 左侧省略号
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.dot + '">...</a>';
                    }
                }
                for (j = 0; j < option.groups && start <= option.pages; start++, j++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + start + '">' + (start == 1 && option.first ? option.first : start) + '</a>';
                }
                if (option.last !== false) {
                    if (start <= option.pages) {
                        if (start <= option.pages - 1) { //右侧省略号
                            html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.dot + '">...</a>';
                        }
                        html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + option.pages + '">' + (option.last || option.pages) + '</a>';
                    }
                }
            } else {
                for (var i = 0; i < option.pages; i++) {
                    html += '<a hidefocus="true" href="javascript:;" class="' + pageClass.num + '" data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
                }
            }
            option.$page.html(html);
            option.$page.find('a.' + pageClass.now).removeClass(pageClass.now);
            option.$page.find('a.' + pageClass.num + '[data-page="' + option.nowPage + '"]').addClass(pageClass.now);
            option.$jump && option.$jump.find('input.' + pageClass.input).val(option.nowPage);
            if (option.nowPage == 1) {
                option.$prev.addClass(pageClass.prevDisabled);
            } else {
                option.$prev.removeClass(pageClass.prevDisabled);
            }
            if (option.nowPage == option.pages) {
                option.$next.addClass(pageClass.nextDisabled);
            } else {
                option.$next.removeClass(pageClass.nextDisabled);
            }
        }

        // 绑定事件
        function bindEvent(option) {
            var $pager = option.$pager;
            if ($pager[0].binded) {
                return;
            }
            $pager[0].binded = true;
            // 上一页
            $pager.delegate('a.' + pageClass.prev, 'click', function () {
                if (option.nowPage > 1) {
                    option.nowPage--;
                    renderNowPage(option);
                }
            });
            // 下一页
            $pager.delegate('a.' + pageClass.next, 'click', function () {
                if (option.nowPage < option.pages) {
                    option.nowPage++;
                    renderNowPage(option);
                }
            });
            // 点击页码
            $pager.delegate('a.' + pageClass.num, 'click', function () {
                var $this = $(this);
                var page = $this.attr('data-page');
                option.nowPage = page;
                renderNowPage(option);
            });
            // 跳转
            $pager.delegate('button.' + pageClass.confirm, 'click', function () {
                var page = option.$jump.find('input.' + pageClass.input).val();
                if (page >= 1 && page <= option.pages) {
                    option.nowPage = page;
                    renderNowPage(option);
                }
            });
            $pager.delegate('input.' + pageClass.input, 'keydown', function (e) {
                if (e.keyCode == 13) {
                    option.$jump.find('button.' + pageClass.confirm).trigger('click');
                }
            });
            // 每页数量变化
            $pager.delegate('select.' + pageClass.limit, 'change', function () {
                var limit = Number($(this).val()) || 0;
                Pager.trigger('limit(' + option.filter + ')', limit);
                Pager.trigger('limit', limit);
                option.reload({
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