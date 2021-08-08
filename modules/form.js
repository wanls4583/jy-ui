/*
 * @Author: lisong
 * @Date: 2021-04-27 12:40:07
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var checkedIcon = '&#xe737;';
        var downIcon = '&#xe74b;';
        var radioedIcon = '&#xe61c;';
        var radioIcon = '&#xe619;';
        var ieVersion = Common.getIeVersion();
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
        var bindedBodyEvent = false;
        var formClass = {
            switchClass: 'song-form-switch',
            switchDisabled: 'song-switch-disabled',
            switchChecked: 'song-switch-checked',
            radio: 'song-form-radio',
            radioDisabled: 'song-radio-disabled',
            radioChecked: 'song-radio-checked',
            checkbox: 'song-form-checkbox',
            checkboxDisabled: 'song-checkbox-disabled',
            checkboxCheckd: 'song-checkbox-checked',
            checkboxCheckedDisabled: 'song-checkbox-checked-disabled',
            select: 'song-form-select',
            selectOpen: 'song-form-select-open',
            selectTitle: 'song-select-title',
            selectBody: 'song-select-dl',
            selectHolder: 'song-color-holder',
            selectDisabled: 'song-select-disabled',
            selectActive: 'song-select-active',
            selectAnimation: 'song-form-animation-hover-down'
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

        function Class() {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.init();
        }

        // 初始化
        Class.prototype.init = function () {
            var that = this;
            $(docBody).delegate('button[type="submit"]', 'click', function () {
                var $form = $(this).parents('form');
                var filter = $(this).attr('song-filter');
                if ($form.length & that.verify($form)) {
                    var data = that.getJsonFromForm($form);
                    if (filter) {
                        that.trigger('submit(' + filter + ')', data);
                    }
                    that.trigger('submit', data);
                }
            });
        }

        // 验证
        Class.prototype.verify = function (formId) {
            var $form = $(formId || 'form');
            var pass = true;
            var dangerClass = 'song-border-danger';
            $form.find('input,textarea').each(function (i, input) {
                if (input.type == 'text' || input.type == 'password' || input.tagName.toLowerCase() == 'textarea') {
                    var $input = $(input);
                    var verifyRules = $input.attr('song-verify') || '';
                    verifyRules = verifyRules.split('|');
                    for (var i = 0; i < verifyRules.length; i++) {
                        var verifyRule = verifyRules[verifyRules[i]];
                        if (pass && verifyRule) {
                            pass = verifyRule.verify ? verifyRule.verify($input.val()) : verifyRule.rule.test($input.val());
                            if (!pass) {
                                window.SongUi && window.SongUi.Dialog && window.SongUi.Dialog.msg(verifyRule.msg, {
                                    icon: 'error'
                                });
                                $input.addClass(dangerClass);
                            } else {
                                $input.removeClass(dangerClass);
                            }
                        }
                    }
                }
            });
            pass && $form.find('select').each(function (i, select) {
                var $select = $(select);
                var verifyRule = $select.attr('song-verify');
                if (verifyRules[verifyRule]) {
                    var pass = verifyRules[verifyRule]($select.val());
                    if (!pass) {
                        select.$ui && select.$ui.find('input.song-input').addClass(dangerClass);
                    } else {
                        select.$ui && select.$ui.find('input.song-input').removeClass(dangerClass);
                    }
                }
            });
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
                var skin = $input.attr('song-skin');
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

        // 渲染页面ui
        Class.prototype.render = function (filter, container) {
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
                    this.renderSwitch(filter, container);
                    break;
                case 'radiao':
                    this.renderRadio(filter, container);
                    break;
                case 'checkbox':
                    this.renderCheckbox(filter, container);
                    break;
                case 'select':
                    this.renderSelect(filter, container);
                    break;
                default:
                    this.renderSwitch('', container);
                    this.renderRadio('', container);
                    this.renderCheckbox('', container);
                    this.renderSelect('', container);
            }
        }
        //渲染开关
        Class.prototype.renderSwitch = function (filter, container) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="checkbox"][song-skin="switch"]' + (filter ? '[song-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector);
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [formClass.switchClass];
                var text = 'OFF';
                // 忽略标签
                if (ignore) {
                    input.$ui && input.$ui.remove();
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
                if (input.$ui) {
                    input.$ui.attr('class', classNames.join(' '));
                    input.$ui.children('span').html(text);
                    return;
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <i></i>\
                        <span>' + text + '</span>\
                    </div>');
                $html.insertAfter(input);
                input.$ui = $html;
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
                var filter = $input.attr('song-filter');
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
        Class.prototype.renderRadio = function (filter, container) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="radio"]' + (filter ? '[song-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector)
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [formClass.radio];
                // 忽略标签
                if (ignore) {
                    input.$ui && input.$ui.remove();
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
                if (input.$ui) {
                    input.$ui.attr('class', classNames.join(' '));
                    return;
                }
                var html =
                    '<div class="' + classNames.join(' ') + '">\
                        <i class="song-radio-icon-checked">' + radioedIcon + '</i>\
                        <i class="song-radio-icon-uncheck">' + radioIcon + '</i>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>';
                var $html = $(html);
                $html.insertAfter(input);
                input.$ui = $html;
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
                var filter = $input.attr('song-filter');
                if ($input.prop('disabled')) {
                    return;
                }
                // 同组的radio取消选中
                $container[0].radios.map(function (radio) {
                    var $radio = $(radio);
                    if ($radio.attr('name') == name && $radio.attr('song-filter') == filter) {
                        radio.$ui.removeClass(formClass.radioChecked);
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
        Class.prototype.renderCheckbox = function (filter, container) {
            var that = this;
            var $container = $(container || docBody);
            var selector = 'input[type="checkbox"][song-skin!="switch"]' + (filter ? '[song-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                inputs = $container;
            } else {
                inputs = $container.find(selector);
            }
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [formClass.checkbox];
                var disabled = $input.prop('disabled');
                var checked = $input.prop('checked')
                // 忽略标签
                if (ignore) {
                    input.$ui && input.$ui.remove();
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
                if (input.$ui) {
                    input.$ui.attr('class', classNames.join(' '));
                    return;
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <span class="song-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>');
                $html.insertAfter(input);
                input.$ui = $html;
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
                var filter = $input.attr('song-filter');
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
                    if ($checkbox.attr('name') == name && $checkbox.attr('song-filter') == filter) {
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
            var selector = 'select' + (filter ? '[song-filter="' + filter + '"]' : '');
            if ($container.is(selector)) {
                selects = $container;
            } else {
                selects = $container.find(selector);
            }
            selects.each(function (i, select) {
                var $select = $(select);
                var ignore = $select.attr('song-ignore') === undefined ? false : true;
                var search = $select.attr('song-search') === undefined ? false : true;
                var classNames = [formClass.select];
                // 删除已经渲染过的ui
                select.$ui && select.$ui.remove();
                // 忽略标签
                if (ignore) {
                    return;
                }
                // 已禁用
                if ($select.prop('disabled')) {
                    classNames.push(formClass.selectDisabled);
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <div class="' + formClass.selectTitle + '">\
                            <input type="text" class="song-input" placeholder="请选择" ' + (search ? '' : 'readonly') + '>\
                            <i>' + downIcon + '</i>\
                        </div>\
                    </div>');
                var dlHtml = '<dl class="' + formClass.selectBody + '">';
                var $input = $html.find('input');
                $select.find('option').each(function (i, opt) {
                    var $opt = $(opt);
                    var text = $opt.text();
                    var value = $opt.val();
                    var classNames = [];
                    if (!text) {
                        classNames.push(formClass.selectHolder);
                    }
                    if ($select.val() == value) {
                        $input.attr('data-value', $select.val());
                        $input.val(text);
                        classNames.push(formClass.selectActive);
                    }
                    dlHtml += '<dd class="' + classNames.join(' ') + '" data-value="' + value + '">' + (text || '请选择') + '</dd>';
                });
                dlHtml += '</dl>';
                $html.append(dlHtml);
                $html.insertAfter($select);
                select.$ui = $html;
                $container[0].selects = $container[0].selects || [];
                $container[0].selects.push(select);
                docBody.selects = docBody.selects || [];
                docBody.selects.push(select);
                $select.hide();
                that.bindSelectEvent($html, $container);
            });
        }

        // 绑定下拉框事件
        Class.prototype.bindSelectEvent = function ($dom, $container) {
            var that = this;
            container = $container[0] === docBody ? false : $container[0];
            var $select = $dom.prev('select');
            var search = $select.attr('song-search') === undefined ? false : true;
            var $title = $dom.children('div.' + formClass.selectTitle);
            var $cont = $dom.children('dl.' + formClass.selectBody);
            var $input = $title.children('input.song-input');
            // 打开，收起事件
            $title.on('click', function () {
                if ($select.prop('disabled')) {
                    return;
                }
                if ($cont.is(':visible')) {
                    $title.trigger('blur');
                } else {
                    // 其他选择框都收起
                    $container[0].selects.map(function (select) {
                        var $ul = $(select).next('.' + formClass.select);
                        $ul.find('dl.' + formClass.selectBody).hide().removeClass(formClass.selectAnimation);
                        // 解决ie7及以下定位bugfix
                        $ul.removeClass(formClass.selectOpen);
                    });
                    $dom.addClass(formClass.selectOpen);
                    $cont.show().addClass(formClass.selectAnimation);
                    var rect = $title[0].getBoundingClientRect();
                    var winHeight = docElement.clientHeight || docBody.clientHeight;
                    var height = $cont[0].offsetHeight;
                    // 使下拉框在可视范围内
                    if (rect.bottom + 5 + height > winHeight && rect.top - 5 - height > 0) {
                        $cont.css('top', -height - 10);
                    } else {
                        $cont.css('top', '100%');
                    }
                }
                return false;
            });
            // 失去焦点，收起
            $title.on('blur', function () {
                var $dd = $cont.find('dd.' + formClass.selectActive);
                // 输入框显示已选中的项
                $input.val($dd.attr('data-value') && $dd.text() || '');
                $cont.hide().removeClass(formClass.selectAnimation);
                $dom.removeClass(formClass.selectOpen);
                setTimeout(function () {
                    $input.blur()
                }, 50);
            });
            // 选中事件
            $cont.find('dd').on('click', function () {
                var $this = $(this);
                var value = $this.attr('data-value');
                var filter = $select.attr('song-filter') || '';
                $cont.find('dd.' + formClass.selectActive).removeClass(formClass.selectActive);
                $this.addClass(formClass.selectActive);
                // 输入框显示已选中的项
                $input.val(value && $this.text() || '').attr('data-value', $this.attr('data-value'));
                $select.val(value);
                $cont.hide();
                // 触发select事件
                filter && that.trigger('select(' + filter + ')', {
                    data: value,
                    dom: $select[0]
                });
                that.trigger('select', {
                    data: value,
                    dom: $select[0]
                });
            });
            // 可搜索
            if (search) {
                $input.on('input propertychange', function () {
                    var title = $(this).val();
                    $cont.children('dd').each(function (i, dd) {
                        var $dd = $(dd);
                        if ($dd.text().indexOf(title) == -1) {
                            $dd.hide();
                        } else {
                            $dd.show();
                        }
                    });
                });
            }
            // 点击页面收起下拉框
            if (!bindedBodyEvent) {
                $(docBody).on('click', function (e) {
                    docBody.selects && docBody.selects.map(function (select) {
                        var $ui = $(select).next('.' + formClass.select);
                        if ($ui.is(':visible')) {
                            $ui.find('div.' + formClass.selectTitle).trigger('blur');
                        }
                    });
                });
                bindedBodyEvent = true;
            }
        }

        var instance = new Class();
        var Form = {
            on: instance.on,
            once: instance.once,
            trigger: instance.trigger,
            verifyRules: verifyRules,
            render: instance.render.bind(instance),
            verify: instance.verify,
            getJsonFromForm: instance.getJsonFromForm
        }

        $(function () {
            // 必须放在ready里面去执行，ie6-ie8浏览器刷新执行完js后有时会重新选择input刷新前的选中状态
            instance.init();
        });

        return Form;
    }

    if ("function" == typeof define && define.amd) {
        define("form", ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Form = factory(window.$, window.SongUi.Common);
    }
})(window)