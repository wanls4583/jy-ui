!(function (window) {
    function factory($, Common) {
        var ieVersion = Common.getIeVersion();
        var docIcon = '&#xe6fd;';
        var plusIcon = '&#xe95e;';
        var minusIcon = '&#xe62d;';
        var rightIcon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var checkedIcon = '&#xe737;';
        var searchIcon = '&#xe642;';
        var tpl = {
            tree: '<div class="jy-tree">\
                <div class="jy-tree-search">\
                    <div class="jy-tree-search-container"><i>' + searchIcon + '</i><input class="jy-tree-search-input" placeholder="关键词搜索" /></div>\
                </div>\
            </div>',
            ul: '<div class="jy-tree-ul"><%if(style=="line"){%><i class="jy-tree-v-line"></i><%}%></div>',
            item: '<div class="jy-tree-item" data-key="<%-key%>"><%if(!isRoot&&style=="line"){%><i class="jy-tree-h-line"></i><%}%></div>',
            title: '<div class="jy-tree-item-title" data-key="<%-key%>">\
                <%if(isChild){%>\
                <div class="jy-tree-child-icon">' + docIcon + '</div>\
                <%}else{%>\
                <div class="jy-tree-click-icon <%-style=="arrow"?"jy-tree-arrow":""%>"><%-style=="line"?"' + plusIcon + '":"' + rightIcon + '"%></div>\
                <div class="jy-tree-click-icon <%-style=="arrow"?"jy-tree-arrow":""%>" style="display:none;"><%-style=="line"?"' + minusIcon + '":"' + downIcon + '"%></div>\
                <%}%>\
                <%if(showCheckbox){%>\
                <div class="jy-tree-checkbox" data-key="<%-key%>"><span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span><span>&nbsp;</span></div>\
                <%}%>\
                <span class="jy-tree-text"><%-title%></span>\
            </div>',
            search: ''
        }
        var treeClass = {
            checkbox: 'jy-tree-checkbox',
            checked: 'jy-tree-checked',
            disabled: 'jy-tree-disabled',
            checkedDisabled: 'jy-tree-checked-disabled',
            search: 'jy-tree-search',
            ul: 'jy-tree-ul',
            vLine: 'jy-tree-v-line',
            item: 'jy-tree-item',
            title: 'jy-tree-item-title',
            clickIcon: 'jy-tree-click-icon',
            text: 'jy-tree-text',
            downAnimation: 'jy-tree-animation-down',
            upAnimation: 'jy-tree-animation-up',
            ieHack: 'jy-tree-ie-hack'
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
            var searchMethod = null;
            // 自定义配置-begin
            this.width = this.option.width || 'auto';
            this.height = this.option.height || 'atuo';
            // 是否显示多选框
            this.showCheckbox = this.option.showCheckbox;
            // 是否默认都展开
            this.spread = this.option.spread;
            // 线条/箭头风格
            this.style = this.option.style;
            // 是否只允许icon来控制展开/收起
            this.onlyIconSwitch = this.option.onlyIconSwitch;
            // 是否开启搜索
            this.searchVisible = this.option.search;
            searchMethod = typeof this.option.searchMethod === 'function' ? this.option.searchMethod : function (text, item) {
                return item.title.indexOf(text) > -1
            }
            this.searchMethod = function (text, item) {
                var obj = Common.deepAssign({}, item);
                obj.children = undefined;
                obj = Common.deepAssign({}, obj);
                return searchMethod(text, obj);
            }
            // 自定义配置-end
            this.$elem = $(this.option.elem);
            this.data = Object.assign([], this.option.data);
            this.$tree = $(tpl.tree);
            this.$search = this.$tree.children('div.' + treeClass.search);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 0;
            this.showList = [];
            if (['arrow', 'line'].indexOf(this.style) == -1) {
                this.style = 'line';
            }
            if (this.searchVisible) {
                this.$search.show();
            }
            this.$tree.css({
                'width': this.width,
                'height': this.height
            })
            this.appendItem(this.data, this.$tree);
            this.$elem.append(this.$tree);
            this.bindEvent();
            this.showList.map(function (item) {
                var $item = $(item);
                var $title = $item.children('div.' + treeClass.title);
                var $ul = $item.children('.' + treeClass.ul);
                $title.children('div.' + treeClass.clickIcon).toggle();
                $ul.show();
                if (ieVersion <= 6) {
                    setTimeout(function () {
                        $ul.children('div.' + treeClass.vLine).css('height', $ul[0].offsetHeight);
                        $ul.parents('div.' + treeClass.ul).each(function (i, ul) {
                            $(ul).children('.' + treeClass.vLine).css('height', ul.offsetHeight);
                            console.log(ul.offsetHeight);
                        });
                    });
                }
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
                item._jy_key = that.key;
                var $item = $(Common.htmlTemplate(tpl.item, {
                    isRoot: !item._jy_parent,
                    style: that.style,
                    key: item._jy_key
                }));
                var $title = $(Common.htmlTemplate(tpl.title, {
                    title: item.title,
                    isRoot: !item._jy_parent,
                    isChild: !item.children || !item.children.length,
                    showCheckbox: that.showCheckbox,
                    style: that.style,
                    key: item._jy_key
                }));
                if (item.id !== undefined) {
                    that.idKeyMap[item.id] = that.key;
                }
                that.dataMap[that.key] = item;
                that.key++;
                $item.append($title);
                $parent.append($item);
                item._jy_checked = item._jy_checked || item.checked;
                item._jy_disabled = item._jy_disabled || item.disabled;
                if (item._jy_checked && that.showCheckbox && item._jy_disabled) { //解决ie6及以下浏览器不支持并列类名增加优先级的bug
                    $title.addClass(treeClass.checkedDisabled);
                } else {
                    if (item._jy_disabled) {
                        $title.addClass(treeClass.disabled);
                    }
                    if (item._jy_checked && that.showCheckbox) {
                        $title.addClass(treeClass.checked);
                    }
                }
                if (item.children && item.children.length) {
                    var $ul = $(Common.htmlTemplate(tpl.ul, {
                        style: that.style
                    }));
                    item.children.map(function (_item) {
                        _item._jy_parent = item;
                        _item._jy_checked = item._jy_checked;
                        _item._jy_disabled = item._jy_disabled;
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
                // 已禁用
                if (data._jy_disabled) {
                    return;
                }
                that.checkItem(key);
                // 触发多选框事件
                that.trigger('change', {
                    data: Common.delInnerProperty(data),
                    checked: data._jy_checked || false,
                    dom: this
                });
                JyTree.trigger('change', {
                    data: Common.delInnerProperty(data),
                    checked: data._jy_checked || false,
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
                    $title.children('div.' + treeClass.checkbox).trigger('click');
                }
                if (data.href && !data._jy_disabled) {
                    window.open(data.href);
                }
                // 触发节点点击事件
                that.trigger('click', {
                    data: Common.delInnerProperty(data),
                    dom: this
                });
                JyTree.trigger('click', {
                    data: Common.delInnerProperty(data),
                    dom: this
                });
                return false;
            });
            // 搜索事件
            this.$search.find('input').on('input propertychange', function () {
                that.search(this.value);
            });
        }

        // 刷新选中状态UI
        Class.prototype.refreshCheckbox = function () {
            var that = this;
            this.$tree.find('div.' + treeClass.title).each(function (i, dom) {
                var $title = $(dom);
                var key = $title.attr('data-key');
                var data = that.dataMap[key];
                if (data._jy_disabled) {
                    return;
                }
                if (data._jy_checked) {
                    $title.addClass(treeClass.checked);
                } else {
                    $title.removeClass(treeClass.checked);
                }
            });
        }

        // 展开/关闭
        Class.prototype.toggle = function (key, spread) {
            var that = this;
            var $title = this.$tree.find('.' + treeClass.title + '[data-key="' + key + '"]');
            var $ul = $title.next('.' + treeClass.ul);
            var visible = $ul.is(':visible');
            if (!$ul.length) {
                return;
            }
            if (spread !== undefined) {
                if (visible && spread || !visible && !spread) {
                    return;
                }
            }
            $ul.show();
            $title.children('div.' + treeClass.clickIcon).toggle();
            if (visible) {
                if (window.requestAnimationFrame) {
                    _hideAnimation($ul);
                } else {
                    $ul.hide();
                }
            } else {
                if (window.requestAnimationFrame) {
                    _showAnimation($ul);
                }
            }
            if (!visible && ieVersion <= 6) {
                setTimeout(function () {
                    $ul.children('div.' + treeClass.vLine).css('height', $ul[0].offsetHeight);
                    $ul.parents('div.' + treeClass.ul).each(function (i, ul) {
                        $(ul).children('.' + treeClass.vLine).css('height', ul.offsetHeight);
                    });
                });
            }

            // 收起动画效果
            function _hideAnimation($ul) {
                var height = $ul[0].clientHeight;
                var countHeigh = height;
                var step = height / 10;
                cancelAnimationFrame(that.animationTimer);
                _animation();

                function _animation() {
                    that.animationTimer = requestAnimationFrame(function () {
                        countHeigh -= step;
                        if (countHeigh > 0) {
                            $ul.css('height', countHeigh);
                            _animation();
                        } else {
                            $ul.css({
                                'height': 'auto'
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
                cancelAnimationFrame(that.animationTimer);
                _animation();

                function _animation() {
                    that.animationTimer = requestAnimationFrame(function () {
                        countHeigh += step;
                        if (countHeigh < height) {
                            $ul.css('height', countHeigh);
                            _animation();
                        } else {
                            $ul.css({
                                'height': 'auto'
                            })
                        }
                    });
                }
            }
        }

        // 选中/取消选中
        Class.prototype.checkItem = function (key, checked) {
            var data = this.dataMap[key];
            data._jy_checked = Boolean(data._jy_checked);
            if (checked === undefined) {
                checked = !data._jy_checked;
            }
            checked = Boolean(checked);
            if (data._jy_checked === checked) {
                return;
            }
            data._jy_checked = checked;
            var children = data.children || [];;
            var data = data._jy_parent;
            children = children.concat([]);
            // 处理上游
            while (data) {
                if (checked && !data._jy_checked) {
                    data._jy_checked = true;
                } else if (!checked && data._jy_checked) {
                    data._jy_checked = false;
                    for (var i = 0; i < data.children.length; i++) {
                        if (data.children[i]._jy_checked) {
                            data._jy_checked = true;
                            break;
                        }
                    }
                }
                data = data._jy_parent;
            }
            // 处理下游
            while (children.length) {
                var item = children.shift();
                if (!item._jy_disabled && !item._jy_hidden) {
                    item._jy_checked = checked;
                    item.children && item.children.map(function (_item) {
                        children.push(_item);
                    });
                }
            }
            this.refreshCheckbox();
        }

        // 验证多选框选中状态
        Class.prototype.validateCheck = function () {
            var data = this.data;
            data.map(function (item) {
                _validate(item);
            });

            function _validate(data) {
                var checked = data._jy_checked;
                if (data._jy_hidden) {
                    checked = false;
                } else {
                    if (data.children && !data._jy_hidden) {
                        checked = false;
                        for (var i = 0; i < data.children.length; i++) {
                            if (_validate(data.children[i])) {
                                checked = true;
                                break;
                            }
                        }
                    }
                    data._jy_checked = checked;
                }
                return checked;
            }
        }

        // 搜索
        Class.prototype.search = function (text) {
            var that = this;
            var showList = [];
            var list = this.data.concat([]);
            while (list.length) {
                var item = list.shift();
                // 搜索
                if (this.searchMethod(text, item) && showList.indexOf(item._jy_key) == -1) {
                    var _item = item._jy_parent;
                    showList.push(item._jy_key);
                    // 前代节点都要选中
                    while (_item) {
                        if (showList.indexOf(_item._jy_key) == -1) {
                            showList.push(_item._jy_key);
                        }
                        _item = _item._jy_parent;
                    }
                }
                item.children && item.children.map(function (_item) {
                    list.push(_item);
                });
            }
            this.$tree.find('div.' + treeClass.item).each(function (i, item) {
                var $item = $(item)
                var key = $item.attr('data-key');
                var data = that.dataMap[key];
                if (Common.indexOf(showList, key) > -1) {
                    $item.show();
                    data._jy_hidden = false;
                } else {
                    $item.hide();
                    data._jy_hidden = true;
                }
            });
            this.validateCheck();
            this.refreshCheckbox();
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
                if (item._jy_checked && !item._jy_hidden && (!item.children || !item.children.length)) {
                    result.push(Common.delInnerProperty(item));
                }
                item.children && item.children.map(function (_item) {
                    list.push(_item);
                });
            }
            return result;
        }

        var event = Common.getEvent();
        var JyTree = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
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

        return JyTree;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Tree = factory(window.$, window.JyUi.Common);
    }
})(window)