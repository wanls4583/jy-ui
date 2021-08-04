!(function (window) {
    function factory($, Common) {
        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var $docBody = $(docBody);
        var docIcon = '&#xe6fd;';
        var plusIcon = '&#xe736;';
        var minusIcon = '&#xe62d;';
        var checkedIcon = '&#xe737;';
        var tpl = {
            tree: '<div class="song-tree"></div>',
            ul: '<div class="song-tree-ul"><i class="song-tree-v-line"></i></div>',
            item: '<div class="song-tree-item" data-key="<%-key%>"><%if(!isRoot){%><i class="song-tree-h-line"></i><%}%></div>',
            title: '<div class="song-tree-item-title">\
                <%if(isChild){%>\
                <div class="song-tree-child-icon">' + docIcon + '</div>\
                <%}else{%>\
                <div class="song-tree-click-icon">' + plusIcon + '</div>\
                <div class="song-tree-click-icon" style="display:none">' + minusIcon + '</div>\
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
            item: 'song-tree-item',
            ul: 'song-tree-ul',
            vLine: 'song-tree-v-line',
            title: 'song-tree-item-title',
            clickIcon: 'song-tree-click-icon',
            ieHack: 'song-tree-ie-hack'
        }

        var SongTree = {
            render: function (option) {
                var tree = new Class(option);
                return {
                    on: tree.on,
                    once: tree.once,
                    trigger: tree.trigger
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
            this.data = Common.deepAssign([], this.option.data);
            this.$tree = $(tpl.tree);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.showList = [];
            this.width = this.option.width;
            this.height = this.option.height || 0;
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

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent) {
            var that = this;
            data.map(function (item, index) {
                item._song_key = that.key;
                var $item = $(Common.htmlTemplate(tpl.item, {
                    isRoot: !item._song_parent,
                    key: item._song_key
                }));
                var $title = $(Common.htmlTemplate(tpl.title, {
                    title: item.title,
                    isRoot: !item._song_parent,
                    isChild: !item.children || !item.children.length,
                    showCheckbox: that.option.showCheckbox,
                    key: item._song_key
                }));
                if (item.id !== undefined) {
                    that.idKeyMap[item.id] = that.key;
                }
                that.dataMap[that.key] = item;
                that.key++;
                $item.append($title);
                $parent.append($item);
                if (item.children && item.children.length) {
                    var $ul = $(tpl.ul);
                    item.children.map(function (_item) {
                        _item._song_parent = item;
                    });
                    if (that.option.spread || item.spread) {
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
                if (checked) {
                    data._song_checked = true;
                    $this.addClass(treeClass.checked);
                } else {
                    data._song_checked = false;
                    $this.removeClass(treeClass.checked);
                }
                var items = $item.parents('.' + treeClass.item);
                for (var i = 0; i < items.length; i++) {
                    var $_item = items.eq(i);
                    var _data = that.dataMap[$_item.attr('data-key')];
                    if (checked) {
                        if (!_data._song_checked) {
                            _data._song_checked = true
                            $_item.children('.' + treeClass.title).find('.' + treeClass.checkbox).addClass(treeClass.checked);
                        } else {
                            break;
                        }
                    } else {
                        var _checked = false;
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
                items = $item.find('.' + treeClass.item);
                items.each(function (i, item) {
                    var $_item = $(item);
                    var $checkbox = $_item.children('.' + treeClass.title).find('.' + treeClass.checkbox);
                    var _data = that.dataMap[$_item.attr('data-key')];
                    _data._song_checked = checked;
                    if (checked) {
                        $checkbox.addClass(treeClass.checked);
                    } else {
                        $checkbox.removeClass(treeClass.checked);
                    }
                });
                return false;
            });
            this.$tree.delegate('.' + treeClass.title, 'click', function () {
                var $title = $(this);
                var $ul = $title.next('.' + treeClass.ul);
                if ($ul.length) {
                    $title.children('.' + treeClass.clickIcon).toggle();
                    $ul.toggle();
                    if (ieVersion <= 6) {
                        $ul.children('.' + treeClass.vLine).css('height', $ul[0].offsetHeight);
                        $ul.parents('.' + treeClass.ul).each(function (i, ul) {
                            $(ul).children('.' + treeClass.vLine).css('height', ul.offsetHeight);
                        });
                    }
                }
                return false;
            });
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