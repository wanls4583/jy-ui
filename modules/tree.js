!(function (window) {
    function factory($, Common) {
        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);
        var docIcon = '&#xe6fd;';
        var plusIcon = '&#xe95e;';
        var minusIcon = '&#xe62d;';
        var rightIcon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var checkedIcon = '&#xe737;';
        var tpl = {
            tree: '<div class="song-tree"></div>',
            ul: '<div class="song-tree-ul"><%if(style=="line"){%><i class="song-tree-v-line"></i><%}%></div>',
            item: '<div class="song-tree-item" data-key="<%-key%>"><%if(!isRoot&&style=="line"){%><i class="song-tree-h-line"></i><%}%></div>',
            title: '<div class="song-tree-item-title" data-key="<%-key%>">\
                <%if(isChild){%>\
                <div class="song-tree-child-icon">' + docIcon + '</div>\
                <%}else{%>\
                <div class="song-tree-click-icon <%-style=="arrow"?"song-tree-arrow":""%>"><%-style=="line"?"' + plusIcon + '":"' + rightIcon + '"%></div>\
                <div class="song-tree-click-icon <%-style=="arrow"?"song-tree-arrow":""%>" style="display:none;"><%-style=="line"?"' + minusIcon + '":"' + downIcon + '"%></div>\
                <%}%>\
                <%if(showCheckbox){%>\
                <div class="song-tree-checkbox" data-key="<%-key%>"><span class="song-checkbox-icon"><i>' + checkedIcon + '</i></span><span>&nbsp;</span></div>\
                <%}%>\
                <span class="song-tree-text"><%-title%></span>\
            </div>'
        }
        var treeClass = {
            checkbox: 'song-tree-checkbox',
            checked: 'song-tree-checked',
            disabled: 'song-tree-disabled',
            item: 'song-tree-item',
            ul: 'song-tree-ul',
            vLine: 'song-tree-v-line',
            title: 'song-tree-item-title',
            text: 'song-tree-text',
            clickIcon: 'song-tree-click-icon',
            ieHack: 'song-tree-ie-hack'
        }

        var SongTree = {
            render: function (option) {
                var tree = new Class(option);
                return {
                    on: tree.on,
                    once: tree.once,
                    trigger: tree.trigger,
                    getChecked: tree.getChecked.bind(tree),
                    spread: function (id) {
                        var key = tree.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        tree.toggle(key, true);
                    },
                    close: function (id) {
                        var key = tree.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        tree.toggle(key, false);
                    },
                    reload: function (option) {
                        tree.reload(option);
                    },
                    destroy: function () {
                        tree.$tree.remove();
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
            this.$elem = $(this.option.elem);
            this.data = Common.deepAssign([], this.option.data);
            this.$tree = $(tpl.tree);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.showList = [];
            this.width = this.option.width;
            this.height = this.option.height || 0;
            // 是否显示多选框
            this.showCheckbox = this.option.showCheckbox;
            // 是否默认都展开
            this.spread = this.option.spread;
            // 线条/箭头风格
            this.style = this.option.style;
            // 是否只允许icon来控制展开/收起
            this.onlyIconSwitch = this.option.onlyIconSwitch;
            if (['arrow', 'line'].indexOf(this.style) == -1) {
                this.style = 'line';
            }
            this.appendItem(this.data, this.$tree);
            this.$elem.append(this.$tree);
            this.bindEvent();
            this.showList.map(function (item) {
                var $item = $(item);
                $item.children('.' + treeClass.title).children('.' + treeClass.clickIcon).toggle();
                $item.children('.' + treeClass.ul).show();
            });
            ieVersion <= 7 && this.$tree.addClass(treeClass.ieHack);
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign({}, option || {});
            this.$tree.remove();
            this.render();
        }

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent) {
            var that = this;
            data.map(function (item, index) {
                item._song_key = that.key;
                var $item = $(Common.htmlTemplate(tpl.item, {
                    isRoot: !item._song_parent,
                    style: that.style,
                    key: item._song_key
                }));
                var $title = $(Common.htmlTemplate(tpl.title, {
                    title: item.title,
                    isRoot: !item._song_parent,
                    isChild: !item.children || !item.children.length,
                    showCheckbox: that.showCheckbox,
                    style: that.style,
                    key: item._song_key
                }));
                if (item.id !== undefined) {
                    that.idKeyMap[item.id] = that.key;
                }
                that.dataMap[that.key] = item;
                that.key++;
                $item.append($title);
                $parent.append($item);
                item._song_checked = item._song_checked || item.checked;
                item._song_disabled = item._song_disabled || item.disabled;
                if (item._song_checked && that.showCheckbox) {
                    $title.children('.' + treeClass.checkbox).addClass(treeClass.checked);
                }
                if (item._song_disabled) {
                    $title.addClass(treeClass.disabled);
                }
                if (item.children && item.children.length) {
                    var $ul = $(Common.htmlTemplate(tpl.ul, {
                        style: that.style
                    }));
                    item.children.map(function (_item) {
                        _item._song_parent = item;
                        _item._song_checked = item._song_checked;
                        _item._song_disabled = item._song_disabled;
                    });
                    if (that.spread || item.spread) {
                        // 默认打开的组
                        that.showList.push($item[0]);
                        $item.parents('.' + treeClass.item).each(function (i, dom) {
                            if (that.showList.indexOf(dom) == -1) {
                                that.showList.push(dom);
                            }
                        });
                    }
                    $item.append($ul);
                    that.appendItem(item.children, $ul);
                }
            });
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            // 多选框事件
            this.$tree.delegate('.' + treeClass.checkbox, 'click', function () {
                var $this = $(this);
                var key = $this.attr('data-key');
                var data = that.dataMap[key];
                var checked = !data._song_checked;
                var $item = $this.parent('.' + treeClass.title).parent('.' + treeClass.item);
                // 禁用状态
                if (data._song_disabled) {
                    return false;
                }
                if (checked) {
                    data._song_checked = true;
                    $this.addClass(treeClass.checked);
                } else {
                    data._song_checked = false;
                    $this.removeClass(treeClass.checked);
                }
                // 上游的项
                var items = $item.parents('.' + treeClass.item);
                for (var i = 0; i < items.length; i++) {
                    var $_item = items.eq(i);
                    var _data = that.dataMap[$_item.attr('data-key')];
                    if (checked) {
                        // 往上寻找需要选中的项
                        if (!_data._song_checked) {
                            _data._song_checked = true;
                            $_item.children('.' + treeClass.title).find('.' + treeClass.checkbox).addClass(treeClass.checked);
                        } else {
                            break;
                        }
                    } else {
                        var _checked = false;
                        // 往上寻找需要取消选中的项
                        for (var n = 0; n < _data.children.length; n++) {
                            var item = _data.children[n];
                            if (item._song_checked) {
                                _checked = true;
                                break;
                            }
                        }
                        if (_checked) {
                            break;
                        } else {
                            _data._song_checked = _checked;
                            $_item.children('.' + treeClass.title).find('.' + treeClass.checkbox).removeClass(treeClass.checked);
                        }
                    }
                }
                // 下游的项
                items = $item.find('.' + treeClass.item);
                items.each(function (i, item) {
                    var $_item = $(item);
                    var $checkbox = $_item.children('.' + treeClass.title).find('.' + treeClass.checkbox);
                    var _data = that.dataMap[$_item.attr('data-key')];
                    // 禁用的项
                    if (_data._song_disabled) {
                        return;
                    }
                    _data._song_checked = checked;
                    // 全部选中/取消选中下游的项
                    if (checked) {
                        $checkbox.addClass(treeClass.checked);
                    } else {
                        $checkbox.removeClass(treeClass.checked);
                    }
                });
                // 触发多选框事件
                that.trigger('change', {
                    data: Common.delInnerProperty(data),
                    checked: data._song_checked || false,
                    dom: this
                });
                return false;
            });
            // 展开/收起事件
            this.$tree.delegate('.' + treeClass.clickIcon, 'click', function () {
                var $title = $(this).parent('.' + treeClass.title);
                var key = $title.attr('data-key');
                var data = that.dataMap[key];
                that.toggle(key);
                // 触发节点展开/收起事件
                that.trigger($title.next('.' + treeClass.ul).is(':visible') ? 'spread' : 'close', {
                    data: Common.delInnerProperty(data),
                    dom: this
                });
                return false;
            });
            // 点击标题文本事件
            this.$tree.delegate('.' + treeClass.text, 'click', function () {
                var $title = $(this).parent('.' + treeClass.title);
                var key = $title.attr('data-key');
                var data = that.dataMap[key];
                if (data.children && data.children.length) {
                    !that.onlyIconSwitch && that.toggle(key);
                } else {
                    $title.find('.' + treeClass.checkbox).trigger('click');
                }
                if (data.href && !data._song_disabled) {
                    window.open(data.href);
                }
                // 触发节点点击事件
                that.trigger('click', {
                    data: Common.delInnerProperty(data),
                    dom: this
                });
                return false;
            });
        }

        // 展开/关闭
        Class.prototype.toggle = function (key, spread) {
            var $title = this.$tree.find('.' + treeClass.title + '[data-key="' + key + '"]');
            var $ul = $title.next('.' + treeClass.ul);
            var visible = $ul.is(':visible');
            if (spread !== undefined) {
                if (visible && spread || !visible && !spread) {
                    return;
                }
            }
            $title.children('.' + treeClass.clickIcon).toggle();
            $ul.toggle();
            if (ieVersion <= 6) {
                $ul.children('.' + treeClass.vLine).css('height', $ul[0].offsetHeight);
                $ul.parents('.' + treeClass.ul).each(function (i, ul) {
                    $(ul).children('.' + treeClass.vLine).css('height', ul.offsetHeight);
                });
            }
        }

        // 通过id获取key
        Class.prototype.getKeyById = function (id) {
            return this.idKeyMap[id];
        }

        // 获取选中的数据
        Class.prototype.getChecked = function () {
            var list = this.data.concat([]);
            var result = [];
            if (!this.showCheckbox) {
                return [];
            }
            while (list.length) {
                var item = list.shift();
                if (item._song_checked && (!item.children || !item.children.length)) {
                    result.push(Common.delInnerProperty(item));
                }
                item.children && item.children.map(function (_item) {
                    list.push(_item);
                });
            }
            return result;
        }
        return SongTree;
    }
    if ("function" == typeof define && define.amd) {
        define('tree', ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Tree = factory(window.$, window.SongUi.Common);
    }
})(window)