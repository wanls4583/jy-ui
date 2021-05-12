/*
 * @Author: lisong
 * @Date: 2021-05-11 18:10:32
 * @Description: 
 */
!(function () {
    function factory($, Common) {
        var Pager = {
            render: render,
            on: Common.on,
            once: Common.once,
            trigger: Common.trigger
        }

        // 渲染
        function render(option) {
            var $elem = $(option.elem);
            var $pager = null;
            if (!option.$pager) {
                Object.assign({}, option);
            }
            option.count = option.count || 0;
            option.limit = option.limit || 10;
            option.pages = Math.ceil(option.count / option.limit) || 1;
            option.now = option.now || 1;
            option.now = option.now > option.pages ? option.pages : option.now;
            option.limits = option.limits || [10, 20, 50];
            option.groups = option.groups || 5;
            option.layout = option.layout || ['count', 'prev', 'page', 'next', 'limit', 'jump'];
            option.prev = option.prev || '上一页';
            option.next = option.next || '下一页';
            option.filter = $elem.attr('filter') || '';
            $pager = option.$pager || $('<div class="song-pager song-row"></div>');
            $pager[0].option = option;
            $pager.html('');
            if (!option.$pager) {
                option.$pager = $pager;
                $elem.replaceWith($pager);
            }
            for (var layout_i = 0; layout_i < option.layout.length; layout_i++) {
                if (option.layout[layout_i] == 'count') {
                    $pager.append('<span class="song-pager-count">共' + option.count + '条</span>');
                }
                if (option.layout[layout_i] == 'prev') {
                    $pager.append('<a href="javascript:;" class="song-pager-prev ' + (option.now == 1 ? 'song-pager-prev-disabled' : '') + '">' + (option.prev) + '</a>');
                }
                if (option.layout[layout_i] == 'page') {
                    $pager.append('<div class="song-pager-nums"></div>')
                    renderNowPage(option);
                }
                if (option.layout[layout_i] == 'next') {
                    $pager.append('<a href="javascript:;" class="song-pager-next ' + (option.now == option.pages ? 'song-pager-next-disabled' : '') + '">' + (option.next) + '</a>');
                }
                if (option.layout[layout_i] == 'limit') {
                    var $select = $('<select class="song-pager-limits" song-ignore></select>');
                    for (var i = 0; i < option.limits.length; i++) {
                        $select.append('<option value="' + option.limits[i] + '" ' + (option.limit == option.limits[i] ? 'selected' : '') + '>' + option.limits[i] + '条每页</option>');
                    }
                    $pager.append($select);
                }
                if (option.layout[layout_i] == 'jump') {
                    $pager.append('\
                    <div class="song-pager-jump">\
                        <span>到</span>\
                        <input type="text" class="song-pager-input">\
                        <span>页</span>\
                        <button class="song-pager-confirm">确定</button>\
                    </div>');
                    $pager.find('.song-pager-input').val(option.now);
                }
            }
            bindEvent(option);
            // 重置
            option.reset = function (_option) {
                Object.assign(option, _option);
                render(option);
            }
            return option;
        }

        // 渲染当前页码
        function renderNowPage(option) {
            var $pager = option.$pager;
            if (option.layout.indexOf('page') > -1) {
                var $nums = $pager.find('.song-pager-nums');
                $nums.html('');
                if (option.pages > option.groups) { // 有省略号
                    var half = Math.floor((option.groups) / 2);
                    var start = option.now - half;
                    start = start + option.groups - 1 >= option.pages ? option.pages - option.groups + 1 : start;
                    start = start > 0 ? start : 1;
                    if (option.first !== false) {
                        if (start > 1) {
                            $nums.append('<a href="javascript:;" class="song-pager-num" data-page="1">' + (option.first || 1) + '</a>');
                        }
                        if (start > 2) { // 左侧省略号
                            $nums.append('<span class="song-pager-dot">...</span>');
                        }
                    }
                    for (j = 0; j < option.groups && start <= option.pages; start++, j++) {
                        $nums.append('<a href="javascript:;" class="song-pager-num" data-page="' + start + '">' + start + '</a>');
                    }
                    if (option.last !== false) {
                        if (start <= option.pages) {
                            if (start <= option.pages - 1) { //右侧省略号
                                $nums.append('<span class="song-pager-dot">...</span>');
                            }
                            $nums.append('<a href="javascript:;" class="song-pager-num" data-page="' + option.pages + '">' + (option.last || option.pages) + '</a>');
                        }
                    }
                } else {
                    for (var i = 0; i < option.pages; i++) {
                        $nums.append('<a href="javascript:;" class="song-pager-num" data-page="' + (i + 1) + '">' + (i + 1) + '</a>');
                    }
                }
                $pager.find('.song-pager-now').removeClass('song-pager-now');
                $pager.find('.song-pager-num[data-page="' + option.now + '"]').addClass('song-pager-now');
            }
            $pager.find('.song-pager-input').val(option.now);
            if (option.now == 1) {
                $pager.find('.song-pager-prev').addClass('song-pager-prev-disabled');
            } else {
                $pager.find('.song-pager-prev').removeClass('song-pager-prev-disabled');
            }
            if (option.now == option.pages) {
                $pager.find('.song-pager-next').addClass('song-pager-next-disabled');
            } else {
                $pager.find('.song-pager-next').removeClass('song-pager-next-disabled');
            }
            Pager.trigger('page(' + option.filter + ')', option.now);
        }

        // 绑定事件
        function bindEvent(option) {
            var $pager = option.$pager;
            if ($pager[0].binded) {
                return;
            }
            $pager[0].binded = true;
            // 上一页
            $pager.delegate('.song-pager-prev', 'click', function () {
                if (option.now > 1) {
                    option.now--;
                    renderNowPage(option);
                }
            });
            // 下一页
            $pager.delegate('.song-pager-next', 'click', function () {
                if (option.now < option.pages) {
                    option.now++;
                    renderNowPage(option);
                }
            });
            // 点击页码
            $pager.delegate('.song-pager-num', 'click', function () {
                var $this = $(this);
                var page = $this.attr('data-page');
                option.now = page;
                renderNowPage(option);
            });
            // 跳转
            $pager.delegate('.song-pager-confirm', 'click', function () {
                var page = $pager.find('.song-pager-input').val();
                if (page >= 1 && page <= option.pages) {
                    option.now = page;
                    renderNowPage(option);
                }
            });
            $pager.delegate('.song-pager-input', 'keydown', function (e) {
                if (e.keyCode == 13) {
                    $pager.find('.song-pager-confirm').trigger('click');
                }
            });
            // 每页数量变化
            $pager.delegate('.song-pager-limits', 'change', function () {
                option.reset({
                    limit: $(this).val()
                });
            });
        }

        return Pager;
    }

    if ("function" == typeof define && define.amd) {
        define('pager', ['jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Pager = factory(window.$, window.SongUi.Common);
    }
})(window)