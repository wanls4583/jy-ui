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
            right: '<i class="song-icon song-menu-right-icon">' + rightIcon + '</i>',
            down: '<i class="song-icon song-menu-down-icon">' + downIcon + '</i>',
            up: '<i class="song-icon song-menu-up-icon">' + upIcon + '</i>',
            border: '<div class="song-menu-border"></div>'
        }

        var menuClass = {
            menu: 'song-menu',
            ul: 'song-menu-ul',
            item: 'song-menu-item',
            title: 'song-menu-item-title',
            group: 'song-menu-group',
            static: 'song-menu-static',
            open: 'song-menu-open',
            right: 'song-menu-right',
            rightWrap: 'song-menu-right-content',
            border: 'song-menu-border',
            checked: 'song-menu-checked'
        }

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
                    open: function (id) {
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
            var that = this;
            this.$elem = $(this.option.elem);
            this.data = this.option.data.concat([]);
            this.$menu = $(tpl.menu);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.appendItem(this.data, this.$menu);
            this.addBorder();
            this.bindEvent();
            if (ieVersion == 6) {
                this.$menu.css('width', this.$menu[0].clientWidth);
            }
            if (this.$elem && this.$elem.length) {
                if (this.option.position == 'static') {
                    this.$elem.append(this.$menu);
                    this.$menu.addClass(menuClass.static);
                } else {
                    this.$menu.hide();
                    $docBody.append(this.$menu);
                    this.$elem.on('click', function () {
                        that.setPosition();
                        that.$menu.toggle();
                        if (that.$menu[0].clientWidth < that.$elem[0].clientWidth) {
                            that.$menu.css('width', that.$elem[0].clientWidth);
                        }
                        return false;
                    });
                    $docBody.on('click', function () {
                        that.$menu.hide();
                    });
                }
            } else {
                $docBody.append(this.$menu);
                this.$menu.addClass(menuClass.static);
            }
        }

        // 重载
        Class.prototype.reload = function (option) {
            option = Object.assign({}, option || {});
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
                    $item.addClass(menuClass.group);
                    if (item.openType == 'right') {
                        $item.append($ul);
                        $item.addClass(menuClass.right);
                        $title.append(tpl.right);
                    } else {
                        $item.append($ul);
                        $title.append(tpl.down + tpl.up);
                    }
                    if (that.option.open) {
                        $item.addClass(menuClass.open);
                    }
                    that.appendItem(item.children, $ul);
                }
            });
        }

        // 给group添加分割线
        Class.prototype.addBorder = function () {
            this.$menu.find('.' + menuClass.group).each(function (i, li) {
                var $li = $(li);
                if (!$li.hasClass(menuClass.right)) {
                    $(tpl.border).insertAfter($li);
                    if (!$li.prev().hasClass(menuClass.border)) {
                        $(tpl.border).insertBefore($li);
                    }
                }
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
        Class.prototype.toggle = function (key, open) {
            var $li = this.$menu.find('.' + menuClass.group + '[data-key="' + key + '"]');
            var $ul = $li.children('.' + menuClass.ul);
            $ul = $ul.length ? $ul : $li.children('div.' + menuClass.rightWrap);
            if (open && !$ul.is(':visible') || !open && $ul.is(':visible')) {
                if ($ul.hasClass(menuClass.rightWrap)) {
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

        // 删除内部使用属性
        Class.prototype.delInnerProperty = function (data) {
            var obj = {};
            for (var key in data) {
                // 去掉内部数据字段
                if (key.slice(0, 5) != '_song') {
                    obj[key] = data[key];
                }
            }
            return obj;
        }

        // 绑定事件
        Class.prototype.bindEvent = function () {
            var that = this;
            this.$menu.delegate('.' + menuClass.group, 'click', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                if (!$this.hasClass(menuClass.right)) {
                    $this.toggleClass(menuClass.open);
                    that.trigger($this.hasClass(menuClass.open) ? 'open' : 'close', {
                        dom: this,
                        data: that.delInnerProperty(data)
                    });
                }
            });
            this.$menu.delegate('.' + menuClass.right, 'mouseenter', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                $this.addClass(menuClass.open);
                that.trigger('open', {
                    dom: this,
                    data: that.delInnerProperty(data)
                });
            });
            this.$menu.delegate('.' + menuClass.right, 'mouseleave', function () {
                var $this = $(this);
                var data = that.getBindData(this);
                $this.removeClass(menuClass.open);
                that.trigger('close', {
                    dom: this,
                    data: that.delInnerProperty(data)
                });
            });
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
                        data: that.delInnerProperty(data)
                    });
                }
                return false;
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