!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var upIcon = '&#xe757;';
        var rightIcon = '&#xe734;';
        var tpl = {
            menu: '<ul class="song-menu song-menu-structure"></ul>',
            ul: '<ul></ul>',
            item: '<li>\
                <div class="song-menu-item-title"></div>\
            </li>',
            rightIcon: '<i class="song-menu-icon song-menu-right-icon">' + rightIcon + '</i>',
            downIcon: '<i class="song-menu-icon song-menu-down-icon">' + downIcon + '</i>',
            upIcon: '<i class="song-menu-icon song-menu-up-icon">' + upIcon + '</i>',
            border: '<li class="song-menu-border"></li>'
        }

        var menuClass = {
            menu: 'song-menu',
            structure: 'song-menu-structure',
            ulRight: 'song-menu-ul-right',
            open: 'song-menu-item-open',
            title: 'song-menu-item-title',
            group: 'song-menu-item-group',
            static: 'song-menu-static',
            border: 'song-menu-border',
            checked: 'song-menu-checked',
            downIcon: 'song-menu-down-icon',
            upIcon: 'song-menu-up-icon',
            hover: 'song-menu-hover',
            ieHack: 'song-menu-ie-hack'
        }

        var hoverRightAnimation = 'song-menu-animation-hover-right';
        var hoverDownAnimation = 'song-menu-animation-hover-down';

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);

        // 菜单类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = Object.assign({}, option);
            this.$menu = this.option.$menu;
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.$elem = $(this.option.elem);
            this.data = this.option.data && this.option.data.concat([]) || [];
            this.$menu = this.$menu || $(tpl.menu);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.width = this.option.width;
            this.height = this.option.height || 0;
            this.showList = [];
            this.width && this.$menu.css('width', this.width);
            this.height && this.$menu.css('height', this.height);
            if (this.option.position == 'static') {
                this.$elem.length && this.$elem.append(this.$menu);
                this.$menu.addClass(menuClass.static);
            } else if (this.$elem && this.$elem.length) {
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
                        that.$menu.css('width', that.$elem[0].offsetWidth - 2);
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
            } else {
                $docBody.append(this.$menu);
                this.$menu.addClass(menuClass.static);
            }
            if (this.$menu.hasClass(menuClass.structure)) {
                this.appendItem(this.data, this.$menu);
                this.addBorder();
                this.setTitleLeftPadding();
                if (ieVersion <= 7) {
                    this.setUlWidth();
                    this.$menu.addClass(menuClass.ieHack);
                }
                // 处理完毕后隐藏掉所有分组
                this.$menu.find('ul').hide();
                // 默认打开的组
                this.showList.map(function (ul) {
                    var $ul = $(ul);
                    var $li = $ul.parent('li');
                    $ul.show();
                    $li.addClass(menuClass.open);
                    if (!$ul.hasClass(menuClass.ulRight)) {
                        var $title = $li.children('.' + menuClass.title);
                        $title.children('.' + menuClass.upIcon).show();
                        $title.children('.' + menuClass.downIcon).hide();
                    }
                });
            } else {
                this.setTitleLeftPadding();
                if (ieVersion <= 7) {
                    this.setUlWidth();
                    this.$menu.addClass(menuClass.ieHack);
                }
                this.$menu.find('ul').hide();
                // 设置右侧图标和显示默认打开的组
                this.$menu.find('li.' + menuClass.group).each(function (i, li) {
                    var $li = $(li);
                    var $title = $li.children('.' + menuClass.title);
                    var $ul = $li.children('ul');
                    var $downIcon = $title.children('.' + menuClass.downIcon);
                    var $upIcon = $title.children('.' + menuClass.upIcon);
                    var $rightIcon = $title.children('.' + menuClass.rightIcon);
                    if ($ul.hasClass(menuClass.ulRight)) {
                        if (!$rightIcon.length) {
                            $title.append(tpl.rightIcon);
                        }
                    } else {
                        if (!$downIcon.length) {
                            $downIcon = $(tpl.downIcon);
                            $title.append($downIcon);
                        }
                        if (!$upIcon.length) {
                            $upIcon = $(tpl.upIcon);
                            $title.append($upIcon);
                        }
                        if ($li.hasClass(menuClass.open)) {
                            $ul.show();
                            $downIcon.hide();
                            $upIcon.show();
                        }
                    }
                });
            }
            this.bindEvent();
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign({}, option || {});
            this.$menu.remove();
            this.render();
        }

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent) {
            var that = this;
            data.map(function (item) {
                var $item = $(tpl.item);
                var $title = $item.children('.' + menuClass.title);
                item = Object.assign({}, item);
                item._song_key = that.key;
                $item.attr('data-key', that.key);
                $title.html(typeof that.option.template === 'function' ? that.option.template(item) : item.title);
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
                        $ul.addClass(menuClass.ulRight);
                        $title.append(tpl.rightIcon);
                    } else {
                        $title.append(tpl.downIcon + tpl.upIcon);
                    }
                    that.appendItem(item.children, $ul);
                    if (that.option.spread || item.spread) {
                        // 默认打开的组
                        if (that.showList.indexOf($ul[0]) == -1) {
                            that.showList.push($ul[0]);
                        }
                        // 父容器
                        $ul.parents('ul').each(function (i, ul) {
                            if (that.showList.indexOf(ul) == -1) {
                                that.showList.push(ul);
                            }
                        });
                    }
                }
            });
        }

        // 给group添加分割线
        Class.prototype.addBorder = function () {
            this.$menu.find('.' + menuClass.group).each(function (i, li) {
                var $li = $(li);
                var $ul = $li.children('ul');
                if (!$ul.hasClass(menuClass.ulRight)) {
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

        // 设置标题左侧内边距
        Class.prototype.setTitleLeftPadding = function () {
            _setPadding(this.$menu, 1);

            function _setPadding($li, level) {
                var $ul = $li.children('ul');
                var isRight = $ul.hasClass(menuClass.ulRight);
                $li.children('li').each(function (i, li) {
                    var $title = $(li).children('.' + menuClass.title);
                    $title.css('padding-left', level * 15 + 'px');
                    _setPadding($(li), level + 1);
                });
                $ul.children('li').each(function (i, li) {
                    var $title = $(li).children('.' + menuClass.title);
                    level = isRight ? 1 : level;
                    $title.css('padding-left', level * 15 + 'px');
                    _setPadding($(li), level + 1);
                });
            }
        }

        // 设置子组的宽度(防止ie7及以下浏览器布局错误)
        Class.prototype.setUlWidth = function () {
            this.$menu.css('width', this.$menu[0].offsetWidth);
            this.$menu.find('ul').each(function (i, ul) {
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
            var $ul = $li.children('ul');
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
            return this.dataMap && this.dataMap[$(dom).attr('data-key')];
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
                var $ul = $this.children('ul');
                if (!$ul.hasClass(menuClass.ulRight)) {
                    var $title = $this.children('.' + menuClass.title);
                    var visible = $ul.is(':visible');
                    if (visible) {
                        $title.children('.' + menuClass.downIcon).show();
                        $title.children('.' + menuClass.upIcon).hide();
                        if (window.requestAnimationFrame) {
                            _hideAnimation($ul);
                        } else {
                            $ul.hide();
                        }
                        $ul.parent('li').removeClass(menuClass.open);
                    } else {
                        $title.children('.' + menuClass.upIcon).show();
                        $title.children('.' + menuClass.downIcon).hide();
                        $ul.show();
                        if (window.requestAnimationFrame) {
                            _showAnimation($ul);
                        }
                        $ul.parent('li').addClass(menuClass.open);
                    }
                    that.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 展开组（右侧）事件
            this.$menu.delegate('.' + menuClass.group, 'mouseenter', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                var $ul = $this.children('ul');
                if ($ul.hasClass(menuClass.ulRight)) {
                    clearTimeout(this.hideItemTimer);
                    $ul.show().addClass(hoverRightAnimation)
                    $this.addClass(menuClass.open);
                    that.trigger('spread', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 关闭组（右侧）事件
            this.$menu.delegate('.' + menuClass.group, 'mouseleave', function () {
                var $this = $(this);
                var $ul = $this.children('ul');
                var data = that.getBindData(this);
                if ($ul.hasClass(menuClass.ulRight)) {
                    // 延迟隐藏，当在100ms内到达右侧子菜单面板时取消隐藏
                    this.hideItemTimer = setTimeout(function () {
                        $ul.hide().removeClass(hoverRightAnimation);
                        $this.removeClass(menuClass.open);
                        that.trigger('close', {
                            dom: this,
                            data: Common.delInnerProperty(data)
                        });
                    }, 100);
                }
            });
            // 鼠标到达右侧组事件
            this.$menu.delegate('ul.' + menuClass.ulRight, 'mouseenter', function () {
                var $this = $(this);
                var right = $this.parent('li')[0];
                // 到达右侧子菜单面板时取消隐藏
                right && clearTimeout(right.hideItemTimer);
            });
            // 选中事件
            this.$menu.delegate('li', 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                if (!$this.hasClass(menuClass.group)) {
                    if (that.option.check) {
                        that.$menu.find('.' + menuClass.checked).removeClass(menuClass.checked);
                        $this.addClass(menuClass.checked);
                        $this.parents('li').addClass(menuClass.checked);
                    }
                    that.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    that.option.position !== 'static' && that.$menu.hide();
                }
                return false;
            });
            // hover事件
            this.$menu.delegate('li', 'mouseenter', function () {
                var $this = $(this);
                var $ul = $this.children('ul');
                clearTimeout(this.hoverTimer);
                if (!$this.hasClass(menuClass.group) || $ul.hasClass(menuClass.ulRight)) {
                    $this.addClass(menuClass.hover);
                }
            });
            // hover事件
            this.$menu.delegate('li', 'mouseleave', function () {
                var $this = $(this);
                var $ul = $this.children('ul');
                this.hoverTimer = setTimeout(function () {
                    $this.removeClass(menuClass.hover);
                }, $ul.hasClass(menuClass.ulRight) ? 100 : 0);
            });

            // 收起动画效果
            function _hideAnimation($ul) {
                var height = $ul[0].clientHeight;
                var countHeigh = height;
                var step = height / 10;
                $ul.css('overflow', 'hidden');
                _animation();

                function _animation() {
                    that.animationTimer = requestAnimationFrame(function () {
                        countHeigh -= step;
                        if (countHeigh > 0) {
                            $ul.css('height', countHeigh);
                            _animation();
                        } else {
                            $ul.css({
                                'height': 'auto',
                                'overflow': 'visible'
                            }).hide();
                        }
                    });
                }
            }

            // 展开动画效果
            function _showAnimation($ul) {
                var height = $ul[0].clientHeight;
                var countHeigh = 0;
                var step = height / 10;
                $ul.css('overflow', 'hidden');
                _animation();

                function _animation() {
                    that.animationTimer = requestAnimationFrame(function () {
                        countHeigh += step;
                        if (countHeigh < height) {
                            $ul.css('height', countHeigh);
                            _animation();
                        } else {
                            $ul.css({
                                'height': 'auto',
                                'overflow': 'visible'
                            })
                        }
                    });
                }
            }
        }

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

        $(function () {
            $('ul.' + menuClass.menu).each(function (i, menu) {
                var $menu = $(menu);
                // 如果不是内部生成的，则绑定相关事件
                if (!$menu.hasClass(menuClass.structure)) {
                    var position = $menu.hasClass(menuClass.static) ? 'static' : 'absolute';
                    var triggerEvent = $menu.attr('song-menu-trigger');
                    var elem = $menu.attr('song-menu-elem');
                    var check = $menu.attr('song-menu-check');
                    SongMenu.render({
                        $menu: $menu,
                        elem: elem,
                        position: position,
                        trigger: triggerEvent,
                        check: check
                    });
                }
            });
        });

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