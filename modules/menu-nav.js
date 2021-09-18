!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var upIcon = '&#xe757;';
        var rightIcon = '&#xe734;';
        var tpl = {
            menu: '<ul class="jy-menu jy-menu-structure"></ul>',
            ul: '<ul></ul>',
            item: '<li><a></a></li>',
            rightIcon: '<i class="jy-menu-icon jy-menu-right-icon">' + rightIcon + '</i>',
            downIcon: '<i class="jy-menu-icon jy-menu-down-icon">' + downIcon + '</i>',
            upIcon: '<i class="jy-menu-icon jy-menu-up-icon">' + upIcon + '</i>',
            border: '<li class="jy-menu-border"></li>'
        }
        var menuClass = {
            menu: 'jy-menu',
            nav: 'jy-menu-nav',
            vertical: 'jy-menu-nav-vertical',
            horizontal: 'jy-menu-nav-horizontal',
            structure: 'jy-menu-structure',
            hoverRight: 'jy-menu-hover-right',
            hoverDown: 'jy-menu-hover-down',
            spread: 'jy-menu-item-spread',
            title: 'jy-menu-item-title',
            absolute: 'jy-menu-absolute',
            border: 'jy-menu-border',
            checked: 'jy-menu-checked',
            checkedParent: 'jy-menu-checked-parent',
            downIcon: 'jy-menu-down-icon',
            upIcon: 'jy-menu-up-icon',
            hover: 'jy-menu-hover',
            child: 'jy-menu-child',
            ieHack: 'jy-menu-ie-hack'
        }
        var hoverRightAnimation = 'jy-menu-animation-hover-right';
        var hoverDownAnimation = 'jy-menu-animation-hover-down';
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);
        var ieVersion = Common.getIeVersion();
        var event = Common.getEvent();

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
            this.$elem = $(this.option.elem);
            this.data = this.option.data && this.option.data.concat([]) || [];
            this.$menu = this.$menu || $(tpl.menu);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.width = this.option.width;
            this.height = this.option.height || 0;
            this.type = this.option.type === 'nav' ? 'nav' : 'menu';
            this.mode = this.option.mode === 'horizontal' ? 'horizontal' : 'vertical';
            this.position = this.option.position === 'absolute' ? 'absolute' : 'static';
            this.check = this.option.check === undefined ? true : Boolean(this.option.check);
            this.showList = [];
            this.width && this.$menu.css('width', this.width);
            this.height && this.$menu.css('height', this.height);
            this.mounted = !this.$menu.hasClass(menuClass.structure);
            this.type === 'menu' ? this.mountMenu() : this.mountNav();
            if (this.type === 'nav') {
                this.$menu.addClass(menuClass.nav);
                this.$menu.addClass(this.mode === 'vertical' ? menuClass.vertical : menuClass.horizontal);
            }
            if (!this.mounted) {
                this.appendItem(this.data, this.$menu, 1);
                this.setTitleLeftPadding();
                this.type === 'menu' && this.addBorder();
                // 处理完毕后隐藏掉所有分组
                this.$menu.find('ul').hide();
                // 默认打开的组
                this.showList.map(function (ul) {
                    var $ul = $(ul);
                    var $li = $ul.parent('li');
                    var $title = $li.children('a');
                    $ul.show();
                    $li.addClass(menuClass.spread);
                    if (!$ul.hasClass(menuClass.hoverRight)) {
                        $title.children('.' + menuClass.upIcon).show();
                        $title.children('.' + menuClass.downIcon).hide();
                    }
                });
            } else {
                this.setTitleLeftPadding();
                this.$menu.find('ul').hide();
                // 设置右侧图标和显示默认打开的组
                this.$menu.find('li').each(function (i, li) {
                    var $li = $(li);
                    var $title = $li.children('a');
                    var $ul = $li.children('ul');
                    var $downIcon = $title.children('.' + menuClass.downIcon);
                    var $upIcon = $title.children('.' + menuClass.upIcon);
                    var $rightIcon = $title.children('.' + menuClass.rightIcon);
                    if (!$ul.length) {
                        return;
                    }
                    if ($ul.hasClass(menuClass.hoverRight)) {
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
                        if ($li.hasClass(menuClass.spread)) {
                            $ul.show();
                            $downIcon.hide();
                            $upIcon.show();
                        }
                    }
                });
            }
            this.bindEvent();
        }

        // 挂载菜单
        Class.prototype.mountMenu = function () {
            var that = this;
            if (this.position == 'static') { //普通菜单
                !this.mounted && this.$elem.length && this.$elem.append(this.$menu);
            } else if (this.$elem && this.$elem.length) { //需要手动触发的菜单
                this.$menu.hide().addClass(menuClass.absolute);
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
                !this.mounted && $docBody.append(this.$menu);
                $docBody.on('click', function () {
                    that.position === 'absolute' && that.$menu.hide();
                });
            } else {
                !this.mounted && $docBody.append(this.$menu);
            }
        }

        // 挂载导航条
        Class.prototype.mountNav = function () {
            !this.mounted && this.$elem.length && this.$elem.append(this.$menu);
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
                var $title = $item.children('a');
                item = Object.assign({}, item);
                item._jy_key = that.key;
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
                    if (that.type === 'nav' && that.mode == 'horizontal') { //横向导航条
                        if (level <= 1) {
                            item.spreadType = 'hover-down';
                        } else {
                            item.spreadType = 'hover-right';
                        }
                    }
                    if (item.spreadType == 'hover-right') { //右侧弹出
                        $ul.addClass(menuClass.hoverRight);
                        $title.append(tpl.rightIcon);
                    } else if (item.spreadType == 'hover-down') { //下方弹出
                        $ul.addClass(menuClass.hoverDown);
                        $title.append(tpl.downIcon + tpl.upIcon);
                    } else {
                        $title.append(tpl.downIcon + tpl.upIcon);
                    }
                    that.appendItem(item.children, $ul, level + 1);
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
            this.$menu.find('li').each(function (i, li) {
                var $li = $(li);
                var $ul = $li.children('ul');
                if ($ul.length && !$ul.hasClass(menuClass.hoverRight)) {
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
            var padding = 15;
            if (this.type === 'nav') {
                padding = 20;
            }
            if (this.type === 'nav' && this.mode === 'horizontal') {
                return;
            }
            _setPadding(this.$menu, 1);

            function _setPadding($li, level) {
                var $ul = $li.children('ul');
                var isPanel = $ul.hasClass(menuClass.hoverRight) || $ul.hasClass(menuClass.hoverDown);
                $li.children('li').each(function (i, li) {
                    var $title = $(li).children('a');
                    $title.css('padding-left', level * padding + 'px');
                    _setPadding($(li), level + 1);
                });
                $ul.children('li').each(function (i, li) {
                    var $title = $(li).children('a');;
                    level = isPanel ? 1 : level;
                    $title.css('padding-left', level * padding + 'px');
                    _setPadding($(li), level + 1);
                });
            }
        }

        // 设置位置
        Class.prototype.setPosition = function () {
            var offset = this.$elem.offset();
            this.$menu.css({
                top: offset.top + this.$elem[0].offsetHeight + 5,
                left: offset.left
            });
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
            var $li = this.$menu.find('li' + '[data-key="' + key + '"]');
            var $ul = $li.children('ul');
            var visible = $ul.is(':visible');
            if ($ul.length && (spread && !visible || !spread && visible)) {
                if ($ul.hasClass(menuClass.hoverRight) || $ul.hasClass(menuClass.hoverDown)) {
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
            // 元素触发方式
            if (this.type === 'menu' && this.position === 'absolute' && this.triggerEvent === 'mouseenter') {
                this.$menu.on('mouseenter', function () {
                    clearTimeout(that.hideMenuTimer);
                });
                this.$menu.on('mouseleave', function () {
                    // 延迟隐藏，当在100ms内到达触发元素时取消隐藏
                    that.hideMenuTimer = setTimeout(function () {
                        that.$menu.hide().removeClass(hoverDownAnimation);
                    }, 100);
                });
            }
            // 点击菜单
            this.$menu.delegate('li', 'click', function (event) {
                var $this = $(this);
                var $title = $this.children('a');
                var data = that.getBindData(this);
                var $ul = $this.children('ul');
                if (!$ul.length) { //选中事件
                    if (that.check) {
                        that.$menu.find('a.' + menuClass.checked).removeClass(menuClass.checked);
                        that.$menu.find('a.' + menuClass.checkedParent).removeClass(menuClass.checkedParent);
                        if (that.type === 'nav' && that.mode === 'horizontal' && $this.parent()[0] != that.$menu[0]) {
                            var $parentLi = $this.parents('li');
                            $parentLi = $($parentLi[$parentLi.length - 1]);
                            $parentLi.children('a').addClass(menuClass.checked).removeClass(menuClass.checkedParent);
                            $title.addClass(menuClass.checkedParent);
                        } else {
                            $title.addClass(menuClass.checked);
                        }
                        $this.parents('li').each(function (i, li) {
                            $(li).children('a').addClass(menuClass.checkedParent);
                        });
                    }
                    that.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    JyMenuNav.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                } else if ($ul.length && !$ul.hasClass(menuClass.hoverRight) && !$ul.hasClass(menuClass.hoverDown)) { //展开/关闭组事件
                    var visible = $ul.is(':visible');
                    if (visible) {
                        $title.children('.' + menuClass.downIcon).show();
                        $title.children('.' + menuClass.upIcon).hide();
                        if (window.requestAnimationFrame) {
                            _hideAnimation($ul);
                        } else {
                            $ul.hide();
                        }
                        $ul.parent('li').removeClass(menuClass.spread);
                    } else {
                        $title.children('.' + menuClass.upIcon).show();
                        $title.children('.' + menuClass.downIcon).hide();
                        $ul.show();
                        if (window.requestAnimationFrame) {
                            _showAnimation($ul);
                        }
                        $ul.parent('li').addClass(menuClass.spread);
                    }
                    that.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    JyMenuNav.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
                Common.stopPropagation(event);
            });
            // 展开hover组事件
            this.$menu.delegate('li', 'mouseenter', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                var $ul = $this.children('ul');
                if ($ul.length && ($ul.hasClass(menuClass.hoverRight) || $ul.hasClass(menuClass.hoverDown))) {
                    clearTimeout(this.hideItemTimer);
                    $this.addClass(menuClass.spread);
                    $ul.show().addClass($ul.hasClass(menuClass.hoverRight) ? hoverRightAnimation : hoverDownAnimation);
                    if ($ul.hasClass(menuClass.hoverDown) && $ul[0].offsetWidth < this.offsetWidth) {
                        $ul.css('width', this.offsetWidth);
                    } else if (ieVersion <= 7) {
                        $ul.css('width', ieVersion < 7 ? $ul[0].offsetWidth : $ul[0].clientWidth);
                    }
                    that.trigger('spread', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    JyMenuNav.trigger('spread', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 关闭hover组事件
            this.$menu.delegate('li', 'mouseleave', function () {
                var $this = $(this);
                var $ul = $this.children('ul');
                var data = that.getBindData(this);
                if ($ul.length && ($ul.hasClass(menuClass.hoverRight) || $ul.hasClass(menuClass.hoverDown))) {
                    // 延迟隐藏，当在100ms内到达右侧子菜单面板时取消隐藏
                    this.hideItemTimer = setTimeout(function () {
                        $ul.hide().removeClass(hoverRightAnimation).removeClass(hoverDownAnimation);
                        $this.removeClass(menuClass.spread);
                        that.trigger('close', {
                            dom: this,
                            data: Common.delInnerProperty(data)
                        });
                        JyMenuNav.trigger('close', {
                            dom: this,
                            data: Common.delInnerProperty(data)
                        });
                    }, 100);
                }
            });
            // 鼠标到达hover组事件
            this.$menu.delegate('.' + menuClass.hoverRight + '.' + menuClass.hoverDown, 'mouseenter', function () {
                var $this = $(this);
                var li = $this.parent('li')[0];
                // 到达hover子菜单面板时取消隐藏
                li && clearTimeout(li.hideItemTimer);
            });
            // hover事件
            this.$menu.delegate('li a', 'mouseenter', function () {
                var $this = $(this);
                $this.addClass(menuClass.hover);
            });
            // hover事件
            this.$menu.delegate('li a', 'mouseleave', function () {
                var $this = $(this);
                $this.removeClass(menuClass.hover);
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

        var JyMenuNav = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
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
                    var type = $menu.hasClass(menuClass.nav) ? 'nav' : 'menu';
                    var mode = $menu.hasClass(menuClass.horizontal) ? 'horizontal' : 'vertical';
                    var position = $menu.hasClass(menuClass.absolute) ? 'absolute' : 'static';
                    var check = $menu.attr('jy-menu-check') === 'false' ? false : true;
                    var elem = $menu.attr('jy-menu-elem');
                    var trigger = $menu.attr('jy-menu-trigger');
                    JyMenuNav.render({
                        elem: elem,
                        $menu: $menu,
                        type: type,
                        position: position,
                        mode: mode,
                        check: check,
                        trigger: trigger
                    });
                }
            });
        });

        return JyMenuNav;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.MenuNav = factory(window.$, window.JyUi.Common);
    }
})(window)