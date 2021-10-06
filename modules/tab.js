!(function (window) {
    function factory($, Common) {
        var leftIcon = '&#xe733;';
        var rightIcon = '&#xe734;';
        var closeIcon = '&#xe735;';
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
            next: '<div class="jy-tab-next">' + rightIcon + '</div>',
            closeIcon: '<i class="jy-tab-close">' + closeIcon + '</i>'
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
            next: 'jy-tab-next',
            closeIcon: 'jy-tab-close'
        }

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
            this.colseEnable = this.option.colseEnable === false ? false : true;
            this.$header = this.$tab.children('.' + tabClass.header);
            this.$headerScroll = this.$header.children('.' + tabClass.headerScroll);
            this.$titles = this.$headerScroll.children('.' + tabClass.titles);
            this.$content = this.$tab.children('.' + tabClass.content);
            this.filter = this.$tab.attr('jy-filter');
            if (!this.option.$tab) {
                this.$elem = $(this.option.elem);
                this.appendItem();
                this.$elem.hide();
                this.$tab.insertAfter(this.$elem);
                if (this.style === 'line') {
                    this.$tab.addClass(tabClass.tabLine);
                }
            }
            // 是否可关闭
            if (this.colseEnable) {
                this.$titles.children('.' + tabClass.title).each(function (i, dom) {
                    var $dom = $(dom);
                    if ($dom.children('.' + tabClass.closeIcon).length == 0) {
                        $dom.append(tpl.closeIcon);
                    }
                });
            }
            this.checkScroll();
            this.bindEvent();
        }

        Class.prototype.appendItem = function () {
            var that = this;
            if (this.data.length) {
                var active = false;
                this.data.map(function (tab) {
                    // 确保只有一个tab是激活状态
                    active = active ? false : tab.active;
                    that.$titles.append(Common.htmlTemplate(tpl.title, {
                        title: tab.title,
                        name: tab.name,
                        active: active
                    }));
                    that.$content.append(Common.htmlTemplate(tpl.item, {
                        content: tab.content || '',
                        name: tab.name,
                        active: active
                    }));
                });
                if (that.$titles.children('.' + tabClass.titleActive).length == 0) {
                    that.$titles.children().first().addClass(tabClass.titleActive);
                    that.$content.children().first().addClass(tabClass.itemActive);
                }
            }
        }

        Class.prototype.addTab = function (tab) {
            var $title = null;
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].name == tab.name) {
                    this.$titles.children('[name="' + tab.name + '"]').trigger('click');
                    return;
                }
            }
            if (tab.active) {
                this.$titles.children('.' + tabClass.titleActive).removeClass(tabClass.titleActive);
                this.$content.children('.' + tabClass.itemActive).removeClass(tabClass.itemActive);
            }
            $title = $(Common.htmlTemplate(tpl.title, {
                title: tab.title,
                name: tab.name,
                active: tab.active
            }));
            this.colseEnable && $title.append(tpl.closeIcon);
            this.$titles.append($title);
            this.$content.append(Common.htmlTemplate(tpl.item, {
                content: tab.content || '',
                name: tab.name,
                active: tab.active
            }));
            this.data.push(tab);
            this.checkScroll();
        }

        Class.prototype.removeTab = function (name) {
            var $title = this.$titles.children('[name="' + name + '"]');
            var $prev = $title.prev();
            if (!$prev.length) {
                $prev = $title.next();
            }
            $title.remove();
            this.$content.children('[target="' + name + '"]').remove();
            this.data = this.data.filter(function (item) {
                return item.name != name;
            });
            that.trigger('close', {
                data: name,
                dom: $title[0]
            });
            that.filter && JyTab.trigger('close(' + that.filter + ')', {
                data: name,
                dom: $title[0]
            });
            JyTab.trigger('close', {
                data: name,
                dom: $title[0]
            });
            if ($title.hasClass(tabClass.titleActive)) {
                $prev.trigger('click');
            }
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
                that.filter && JyTab.trigger('change(' + that.filter + ')', {
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
            this.$tab.delegate('.' + tabClass.closeIcon, 'click', function () {
                var name = $(this).parent().attr('name');
                that.removeTab(name);
                return false;
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

        function checkStaticTab() {
            $('div.' + tabClass.tab).each(function (i, tab) {
                var $tab = $(tab);
                if (!$tab.hasClass(tabClass.structure)) {
                    new Class({
                        $tab: $(tab)
                    });
                }
            });
        }

        var event = Common.getEvent();
        var JyTab = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            checkStaticTab: checkStaticTab,
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

        checkStaticTab();

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