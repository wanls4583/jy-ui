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
        var fullIcon = '&#xe644;';
        var recoveryIcon = '&#xe617;';
        var minusIcon = '&#xe62d;';
        var layerClass = {
            layer: 'song-layer',
            shadow: 'song-layer-shadow',
            title: 'song-layer-title',
            footer: 'song-layer-footer',
            body: 'song-layer-content',
            dialog: 'song-layer-dialog',
            alert: 'song-layer-alert',
            confirm: 'song-layer-confirm',
            msg: 'song-layer-msg',
            iconMsg: 'song-layer-msg-with-icon'
        }
        var ieVersion = Common.getIeVersion();
        var store = {};
        var Dialog = {
            layerIndex: 0,
            open: open,
            alert: alert,
            confirm: confirm,
            msg: msg,
            close: close,
            setPosition: setPosition,
            setArea: setArea
        };
        // 打开弹框
        function open(option) {
            option.type = option.type || 'dialog';
            var layerIndex = Dialog.layerIndex;
            var $container = $(option.container || window.document.body);
            var $shadow = $('<div class="' + [layerClass.shadow, layerClass.layer + layerIndex].join(' ') + '"></div>');
            var $layer = $('<div class="' + [layerClass.layer, layerClass.layer + '-' + option.type, layerClass.layer + layerIndex].join(' ') + '" song-index="' + layerIndex + '"></div>');
            var $title = $(
                '<div class="' + layerClass.title + '">\
                    <span>' + option.title + '</span>\
                    <div class="song-layer-op">\
                        <i class="song-op-minus song-icon">' + minusIcon + '</i>\
                        <i class="song-op-full song-icon">' + fullIcon + '</i>\
                        <i class="song-op-recovery song-icon">' + recoveryIcon + '</i>\
                        <i class="song-op-close song-icon">' + closeIcon + '</i>\
                    </div>\
                </div>'
            );
            var $content = $('<div class="' + layerClass.body + '"><div>' + (typeof option.content == 'object' ? $(option.content).html() : option.content) + '</div></div>');
            var $footer = $('<div class="' + layerClass.footer + '"></div>');
            // 存储弹框数据
            store[layerIndex] = {
                overflow: document.body.style.overflow,
                type: option.type
            }
            $title.find('i.song-icon').hide();
            if (option.full) {
                $title.find('i.song-op-minus').show();
                $title.find('i.song-op-full').show();
            }
            if (option.close !== false) {
                $title.find('i.song-op-close').show();
            }
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
            } else if (ieVersion <= 6 && option.type != 'msg' && option.shadow !== false) {
                //ie6不支持fixed，以下css防止页面滚动
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
                    $layer.removeClass(layerClass.msg).addClass(layerClass.iconMsg);
                }
            }
            if (option.duration) {
                setTimeout(function () {
                    close(layerIndex);
                }, option.duration);
            }
            $container.append($layer);
            setArea(layerIndex, {
                width: option.width,
                height: option.height
            });
            setPosition(layerIndex, option.offset || 'center');
            _bindEvent();
            Dialog.layerIndex++;
            return layerIndex;

            function _bindEvent() {
                // 关闭
                $title.find('i.song-op-close').on('click', function () {
                    close(layerIndex);
                });
                // 全屏
                $title.find('i.song-op-full').on('click', function () {
                    $(this).hide();
                    $title.find('i.song-op-minus').hide();
                    $title.find('i.song-op-recovery').show();
                    store[layerIndex].area = {
                        width: ieVersion <= 6 ? $layer.outerWidth() : $layer.width(),
                        height: ieVersion <= 6 ? $layer.outerHeight() : $layer.height()
                    }
                    var area = {
                        width: document.documentElement.clientWidth || window.document.body.clientWidth,
                        height: document.documentElement.clientHeight || window.document.body.clientHeight
                    };
                    setArea(layerIndex, area);
                    setPosition(layerIndex, option.offset || 'center');
                });
                // 恢复默认大小
                $title.find('i.song-op-recovery').on('click', function () {
                    $(this).hide();
                    $title.find('i.song-op-minus').show();
                    $title.find('i.song-op-full').show();
                    $content.show();
                    $footer.show();
                    setArea(layerIndex, store[layerIndex].area);
                    setPosition(layerIndex, option.offset || 'center');
                });
                // 最小化
                $title.find('i.song-op-minus').on('click', function () {
                    var contentHeight = $layer.find('div.' + layerClass.body).outerHeight() || 0;
                    var footerHeight = $layer.find('div.' + layerClass.footer).outerHeight() || 0;
                    $(this).hide();
                    $title.find('i.song-op-full').hide();
                    $title.find('i.song-op-recovery').show();
                    store[layerIndex].area = {
                        width: ieVersion <= 6 ? $layer.outerWidth() : $layer.width(),
                        height: ieVersion <= 6 ? $layer.outerHeight() : $layer.height()
                    }
                    var area = {
                        width: 180,
                        height: (ieVersion <= 6 ? $layer.outerHeight() : $layer.height()) - contentHeight - footerHeight
                    };
                    $content.hide();
                    $footer.hide();
                    setArea(layerIndex, area);
                    setPosition(layerIndex, 'left bottom');
                });
                // 底部按钮
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
            $('div.' + layerClass.layer + '.' + layerClass.layer + layerIndex).remove();
            $('div.' + layerClass.shadow + '.' + layerClass.layer + layerIndex).remove();
            if (ieVersion <= 6 && store[layerIndex].type != 'msg') {
                document.body.style.overflow = store[layerIndex].overflow;
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
                        $('div.' + layerClass.msg).remove();
                        $('div.' + layerClass.iconMsg).remove();
                        break;
                    case 'dialog':
                        $('div.' + layerClass.dialog).each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.' + layerClass.layer + index).remove();
                        });
                        break;
                    case 'alert':
                        $('div.' + layerClass.alert).each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.' + layerClass.layer + index).remove();
                        });
                        break;
                    case 'confrim':
                        $('div.' + layerClass.confirm).each(function (i, dom) {
                            var $dom = $(dom);
                            var index = $dom.attr('song-index');
                            $('div.' + layerClass.layer + index).remove();
                        });
                        break;
                }
            } else {
                $('div.' + layerClass.shadow).remove();
                $('div.' + layerClass.layer).remove();
            }
        }
        // 设置位置
        function setPosition(layerIndex, offset) {
            var $layer = $('div.' + layerClass.layer + '.' + layerClass.layer + layerIndex);
            var ie6MarginTop = 0;
            if ($layer.length) {
                var winWidth = document.documentElement.clientWidth || window.document.body.clientWidth;
                var winHeight = document.documentElement.clientHeight || window.document.body.clientHeight;
                if (ieVersion <= 6) { //i6以下没有fixed定位
                    // 在i6以上浏览器中，指定了DOCTYPE是document.documentElement.scrollTop有效，否则document.body.scrollTop有效
                    // ie6以下只认document.body.scrollTop
                    ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    $('div.' + layerClass.shadow + '.' + layerClass.layer + layerIndex).css({
                        width: window.screen.width + window.document.body.scrollWidth + 'px',
                        height: window.screen.height + window.document.body.scrollHeight + 'px'
                    });
                }
                var width = $layer[0].offsetWidth;
                var height = $layer[0].offsetHeight;
                if ('string' == typeof offset) {
                    offset = offset.split(' ');
                    offset[1] = offset[1] || offset[0];
                    switch (offset[0]) { // 水平位置
                        case 'left':
                            $layer.css({
                                left: 0,
                                right: 'auto'
                            });
                            break;
                        case 'right':
                            $layer.css({
                                left: 'auto',
                                right: 0
                            });
                            break;
                        case 'center':
                            $layer.css({
                                left: (winWidth - width) / 2 + 'px',
                                right: 'auto'
                            });
                            break;
                    }
                    switch (offset[1]) { // 垂直位置
                        case 'top':
                            $layer.css({
                                top: 0,
                                bottom: 'auto',
                                marginTop: ie6MarginTop
                            });
                            break;
                        case 'center':
                            $layer.css({
                                top: (winHeight - height) / 2 + 'px',
                                bottom: 'auto',
                                marginTop: ie6MarginTop
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

        // 设置尺寸
        function setArea(layerIndex, area) {
            var $layer = $('div.' + layerClass.layer + '.' + layerClass.layer + layerIndex);
            var $content = $layer.children('div.' + layerClass.body);
            var width = area.width || (ieVersion <= 6 ? $layer.outerWidth() : $layer.width());
            var height = area.height || (ieVersion <= 6 ? $layer.outerHeight() : $layer.height());
            var titleHeight = $layer.find('div.' + layerClass.title).outerHeight() || 0;
            var footerHeight = $layer.find('div.' + layerClass.footer).outerHeight() || 0;
            var winWidth = document.documentElement.clientWidth || window.document.body.clientWidth;
            var winHeight = document.documentElement.clientHeight || window.document.body.clientHeight;
            var rect = Common.getRect($content[0]);
            if (width > winWidth) {
                width = winWidth;
            }
            if (height > winHeight) {
                height = winHeight;
            }
            $layer.css({
                width: width,
                height: height
            });
            height = $layer.outerHeight() - titleHeight - footerHeight;
            $content.css({
                height: (ieVersion <= 6 ? height : height - rect.paddingTop - rect.paddingBottom) + 'px'
            });
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