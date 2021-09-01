!(function (window) {
    function factory($, Common) {
        var leftIcon = '&#xe733;';
        var rightIcon = '&#xe734;';
        var tpl = {
            tab: '<div class="jy-tab jy-tab-structure">\
                <div class="jy-tab-header">\
                    <div class="jy-tab-header-scroll">\
                        <div class="jy-tab-titles">\
                        </div>\
                    </div>\
                </div>\
                <div class="jy-tab-content">\
                </div>\
            </div>',
            item: '<div class="jy-tab-item<%-(active?" jy-tab-item-active":"")%>" target="<%-name%>"><%-content%></div>',
            title: '<div class="jy-tab-title<%-(active?" jy-tab-title-active":"")%>" name="<%-name%>"><%-title%></div>',
            prev: '<div class="jy-tab-prev">' + leftIcon + '</div>',
            next: '<div class="jy-tab-next">' + rightIcon + '</div>'
        }
        var tabClass = {
            tab: 'jy-tab',
            tabLine: 'jy-tab-line',
            structure: 'jy-tab-structure',
            scroll: 'jy-tab-scroll',
            header: 'jy-tab-header',
            headerScroll: 'jy-tab-header-scroll',
            content: 'jy-tab-content',
            titles: 'jy-tab-titles',
            title: 'jy-tab-title',
            item: 'jy-tab-item',
            titleActive: 'jy-tab-title-active',
            itemActive: 'jy-tab-item-active',
            prev: 'jy-tab-prev',
            next: 'jy-tab-next'
        }
        var event = Common.getEvent();

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
            this.$tab = this.option.$tab || $(tpl.tab);
            this.data = this.option.data || [];
            this.style = this.option.style === 'line' ? 'line' : 'card';
            this.$header = this.$tab.children('.' + tabClass.header);
            this.$headerScroll = this.$header.children('.' + tabClass.headerScroll);
            this.$titles = this.$headerScroll.children('.' + tabClass.titles);
            this.$content = this.$tab.children('.' + tabClass.content);
            if (!this.option.$tab) {
                this.$elem = $(this.option.elem);
                this.appendItem();
                this.$elem.hide();
                this.$tab.insertAfter(this.$elem);
                if (this.style === 'line') {
                    this.$tab.addClass(tabClass.tabLine);
                }
            }
            this.checkScroll();
            this.bindEvent();
        }

        Class.prototype.appendItem = function () {
            var that = this;
            if (this.data.length) {
                this.data.map(function (tab) {
                    that.$titles.append(Common.htmlTemplate(tpl.title, {
                        title: tab.title,
                        name: tab.name,
                        active: tab.active
                    }));
                    that.$content.append(Common.htmlTemplate(tpl.item, {
                        content: tab.content || '',
                        name: tab.name,
                        active: tab.active
                    }));
                });
                if (that.$titles.children('.' + tabClass.titleActive).length == 0) {
                    that.$titles.children().first().addClass(tabClass.titleActive);
                    that.$content.children().first().addClass(tabClass.itemActive);
                }
            }
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
                that.trigger('change', {
                    data: tabName,
                    dom: this
                });
                JyTab.trigger('change', {
                    data: tabName,
                    dom: this
                });
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

        var JyTab = {
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

        return JyTab;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Tab = factory(window.$, window.JyUi.Common);
    }
})(window)