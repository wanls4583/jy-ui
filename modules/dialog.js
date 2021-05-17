/*
 * @Author: lisong
 * @Date: 2021-04-28 09:59:36
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var closeIcon = '&#xe735;';
        var successIcon = '&#xe615;';
        var warnIcon = '&#xe60a;';
        var errorIcon = '&#xe60b;';
        var questionIcon = '&#xe613;';
        var ieVersion = Common.getIeVersion();
        var Dialog = {
            layerIndex: 0,
            open: open,
            alert: alert,
            confirm: confirm,
            msg: msg,
            close: close,
            setPosition: setPosition
        };
        // 打开弹框
        function open(option) {
            option.type = option.type || 'dialog';
            var layerIndex = Dialog.layerIndex;
            var $container = $(option.container || window.document.body);
            var $shadow = $('<div class="song-layer-shadow song-layer' + layerIndex + '"></div>');
            var $layer = $('<div class="song-layer song-layer-' + option.type + ' song-layer' + layerIndex + '" song-index="' + layerIndex + '"></div>');
            var $title = $(
                '<div class="song-layer-title">\
                <span>' + option.title + '</span>\
                <div class="song-layer-op">\
                    <i class="song-op-close song-icon">' + closeIcon + '</i>\
                </div>\
            </div>'
            );
            var $content = $('<div class="song-layer-content"><div>' + (typeof option.content == 'object' ? $(option.content).html() : option.content) + '</div></div>');
            var $footer = $('<div class="song-layer-footer"></div>');
            if (option.shadow !== false) {
                $container.append($shadow);
            }
            if (option.btn) {
                var btnHtml = '';
                for (var i = 0; i < option.btn.length; i++) {
                    btnHtml += '<button class="song-btn' + (i > 0 ? ' song-btn-primary' : '') + (option.type != 'dialog' ? ' song-btn-sm' : '') + '">' + option.btn[i] + '</button>';
                }
                $footer.append(btnHtml);
            }
            if (option.title) {
                $layer.append($title);
            }
            $layer.append($content);
            if (option.btn) {
                $layer.append($footer);
            }
            // 在特定容器里打开
            if ($container[0] != window.document.body) {
                $shadow.addClass('song-layer-absolute');
                $layer.addClass('song-layer-absolute');
            } else if (ieVersion <= 6 && option.type != 'msg') {
                //ie6不支持fixed，以下css防止页面滚动
                document.body.overflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            }
            if (option.icon) {
                var icon = '';
                var color = '';
                switch (option.icon) {
                    case 'success':
                        icon = successIcon;
                        color = 'song-color-success';
                        break;
                    case 'warn':
                        icon = warnIcon;
                        color = 'song-color-warn';
                        break;
                    case 'error':
                        icon = errorIcon;
                        color = 'song-color-danger';
                        break;
                    case 'question':
                        icon = questionIcon;
                        color = 'song-color-warn';
                        break;
                }
                $content.prepend('<i class="song-layer-icon ' + color + '">' + icon + '</i>').css({
                    paddingLeft: '55px'
                });
                if (option.type == 'msg') {
                    $layer.removeClass('song-layer-msg').addClass('song-layer-msg-with-icon');
                }
            }
            if (option.duration) {
                setTimeout(function () {
                    close(layerIndex);
                }, option.duration);
            }
            $container.append($layer);
            setPosition(layerIndex, option.offset || 'center');
            _bindEvent();
            Dialog.layerIndex++;
            return layerIndex;

            function _bindEvent() {
                $title.find('i.song-op-close').on('click', function () {
                    close(layerIndex);
                });
                $footer.find('button.song-btn').each(function (i) {
                    var $this = $(this);
                    (function (i) {
                        $this.on('click', function () {
                            if (i == 0) {
                                if ('function' == typeof option.yes) {
                                    option.yes(layerIndex);
                                } else {
                                    'function' == typeof option['btn' + i] && typeof option['btn' + i](layerIndex);
                                }
                            } else if (i == 1) {
                                if ('function' == typeof option.cancel) {
                                    option.cancel(layerIndex);
                                } else {
                                    'function' == typeof option['btn' + i] && typeof option['btn' + i](layerIndex);
                                }
                            } else {
                                'function' == typeof option['btn' + i] && typeof option['btn' + i](layerIndex);
                            }
                        });
                    })(i)
                });
            }
        }
        // 带确定按钮的提示
        function alert(content, option) {
            var yes = function (index) {
                close(index)
            };
            var _option = {
                title: '信息',
                type: 'alert',
                content: content,
                btn: ['确定'],
                yes: yes
            }
            option = option && Object.assign(_option, option) || _option;
            open(option);
        }
        // 确认弹框
        function confirm(content, option) {
            var yes = function (index) {
                close(index)
            };
            var _option = {
                title: '信息',
                type: 'alert',
                content: content,
                btn: ['确定', '取消'],
                cancel: yes
            }
            option = option && Object.assign(_option, option) || _option;
            open(option);
        }
        // 提示消息
        function msg(content, option) {
            var yes = function (index) {
                close(index)
            };
            var _option = {
                title: false,
                type: 'msg',
                duration: 3000,
                shadow: false,
                content: content,
                yes: yes
            }
            option = option && Object.assign(_option, option) || _option;
            if (!option.tipMore) {
                closeAll('msg');
            }
            open(option);
        }
        // 关闭弹框
        function close(layerIndex) {
            $('div.song-layer.song-layer' + layerIndex).remove();
            $('div.song-layer-shadow.song-layer' + layerIndex).remove();
            if (ieVersion <= 6 && document.body.overflow !== undefined) {
                document.body.style.overflow = document.body.overflow;
            }
        }
        /**
         * 关闭所有弹窗
         * @param {String}} type 弹窗类型
         */
        function closeAll(type) {
            if (type) {
                switch (type) {
                    case 'msg':
                        $('div.song-layer-msg').remove();
                        $('div.song-layer-msg-with-icon').remove();
                        break;
                    case 'dialog':
                        $('div.song-layer-dialog').each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.song-layer' + index).remove();
                        });
                        break;
                    case 'alert':
                        $('div.song-layer-alert').each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.song-layer' + index).remove();
                        });
                        break;
                    case 'confrim':
                        $('div.song-layer-confrim').each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.song-layer' + index).remove();
                        });
                        break;
                }
            } else {
                $('div.song-layer-shadow').remove();
                $('div.song-layer').remove();
            }
        }
        // 设置位置
        function setPosition(layerIndex, offset) {
            var $layer = $('div.song-layer.song-layer' + layerIndex);
            var ie6MarginTop = 0;
            if ($layer.length) {
                if (ieVersion <= 6) { //i6以下没有fixed定位
                    // 在i6以上浏览器中，指定了DOCTYPE是document.documentElement.scrollTop有效，否则document.body.scrollTop有效
                    // ie6以下只认document.body.scrollTop
                    ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    $('div.song-layer-shadow.song-layer' + layerIndex).css({
                        marginTop: ie6MarginTop + 'px',
                        width: $(window.document.body).outerWidth() + 'px',
                        height: $(window.document.body).outerHeight() + 'px'
                    });
                }
                if ('string' == typeof offset) {
                    var width = $layer.outerWidth();
                    var height = $layer.outerHeight();
                    offset = offset.split(' ');
                    offset[1] = offset[1] || offset[0];
                    switch (offset[0]) {
                        case 'left':
                            $layer.css({
                                left: 0,
                                right: 'auto',
                                marginLeft: 0
                            });
                            break;
                        case 'right':
                            $layer.css({
                                left: 'auto',
                                right: 0,
                                marginLeft: 0
                            });
                            break;
                        case 'center':
                            $layer.css({
                                left: '50%',
                                right: 'auto',
                                marginLeft: '-' + (width / 2) + 'px'
                            });
                            break;
                    }
                    switch (offset[1]) {
                        case 'top':
                            $layer.css({
                                top: 0,
                                bottom: 'auto',
                                marginTop: ie6MarginTop
                            });
                            break;
                        case 'center':
                            $layer.css({
                                top: '50%',
                                bottom: 'auto',
                                marginTop: (ie6MarginTop - height / 2) + 'px'
                            });
                            break;
                        case 'bottom':
                            $layer.css({
                                top: 'auto',
                                bottom: 0,
                                marginTop: 0
                            });
                            break;
                    }
                } else {
                    $layer.css({
                        left: offset.left,
                        top: offset.top
                    });
                }
            }
        }

        return Dialog;
    }

    if ("function" == typeof define && define.amd) {
        define('dialog', ['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Dialog = factory(window.$, window.SongUi.Common);
    }
})(window)