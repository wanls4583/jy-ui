/*
 * @Author: lisong
 * @Date: 2021-08-24 17:05:26
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var checkedIcon = '&#xe737;';
        var tpl = {
            select: '<div class="jy-select"></div>',
            title: '<div class="jy-select-title"><i class="jy-select-suffix">' + downIcon + '</i></div>',
            tags: '<div class="jy-select-tags"></div>',
            tag: '<div class="jy-select-tag"><%-tag%></div>',
            input: '<input class="jy-input" />',
            selectBody: '<div class="jy-select-body">\
                <div class="jy-select-empty">无匹配数据</div>\
                <div class="jy-select-loading">加载中...</div>\
            </div>',
            selectDl: '<dl class="jy-select-dl"></dl>',
            checkbox: '<div class="jy-checkbox">\
                <span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                <span><%-label%></span>\
            </div>'
        }
        var classNames = {
            select: 'jy-select',
            suggestion: 'jy-suggestion',
            multi: 'jy-multi-select',
            selectSuffix: 'jy-select-suffix',
            selectOpen: 'jy-select-open',
            selectTitle: 'jy-select-title',
            searIcon: 'jy-select-search-suffix',
            selectBody: 'jy-select-body',
            selectDl: 'jy-select-dl',
            selectHolder: 'jy-color-holder',
            selectDisabled: 'jy-select-disabled',
            selectActive: 'jy-select-active',
            selectAnimation: 'jy-form-animation-hover-down',
            empty: 'jy-select-empty',
            loading: 'jy-select-loading'
        }
        var ieVersion = Common.getIeVersion();
        var event = Common.getEvent();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var bindedBodyEvent = false;
        window.jyUiSelects = window.jyUiSelects || [];

        // 页码类
        function Class(option) {
            var that = this;
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = Common.deepAssign({}, option);
            this.$elem = $(this.option.elem);
            // 配置参数-begin
            this.type = this.option.type === 'input' ? 'input' : 'select'; //组件类型（select/input）
            this.disabled = this.option.disabled;
            this.valueKey = this.option.valueKey || 'value';
            this.labelKey = this.option.labelKey || (this.type === 'input' ? this.valueKey : 'label');
            this.placeholder = this.option.placeholder || '请选择';
            this.defaultOpen = this.option.defaultOpen;
            this.selectAble = this.option.selectAble === undefined ? true : this.option.selectAble;
            this.multiselect = this.type === 'select' && this.option.multiselect;
            this.searchEnable = !this.disabled && (this.type == 'input' || this.option.search);
            this.focus = this.option.focus;
            this.appendTo = this.option.appendTo === 'body' ? 'body' : 'input'; //下拉框的容器
            this.searchMethod = this.option.searchMethod || function (value, cb) {
                var data = [];
                if (value) {
                    var reg = new RegExp(value, 'i');
                    data = that.data.filter(function (item) {
                        if (typeof item == 'object') {
                            if (reg.exec(item[that.labelKey])) {
                                return true;
                            }
                        } else {
                            if (reg.exec(item)) {
                                return true;
                            }
                        }
                        return false;
                    });
                } else {
                    data = that.data;
                }
                cb(data);
            }
            this.data = this.option.data || [];
            // 配置参数-end
            this.data = this.data.map(function (item) {
                if (typeof item != 'object') {
                    return {
                        label: item,
                        value: item
                    }
                }
                return item;
            });
            // 多选记录
            this.tags = [];
            this.selectValue = this.$elem.val() || '';
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.$select = $(tpl.select);
            this.$title = $(tpl.title);
            this.$tags = $(tpl.tags);
            this.$input = $(tpl.input);
            this.$selectDl = $(tpl.selectDl);
            this.$selectBody = $(tpl.selectBody);
            this.$title.append(this.$input);
            this.$title.append(this.$tags);
            this.$selectBody.append(this.$selectDl);
            this.$select.append(this.$title);
            this.$select.append(this.$selectBody);
            this.$elem.next('.' + classNames.select).remove();
            this.$select.insertAfter(this.$elem);
            this.$elem.hide();
            this.select(this.$elem.val());
            this.$empty = this.$selectBody.children('.' + classNames.empty);
            this.$loading = this.$selectBody.children('.' + classNames.loading);
            if (this.appendTo === 'body') {
                $(docBody).append(this.$selectBody);
                this.$selectBody.css('width', this.$title[0].offsetWidth);
            }
            // input类型组件只提供搜索建议
            if (this.type === 'input') {
                this.$input.val(this.selectValue);
                this.$select.addClass(classNames.suggestion);
            }
            if (this.multiselect) {
                this.$select.addClass(classNames.multi);
            }
            if (this.disabled) {
                this.$select.addClass(classNames.selectDisabled);
            } else {
                if (this.searchEnable) {
                    this.search(true);
                } else {
                    that.renderItem(this.data);
                }
                if (!this.defaultOpen) {
                    this.$selectBody.hide();
                }
                this.bindEvent();
            }
            if (!this.searchEnable) {
                this.$input.attr('readonly', true);
            }
            if (this.focus) {
                setTimeout(function() {
                    that.$input.trigger('focus');
                }, 100);
            }
            window.jyUiSelects.push(this);
        }

        Class.prototype.renderItem = function (data) {
            var that = this;
            var html = '';
            var tags = [];
            this.renderedData = data;
            data.map(function (item) {
                var dClass = [];
                var label = item[that.labelKey] || '';
                var value = item[that.valueKey] || '';
                var labelHtml = '';
                item[that.labelKey] = label;
                item[that.valueKey] = value;
                if (that.type === 'input') {
                    label = value;
                }
                if (that.multiselect) {
                    if (item.selected) { //默认选中
                        dClass.push(classNames.selectActive);
                        item.selected = false;
                        tags.push(item);
                    } else {
                        for (var i = 0; i < that.tags.length; i++) {
                            if (that.tags[i][that.valueKey] == value) {
                                dClass.push(classNames.selectActive);
                                break;
                            }
                        }
                    }
                } else {
                    if (item.selected) { //默认选中
                        item.selected = false;
                        that.selectValue = item[that.valueKey];
                        dClass.push(classNames.selectActive);
                    } else if (value == that.selectValue) {
                        dClass.push(classNames.selectActive);
                    }

                }
                if (!value) {
                    that.placeholder = label || that.placeholder;
                    dClass.push(classNames.selectHolder);
                }
                labelHtml = label || that.placeholder;
                if (that.multiselect) {
                    labelHtml = Common.htmlTemplate(tpl.checkbox, {
                        label: labelHtml
                    });
                }
                html += '<dd class="' + dClass.join(' ') + '" data-value="' + value + '">' + labelHtml + '</dd>';
            });
            this.$selectDl.html(html);
            this.setPosition();
            if (this.multiselect && tags.length) {
                this.tags = tags;
                this.renderTags();
            }
            if (this.type === 'input') {
                // 搜索建议组件，为空时需要隐藏面板
                if (!data.length) {
                    this.$selectBody.css('visibility', 'hidden');
                } else {
                    this.$selectBody.css('visibility', 'visible');
                }
            } else {
                if (!data.length) {
                    this.$empty.show();
                } else {
                    this.$empty.hide();
                }
                this.$input.attr('placeholder', this.placeholder);
            }
        }

        Class.prototype.renderTags = function () {
            var that = this;
            this.$tags.empty();
            this.tags.map(function (item) {
                that.$tags.append('<div class="jy-select-tag">' + item[that.labelKey] + '</div>');
            });
        }

        Class.prototype.setPosition = function () {
            var rect = this.$title[0].getBoundingClientRect();
            var winHeight = docElement.clientHeight || docBody.clientHeight;
            var dlHeight = this.$selectBody[0].offsetHeight;
            var titleHeight = this.$title[0].offsetHeight;
            // 使下拉框在可视范围内
            if (rect.bottom + 5 + dlHeight > winHeight && rect.top - 5 - dlHeight > 0) {
                if (this.appendTo === 'body') {
                    var offset = this.$title.offset();
                    this.$selectBody.css({
                        top: offset.top - dlHeight - 10,
                        left: offset.left
                    });
                } else {
                    this.$selectBody.css('top', -dlHeight - 10);
                }
            } else {
                if (this.appendTo === 'body') {
                    var offset = this.$title.offset();
                    this.$selectBody.css({
                        top: offset.top + titleHeight,
                        left: offset.left
                    });
                } else {
                    this.$selectBody.css('top', '100%');
                }
            }
            if (this.appendTo === 'body') {
                if (ieVersion <= 6) {
                    var ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                    var ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                    this.$selectBody.css({
                        marginTop: ie6MarginTop,
                        marginLeft: ie6MarginLeft
                    });
                }
            }
            var rect = this.$title[0].getBoundingClientRect();
        }

        // 选中
        Class.prototype.select = function (value) {
            var that = this;
            var finded = false;
            value = value || '';
            // 组件不可选中
            if (!this.selectAble) {
                return;
            }
            this.data.map(function (item) {
                if (item[that.valueKey] == value) {
                    _selct(item);
                    finded = true;
                }
            });
            // 自定义搜素的数据可能不在this.data中
            if (!finded && this.renderedData) {
                this.renderedData.map(function (item) {
                    if (item[that.valueKey] == value) {
                        _selct(item);
                    }
                });
            }

            function _selct(item) {
                var value = item[that.valueKey] || '';
                if (that.multiselect) {
                    that.$selectDl.children('dd[data-value="' + value + '"]').toggleClass(classNames.selectActive);
                } else {
                    that.selectValue = value;
                    that.$selectDl.children('dd.' + classNames.selectActive).removeClass(classNames.selectActive);
                    that.$selectDl.children('dd[data-value="' + value + '"]').addClass(classNames.selectActive);
                }
                if (that.type === 'input') {
                    // 搜索建议组件的值即为输入的值
                    that.$input.val(item[that.valueKey] || '');
                    that.$elem.val(item[that.valueKey] || '');
                } else if (that.multiselect) {
                    // 多选情况下，只做选中处理
                    var index = -1;
                    var values = null;
                    for (var i = 0; i < that.tags.length; i++) {
                        if (that.tags[i][that.valueKey] == value) {
                            index = i;
                            break;
                        }
                    }
                    if (index == -1) {
                        that.tags.push(item);
                    } else {
                        that.tags.splice(index, 1);
                    }
                    values = that.tags.map(function (item) {
                        return item[that.valueKey];
                    });
                    that.$elem.val(values.join(','));
                    that.renderTags();
                } else {
                    that.$elem.val(value);
                    that.$input.val(value && item[that.labelKey] || '');
                }
            }
        }

        // 搜索
        Class.prototype.search = function (immediately) {
            var label = this.$input.val();
            var that = this;
            clearTimeout(this.timer);
            if (immediately) {
                _search();
            } else {
                this.timer = setTimeout(function () {
                    _search();
                }, 100);
            }

            function _search() {
                that.$empty.hide();
                that.$selectDl.empty();
                if (that.type === 'input') {
                    // 搜索建议组件不显示加载提示
                    that.$selectBody.css('visibility', 'hidden');
                } else {
                    that.$loading.show();
                }
                that.searchMethod(label, function (data) {
                    data = data || [];
                    that.renderItem(data);
                    that.$loading.hide();
                });
            }
        }

        Class.prototype.hideOther = function (all) {
            var that = this;
            // 其他选择框都收起
            window.jyUiSelects.map(function (instance) {
                if (all || instance != that) {
                    if (instance.$selectBody.is(':visible')) {
                        instance.$title.trigger('blur');
                        instance.$selectBody.hide();
                    }
                }
            });
        }

        // 绑定下拉框事件
        Class.prototype.bindEvent = function () {
            var that = this;
            var $select = this.$select;
            var $selectBody = this.$selectBody;
            var $input = this.$input;
            if (this.type === 'input') {
                this.$input.on('focus', function () {
                    $selectBody.show();
                    $select.addClass(classNames.selectOpen);
                    that.hideOther();
                    that.setPosition();
                });
            } else {
                // 打开，收起事件
                this.$title.on('click', function () {
                    if ($select.prop('disabled')) {
                        return;
                    }
                    if ($selectBody.is(':visible')) {
                        that.$title.trigger('blur');
                    } else {
                        that.hideOther();
                        $select.addClass(classNames.selectOpen);
                        $selectBody.show().addClass(classNames.selectAnimation);
                        that.setPosition();
                        // 多选情况下，显示搜索输入框
                        if (that.multiselect) {
                            that.$input.show().focus();
                            that.$tags.hide();
                        }
                    }
                    return false;
                });
            }
            // 失去焦点，收起
            this.$title.on('blur', function () {
                // 输入框显示已选中的项
                if (that.type !== 'input') {
                    // 多选情况下只隐藏搜索输入框
                    if (that.multiselect) {
                        that.$input.hide();
                        that.$tags.show();
                    } else {
                        var $dd = that.$selectDl.children('dd.' + classNames.selectActive);
                        that.$input.val(that.selectValue && $dd.text() || '');
                    }
                }
                $selectBody.hide().removeClass(classNames.selectAnimation);
                $select.removeClass(classNames.selectOpen);
                that.searchEnable && that.search();
                setTimeout(function () {
                    that.$input.blur();
                }, 50);
            });
            // 选中事件
            $selectBody.delegate('dd', 'click', function () {
                var $this = $(this);
                var value = $this.attr('data-value');
                var filter = that.$elem.attr('jy-filter') || '';
                that.select(value);
                // 多选情况下不做处理
                if (!that.multiselect) {
                    $selectBody.hide();
                    $select.removeClass(classNames.selectOpen);
                    that.searchEnable && that.search();
                }
                // 触发select事件
                filter && that.trigger('select(' + filter + ')', {
                    data: value,
                    dom: $select[0]
                });
                that.trigger('select', {
                    data: value,
                    dom: $select[0]
                });
                return false;
            });
            $select.on('click', function () {
                return false;
            });
            // 可搜索
            if (that.searchEnable) {
                $input.on('input propertychange', function () {
                    if (that.type === 'input') {
                        that.$elem.val(this.value);
                    }
                    that.search();
                });
            }
            // 点击页面收起下拉框
            if (!bindedBodyEvent) {
                $(docBody).on('click', function (e) {
                    that.hideOther(true);
                });
                bindedBodyEvent = true;
            }
        }

        var JySelect = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var select = new Class(option);
                return {
                    on: select.on,
                    once: select.once,
                    trigger: select.trigger,
                    select: select.select.bind(select)
                }
            }
        }

        return JySelect;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Select = factory(window.$, window.JyUi.Common);
    }
})(window)