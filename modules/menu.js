!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var upIcon = '&#xe757;';
        var leftIcon = '&#xe733;';
        var rightIcon = '&#xe734;';
        var tpl = {
            menu: '<ul class="song-menu"></ul>',
            item: '<li class="song-menu-item">\
                <div class="song-menu-item-title"></div>\
            </li>',
            right: '<i class="song-icon song-menu-right-icon">' + rightIcon + '</i>',
            down: '<i class="song-icon song-menu-down-icon">' + downIcon + '</i>',
            up: '<i class="song-icon song-menu-up-icon">' + upIcon + '</i>',
            border: '<div class="song-menu-border"></div>'
        }

        var menuClass = {
            title: 'song-menu-item-title',
            group: 'song-menu-group',
            static: 'song-menu-static',
            open: 'song-menu-open',
            right: 'song-menu-right',
            border: 'song-menu-border'
        }

        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);

        var SongMenu = {
            render: function (option) {
                return new Class(option);
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
            this.$elem = $(this.option.elem);
            this.data = this.option.data.concat([]);
            this.$menu = $(tpl.menu);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.appendItem(this.data, this.$menu);
            this.bindEvent();
            if (this.option.position == 'static') {
                if (this.$elem && this.$elem.length) {
                    this.$elem.append(this.$menu);
                } else {
                    $docBody.append(this.$menu);
                }
                this.$menu.addClass(dateClass.static);
            } else {
                $docBody.append(this.$menu);
                this.setPosition();
            }
        }

        Class.prototype.appendItem = function (data, $parent) {
            var that = this;
            data.map(function (item) {
                var $item = $(tpl.item);
                var $title = $item.children('.' + menuClass.title);
                item = Object.assign({}, item);
                item._song_key = that.key;
                $item.attr('data-key', that.key);
                $title.html(typeof that.option.template === 'function' ? that.option.template(item) : item.title);
                that.key++;
                $parent.append($item);
                if (item.id !== undefined) {
                    that.idKeyMap[id] = that.key;
                    that.dataMap[that.key] = item;
                }
                if (item.children && item.children.length) {
                    var $ul = $('<ul></ul>');
                    $item.append($ul);
                    $item.addClass(menuClass.group);
                    if (item.openType == 'right') {
                        $title.append(tpl.right);
                        $item.addClass(menuClass.right);
                    } else {
                        $title.append(tpl.down + tpl.up);
                    }
                    if (that.option.open) {
                        $item.addClass(menuClass.open);
                    }
                    that.appendItem(item.children, $ul);
                }
            });
            $parent = $parent.parent();
            $parent.parent().append(tpl.border);
            if ($parent.prev() && !$parent.prev().hasClass(menuClass.border)) {
                $(tpl.border).insertBefore($parent);
            }
        }

        Class.prototype.setPosition = function () {
            if (this.$elem.length) {
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
        }

        // 获取li绑定的数据
        Class.prototype.getBindData = function (dom) {
            var storeData = store[this.filter];
            return storeData.dataMap[$(dom).attr('data-key')];
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            this.$menu.delegate('li.' + menuClass.group, 'click', function () {
                var $this = $(this);
                if (!$this.hasClass(menuClass.right)) {
                    $this.toggleClass(menuClass.open);
                }
            });
            this.$menu.delegate('li.' + menuClass.right, 'mouseover', function () {
                var $this = $(this);
                $this.addClass(menuClass.open);
            });
            this.$menu.delegate('li.' + menuClass.right, 'mouseleave', function () {
                var $this = $(this);
                $this.removeClass(menuClass.open);
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