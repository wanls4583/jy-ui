/*
 * @Author: lijy
 * @Date: 2021-04-27 12:40:07
 * @Description: 
 */
!(function (window) {
    function factory($, Common, Select, Dialog) {
        var checkedIcon = '&#xe737;';
        var radioedIcon = '&#xe61c;';
        var radioIcon = '&#xe619;';
        var errorIcon = '&#xe60b;';
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var ieVersion = Common.getIeVersion();
        var formClass = {
            switchClass: 'jy-switch',
            switchDisabled: 'jy-switch-disabled',
            switchChecked: 'jy-switch-checked',
            radio: 'jy-radio',
            radioDisabled: 'jy-radio-disabled',
            radioChecked: 'jy-radio-checked',
            checkbox: 'jy-checkbox',
            checkboxDisabled: 'jy-checkbox-disabled',
            checkboxCheckd: 'jy-checkbox-checked',
            checkboxCheckedDisabled: 'jy-checkbox-checked-disabled',
            select: 'jy-select'
        }
        var tpl = {
            tip: '<div class="jy-form-tip"><i class="jy-form-tip-icon">' + errorIcon + '</i><span></span></div>'
        }
        var verifyRules = {
            required: {
                msg: '必填项不能为空',
                rule: /[\S]+/
            },
            number: {
                msg: '请输入数字',
                rule: /^\-?\d+(\.\d*)?$/
            },
            int: {
                msg: '请输入整数',
                rule: /^\-?\d+$/
            },
            date: {
                msg: '请输入正确的日期',
                rule: /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
            },
            phone: {
                msg: '请输入正确的手机号',
                rule: /^1(3|4|5|6|7|8|9)\d{9}$/
            },
            email: {
                msg: '请输入正确的邮箱',
                rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
            },
            identify: {
                msg: '请输入正确的身份证',
                rule: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/i
            },
            url: {
                rule: /^(#|(http(s?)):\/\/|\/\/)[^\s]+\.[^\s]+$/,
                msg: '请输入正确的链接'
            }
        };

        var customRules = {
            'max-250': {
                msg: '最多输入250个字符',
                verify: function (str) {
                    if (str && str.length > 250) {
                        return false;
                    }
                    return true;
                }
            }
        };

        function Class() {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
        }

        // 初始化
        Class.prototype.init = function () {
            var that = this;
            $(docBody).delegate('button[type="submit"]', 'click', function () {
                var $form = $(this).parents('form');
                var filter = $(this).attr('jy-filter');
                if ($form.length & that.verify($form)) {
                    var data = that.getJsonFromForm($form);
                    if (filter) {
                        that.trigger('submit(' + filter + ')', data);
                    }
                    that.trigger('submit', data);
                }
            });
        }

        Class.prototype.addRule = function (rules) {
            if (typeof rules === 'object') {
                Object(customRules, rules);
            }
        }

        // 验证
        Class.prototype.verify = function (formId, callback) {
            var that = this;
            var $form = $(formId || 'form');
            var pass = true;
            var msg = '';
            var dangerClass = 'jy-border-danger';
            $form.find('input,textarea,select').each(function (i, input) {
                var tagName = input.tagName.toLowerCase();
                if (input.type == 'text' || input.type == 'password' || tagName == 'textarea' || tagName == 'select') {
                    var $input = $(input);
                    var rules = $input.attr('jy-verify') || '';
                    var value = $input.val() || '';
                    rules = rules.split('|');
                    for (var i = 0; i < rules.length; i++) {
                        var verifyRule = customRules[rules[i]] || verifyRules[rules[i]];
                        if (pass && verifyRule) {
                            pass = verifyRule.verify ? verifyRule.verify(value) : verifyRule.rule.test(value);
                            if (!pass) {
                                that.showTip(verifyRule.msg);
                                msg = verifyRule.msg;
                                if (tagName == 'select') {
                                    $input.next('.' + formClass.select).children('.jy-select-title').addClass(dangerClass);
                                } else {
                                    $input.addClass(dangerClass);
                                }
                            } else {
                                if (tagName == 'select') {
                                    $input.next('.' + formClass.select).children('.jy-select-title').removeClass(dangerClass);
                                } else {
                                    $input.removeClass(dangerClass);
                                }
                            }
                        }
                    }
                }
            });
            callback && callback(pass, msg);
            return pass
        }

        // 获取表单数据
        Class.prototype.getJsonFromForm = function (formId) {
            var $form = $(formId);
            var data = {};
            $form.find('input').each(function (i, input) {
                var $input = $(input);
                var name = $input.attr('name');
                var value = $input.val();
                var skin = $input.attr('jy-skin');
                if (input.type == 'text' || input.type == 'hidden' || input.type == 'password') {
                    name && (data[name] = value);
                } else if (input.type == 'radio') {
                    if (!data[name]) {
                        data[name] = '';
                        $input.prop('checked') && name && (data[name] = value);
                    }
                } else if (input.type == 'checkbox') {
                    if (skin === 'switch') {
                        data[name] = $input.prop('checked');
                    } else {
                        data[name] = data[name] || [];
                        $input.prop('checked') && name && data[name].push(value);
                    }
                }
            });
            $form.find('select').each(function (i, select) {
                var $select = $(select);
                var name = $select.attr('name');
                var value = $select.val();
                name && (data[name] = value);
            });
            $form.find('textarea').each(function (i, textarea) {
                var $textarea = $(textarea);
                var name = $textarea.attr('name');
                var value = $textarea.val();
                name && (data[name] = value);
            });
            return data;
        }

        // 表单赋值
        Class.prototype.setData = function (form, data) {
            var $form = $(form);
            $form.find('input,textarea,select').each(function (i, dom) {
                var $dom = $(dom);
                var name = dom.name;
                var value = data[name];
                var tagName = dom.tagName.toLowerCase();
                if (value === undefined || value === null) {
                    return true;
                };
                value += '';
                if (tagName === 'select') {
                    $dom.val(value).find('option:selected').attr('selected', true);
                } else if (tagName === 'textarea') {
                    $dom.val(value).html(value);
                } else if (tagName === 'input') {
                    switch (dom.type) {
                        case 'checkbox':
                            if (value instanceof Array && value.indexOf(dom.value) > -1 || dom.value == value) {
                                dom.checked = true;
                                $dom.attr('checked', 'checked');
                                $dom.prop('checked', true);
                            } else {
                                $dom.removeAttr('checked');
                                $dom.prop('checked', false);
                            }
                            break;
                        case 'radio':
                            if (dom.value == value) {
                                $dom.attr('checked', 'checked');
                                $dom.prop('checked', true);
                            } else {
                                $dom.removeAttr('checked');
                                $dom.prop('checked', false);
                            }
                            break;
                        default:
                            $dom.attr('value', value);
                            $dom.val(value);
                    }
                }
            });
            Form.render('', $form);
        }

        // 清空表单数据
        Class.prototype.empty = function (formId) {
            var $form = $(formId);
            $form.find('input,textarea,select').each(function (i, dom) {
                var $dom = $(dom);
                var tagName = dom.tagName.toLowerCase();
                if (tagName === 'select') {
                    $dom.val('').find('option:selected').removeAttr('selected');
                } else if (tagName === 'textarea') {
                    $dom.val('').html('');
                } else if (tagName === 'input') {
                    switch (dom.type) {
                        case 'checkbox':
                            $dom.removeAttr('checked');
                            $dom.prop('checked', false);
                            break;
                        case 'radio':
                            $dom.removeAttr('checked');
                            $dom.prop('checked', false);
                            break;
                        default:
                            $dom.removeAttr('value');
                            $dom.val('');
                    }
                }
            });
            Form.render('', $form);
        }

        // 渲染页面ui
        Class.prototype.render = function (filter, container, refresh) {
            var tagName = '';
            if (filter) {
                var reg = /^(.+?)(?:\((.+)\))?$/;
                filter = filter && filter.toLowerCase() || '';
                reg = reg.exec(filter);
                tagName = reg && reg[1] || '';
                filter = reg && reg[2] || '';
            }
            switch (tagName) {
                case 'switch':
                    this.renderSwitch(filter, container, refresh);
                    break;
                case 'radiao':
                    this.renderRadio(filter, container, refresh);
                    break;
                case 'checkbox':
                    this.renderCheckbox(filter, container, refresh);
                    break;
                case 'select':
                    this.renderSelect(filter, container);
                    break;
                default:
                    this.renderSwitch('', container, refresh);
                    this.renderRadio('', container, refresh);
                    this.renderCheckbox('', container, refresh);
                    this.renderSelect('', container);
            }
        }
        //渲染开关
        Class.prototype.renderSwitch = function (filter, container, refresh) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="checkbox"][jy-skin="switch"]' + (filter ? '[jy-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector);
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('jy-ignore') === undefined ? false : true;
                var classNames = [formClass.switchClass];
                var text = 'OFF';
                var $ui = $input.next('.' + formClass.switchClass);
                // 忽略标签
                if (ignore) {
                    $ui.remove();
                    return;
                }
                // 已禁用
                if ($input.prop('disabled')) {
                    classNames.push(formClass.switchDisabled);
                }
                // 已选中
                if ($input.prop('checked')) {
                    classNames.push(formClass.switchChecked);
                    text = 'ON';
                }
                // 已经渲染过
                if ($ui.length) {
                    if (refresh) {
                        $ui.remove();
                    } else {
                        $ui.attr('class', classNames.join(' '));
                        $ui.children('span').html(text);
                        return;
                    }
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <i></i>\
                        <span>' + text + '</span>\
                    </div>');
                $html.insertAfter(input);
                $input.hide();
                that.bindSwitchEvent($html, $container);
            });
        }

        Class.prototype.bindSwitchEvent = function ($dom, $container) {
            var that = this;
            container = $container[0] === docBody ? false : $container[0];
            $dom.on('click', function () {
                var $this = $(this);
                var $input = $this.prev('input');
                var filter = $input.attr('jy-filter');
                var checked = $input.prop('checked');
                if ($input.prop('disabled')) {
                    return;
                }
                $input.prop('checked', !checked);
                $this.toggleClass(formClass.switchChecked);
                $this.find('span').html(checked ? 'OFF' : 'ON');
                // 触发switch事件
                filter && that.trigger('switch(' + filter + ')', {
                    data: $input.prop('checked'),
                    dom: $input[0]
                });
                that.trigger('switch', {
                    data: $input.prop('checked'),
                    dom: $input[0]
                });
            });
        }
        // 渲染单选按钮
        Class.prototype.renderRadio = function (filter, container, refresh) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="radio"]' + (filter ? '[jy-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector)
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('jy-ignore') === undefined ? false : true;
                var classNames = [formClass.radio];
                var $ui = $input.next('.' + formClass.radio);
                // 忽略标签
                if (ignore) {
                    $ui.remove();
                    return;
                }
                // 已禁用
                if ($input.prop('disabled')) {
                    classNames.push(formClass.radioDisabled);
                }
                // 已选中
                if ($input.prop('checked')) {
                    classNames.push(formClass.radioChecked);
                }
                // 已经渲染过
                if ($ui.length) {
                    if (refresh) {
                        $ui.remove();
                    } else {
                        $ui.attr('class', classNames.join(' '));
                        return;
                    }
                }
                var html =
                    '<div class="' + classNames.join(' ') + '">\
                        <i class="jy-radio-icon-checked">' + radioedIcon + '</i>\
                        <i class="jy-radio-icon-uncheck">' + radioIcon + '</i>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>';
                var $html = $(html);
                $html.insertAfter(input);
                $input.hide();
                $container[0].radios = $container[0].radios || [];
                $container[0].radios.push(input);
                if (inputs != $container) {
                    that.bindRadioEvent($html, $container);
                }
            });
        }

        // 绑定单选框事件
        Class.prototype.bindRadioEvent = function ($dom, $container) {
            var that = this;
            container = $container[0] === docBody ? false : $container[0];
            $dom.on('click', function () {
                var $this = $(this);
                var $input = $this.prev('input');
                var name = $input.attr('name');
                var filter = $input.attr('jy-filter');
                if ($input.prop('disabled')) {
                    return;
                }
                // 同组的radio取消选中
                $container[0].radios.map(function (radio) {
                    var $radio = $(radio);
                    if ($radio.attr('name') == name && $radio.attr('jy-filter') == filter) {
                        $radio.next('.' + formClass.radio).removeClass(formClass.radioChecked);
                    }
                });
                $this.addClass(formClass.radioChecked);
                $input.prop('checked', true);
                // 触发radio事件
                filter && that.trigger('radio(' + filter + ')', {
                    data: $input.val(),
                    dom: $input[0]
                });
                that.trigger('radio', {
                    data: $input.val(),
                    dom: $input[0]
                });
            });
        }

        // 渲染复选框
        Class.prototype.renderCheckbox = function (filter, container, refresh) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="checkbox"][jy-skin!="switch"]' + (filter ? '[jy-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector);
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('jy-ignore') === undefined ? false : true;
                var classNames = [formClass.checkbox];
                var disabled = $input.prop('disabled');
                var checked = $input.prop('checked');
                var $ui = $input.next('.' + formClass.checkbox);
                // 忽略标签
                if (ignore) {
                    $ui.remove();
                    return;
                }
                if (checked && disabled) {
                    classNames.push(formClass.checkboxCheckedDisabled);
                } else {
                    // 已禁用
                    if (disabled) {
                        classNames.push(formClass.checkboxDisabled);
                    }
                    // 已选中
                    if (checked) {
                        classNames.push(formClass.checkboxCheckd);
                    }
                }
                // 已经渲染过
                if ($ui.length) {
                    if (refresh) {
                        $ui.remove();
                    } else {
                        $ui.attr('class', classNames.join(' '));
                    }
                    return;
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>');
                $html.insertAfter(input);
                $input.hide();
                $container[0].checkboxs = $container[0].checkboxs || [];
                $container[0].checkboxs.push(input);
                if (inputs != $container) {
                    that.bindCheckboxEvent($html, $container);
                }
            });
        }

        // 绑定多选框事件
        Class.prototype.bindCheckboxEvent = function ($dom, $container) {
            var that = this;
            container = $container[0] === docBody ? false : $container[0];
            $dom.on('click', function () {
                var $this = $(this);
                var $input = $this.prev('input');
                var name = $input.attr('name');
                var filter = $input.attr('jy-filter');
                var checked = $input.prop('checked');
                var data = [];
                if ($input.prop('disabled')) {
                    return;
                }
                $this.toggleClass(formClass.checkboxCheckd);
                $input.prop('checked', !checked);
                // 获取同组的选中数据
                $container[0].checkboxs.map(function (checkbox) {
                    var $checkbox = $(checkbox);
                    if ($checkbox.attr('name') == name && $checkbox.attr('jy-filter') == filter) {
                        data.push($checkbox.val());
                    }
                });
                // 触发checkbox事件
                filter && that.trigger('checkbox(' + filter + ')', {
                    data: data,
                    dom: $input[0]
                });
                that.trigger('checkbox', {
                    data: data,
                    dom: $input[0]
                });
            });
        }

        // 渲染下拉选择框
        Class.prototype.renderSelect = function (filter, container) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'select' + (filter ? '[jy-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                selects = $container;
            } else {
                selects = $container.find(selector);
            }
            selects.each(function (i, select) {
                var data = [];
                var $select = $(select);
                var ignore = $select.attr('jy-ignore') === undefined ? false : true;
                var disabled = $select.prop('disabled');
                var search = $select.attr('jy-search') === undefined ? false : true;
                var placeholder = $select.attr('placeholder');
                var filter = $select.attr('jy-filter');
                if (!ignore) {
                    $select.find('option').each(function (i, option) {
                        var $option = $(option);
                        data.push({
                            label: $option.text(),
                            value: $option.attr('value')
                        });
                    });
                    var select = Select.render({
                        elem: select,
                        disabled: disabled,
                        search: search,
                        placeholder: placeholder,
                        data: data
                    });
                    filter && select.on('select(' + filter + ')', function (obj) {
                        that.trigger('select(' + filter + ')', obj)
                    });
                    select.on('select', function (obj) {
                        that.trigger('select', obj);
                    });
                }
            });
        }

        // 显示错误提示
        Class.prototype.showTip = function (tip) {
            var $tip = $(tpl.tip);
            var width = 0;
            var height = 0;
            var ie6MarginTop = 0;
            var ie6MarginLeft = 0;
            var winWidth = docElement.clientWidth || docBody.clientWidth;
            var winHeight = docElement.clientHeight || docBody.clientHeight;
            if (ieVersion <= 6) {
                ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
            }
            $tip.children('span').text(tip);
            $(docBody).append($tip);
            width = $tip[0].offsetWidth;
            height = $tip[0].offsetHeight;
            $tip.css({
                left: (winWidth - width) / 2,
                top: (winHeight - height) / 2,
                marginLeft: ie6MarginLeft,
                marginTop: ie6MarginTop
            });
            setTimeout(function () {
                $tip.remove();
            }, 1500);
        }

        var instance = new Class();
        var Form = {
            on: instance.on,
            once: instance.once,
            trigger: instance.trigger,
            verifyRules: verifyRules,
            render: instance.render.bind(instance),
            addRule: instance.addRule.bind(instance),
            verify: instance.verify.bind(instance),
            getJsonFromForm: instance.getJsonFromForm.bind(instance),
            setData: instance.setData.bind(instance),
            empty: instance.empty.bind(instance)
        }

        $(function () {
            // 必须放在ready里面去执行，ie6-ie8浏览器刷新执行完js后有时会重新选择input刷新前的选中状态
            instance.init();
        });

        return Form;
    }

    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common', './select'], function ($, Common, Select) {
            return factory($, Common, Select);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Form = factory(window.$, window.JyUi.Common, window.JyUi.Select);
    }
})(window)