!(function (window) {
    function factory($, Common) {
        var leftIcon = '&#xe733;';
        var rightIcon = '&#xe734;';
        var tpl = {
            tab: '<div class="song-tab song-tab-structure">\
                <div class="song-tab-header">\
                    <div class="song-tab-header-scroll">\
                        <div class="song-tab-titles">\
                        </div>\
                    </div>\
                </div>\
                <div class="song-tab-content">\
                </div>\
            </div>',
            item: '<div class="song-tab-item" name="<%-name%>"><%-content%></div>',
            title: '<div class="song-tab-title" name="<%-name%>"><%-title%></div>',
            prev: '<div class="song-tab-prev">' + leftIcon + '</div>',
            next: '<div class="song-tab-next">' + rightIcon + '</div>'
        }
        var tabClass = {
            tab: 'song-tab',
            structure: 'song-tab-structure',
            scroll: 'song-tab-scroll',
            header: 'song-tab-header',
            headerScroll: 'song-tab-header-scroll',
            content: 'song-tab-content',
            titles: 'song-tab-titles',
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
            this.render();
        }

        Class.prototype.render = function () {
            this.$tab = this.option.$tab || $(tpl.tab);
            this.data = this.option.data || [];
            this.style = this.option.style || 'card';
            this.$header = this.$tab.children('.' + tabClass.header);
            this.$headerScroll = this.$header.children('.' + tabClass.headerScroll);
            this.$titles = this.$headerScroll.children('.' + tabClass.titles);
            this.$content = this.$tab.children('.' + tabClass.content);
            if (!this.option.$tab) {
                this.appendItem();
            }
            this.checkScroll();
            this.bindEvent();
        }

        Class.prototype.appendItem = function () {
            var that = this;
            this.data.map(function (tab) {
                that.$titles.append(Common.htmlTemplate(tpl.title, {
                    title: tab.title,
                    name: tab.name
                }));
                that.$content.append(Common.htmlTemplate(tpl.item, {
                    content: tab.content,
                    name: tab.name
                }));
            });
        }

        Class.prototype.addTab = function (tab) {
            this.$titles.append(Common.htmlTemplate(tpl.title, {
                title: tab.title,
                name: tab.name
            }));
            this.checkScroll();
        }

        Class.prototype.removeTab = function (name) {
            this.$titles.children('[name="' + name + '"]').remove();
            this.checkScroll();
        }

        // 检查是否出现滚动条
        Class.prototype.checkScroll = function () {
            if (this.$headerScroll[0].scrollWidth > this.$headerScroll[0].clientWidth) {
                var $prev = this.$header.children('.' + tabClass.prev);
                var $next = this.$header.children('.' + tabClass.next);
                if (!$prev.length) {
                    this.$header.append(tpl.prev);
                }
                if (!$next.length) {
                    this.$header.append(tpl.next);
                }
                this.$tab.addClass(tabClass.scroll);
            }
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            this.$tab.delegate('.' + tabClass.title, 'click', function () {
                var $this = $(this);
                var tabName = $this.attr('name');
                that.$titles.children('.' + tabClass.titleActive).removeClass(tabClass.titleActive);
                that.$content.children('.' + tabClass.itemActive).removeClass(tabClass.itemActive);
                $this.addClass(tabClass.titleActive);
                that.$content.children('[target="' + tabName + '"]').addClass(tabClass.itemActive);
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
            var that = this;
            var left = this.$titles[0].offsetLeft;
            var headerWidth = this.$headerScroll[0].clientWidth;
            this.$titles.children('.' + tabClass.title).each(function (i, title) {
                if (title.offsetLeft + left >= 0) {
                    left = title.offsetLeft - headerWidth;
                    if (left < 0) {
                        left = 0;
                    }
                    that.$titles.css('left', -left);
                    return false;
                }
            });
        }

        // 后一页
        Class.prototype.next = function () {
            var that = this;
            var left = this.$titles[0].offsetLeft;
            var headerWidth = this.$headerScroll[0].clientWidth;
            var scrollWidth = this.$titles[0].clientWidth;
            this.$titles.children('.' + tabClass.title).each(function (i, title) {
                if (title.offsetLeft + title.offsetWidth + left >= headerWidth) {
                    left = title.offsetLeft;
                    if (left > scrollWidth - headerWidth) {
                        left = scrollWidth - headerWidth;
                    }
                    that.$titles.css('left', -left);
                    return false;
                }
            });
        }

        function check() {
            $('div.' + tabClass.tab).each(function (i, tab) {
                var $tab = $(tab);
                if (!$tab.hasClass(tabClass.structure)) {
                    new Class({
                        $tab: $(tab)
                    });
                }
            });
        }

        check();

        var SongTab = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            check: check,
            render: function (option) {
                var tab = new Class(option);
                return {
                    on: tab.on,
                    once: tab.once,
                    trigger: tab.trigger,
                    addTab: tab.addTab.bind(tab),
                    removeTab: tab.removeTab.bind(tab)
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