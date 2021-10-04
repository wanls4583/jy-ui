!(function (window) {
    function factory($, Common) {
        var docBody = window.document.body;
        var $docBody = $(docBody);
        var leftIcon = '&#xe612;';
        var rightIcon = '&#xe61a;';
        var checkedIcon = '&#xe737;';
        var searchIcon = '&#xe642;';
        var tpl = {
            transfer: '<div class="jy-transfer"></div>',
            left: '<div class="jy-transfer-left">\
                <div class="jy-transfer-title">\
                    <div class="jy-transfer-checkbox"><span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span><span><%-(title||"&nbsp;")%></span></div>\
                </div>\
                <div class="jy-transfer-search">\
                    <div class="jy-transfer-search-container"><i>' + searchIcon + '</i><input class="jy-transfer-search-input" placeholder="关键词搜索" /></div>\
                </div>\
                <div class="jy-transfer-left-body"><div class="jy-transfer-empty">无数据</div></div>\
            </div>',
            right: '<div class="jy-transfer-right">\
                <div class="jy-transfer-title">\
                    <div class="jy-transfer-checkbox"><span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span><span><%-(title||"&nbsp;")%></span></div>\
                </div>\
                <div class="jy-transfer-search">\
                    <div class="jy-transfer-search-container"><i>' + searchIcon + '</i><input class="jy-transfer-search-input" placeholder="关键词搜索" /></div>\
                </div>\
                <div class="jy-transfer-right-body"><div class="jy-transfer-empty">无数据</div></div>\
            </div>',
            center: '<div class="jy-transfer-center"><div class="jy-transfer-btns"></div></div>',
            item: '<div class="jy-transfer-item" data-key="<%-key%>">\
                <div class="jy-transfer-checkbox" data-key="<%-key%>"><span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span><span><%-(title||"&nbsp;")%></span></div>\
            </div>',
            leftBtn: '<div class="jy-transfer-btn">' + leftIcon + '</div>',
            rightBtn: '<div class="jy-transfer-btn">' + rightIcon + '</div>'
        }
        var transferClass = {
            transfer: 'jy-transfer',
            left: 'jy-transfer-left',
            right: 'jy-transfer-right',
            leftBody: 'jy-transfer-left-body',
            rightBody: 'jy-transfer-right-body',
            item: 'jy-transfer-item',
            title: 'jy-transfer-title',
            search: 'jy-transfer-search',
            btns: 'jy-transfer-btns',
            btn: 'jy-transfer-btn',
            activeBtn: 'jy-transfer-btn-active',
            checkbox: 'jy-transfer-checkbox',
            checked: 'jy-transfer-checked',
            disabled: 'jy-transfer-disabled',
            checkedDisabled: 'jy-tree-checked-disabled',
            empty: 'jy-transfer-empty'
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
            this.stretch = this.option.stretch || false;
            this.width = this.option.width || 200;
            this.height = this.option.height || 320;
            this.search = this.option.search || false;
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
            this.$elem = this.$elem.length ? this.$elem : $docBody;
            this.leftData = Object.assign([], this.option.data);
            this.rightData = Object.assign([], this.option.value);
            this.$transfer = $(tpl.transfer);
            this.$left = $(Common.htmlTemplate(tpl.left, {
                title: this.option.leftTitle || '列表1'
            }));
            this.$right = $(Common.htmlTemplate(tpl.right, {
                title: this.option.rightTitle || '列表2'
            }));
            this.$leftBody = this.$left.children('.' + transferClass.leftBody);
            this.$rightBody = this.$right.children('.' + transferClass.rightBody);
            this.$leftTitle = this.$left.children('.' + transferClass.title);
            this.$rightTitle = this.$right.children('.' + transferClass.title);
            this.$leftSearch = this.$left.children('.' + transferClass.search);
            this.$rightSearch = this.$right.children('.' + transferClass.search);
            this.$leftBtn = $(tpl.leftBtn);
            this.$rightBtn = $(tpl.rightBtn);
            this.$center = $(tpl.center);
            this.idKeyMap = {};
            this.dataMap = {};
            this.key = 1;
            this.showList = [];
            this.appendItem(this.leftData, this.$leftBody);
            this.appendItem(this.rightData, this.$rightBody);
            this.setAllChecked();
            this.setBtnActive();
            this.setEmpty();
            if (this.stretch) {
                this.width = this.$elem[0].clientWidth || this.$elem[0].offsetWidth;
                this.width = (this.width - 84) / 2;
            }
            if (this.search) {
                this.$leftSearch.show();
                this.$rightSearch.show();
            }
            this.$left.css({
                'width': this.width,
                'height': this.height
            });
            this.$center.css({
                'height': this.height
            });
            this.$right.css({
                'width': this.width,
                'height': this.height
            });
            this.$center.children('.' + transferClass.btns).append(this.$rightBtn).append(this.$leftBtn);
            this.$transfer.append(this.$left);
            this.$transfer.append(this.$center);
            this.$transfer.append(this.$right);
            this.$elem.append(this.$transfer);
            this.bindEvent();
        }

        // 重载
        Class.prototype.reload = function (option) {
            this.option = Object.assign({}, option || {});
            this.$transfer.remove();
            this.render();
        }

        // 生成菜单树
        Class.prototype.appendItem = function (data, $parent) {
            var that = this;
            data.map(function (item) {
                item._jy_key = item._jy_key || that.key++;
                var $item = $(Common.htmlTemplate(tpl.item, {
                    title: item.title,
                    key: item._jy_key
                }));
                if (item.id !== undefined) {
                    that.idKeyMap[item.id] = item._jy_key;
                }
                that.dataMap[item._jy_key] = item;
                $parent.append($item);
                item._jy_hidden = false;
                item._jy_checked = item._jy_checked || item.checked && !item.disabled;
                item._jy_disabled = item._jy_disabled || item.disabled;
                if (item._jy_checked && item._jy_disabled) { //解决ie6及以下浏览器不支持并列类名增加优先级的bug
                    $item.addClass(transferClass.checkedDisabled);
                } else {
                    if (item._jy_checked) {
                        $item.addClass(transferClass.checked);
                    }
                    if (item._jy_disabled) {
                        $item.addClass(transferClass.disabled);
                    }
                }
            });
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            // 多选框事件
            this.$transfer.delegate('.' + transferClass.item, 'click', function () {
                var $this = $(this);
                var key = $this.attr('data-key');
                var data = that.dataMap[key];
                var checked = !data._jy_checked;
                // 禁用状态
                if (data._jy_disabled) {
                    return false;
                }
                if (checked) {
                    data._jy_checked = true;
                    $this.addClass(transferClass.checked);
                } else {
                    data._jy_checked = false;
                    $this.removeClass(transferClass.checked);
                }
                that.setAllChecked();
                that.setBtnActive();
                return false;
            });
            // 全选/全不选事件
            this.$transfer.delegate('.' + transferClass.title, 'click', function () {
                var $this = $(this);
                var checked = false;
                var $tansferBody = $this.parent('.' + transferClass.left).children('.' + transferClass.leftBody);
                var dataList = that.getEnable(that.leftData);
                if (!$tansferBody.length) {
                    $tansferBody = that.$rightBody;
                    dataList = that.getEnable(that.rightData);
                }
                checked = that.getChecked(dataList).length != dataList.length;
                checked ? $this.addClass(transferClass.checked) : $this.removeClass(transferClass.checked);
                dataList.map(function (item) {
                    if (!item._jy_disabled) {
                        item._jy_checked = checked;
                    }
                });
                $tansferBody.children('.' + transferClass.item).each(function (i, item) {
                    var $item = $(item);
                    var _data = that.dataMap[$item.attr('data-key')];
                    if (!_data._jy_disabled && !_data._jy_hidden) {
                        checked ? $item.addClass(transferClass.checked) : $item.removeClass(transferClass.checked);
                    }
                });
                that.setBtnActive();
            });
            // 往左移动事件
            this.$leftBtn.on('click', function () {
                var checkedData = that.getChecked(that.rightData);
                if (checkedData.length) {
                    that.leftData = that.leftData.concat(checkedData);
                    that.rightData = that.rightData.filter(function (item) {
                        return !item._jy_checked
                    });
                    // 左侧搜索框有内容，需要过滤
                    checkedData.map(function (item) {
                        item._jy_checked = false;
                        if (that.leftSearchText && !that.searchMethod(that.leftSearchText, item)) {
                            item._jy_hidden = true;
                        } else {
                            item._jy_hidden = false;
                        }
                    });
                    that.$rightBody.children('.' + transferClass.checked).each(function (i, item) {
                        var $item = $(item);
                        var data = that.dataMap[$item.attr('data-key')];
                        $item.removeClass(transferClass.checked);
                        that.$leftBody.append($item);
                        data._jy_hidden && $item.hide();
                    });
                    $(this).removeClass(transferClass.activeBtn);
                    that.$leftTitle.removeClass(transferClass.checked);
                    that.$rightTitle.removeClass(transferClass.checked);
                    that.setEmpty();
                    // 触发change事件
                    that.trigger('change', {
                        data: that.rightData.map(function (item) {
                            return Common.delInnerProperty(item);
                        }),
                        dom: this
                    });
                    JyTransfer.trigger('change', {
                        data: that.rightData.map(function (item) {
                            return Common.delInnerProperty(item);
                        }),
                        dom: this
                    });
                }
            });
            // 往右移动事件
            this.$rightBtn.on('click', function () {
                var checkedData = that.getChecked(that.leftData);
                if (checkedData.length) {
                    that.rightData = that.rightData.concat(checkedData);
                    that.leftData = that.leftData.filter(function (item) {
                        return !item._jy_checked
                    });
                    checkedData.map(function (item) {
                        item._jy_checked = false;
                        // 右侧搜索框有内容，需要过滤
                        if (that.rightSearchText && !that.searchMethod(that.rightSearchText, item)) {
                            item._jy_hidden = true;
                        } else {
                            item._jy_hidden = false;
                        }
                    });
                    that.$leftBody.children('.' + transferClass.checked).each(function (i, item) {
                        var $item = $(item);
                        var data = that.dataMap[$item.attr('data-key')];
                        $item.removeClass(transferClass.checked);
                        that.$rightBody.append($item);
                        data._jy_hidden && $item.hide();
                    });
                    $(this).removeClass(transferClass.activeBtn);
                    that.$leftTitle.removeClass(transferClass.checked);
                    that.$rightTitle.removeClass(transferClass.checked);
                    that.setEmpty();
                    // 触发change事件
                    that.trigger('change', {
                        data: that.rightData.map(function (item) {
                            return Common.delInnerProperty(item);
                        }),
                        dom: this
                    });
                    JyTransfer.trigger('change', {
                        data: that.rightData.map(function (item) {
                            return Common.delInnerProperty(item);
                        }),
                        dom: this
                    });
                }
            });
            // 左边搜索框搜索事件
            this.$leftSearch.find('input').on('input propertychange', function () {
                that.leftSearchText = this.value;
                clearTimeout(that.bindEvent.inputTimer);
                that.bindEvent.inputTimer = setTimeout(function () {
                    that.leftData.map(function (item) {
                        if (that.leftSearchText && !that.searchMethod(that.leftSearchText, item)) {
                            item._jy_hidden = true;
                        } else {
                            item._jy_hidden = false;
                        }
                    });
                    that.$leftBody.children('.' + transferClass.item).each(function (i, item) {
                        var $item = $(item);
                        var data = that.dataMap[$item.attr('data-key')];
                        data._jy_hidden ? $item.hide() : $item.show();
                    });
                    that.setAllChecked();
                    that.setBtnActive();
                }, 50);
            });
            // 右边搜索框搜索事件
            this.$rightSearch.find('input').on('input propertychange', function () {
                that.rightSearchText = this.value;
                clearTimeout(that.bindEvent.inputTimer);
                that.bindEvent.inputTimer = setTimeout(function () {
                    that.leftData.map(function (item) {
                        if (that.rightSearchText && !that.searchMethod(that.rightSearchText, item)) {
                            item._jy_hidden = true;
                        } else {
                            item._jy_hidden = false;
                        }
                    });
                    that.$rightBody.children('.' + transferClass.item).each(function (i, item) {
                        var $item = $(item);
                        var data = that.dataMap[$item.attr('data-key')];
                        data._jy_hidden ? $item.hide() : $item.show();
                    });
                    that.setAllChecked();
                    that.setBtnActive();
                });
            });
        }

        // 按钮是否可用
        Class.prototype.setBtnActive = function () {
            if (this.getChecked(this.leftData).length > 0) {
                this.$rightBtn.addClass(transferClass.activeBtn);
            } else {
                this.$rightBtn.removeClass(transferClass.activeBtn);
            }
            if (this.getChecked(this.rightData).length > 0) {
                this.$leftBtn.addClass(transferClass.activeBtn);
            } else {
                this.$leftBtn.removeClass(transferClass.activeBtn);
            }
        }

        // 全选框是否选中
        Class.prototype.setAllChecked = function () {
            var checkedData = null;
            var enableData = null;
            checkedData = this.getChecked(this.leftData);
            enableData = this.getEnable(this.leftData);
            if (checkedData.length == enableData.length && enableData.length) {
                this.$leftTitle.addClass(transferClass.checked);
            } else {
                this.$leftTitle.removeClass(transferClass.checked);
            }
            checkedData = this.getChecked(this.rightData);
            enableData = this.getEnable(this.rightData);
            if (checkedData.length == enableData.length && enableData.length) {
                this.$rightTitle.addClass(transferClass.checked);
            } else {
                this.$rightTitle.removeClass(transferClass.checked);
            }
        }

        // 列表是否为空
        Class.prototype.setEmpty = function () {
            var $empty = this.$leftBody.children('.' + transferClass.empty);
            if (this.leftData.length) {
                $empty.hide();
            } else {
                $empty.show();
            }
            $empty = this.$rightBody.children('.' + transferClass.empty);
            if (this.rightData.length) {
                $empty.hide();
            } else {
                $empty.show();
            }
        }

        // 通过id获取key
        Class.prototype.getKeyById = function (id) {
            return this.idKeyMap[id];
        }

        // 获取选中的数据
        Class.prototype.getChecked = function (data) {
            var result = data.filter(function (item) {
                return item._jy_checked && !item._jy_hidden;
            });
            return result;
        }

        // 获取可用的数据
        Class.prototype.getEnable = function (data) {
            var result = data.filter(function (item) {
                return !item._jy_disabled && !item._jy_hidden;
            });
            return result;
        }

        // 获取移动的数据
        Class.prototype.getTransfered = function (data) {
            var result = [];
            this.rightData.map(function (item) {
                result.push(Common.delInnerProperty({}, item));
            });
            return result;
        }

        var event = Common.getEvent();
        var JyTransfer = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var transfer = new Class(option);
                return {
                    on: transfer.on,
                    once: transfer.once,
                    trigger: transfer.trigger,
                    reload: function (option) {
                        transfer.reload(option);
                    },
                    destroy: function () {
                        transfer.$transfer.remove();
                    },
                    getData: function () {
                        return transfer.value.map(function (item) {
                            return Common.delInnerProperty(item);
                        });
                    }
                }
            }
        }

        return JyTransfer;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Transfer = factory(window.$, window.JyUi.Common);
    }
})(window)