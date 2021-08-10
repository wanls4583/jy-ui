!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var upIcon = '&#xe757;';
        var rightIcon = '&#xe734;';
        var tpl = {
            nav: '<ul class="song-nav song-nav-structure"></ul>',
            ul: '<ul></ul>',
            item: '<li><a></a></li>',
            rightIcon: '<i class="song-nav-icon song-nav-right-icon">' + rightIcon + '</i>',
            downIcon: '<i class="song-nav-icon song-nav-down-icon">' + downIcon + '</i>',
            upIcon: '<i class="song-nav-icon song-nav-up-icon">' + upIcon + '</i>',
            border: '<li class="song-nav-border"></li>'
        }
        var navClass = {
            nav: 'song-nav',
            vertical: 'song-nav-vertical',
            horizontal: 'song-nav-horizontal',
            structure: 'song-nav-structure',
            hoverRight: 'song-nav-hover-right',
            hoverDown: 'song-nav-hover-down',
            open: 'song-nav-item-open',
            title: 'song-nav-item-title',
            group: 'song-nav-item-group',
            static: 'song-nav-static',
            border: 'song-nav-border',
            checked: 'song-nav-checked',
            downIcon: 'song-nav-down-icon',
            upIcon: 'song-nav-up-icon',
            hover: 'song-nav-hover',
            ieHack: 'song-nav-ie-hack'
        }
        var hoverRightAnimation = 'song-nav-animation-hover-right';
        var hoverDownAnimation = 'song-nav-animation-hover-down';
        var ieVersion = Common.getIeVersion();
        var event = Common.getEvent();

        // 菜单类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = Object.assign({}, option);
            this.$nav = this.option.$nav;
            this.render();
        }

        Class.prototype.render = function () {
            this.$elem = $(this.option.elem);
            this.data = this.option.data && this.option.data.concat([]) || [];
            this.$nav = this.$nav || $(tpl.nav);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.width = this.option.width;
            this.height = this.option.height || 0;
            this.mode = this.option.mode === 'vertical' ? 'vertical' : 'horizontal';
            this.showList = [];
            this.width && this.$nav.css('width', this.width);
            this.height && this.$nav.css('height', this.height);
            this.$nav.addClass(this.mode === 'vertical' ? navClass.vertical : navClass.horizontal);
            if (this.$nav.hasClass(navClass.structure)) {
                this.$elem.length && this.$elem.append(this.$nav);
                this.appendItem(this.data, this.$nav, 1);
                this.setTitleLeftPadding();
                if (ieVersion <= 7) {
                    this.setUlWidth();
                    this.$nav.addClass(navClass.ieHack);
                }
                // 处理完毕后隐藏掉所有分组
                this.$nav.find('ul').hide();
                // 默认打开的组
                this.showList.map(function (ul) {
                    var $ul = $(ul);
                    var $li = $ul.parent('li');
                    $ul.show();
                    $li.addClass(navClass.open);
                    if (!$ul.hasClass(navClass.hoverRight)) {
                        $li.children('.' + navClass.upIcon).show();
                        $li.children('.' + navClass.downIcon).hide();
                    }
                });
            } else {
                this.setTitleLeftPadding();
                if (ieVersion <= 7) {
                    this.setUlWidth();
                    this.$nav.addClass(navClass.ieHack);
                }
                this.$nav.find('ul').hide();
                // 设置右侧图标和显示默认打开的组
                this.$nav.find('li.' + navClass.group).each(function (i, li) {
                    var $li = $(li);
                    var $ul = $li.children('ul');
                    var $downIcon = $link.children('.' + navClass.downIcon);
                    var $upIcon = $link.children('.' + navClass.upIcon);
                    var $rightIcon = $link.children('.' + navClass.rightIcon);
                    if ($ul.hasClass(navClass.hoverRight)) {
                        if (!$rightIcon.length) {
                            $li.append(tpl.rightIcon);
                        }
                    } else {
                        if (!$downIcon.length) {
                            $downIcon = $(tpl.downIcon);
                            $li.append($downIcon);
                        }
                        if (!$upIcon.length) {
                            $upIcon = $(tpl.upIcon);
                            $li.append($upIcon);
                        }
                        if ($li.hasClass(navClass.open)) {
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
            this.$nav.remove();
            this.render();
        }

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent, level) {
            var that = this;
            data.map(function (item) {
                var $item = $(tpl.item);
                var $title = $item.children('a');
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
                    $item.addClass(navClass.group);
                    if (that.mode == 'horizontal') {
                        if (level <= 1) {
                            $ul.addClass(navClass.hoverDown);
                            $item.append(tpl.downIcon + tpl.upIcon);
                        } else {
                            $ul.addClass(navClass.hoverRight);
                            $item.append(tpl.rightIcon);
                        }
                    } else {
                        $item.append(tpl.downIcon + tpl.upIcon);
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

        // 设置标题左侧内边距
        Class.prototype.setTitleLeftPadding = function () {
            if (this.mode === 'horizontal') {
                return;
            }
            _setPadding(this.$nav, 1);

            function _setPadding($li, level) {
                var $ul = $li.children('ul');
                var isRight = $ul.hasClass(navClass.hoverRight);
                $li.children('li').each(function (i, li) {
                    var $title = $(li).children('a');
                    $title.css('padding-left', level * 20 + 'px');
                    _setPadding($(li), level + 1);
                });
                $ul.children('li').each(function (i, li) {
                    var $title = $(li).children('a');;
                    level = isRight ? 1 : level;
                    $title.css('padding-left', level * 15 + 'px');
                    _setPadding($(li), level + 1);
                });
            }
        }

        // 设置子组的宽度(防止ie7及以下浏览器布局错误)
        Class.prototype.setUlWidth = function () {
            this.$nav.css('width', this.$nav[0].offsetWidth);
            this.$nav.find('ul').each(function (i, ul) {
                $(ul).css('width', ul.offsetWidth);
            });
        }

        // 打开/关闭菜单项
        Class.prototype.toggle = function (key, spread) {
            var $li = this.$nav.find('.' + navClass.group + '[data-key="' + key + '"]');
            var $ul = $li.children('ul');
            if (spread && !$ul.is(':visible') || !spread && $ul.is(':visible')) {
                if ($ul.hasClass(navClass.hoverRight)) {
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
            // 展开/关闭组事件
            this.$nav.delegate('.' + navClass.group, 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                var $ul = $this.children('ul');
                if (!$ul.hasClass(navClass.hoverRight) && !$ul.hasClass(navClass.hoverDown)) {
                    var visible = $ul.is(':visible');
                    if (visible) {
                        $this.children('.' + navClass.downIcon).show();
                        $this.children('.' + navClass.upIcon).hide();
                        if (window.requestAnimationFrame) {
                            _hideAnimation($ul);
                        } else {
                            $ul.hide();
                        }
                        $ul.parent('li').removeClass(navClass.open);
                    } else {
                        $this.children('.' + navClass.upIcon).show();
                        $this.children('.' + navClass.downIcon).hide();
                        $ul.show();
                        if (window.requestAnimationFrame) {
                            _showAnimation($ul);
                        }
                        $ul.parent('li').addClass(navClass.open);
                    }
                    that.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    SongNav.trigger($ul.is(':visible') ? 'spread' : 'close', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 展开hover组事件
            this.$nav.delegate('.' + navClass.group, 'mouseenter', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                var $ul = $this.children('ul');
                if ($ul.hasClass(navClass.hoverRight) || $ul.hasClass(navClass.hoverDown)) {
                    clearTimeout(this.hideItemTimer);
                    $this.addClass(navClass.open);
                    $ul.show().addClass($ul.hasClass(navClass.hoverRight) ? hoverRightAnimation : hoverDownAnimation);
                    if ($ul.hasClass(navClass.hoverDown) && $ul[0].offsetWidth < this.offsetWidth) {
                        $ul.css('width', this.offsetWidth);
                    }
                    that.trigger('spread', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    SongNav.trigger('spread', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
            });
            // 关闭hover组事件
            this.$nav.delegate('.' + navClass.group, 'mouseleave', function () {
                var $this = $(this);
                var $ul = $this.children('ul');
                var data = that.getBindData(this);
                if ($ul.hasClass(navClass.hoverRight) || $ul.hasClass(navClass.hoverDown)) {
                    // 延迟隐藏，当在100ms内到达右侧子菜单面板时取消隐藏
                    this.hideItemTimer = setTimeout(function () {
                        $ul.hide().removeClass(hoverRightAnimation).removeClass(hoverDownAnimation);
                        $this.removeClass(navClass.open);
                        that.trigger('close', {
                            dom: this,
                            data: Common.delInnerProperty(data)
                        });
                        SongNav.trigger('close', {
                            dom: this,
                            data: Common.delInnerProperty(data)
                        });
                    }, 100);
                }
            });
            // 鼠标到达hover组事件
            this.$nav.delegate('.' + navClass.hoverRight + '.' + navClass.hoverDown, 'mouseenter', function () {
                var $this = $(this);
                var li = $this.parent('li')[0];
                // 到达hover子菜单面板时取消隐藏
                li && clearTimeout(li.hideItemTimer);
            });
            // 选中事件
            this.$nav.delegate('li', 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                if (!$this.hasClass(navClass.group)) {
                    var $title = $this.children('a');
                    if ($this.parent()[0] == that.$nav[0] || that.mode === 'vertical') {
                        that.$nav.find('a.' + navClass.checked).removeClass(navClass.checked);
                        $title.addClass(navClass.checked);
                    }
                    that.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                    SongNav.trigger('click', {
                        dom: this,
                        data: Common.delInnerProperty(data)
                    });
                }
                return false;
            });
            // hover事件
            this.$nav.delegate('li a', 'mouseenter', function () {
                var $this = $(this);
                clearTimeout(this.hoverTimer);
                $this.addClass(navClass.hover);
            });
            // hover事件
            this.$nav.delegate('li a', 'mouseleave', function () {
                var $this = $(this);
                var $ul = $this.next('ul');
                this.hoverTimer = setTimeout(function () {
                    $this.removeClass(navClass.hover);
                }, $ul.hasClass(navClass.hoverRight) || $ul.hasClass(navClass.hoverDown) ? 100 : 0);
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

        var SongNav = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var nav = new Class(option);
                return {
                    on: nav.on,
                    once: nav.once,
                    trigger: nav.trigger,
                    spread: function (id) {
                        var key = nav.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        nav.toggle(key, true);
                    },
                    close: function (id) {
                        var key = nav.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        nav.toggle(key, false);
                    },
                    reload: function (option) {
                        nav.reload(option);
                    },
                    destroy: function () {
                        nav.$nav.remove();
                    },
                    setWidth: function (width) {
                        nav.$nav.css('width', width);
                    }
                }
            }
        }

        $(function () {
            $('ul.' + navClass.nav).each(function (i, nav) {
                var $nav = $(nav);
                // 如果不是内部生成的，则绑定相关事件
                if (!$nav.hasClass(navClass.structure)) {
                    var mode = $nav.hasClass(navClass.vertical) ? 'vertical' : 'horizontal';
                    SongNav.render({
                        $nav: $nav,
                        mode: mode
                    });
                }
            });
        });

        return SongNav;
    }
    if ("function" == typeof define && define.amd) {
        define('nav', ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Nav = factory(window.$, window.SongUi.Common);
    }
})(window)