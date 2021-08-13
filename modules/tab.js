!(function (window) {
    function factory($, Common) {
        var leftIcon = '&#xe733;';
        var rightIcon = '&#xe734;';
        var tpl = {
            title: '<div class="song-tab-title"></div>',
            prev: '<div class="song-tab-prev">' + leftIcon + '</div>',
            next: '<div class="song-tab-next">' + rightIcon + '</div>'
        }
        var tabClass = {
            tab: 'song-tab',
            header: 'song-tab-header',
            headerScroll: 'song-tab-header-scroll',
            content: 'song-tab-content',
            title: 'song-tab-title',
            item: 'song-tab-item',
            titleActive: 'song-tab-title-active',
            itemActive: 'song-tab-item-active',
            prev: 'song-tab-prev',
            next: 'song-tab-next'
        }
        var event = Common.getEvent();

        // 页码类
        function Class(option) {
            this.option = Object.assign({}, option);
            this.$tab = this.option.$tab;
            this.render();
        }

        Class.prototype.render = function () {
            var $header = this.$tab.children('.' + tabClass.header);
            var $headerScroll = $header.children('.' + tabClass.headerScroll);
            if ($header[0].scrollWidth > $header[0].clientWidth) {
                var $prev = $header.children('.' + tabClass.prev);
                var $next = $header.children('.' + tabClass.next);
                if (!$prev.length) {
                    $header.append(tpl.prev);
                }
                if (!$next.length) {
                    $header.append(tpl.next);
                }
                $header.css({
                    'padding-left': '40px',
                    'padding-right': '40px'
                });
                $headerScroll.css({
                    'position': 'absolute',
                    'left': 40
                })
            }
            this.bindEvent();
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            this.$tab.delegate('.' + tabClass.title, 'click', function () {
                var $this = $(this);
                var tabName = $this.attr('name');
                var $headerScroll = that.$tab.children('.' + tabClass.header).children('.' + tabClass.headerScroll);
                var $content = that.$tab.children('.' + tabClass.content);
                $headerScroll.children('.' + tabClass.titleActive).removeClass(tabClass.titleActive);
                $content.children('.' + tabClass.itemActive).removeClass(tabClass.itemActive);
                $this.addClass(tabClass.titleActive);
                $content.children('[target="' + tabName + '"]').addClass(tabClass.itemActive);
            });
            this.$tab.delegate('.' + tabClass.prev, 'click', function () {
                that.prev();
            });
            this.$tab.delegate('.' + tabClass.next, 'click', function () {
                that.next();
            });
        }

        // 前一页
        Class.prototype.prev = function () {
            var $header = this.$tab.children('.' + tabClass.header);
            var $headerScroll = $header.children('.' + tabClass.headerScroll);
            var left = $headerScroll[0].offsetLeft;
            var headerWidth = $header[0].clientWidth;
            $headerScroll.children('.' + tabClass.title).each(function (i, title) {
                if (title.offsetLeft + left >= 40) {
                    left = title.offsetLeft - (headerWidth - 40);
                    if (left < -40) {
                        left = -40;
                    }
                    $headerScroll.css('left', -left);
                    return false;
                }
            });
        }

        // 后一页
        Class.prototype.next = function () {
            var $header = this.$tab.children('.' + tabClass.header);
            var $headerScroll = $header.children('.' + tabClass.headerScroll);
            var left = $headerScroll[0].offsetLeft;
            var headerWidth = $header[0].clientWidth;
            var scrollWidth = $headerScroll[0].clientWidth;
            $headerScroll.children('.' + tabClass.title).each(function (i, title) {
                if (title.offsetLeft + title.offsetWidth + left >= headerWidth - 40) {
                    left = title.offsetLeft - 40;
                    if (left > scrollWidth - (headerWidth - 40)) {
                        left = scrollWidth - (headerWidth - 40);
                    }
                    $headerScroll.css('left', -left);
                    return false;
                }
            });
        }

        function init() {
            $('div.' + tabClass.tab).each(function (i, tab) {
                var $tab = $(tab);
                if (!$tab.hasClass(tabClass.structure)) {
                    new Class({
                        $tab: $(tab)
                    });
                }
            });
        }

        init();

        var SongTab = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var tab = new Class(option);
                return {
                    on: tab.on,
                    once: tab.once,
                    trigger: tab.trigger,
                    init: init
                }
            }
        }

        return SongTab;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Tab = factory(window.$, window.SongUi.Common);
    }
})(window)