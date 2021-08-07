!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var upIcon = '&#xe757;';
        var rightIcon = '&#xe734;';
        var tpl = {
            menu: '<div class="song-menu"></div>',
            ul: '<div class="song-menu-ul"></div>',
            item: '<div class="song-menu-item">\
                <div class="song-menu-item-title"></div>\
            </div>',
            right: '<i class="song-menu-icon song-menu-right-icon">' + rightIcon + '</i>',
            down: '<i class="song-menu-icon song-menu-down-icon">' + downIcon + '</i>',
            up: '<i class="song-menu-icon song-menu-up-icon">' + upIcon + '</i>',
            border: '<div class="song-menu-border"></div>'
        }

        var menuClass = {
            menu: 'song-menu',
            ul: 'song-menu-ul',
            ulRight: 'song-menu-ul-right',
            item: 'song-menu-item',
            title: 'song-menu-item-title',
            group: 'song-menu-group',
            static: 'song-menu-static',
            right: 'song-menu-right',
            border: 'song-menu-border',
            checked: 'song-menu-checked',
            icon: 'song-menu-icon',
            hover: 'song-menu-hover',
            ieHack: 'song-menu-ie-hack'
        }

        var hoverRightAnimation = 'song-menu-animation-hover-right';
        var hoverDownAnimation = 'song-menu-animation-hover-down';

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);

        var SongMenu = {
            render: function (option) {
                var menu = new Class(option);
                return {
                    on: menu.on,
                    once: menu.once,
                    trigger: menu.trigger,
                    spread: function (id) {
                        var key = menu.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        menu.toggle(key, true);
                    },
                    close: function (id) {
                        var key = menu.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        menu.toggle(key, false);
                    },
                    reload: function (option) {
                        menu.reload(option);
                    },
                    destroy: function () {
                        menu.$menu.remove();
                    },
                    setWidth: function (width) {
                        menu.$menu.css('width', width);
                    }
                }
            }
        }

        // 菜单类
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
            this.data = this.option.data.concat([]);
            this.$menu = $(tpl.menu);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.width = this.option.width;
            this.height = this.option.height || 0;
            this.showList = [];
            if (this.$elem && this.$elem.length) {
                this.width && this.$menu.css('width', this.width);
                this.height && this.$menu.css('height', this.height);
                if (this.option.position == 'static') {
                    this.$elem.append(this.$menu);
                    this.$menu.addClass(menuClass.static);
                } else {
                    this.$menu.hide();
                    this.triggerEvent = this.option.trigger || 'click';
                    this.triggerEvent = this.triggerEvent === 'hover' ? 'mouseenter' : this.triggerEvent;
                    this.$elem.on(this.triggerEvent, function () {
                        that.setPosition();
                        if (that.triggerEvent === 'mouseenter') {
                            clearTimeout(that.hideMenuTimer);
                            that.$menu.show().addClass(hoverDownAnimation);
                        } else {
                            that.$menu.toggle();
                        }
                        if (that.$menu[0].offsetWidth < that.$elem[0].offsetWidth) {
                            that.$menu.css('width', that.$elem[0].offsetWidth - (ieVersion <= 6 ? 0 : 2));
                        }
                        return false;
                    });
                    // 鼠标离开$elem事件
                    this.triggerEvent === 'mouseenter' && this.$elem.on('mouseleave', function () {
                        // 延迟隐藏，当在100ms内到达菜单面板时取消隐藏
                        that.hideMenuTimer = setTimeout(function () {
                            that.$menu.hide().removeClass(hoverDownAnimation);
                        }, 100);
                    });
                    $docBody.append(this.$menu);
                    $docBody.on('click', function () {
                        that.option.position !== 'static' && that.$menu.hide();
                    });
                }
            } else {
                $docBody.append(this.$menu);
                this.$menu.addClass(menuClass.static);
            }
            this.appendItem(this.data, this.$menu, 1);
            this.addBorder();
            this.bindEvent();
            if (ieVersion <= 7) {
                this.setUlWidth();
                this.$menu.addClass(menuClass.ieHack);
            }
            // 处理完毕后隐藏掉所有分组
            this.$menu.find('.' + menuClass.ul).hide();
            // 默认打开的组
            this.showList.map(function (ul) {
                $(ul).show();
            });
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign({}, option || {});
            this.$menu.remove();
            this.render();
        }

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent, level) {
            var that = this;
            data.map(function (item) {
                var $item = $(tpl.item);
                var $title = $item.children('.' + menuClass.title);
                item = Object.assign({}, item);
                item._song_key = that.key;
                $item.attr('data-key', that.key);
                $title.html(typeof that.option.template === 'function' ? that.option.template(item) : item.title);
                $title.css('padding-left', level * 15 + 'px');
                $parent.append($item);
                if (item.id !== undefined) {
                    that.idKeyMap[item.id] = that.key;
                }
                that.dataMap[that.key] = item;
                that.key++;
                if (item.children && item.children.length) {
                    var $ul = $(tpl.ul);
                    $item.append($ul);
                    $item.addClass(menuClass.group);
                    if (item.spreadType == 'right') {
                        $item.addClass(menuClass.right);
                        $ul.addClass(menuClass.ulRight);
                        $title.append(tpl.right);
                    } else {
                        $title.append(tpl.down + tpl.up);
                    }
                    that.appendItem(item.children, $ul, level + 1);
                    if (that.option.spread || item.spread) {
                        // 默认打开的组
                        if (that.showList.indexOf($ul[0]) == -1) {
                            that.showList.push($ul[0]);
                        }
                        // 父容器
                        $ul.parents('.' + menuClass.ul).each(function (i, ul) {
                            if (that.showList.indexOf(ul) == -1) {
                                var $title = $(ul).prev('.' + menuClass.title);
                                that.showList.push(ul);
                                $title.children('.' + menuClass.icon).toggle();
                            }
                        });
                        if (item.spreadType != 'right') {
                            $item.children('.' + menuClass.title).children('.' + menuClass.icon).toggle();
                        }
                    }
                }
            });
        }

        // 给group添加分割线
        Class.prototype.addBorder = function () {
            this.$menu.find('.' + menuClass.group).each(function (i, li) {
                var $li = $(li);
                if (!$li.hasClass(menuClass.right)) {
                    var $prev = $li.prev();
                    if ($li.next().length) {
                        $(tpl.border).insertAfter($li);
                    }
                    if ($prev.length && !$prev.hasClass(menuClass.border)) {
                        $(tpl.border).insertBefore($li);
                    }
                }
            });
        }

        // 设置子组的宽度(防止ie7及以下浏览器布局错误)
        Class.prototype.setUlWidth = function () {
            this.$menu.css('width', this.$menu[0].offsetWidth);
            this.$menu.find('.' + menuClass.ul).each(function (i, ul) {
                $(ul).css('width', ul.offsetWidth);
            });
        }

        // 设置位置
        Class.prototype.setPosition = function () {
            var offset = this.$elem.offset();
            this.$menu.css({
                top: offset.top + this.$elem[0].offsetHeight + 5,
                left: offset.left
            })
            if (ieVersion <= 6) {
                var ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                var ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                this.$menu.css({
                    marginTop: ie6MarginTop,
                    marginLeft: ie6MarginLeft
                })
            }
        }

        // 打开/关闭菜单项
        Class.prototype.toggle = function (key, spread) {
            var $li = this.$menu.find('.' + menuClass.group + '[data-key="' + key + '"]');
            var $ul = $li.children('.' + menuClass.ul);
            if (spread && !$ul.is(':visible') || !spread && $ul.is(':visible')) {
                if ($ul.hasClass(menuClass.ulRight)) {
                    $li.trigger('mouseenter');
                } else {
                    $li.trigger('click');
                }
            }
        }

        // 通过id获取key
        Class.prototype.getKeyById = function (id) {
            return this.idKeyMap[id];
        }

        // 获取li绑定的数据
        Class.prototype.getBindData = function (dom) {
            return this.dataMap[$(dom).attr('data-key')];
        }

        // 绑定事件
        Class.prototype.bindEvent = function () {
            var that = this;
            if (this.triggerEvent === 'mouseenter') {
                // 鼠标到达菜单面部事件（hover方式）
                this.$menu.on('mouseenter', function () {
                    clearTimeout(that.hideMenuTimer);
                });
                // 鼠标离开菜单面部事件（hover方式）
                this.$menu.on('mouseleave', function () {
                    // 延迟隐藏，当在100ms内到达$elem时取消隐藏
                    that.hideMenuTimer = setTimeout(function () {
                        that.$menu.hide();
                    }, 100);
                });
            }
            // 展开/关闭组事件
            this.$menu.delegate('.' + menuClass.group, 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                if (!$this.hasClass(menuClass.right)) {
                    var $ul = $this.children('.' + menuClass.ul);
                    var $icon = $this.children('.' + menuClass.title).children('.' + menuClass.icon);
                    $ul.toggle();
                    $icon.toggle();
                    that.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 展开组（右侧）事件
            this.$menu.delegate('.' + menuClass.right, 'mouseenter', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                var $ul = $this.children('.' + menuClass.ul);
                clearTimeout(this.hideItemTimer);
                $ul.show().addClass(hoverRightAnimation);
                that.trigger('spread', {
                    dom: this,
                    data: Common.delInnerProperty(data)
                });
            });
            // 关闭组（右侧）事件
            this.$menu.delegate('.' + menuClass.right, 'mouseleave', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                // 延迟隐藏，当在100ms内到达右侧子菜单面板时取消隐藏
                this.hideItemTimer = setTimeout(function () {
                    $this.children('.' + menuClass.ul).hide().removeClass(hoverRightAnimation);
                    that.trigger('close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }, 100);
            });
            // 选中事件
            this.$menu.delegate('.' + menuClass.item, 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                if (!$this.hasClass(menuClass.group)) {
                    if (that.option.check) {
                        that.$menu.find('.' + menuClass.checked).removeClass(menuClass.checked);
                        $this.addClass(menuClass.checked);
                        $this.parents('.' + menuClass.item).addClass(menuClass.checked);
                    }
                    that.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    that.option.position !== 'static' && that.$menu.hide();
                }
                return false;
            });
            // 鼠标到达右侧组事件
            this.$menu.delegate('.' + menuClass.ul, 'mouseenter', function () {
                var right = $(this).parent('.' + menuClass.right)[0];
                // 到达右侧子菜单面板时取消隐藏
                right && clearTimeout(right.hideItemTimer);
            });

            this.$menu.delegate('.' + menuClass.item, 'mouseenter', function () {
                var $this = $(this);
                clearTimeout(this.hoverTimer);
                if (!$this.hasClass(menuClass.group) || $this.hasClass(menuClass.right)) {
                    $this.addClass(menuClass.hover);
                }
            });

            this.$menu.delegate('.' + menuClass.item, 'mouseleave', function () {
                var $this = $(this);
                this.hoverTimer = setTimeout(function () {
                    $this.removeClass(menuClass.hover);
                }, $this.hasClass(menuClass.right) ? 100 : 0);
            });
        }

        return SongMenu;
    }
    if ("function" == typeof define && define.amd) {
        define('menu', ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Menu = factory(window.$, window.SongUi.Common);
    }
})(window)