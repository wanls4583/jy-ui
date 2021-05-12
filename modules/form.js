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
        var Form = {
            init: init,
            render: render,
            on: Common.on,
            once: Common.once,
            trigger: Common.trigger,
            verify: verify,
            getJsonFromForm: getJsonFromForm,
            verifyRules: {
                required: {
                    msg: '必填项不能为空',
                    rule: /[\s\S]+/
                },
                number: {
                    msg: '请输入数字',
                    rule: /\-?\d+(\.\d*)?/
                },
                int: {
                    msg: '请输入整数',
                    rule: /\-?\d+/
                },
                phone: {
                    msg: '请输入手机号',
                    rule: /^1(3|4|5|6|7|8|9)\d{9}$/
                },
                email: {
                    msg: '请输入邮箱',
                    rule: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                },
                identify: {
                    msg: '请输入身份证',
                    rule: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i
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
                                $input.addClass('song-border-danger');
                            } else {
                                $input.removeClass('song-border-danger');
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
                        select.$ui && select.$ui.find('.song-input').addClass('song-border-danger');
                    } else {
                        select.$ui && select.$ui.find('.song-input').removeClass('song-border-danger');
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
        function render(tagName) {
            tagName = tagName && tagName.toLowerCase() || '';
            switch (tagName) {
                case 'switch':
                    renderSwitch(true);
                    break;
                case 'radiao':
                    renderRadio(true);
                    break;
                case 'checkbox':
                    renderCheckbox(true);
                    break;
                case 'select':
                    renderSelect(true);
                    break;
                default:
                    renderSwitch(true);
                    renderRadio(true);
                    renderCheckbox(true);
                    renderSelect(true);
            }
        }
        //渲染开关
        function renderSwitch(fresh) {
            var inputs = $('input[type="checkbox"][song-skin="switch"]');
            inputs.each(function (i, input) {
                if (input.renderedSongUi && !fresh) {
                    return;
                }
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = '';
                input.$ui && input.$ui.remove();
                if (ignore) {
                    return;
                }
                if ($input.prop('disabled')) {
                    classNames += ' song-switch-disabled';
                }
                if ($input.prop('checked')) {
                    classNames += ' song-switch-checked';
                }
                var $html = $(
                    '<div class="song-form-switch ' + classNames + '">\
                    <i></i>\
                    <span>' + ($input.prop('checked') ? 'ON' : 'OFF') + '</span>\
                </div>');
                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                _bindEvent($html);
                $input.hide();
                input.renderedSongUi = true;
            });

            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var filter = this.$input.attr('song-filter');
                    if ($this.hasClass('song-switch-disabled')) {
                        return;
                    }
                    $this.toggleClass('song-switch-checked');
                    if ($this.hasClass('song-switch-checked')) {
                        $this.find('span').html('ON');
                        $this[0].$input.prop('checked', true);
                    } else {
                        $this.find('span').html('OFF');
                        $this[0].$input.prop('checked', false);
                    }
                    if (filter) {
                        Form.trigger('switch(' + filter + ')', {
                            data: $this[0].$input.prop('checked'),
                            dom: $this[0].$input[0]
                        });
                    }
                    Form.trigger('switch', {
                        data: $this[0].$input.prop('checked'),
                        dom: $this[0].$input[0]
                    });
                });
            }
        }
        // 渲染单选按钮
        function renderRadio(fresh) {
            var inputs = $('input[type="radio"]');
            inputs.each(function (i, input) {
                if (input.renderedSongUi && !fresh) {
                    return false;
                }
                var $input = $(input);
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                var classNames = '';
                input.$ui && input.$ui.remove();
                if (ignore) {
                    return;
                }
                if ($input.prop('disabled')) {
                    classNames += ' song-radio-disabled';
                }
                if ($input.prop('checked')) {
                    classNames += ' song-radio-checked';
                }
                var html =
                    '<div class="song-form-radio ' + classNames + '">\
                    <i>' + ($input.prop('checked') ? radioIcon : radioedIcon) + '</i>\
                    <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                </div>';
                var $html = $(html);
                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                _bindEvent($html);
                $input.hide();
                input.renderedSongUi = true;
            });
            //绑定事件
            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var filter = this.$input.attr('song-filter');
                    if ($this.hasClass('song-radio-disabled')) {
                        return;
                    }
                    $('.song-form-radio').each(function (i, radio) {
                        var $_this = $(this);
                        if ($_this[0].$input.attr('name') == $this[0].$input.attr('name')) {
                            $_this.removeClass('song-radio-checked').find('i').html(radioedIcon);
                        }
                    });
                    $this.addClass('song-radio-checked');
                    $this.find('i').html(radioIcon);
                    $this[0].$input.prop('checked', true);
                    if (filter) {
                        Form.trigger('radio(' + filter + ')', {
                            data: $this[0].$input.val(),
                            dom: $this[0].$input[0]
                        });
                    }
                    Form.trigger('radio', {
                        data: $this[0].$input.val(),
                        dom: $this[0].$input[0]
                    });
                });
            }
        }
        // 渲染复选框
        function renderCheckbox(fresh) {
            var inputs = $('input[type="checkbox"]');
            inputs.each(function (i, input) {
                var $input = $(input);
                if (input.renderedSongUi && !fresh || $input.attr('song-skin') == 'switch') {
                    return;
                }
                var ignore = $input.attr('song-ignore') === undefined ? false : true;
                input.$ui && input.$ui.remove();
                if (ignore) {
                    return;
                }
                if ($input.attr('song-skin') == 'switch') {
                    return;
                }
                var classNames = '';
                if ($input.prop('disabled')) {
                    classNames += ' song-checkbox-disabled';
                }
                if ($input.prop('checked')) {
                    classNames += ' song-checkbox-checked';
                }
                var $html = $(
                    '<div class="song-form-checkbox ' + classNames + '">\
                    <i>' + ($input.prop('checked') ? checkedIcon : '') + '</i>\
                    <span>' + ($input.attr('title') || '&nbsp;') + '</span>\
                </div>');

                $html.insertAfter(input);
                $html[0].$input = $input;
                input.$ui = $html;
                _bindEvent($html);
                $input.hide();
                input.renderedSongUi = true;
            });

            function _bindEvent($dom) {
                $dom.on('click', function () {
                    var $this = $(this);
                    var filter = this.$input.attr('song-filter');
                    var data = [];
                    if ($this.hasClass('song-checkbox-disabled')) {
                        return;
                    }
                    $this.toggleClass('song-checkbox-checked');
                    if ($this.hasClass('song-checkbox-checked')) {
                        $this.find('i').html(checkedIcon);
                        $this[0].$input.prop('checked', true);
                    } else {
                        $this.find('i').html('');
                        $this[0].$input.prop('checked', false);
                    }
                    $('.song-checkbox-checked').each(function (i, radio) {
                        var $_this = $(this);
                        if ($_this[0].$input.attr('name') == $this[0].$input.attr('name')) {
                            data.push($_this[0].$input.val());
                        }
                    });
                    if (filter) {
                        Form.trigger('checkbox(' + filter + ')', {
                            data: data,
                            dom: $this[0].$input[0]
                        });
                    }
                    Form.trigger('checkbox', {
                        data: data,
                        dom: $this[0].$input[0]
                    });
                });
            }
        }
        // 渲染下拉选择框
        function renderSelect(fresh) {
            $('select').each(function (i, select) {
                if (select.renderedSongUi && !fresh) {
                    return;
                }
                var $select = $(select);
                var ignore = $select.attr('song-ignore') === undefined ? false : true;
                var search = $select.attr('song-search') === undefined ? false : true;
                var classNames = '';
                select.$ui && select.$ui.remove();
                if (ignore) {
                    return;
                }
                if ($select.prop('disabled')) {
                    classNames += ' song-select-disabled';
                }
                var $html = $(
                    '<div class="song-form-select ' + classNames + '">\
                    <div class="song-select-title">\
                        <input type="text" class="song-input" placeholder="请选择" ' + (search ? '' : 'readonly') + '>\
                        <i>' + downIcon + '</i>\
                    </div>\
                </div>');
                var html = '<dl class="song-select-dl">';
                var $input = $html.find('input');
                $select.find('option').each(function (i, opt) {
                    var $opt = $(opt);
                    var text = $opt.text();
                    var value = $opt.val();
                    var classNames = '';
                    if (!text) {
                        classNames += ' song-color-holder';
                    }
                    if ($select.val() == value) {
                        $input.attr('data-value', $select.val());
                        $input.val(text);
                        classNames += ' song-select-active';
                    }
                    html += '<dd class="' + classNames + '" data-value="' + value + '">' + (text || '请选择') + '</dd>';
                });
                html += '</dl>';
                $html.append(html);
                $html.insertAfter($select);
                $html[0].$select = $select;
                select.$ui = $html;
                _bindEvent($html);
                $select.hide();
                select.renderedSongUi = true;
            });
            // 绑定事件
            function _bindEvent($dom) {
                var search = $dom[0].$select.attr('song-search') === undefined ? false : true;
                var $title = $dom.find('.song-select-title');
                var $cont = $dom.find('.song-select-dl');
                var $input = $dom.find('.song-input');
                $title.on('click', function () {
                    if ($dom.hasClass('song-select-disabled')) {
                        return;
                    }
                    if ($cont.is(':visible')) {
                        $title.trigger('blur');
                    } else {
                        // 其他选择框都收起
                        $('.song-select-dl').hide().parents('.song-form-item').css({
                            'z-index': 'auto'
                        });
                        $title.parents('.song-form-item').css({
                            'z-index': '99'
                        });
                        $cont.find('dd').show();
                        $cont.show();
                    }
                    return false;
                });
                $title.on('blur', function () {
                    var $dd = $cont.find('.song-select-active');
                    $input.val($dd.attr('data-value') && $dd.text() || '');
                    $cont.hide();
                    $title.parents('.song-form-item').css({
                        'z-index': 'auto'
                    });
                    setTimeout(function () {
                        $input.blur()
                    }, 50);
                });
                $cont.find('dd').on('click', function () {
                    var $this = $(this);
                    var value = $this.attr('data-value');
                    var filter = $dom[0].$select.attr('song-filter') || '';
                    $cont.find('.song-select-active').removeClass('song-select-active');
                    $this.addClass('song-select-active');
                    $input.val(value && $this.text() || '').attr('data-value', $this.attr('data-value'));
                    $dom[0].$select.val(value);
                    $cont.hide();
                    if (filter) {
                        Form.trigger('select(' + filter + ')', {
                            data: value,
                            dom: $dom[0].$select[0]
                        });
                    }
                    Form.trigger('select', {
                        data: value,
                        dom: $dom[0].$select[0]
                    });
                });
                // 可搜索
                if (search) {
                    $input.on('input propertychange', function () {
                        var title = $(this).val();
                        $cont.find('dd').each(function (i, dd) {
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
                        $('.song-form-select:visible').find('.song-select-title').trigger('blur');
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
        define("form", ['jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Form = factory(window.$, window.SongUi.Common);
    }
})(window)