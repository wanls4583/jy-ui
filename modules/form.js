/*
 * @Author: lisong
 * @Date: 2021-04-27 12:40:07
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var checkedIcon = '&#xe737;';
        var downIcon = '&#xe74b;';
        var radioIcon = '&#xe61c;';
        var radioedIcon = '&#xe619;';
        var switchClass = 'song-form-switch';
        var switchDisabled = 'song-switch-disabled';
        var switchChecked = 'song-switch-checked';
        var radioClass = 'song-form-radio';
        var radioDisabled = 'song-radio-disabled';
        var radioChecked = 'song-radio-checked';
        var checkboxClass = 'song-form-checkbox';
        var checkboxDisabled = 'song-checkbox-disabled';
        var checkboxCheckd = 'song-checkbox-checked';
        var selectClass = 'song-form-select';
        var selectTitle = 'song-select-title';
        var selectBody = 'song-select-dl';
        var selectHolder = 'song-color-holder';
        var selectDisabled = 'song-select-disabled';
        var selectActive = 'song-select-active';
        var event = Common.getEvent();
        var ieVersion = Common.getIeVersion();
        var Form = {
            init: init,
            render: render,
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            verify: verify,
            getJsonFromForm: getJsonFromForm,
            verifyRules: {
                required: {
                    msg: '必填项不能为空',
                    rule: /[\S]+/
                },
                number: {
                    msg: '请输入数字',
                    rule: /\-?\d+(\.\d*)?/
                },
                int: {
                    msg: '请输入整数',
                    rule: /\-?\d+/
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
            }
        }
        // 初始化
        function init() {
            $(document.body).delegate('button[type="submit"]', 'click', function () {
                var $form = $(this).parents('form');
                var filter = $(this).attr('song-filter');
                if ($form.length & Form.verify($form)) {
                    var data = Form.getJsonFromForm($form);
                    if (filter) {
                        Form.trigger('submit(' + filter + ')', data);
                    }
                    Form.trigger('submit', data);
                }
            });
        }
        // 验证
        function verify(formId) {
            var $form = $(formId || 'form');
            var pass = true;
            var dangerClass = 'song-border-danger';
            $form.find('input,textarea').each(function (i, input) {
                if (input.type == 'text' || input.type == 'password' || input.tagName.toLowerCase() == 'textarea') {
                    var $input = $(input);
                    var verifyRules = $input.attr('song-verify') || '';
                    verifyRules = verifyRules.split('|');
                    for (var i = 0; i < verifyRules.length; i++) {
                        var verifyRule = Form.verifyRules[verifyRules[i]];
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
                if (Form.verifyRules[verifyRule]) {
                    var pass = Form.verifyRules[verifyRule]($select.val());
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
        function getJsonFromForm(formId) {
            var $form = $(formId);
            var data = {};
            $form.find('input').each(function (i, input) {
                var $input = $(input);
                var name = $input.attr('name');
                var value = $input.val();
                if (input.type == 'text' || input.type == 'hidden' || input.type == 'password') {
                    name && (data[name] = value);
                } else if (input.type == 'radio') {
                    $input.prop('checked') && name && (data[name] = [value]);
                } else if (input.type == 'checkbox') {
                    $input.prop('checked') && name && (data[name] ? data[name].push(value) : data[name] = [value]);
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
        function render(filter) {
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
                    renderSwitch(filter);
                    break;
                case 'radiao':
                    renderRadio(filter);
                    break;
                case 'checkbox':
                    renderCheckbox(filter);
                    break;
                case 'select':
                    renderSelect(filter);
                    break;
                default:
                    renderSwitch();
                    renderRadio();
                    renderCheckbox();
                    renderSelect();
            }
        }
        //渲染开关
        function renderSwitch(filter) {
            var inputs = $('input[type="checkbox"][song-skin="switch"]' + (filter ? '[song-filter="' + filter + '"]' : ''));
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [switchClass];
                // 删除已经渲染过的ui
                input.$ui && input.$ui.remove();
                // 忽略标签
                if (ignore) {
                    return;
                }
                // 已禁用
                if ($input.prop('disabled')) {
                    classNames.push(switchDisabled);
                }
                // 已选中
                if ($input.prop('checked')) {
                    classNames.push(switchChecked);
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <i></i>\
                        <span>' + ($input.prop('checked') ? 'ON' : 'OFF') + '</span>\
                    </div>');
                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                $input.hide();
                input.renderedSongUi = true;
                _bindEvent($html);
            });

            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var filter = this.$input.attr('song-filter');
                    var checked = this.$input.prop('checked');
                    if (this.$input.prop('disabled')) {
                        return;
                    }
                    this.$input.prop('checked', !checked);
                    $this.toggleClass(switchChecked);
                    $this.find('span').html(checked ? 'OFF' : 'ON');
                    // 触发switch事件
                    filter && Form.trigger('switch(' + filter + ')', {
                        data: $this[0].$input.prop('checked'),
                        dom: $this[0].$input[0]
                    });
                    Form.trigger('switch', {
                        data: $this[0].$input.prop('checked'),
                        dom: $this[0].$input[0]
                    });
                });
            }
        }
        // 渲染单选按钮
        function renderRadio(filter) {
            var inputs = $('input[type="radio"]' + (filter ? '[song-filter="' + filter + '"]' : ''));
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [radioClass];
                // 删除已经渲染过的ui
                input.$ui && input.$ui.remove();
                // 忽略标签
                if (ignore) {
                    return;
                }
                // 已禁用
                if ($input.prop('disabled')) {
                    classNames.push(radioDisabled);
                }
                // 已选中
                if ($input.prop('checked')) {
                    classNames.push(radioChecked);
                }
                var html =
                    '<div class="' + classNames.join(' ') + '">\
                        <i>' + ($input.prop('checked') ? radioIcon : radioedIcon) + '</i>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>';
                var $html = $(html);
                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                $input.hide();
                input.renderedSongUi = true;
                _bindEvent($html);
            });
            //绑定事件
            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var name = $this[0].$input.attr('name');
                    var filter = this.$input.attr('song-filter');
                    if (this.$input.prop('disabled')) {
                        return;
                    }
                    // 同组的radio取消选中
                    $('div.' + radioClass).each(function (i, radio) {
                        var $_this = $(this);
                        if ($_this[0].$input.attr('name') == name && $_this[0].$input.attr('song-filter') == filter) {
                            $_this.removeClass(radioChecked).find('i').html(radioedIcon);
                        }
                    });
                    $this.addClass(radioChecked);
                    $this.find('i').html(radioIcon);
                    this.$input.prop('checked', true);
                    // 触发radio事件
                    filter && Form.trigger('radio(' + filter + ')', {
                        data: this.$input.val(),
                        dom: this.$input[0]
                    });
                    Form.trigger('radio', {
                        data: this.$input.val(),
                        dom: this.$input[0]
                    });
                });
            }
        }
        // 渲染复选框
        function renderCheckbox(filter) {
            var inputs = $('input[type="checkbox"][song-skin!="switch"]' + (filter ? '[song-filter="' + filter + '"]' : ''));
            inputs.each(function (i, input) {
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = [checkboxClass];
                // 删除已经渲染过的ui
                input.$ui && input.$ui.remove();
                // 忽略标签
                if (ignore) {
                    return;
                }
                // 已禁用
                if ($input.prop('disabled')) {
                    classNames.push(checkboxDisabled);
                }
                // 已选中
                if ($input.prop('checked')) {
                    classNames.push(checkboxCheckd);
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <i>' + ($input.prop('checked') ? checkedIcon : '') + '</i>\
                        <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                    </div>');
                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                $input.hide();
                input.renderedSongUi = true;
                _bindEvent($html);
            });

            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var name = this.$input.attr('name');
                    var filter = this.$input.attr('song-filter');
                    var checked = this.$input.prop('checked');
                    var data = [];
                    if (this.$input.prop('disabled')) {
                        return;
                    }
                    $this.toggleClass(checkboxCheckd);
                    $this.find('i').html(checked ? '' : checkedIcon);
                    this.$input.prop('checked', !checked);
                    // 获取同组的选中数据
                    $('div.' + checkboxCheckd).each(function (i, radio) {
                        var $_this = $(this);
                        if ($_this[0].$input.attr('name') == name && $_this[0].$input.attr('song-filter') == filter) {
                            data.push($_this[0].$input.val());
                        }
                    });
                    // 触发checkbox事件
                    filter && Form.trigger('checkbox(' + filter + ')', {
                        data: data,
                        dom: this.$input[0]
                    });
                    Form.trigger('checkbox', {
                        data: data,
                        dom: this.$input[0]
                    });
                });
            }
        }
        // 渲染下拉选择框
        function renderSelect(filter) {
            var selects = $('select' + (filter ? '[song-filter="' + filter + '"]' : ''));
            selects.each(function (i, select) {
                var $select = $(select);
                var ignore = $select.attr('song-ignore') === undefined ? false : true;
                var search = $select.attr('song-search') === undefined ? false : true;
                var classNames = [selectClass];
                // 删除已经渲染过的ui
                select.$ui && select.$ui.remove();
                // 忽略标签
                if (ignore) {
                    return;
                }
                // 已禁用
                if ($select.prop('disabled')) {
                    classNames.push(selectDisabled);
                }
                var $html = $(
                    '<div class="' + classNames.join(' ') + '">\
                        <div class="' + selectTitle + '">\
                            <input type="text" class="song-input" placeholder="请选择" ' + (search ? '' : 'readonly') + '>\
                            <i>' + downIcon + '</i>\
                        </div>\
                    </div>');
                var dlHtml = '<dl class="' + selectBody + '">';
                var $input = $html.find('input');
                $select.find('option').each(function (i, opt) {
                    var $opt = $(opt);
                    var text = $opt.text();
                    var value = $opt.val();
                    var classNames = [];
                    if (!text) {
                        classNames.push(selectHolder);
                    }
                    if ($select.val() == value) {
                        $input.attr('data-value', $select.val());
                        $input.val(text);
                        classNames.push(selectActive);
                    }
                    dlHtml += '<dd class="' + classNames.join(' ') + '" data-value="' + value + '">' + (text || '请选择') + '</dd>';
                });
                dlHtml += '</dl>';
                $html.append(dlHtml);
                $html.insertAfter($select);
                $html[0].$select = $select;
                select.$ui = $html;
                $select.hide();
                select.renderedSongUi = true;
                _bindEvent($html);
            });
            // 绑定事件
            function _bindEvent($dom) {
                var search = $dom[0].$select.attr('song-search') === undefined ? false : true;
                var $title = $dom.children('div.' + selectTitle);
                var $cont = $dom.children('dl.' + selectBody);
                var $input = $title.children('input.song-input');
                // 打开，收起事件
                $title.on('click', function () {
                    if ($dom[0].$select.prop('disabled')) {
                        return;
                    }
                    if ($cont.is(':visible')) {
                        $title.trigger('blur');
                    } else {
                        // 其他选择框都收起
                        $('dl.' + selectBody).hide();
                        if (ieVersion < 8) { // ie7及以下定位bugfix
                            $('dl.' + selectBody).parent().parent().parent().css({
                                'z-index': 'auto'
                            });
                            $title.parent().parent().parent().css({
                                'z-index': '99'
                            });
                        }
                        $cont.children('dd').show();
                        $cont.show();
                    }
                    return false;
                });
                // 失去焦点，收起
                $title.on('blur', function () {
                    var $dd = $cont.find('dd.' + selectActive);
                    // 输入框显示已选中的项
                    $input.val($dd.attr('data-value') && $dd.text() || '');
                    $cont.hide();
                    // ie7及以下定位bugfix
                    if (ieVersion < 8) {
                        $title.parent().parent().parent().css({
                            'z-index': 'auto'
                        });
                    }
                    setTimeout(function () {
                        $input.blur()
                    }, 50);
                });
                // 选中事件
                $cont.find('dd').on('click', function () {
                    var $this = $(this);
                    var value = $this.attr('data-value');
                    var filter = $dom[0].$select.attr('song-filter') || '';
                    $cont.find('dd.' + selectActive).removeClass(selectActive);
                    $this.addClass(selectActive);
                    // 输入框显示已选中的项
                    $input.val(value && $this.text() || '').attr('data-value', $this.attr('data-value'));
                    $dom[0].$select.val(value);
                    $cont.hide();
                    // 触发select事件
                    filter && Form.trigger('select(' + filter + ')', {
                        data: value,
                        dom: $dom[0].$select[0]
                    });
                    Form.trigger('select', {
                        data: value,
                        dom: $dom[0].$select[0]
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
                if (!renderSelect.bindedBodyEvent) {
                    $(document.body).on('click', function (e) {
                        $('div.' + selectClass + ':visible').find('div.' + selectTitle).trigger('blur');
                    });
                    renderSelect.bindedBodyEvent = true;
                }
            }
        }

        // 必须放在ready里面去执行，ie6-ie8浏览器刷新执行完js后有时会重新选择input刷新前的选中状态
        $(function () {
            Form.init();
            Form.render();
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