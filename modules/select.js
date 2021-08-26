/*
 * @Author: lisong
 * @Date: 2021-08-24 17:05:26
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var downIcon = '&#xe74b;';
        var tpl = {
            select: '<div class="jy-select"></div>',
            title: '<div class="jy-select-title"><i class="jy-select-suffix">' + downIcon + '</i></div>',
            input: '<input class="jy-input" />',
            selectBody: '<div class="jy-select-body">\
                <div class="jy-select-empty">无匹配数据</div>\
                <div class="jy-select-loading">加载中...</div>\
            </div>',
            selectDl: '<dl class="jy-select-dl"></dl>'
        }
        var classNames = {
            select: 'jy-select',
            suggestion: 'jy-suggestion',
            selectSuffix: 'jy-select-suffix',
            selectOpen: 'jy-select-open',
            selectTitle: 'jy-select-title',
            selectBody: 'jy-select-body',
            selectDl: 'jy-select-dl',
            selectHolder: 'jy-color-holder',
            selectDisabled: 'jy-select-disabled',
            selectActive: 'jy-select-active',
            selectAnimation: 'jy-form-animation-hover-down',
            empty: 'jy-select-empty',
            loading: 'jy-select-loading'
        }
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
            this.data = this.option.data || [];
            this.disabled = this.option.disabled;
            this.titleKey = this.option.titleKey || 'title';
            this.valueKey = this.option.valueKey || 'value';
            this.placeHolder = this.option.placeHolder || '请选择';
            this.defaultOpen = this.option.defaultOpen;
            // 组件类型（select/input）
            this.type = this.option.type === 'input' ? 'input' : 'select';
            this.searchEnable = !this.disabled && this.option.search;
            this.searchMethod = this.option.searchMethod || function (value, cb) {
                var data = [];
                if (value) {
                    var reg = new RegExp(value, 'i');
                    data = that.data.filter(function (item) {
                        if (typeof item == 'object') {
                            if (reg.exec(item[that.titleKey])) {
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
            this.render();
        }

        Class.prototype.render = function () {
            var that = this;
            this.$select = $(tpl.select);
            this.$title = $(tpl.title);
            this.$input = $(tpl.input);
            this.$selectDl = $(tpl.selectDl);
            this.$selectBody = $(tpl.selectBody);
            this.$title.append(this.$input);
            this.$selectBody.append(this.$selectDl);
            this.$select.append(this.$title);
            this.$select.append(this.$selectBody);
            this.$elem.next('.' + classNames.select).remove();
            this.$select.insertAfter(this.$elem);
            this.$elem.hide();
            this.select(this.$elem.val());
            this.$empty = this.$selectBody.children('.' + classNames.empty);
            this.$loading = this.$selectBody.children('.' + classNames.loading);
            // input类型组件只提供搜索建议
            if (this.type === 'input') {
                this.$select.addClass(classNames.suggestion);
            }
            if (this.disabled) {
                this.$select.addClass(classNames.selectDisabled);
            } else {
                if (this.searchEnable) {
                    this.search();
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
            window.jyUiSelects.push(this.$select);
        }

        Class.prototype.renderItem = function (data) {
            var that = this,
                html = '',
                selectValue = this.$input.attr('data-value') || '';
            this.renderedData = data;
            data.map(function (item) {
                var title, value, dClass = [];
                if (typeof item === 'object') {
                    title = item[that.titleKey];
                    value = item[that.valueKey];
                } else {
                    title = item;
                    value = item;
                }
                title = title || '';
                value = value || '';
                if (value == selectValue) {
                    dClass.push(classNames.selectActive);
                    that.$input.attr('data-value', value);
                }
                if (!value) {
                    that.placeHolder = title || that.placeHolder;
                    dClass.push(classNames.selectHolder);
                }
                html += '<dd class="' + dClass.join(' ') + '" data-value="' + value + '">' + (title || that.placeHolder) + '</dd>';
            });
            this.$selectDl.html(html);
            this.$input.attr('placeholder', this.placeHolder);
            this.setPosition();
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
            }
        }

        Class.prototype.setPosition = function () {
            var rect = this.$title[0].getBoundingClientRect();
            var winHeight = docElement.clientHeight || docBody.clientHeight;
            var height = this.$selectBody[0].offsetHeight;
            // 使下拉框在可视范围内
            if (rect.bottom + 5 + height > winHeight && rect.top - 5 - height > 0) {
                this.$selectBody.css('top', -height - 10);
            } else {
                this.$selectBody.css('top', '100%');
            }
        }

        // 选中
        Class.prototype.select = function (value) {
            var that = this;
            var finded = false;
            value = value || '';
            this.$input.attr('data-value', value);
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
                var value = item[that.valueKey];
                that.$selectDl.children('dd.' + classNames.selectActive).removeClass(classNames.selectActive);
                that.$selectDl.children('dd[data-value="' + value + '"]').addClass(classNames.selectActive);
                if (that.type === 'input') {
                    // 搜索建议组件的值即为输入的值
                    that.$input.val(item[that.titleKey] || '');
                    that.$elem.val(item[that.titleKey] || '');
                } else {
                    that.$elem.val(value);
                    that.$input.val(value && item[that.titleKey] || '');
                }
            }
        }

        // 搜索
        Class.prototype.search = function () {
            var title = this.$input.val();
            var that = this;
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                that.$empty.hide();
                that.$selectDl.empty();
                if (that.type === 'input') {
                    // 搜索建议组件不显示加载提示
                    that.$selectBody.css('visibility', 'hidden');
                } else {
                    that.$loading.show();
                }
                that.searchMethod(title, function (data) {
                    data = data || [];
                    that.renderItem(data);
                    that.$loading.hide();
                });
            }, 100);
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
                        // 其他选择框都收起
                        window.jyUiSelects.map(function ($select) {
                            $select.children('.' + classNames.selectBody).hide().removeClass(classNames.selectAnimation);
                            // 解决ie7及以下定位bugfix
                            $select.removeClass(classNames.selectOpen);
                        });
                        $select.addClass(classNames.selectOpen);
                        $selectBody.show().addClass(classNames.selectAnimation);
                        that.setPosition();
                    }
                    return false;
                });
                // 失去焦点，收起
                this.$title.on('blur', function () {
                    var $dd = that.$selectDl.children('dd.' + classNames.selectActive);
                    var value = $dd.attr('data-value');
                    // 输入框显示已选中的项
                    if (that.type !== 'input') {
                        $input.val(value && $dd.text() || '');
                    }
                    $selectBody.hide().removeClass(classNames.selectAnimation);
                    $select.removeClass(classNames.selectOpen);
                    that.searchEnable && that.search();
                    setTimeout(function () {
                        $input.blur()
                    }, 50);
                });
            }
            // 选中事件
            $selectBody.delegate('dd', 'click', function () {
                var $this = $(this);
                var value = $this.attr('data-value');
                var filter = that.$elem.attr('jy-filter') || '';
                that.select(value);
                $selectBody.hide();
                that.searchEnable && that.search();
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
                    window.jyUiSelects.map(function ($select) {
                        var $selectBody = $select.children('div.' + classNames.selectBody);
                        if ($selectBody.is(':visible')) {
                            $select.find('div.' + classNames.selectTitle).trigger('blur');
                            $selectBody.hide();
                        }
                    });
                });
                bindedBodyEvent = true;
            }
        }

        var JySelect = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var tab = new Class(option);
                return {
                    on: tab.on,
                    once: tab.once,
                    trigger: tab.trigger
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