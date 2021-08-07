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
        var loadingIcon = '&#xe61e;';
        var menuWidth = 180;
        var bindedEvent = false;
        var docBody = window.document.body;
        var docElement = window.document.documentElement;
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
            iconMsg: 'song-layer-msg-with-icon',
            loading: 'song-layer-loading',
            loadingIcon: 'song-layer-loading-icon'
        }
        var ieVersion = Common.getIeVersion();
        var store = {};
        var layerCount = 0;
        var Dialog = {
            open: open,
            alert: alert,
            confirm: confirm,
            msg: msg,
            loading: loading,
            close: close,
            setPosition: setPosition,
            setArea: setArea
        };
        // 打开弹框
        function open(option) {
            option.type = option.type || 'dialog';
            option.close = option.close !== false ? true : false;
            option.shadow = option.shadow !== false ? true : false;
            option.move = option.move !== false ? true : false;
            option.full = option.full !== false ? true : false;
            option.animation = option.animation !== false ? (option.animation || 'stretch') : '';
            var layerIndex = ++layerCount;
            var $container = $(option.container || docBody);
            var $shadow = $('<div class="' + [layerClass.shadow, layerClass.layer + layerIndex].join(' ') + '" style="z-index:' + (layerIndex + 99) + '"></div>');
            var $layer = $('<div class="' + [layerClass.layer, layerClass.layer + '-' + option.type, layerClass.layer + layerIndex].join(' ') + '" song-index="' + layerIndex + '" style="z-index:' + (layerIndex + 100) + '"></div>');
            var $title = $(
                '<div ' + (option.move ? 'onselectstart="return false;"' : '') + ' class="' + layerClass.title + '">\
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
                option: option
            }
            $title.find('i.song-icon').hide();
            // 动画
            if (option.animation && option.type != 'msg' && option.type != 'loading') {
                var animation = 'song-layer-animation-' + option.animation;
                $layer.addClass(animation);
                setTimeout(function () {
                    $layer.removeClass(animation);
                }, ieVersion >= 9 ? 300 : 0);
            }
            if (option.full) {
                $title.find('i.song-op-minus').show();
                $title.find('i.song-op-full').show();
            }
            if (option.close) {
                $title.find('i.song-op-close').show();
            }
            if (option.shadow || option.mask) {
                $container.append($shadow);
                if (option.mask) {
                    $shadow.css('background-color', '#fff');
                }
            }
            if (option.move) {
                $title.css('cursor', 'move');
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
            if ($container[0] != docBody) {
                $shadow.addClass('song-layer-absolute');
                $layer.addClass('song-layer-absolute');
            }
            // 提示图标
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
            // 自动关闭
            if (option.duration) {
                setTimeout(function () {
                    close(layerIndex);
                }, option.duration);
            }
            $container.append($layer);
            // 设置弹框尺寸
            setArea(layerIndex, {
                width: option.width,
                height: option.height
            });
            // 设置弹框位置
            setPosition(layerIndex, option.offset || 'center');
            // 绑定事件
            _bindEvent();
            // 弹框成功回调
            typeof option.success == 'function' && option.success($layer, layerIndex);

            return layerIndex;

            function _bindEvent() {
                $layer.on('click', function () {
                    var zIndex = ++layerCount + 100;
                    $(this).css('z-index', zIndex);
                });
                // 关闭
                $title.find('i.song-op-close').on('click', function () {
                    close(layerIndex);
                    return false;
                });
                if (option.full) {
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
                            width: docElement.clientWidth || docBody.clientWidth,
                            height: docElement.clientHeight || docBody.clientHeight
                        };
                        setArea(layerIndex, area);
                        setPosition(layerIndex, option.offset || 'center');
                        return false;
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
                        return false;
                    });
                    // 最小化
                    $title.find('i.song-op-minus').on('click', function () {
                        var layers = $('div.' + layerClass.layer);
                        var contentHeight = $layer.find('div.' + layerClass.body).outerHeight() || 0;
                        var footerHeight = $layer.find('div.' + layerClass.footer).outerHeight() || 0;
                        var winHeight = docElement.clientHeight || docBody.clientHeight;
                        $(this).hide();
                        $title.find('i.song-op-full').hide();
                        $title.find('i.song-op-recovery').show();
                        store[layerIndex].area = {
                            width: ieVersion <= 6 ? $layer.outerWidth() : $layer.width(),
                            height: ieVersion <= 6 ? $layer.outerHeight() : $layer.height()
                        }
                        var area = {
                            width: menuWidth,
                            height: (ieVersion <= 6 ? $layer.outerHeight() : $layer.height()) - contentHeight - footerHeight
                        };
                        var left = 0;
                        var arr = [];
                        layers.each(function (i, layer) {
                            if (layer != $layer[0]) {
                                arr.push(layer.offsetLeft);
                            }
                        });
                        arr.sort(function (a, b) {
                            return a - b;
                        });
                        for (var i = 0; i < arr.length; i++) {
                            if (i * menuWidth != arr[i]) {
                                left = i * menuWidth;
                                break;
                            } else {
                                left = (i + 1) * menuWidth;
                            }
                        }
                        $content.hide();
                        $footer.hide();
                        setArea(layerIndex, area);
                        setPosition(layerIndex, {
                            left: left,
                            top: winHeight - $title.outerHeight()
                        });
                        return false;
                    });
                }
                // 拖动
                if (option.move) {
                    $title.on('mousedown', function (e) {
                        var rect = Common.getRect($layer[0]);
                        var marginTop = rect.marginTop;
                        var marginLeft = rect.marginLeft;
                        $title[0].startX = e.pageX;
                        $title[0].startY = e.pageY;
                        $title[0].startTop = ieVersion <= 6 ? $layer[0].offsetTop - marginTop : $layer[0].offsetTop;
                        $title[0].startLeft = ieVersion <= 6 ? $layer[0].offsetLeft - marginLeft : $layer[0].offsetLeft;
                    });
                    $(docBody).on('mousemove', function (e) {
                        if ($title[0].startX) {
                            var _left = e.pageX - $title[0].startX;
                            var _top = e.pageY - $title[0].startY;
                            $layer.css({
                                left: $title[0].startLeft + _left,
                                top: $title[0].startTop + _top
                            });
                        }
                    }).on('mouseup', function () {
                        $title[0].startX = 0;
                        $title[0].startY = 0;
                    });
                }
                // 底部按钮
                $footer.find('button.song-btn').each(function (i) {
                    var $this = $(this);
                    (function (i) {
                        $this.on('click', function () {
                            if (i == 0) {
                                if ('function' == typeof option.yes) {
                                    option.yes($layer, layerIndex);
                                } else {
                                    'function' == typeof option['btn' + i] && typeof option['btn' + i]($layer, layerIndex);
                                }
                            } else if (i == 1) {
                                if ('function' == typeof option.cancel) {
                                    option.cancel($layer, layerIndex);
                                } else {
                                    'function' == typeof option['btn' + i] && typeof option['btn' + i]($layer, layerIndex);
                                }
                            } else {
                                'function' == typeof option['btn' + i] && typeof option['btn' + i]($layer, layerIndex);
                            }
                        });
                    })(i)
                    return false;
                });

                // ie6修复top位置
                if (ieVersion <= 6 && !bindedEvent) {
                    bindedEvent = true;
                    $(window).on('scroll', function () {
                        var ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                        var ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                        $(docBody).children('div.' + layerClass.layer).each(function (i, layer) {
                            var $layer = $(layer);
                            // 移动中的弹框不需要更改边距
                            if (!$layer.children('div.' + layerClass.title)[0].startX) {
                                // 避免超出屏幕外
                                if (layer.offsetLeft + layer.offsetWidth < docBody.scrollWidth) {
                                    $layer.css({
                                        marginLeft: ie6MarginLeft
                                    });
                                }
                                if (layer.offsetTop + layer.offsetHeight < docBody.scrollHeight) {
                                    $layer.css({
                                        marginTop: ie6MarginTop
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
        // 带确定按钮的提示
        function alert(content, option) {
            var yes = function ($layer, index) {
                close(index)
            };
            var _option = {
                title: '信息',
                type: 'alert',
                full: false,
                content: content,
                btn: ['确定'],
                yes: yes
            }
            option = option && Object.assign(_option, option) || _option;
            return open(option);
        }
        // 确认弹框
        function confirm(content, option) {
            var yes = function ($layer, index) {
                close(index)
            };
            var _option = {
                title: '信息',
                type: 'alert',
                full: false,
                content: content,
                btn: ['确定', '取消'],
                cancel: yes
            }
            option = option && Object.assign(_option, option) || _option;
            return open(option);
        }
        // 提示消息
        function msg(content, option) {
            var yes = function ($layer, index) {
                close(index)
            };
            var _option = {
                title: false,
                type: 'msg',
                full: false,
                duration: 3000,
                shadow: false,
                content: content,
                yes: yes
            }
            option = option && Object.assign(_option, option) || _option;
            if (!option.tipMore) {
                closeAll('msg');
            }
            return open(option);
        }
        // 加载
        function loading(option) {
            var _option = {
                title: false,
                type: 'loading',
                full: false
            }
            var color = '';
            option = option && Object.assign(_option, option) || _option;
            if (option.shadow !== false) {
                color = '#fff';
            } else {
                color = '#999';
            }
            option.content = '<div ' + (color ? 'style="color:' + color + '"' : '') + '><div class="' + layerClass.loadingIcon + ' song-icon">' + loadingIcon + '</div><div>' + (option.content || '') + '</div></div>';
            return open(option);
        }
        // 关闭弹框
        function close(layerIndex) {
            var $layer = $('div.' + layerClass.layer + '.' + layerClass.layer + layerIndex);
            $('div.' + layerClass.shadow + '.' + layerClass.layer + layerIndex).remove();
            $layer.addClass('song-layer-animation-fade-out');
            setTimeout(function () {
                // 关闭弹框回调
                typeof store[layerIndex].option.end == 'function' && store[layerIndex].option.end($layer, layerIndex);
                $layer.remove();
            }, ieVersion >= 9 ? 300 : 0);
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
            var ie6MarginLeft = 0;
            if ($layer.length) {
                if ('string' == typeof offset) {
                    var $container = $layer.parent();
                    var winWidth = 0;
                    var winHeight = 0;
                    var tagName = $container[0].tagName.toUpperCase();
                    if (tagName == 'BODY') {
                        winWidth = docElement.clientWidth || docBody.clientWidth;
                        winHeight = docElement.clientHeight || docBody.clientHeight;
                    } else {
                        winWidth = $container[0].clientWidth;
                        winHeight = $container[0].clientHeight;
                    }
                    if (ieVersion <= 6 && tagName == 'BODY') { //i6以下没有fixed定位
                        // 在i6以上浏览器中，指定了DOCTYPE是documentElement.scrollTop有效
                        // body.scrollTop
                        ie6MarginTop = docElement.scrollTop || docBody.scrollTop || 0;
                        ie6MarginLeft = docElement.scrollLeft || docBody.scrollLeft || 0;
                    }
                    var width = $layer[0].offsetWidth;
                    var height = $layer[0].offsetHeight;
                    offset = offset.split(' ');
                    offset[1] = offset[1] || offset[0];
                    if (offset[0] == 'top' || offset[0] == 'bottom') {
                        offset.reverse();
                    }
                    switch (offset[0]) { // 水平位置
                        case 'left':
                            $layer.css({
                                left: 0,
                                right: 'auto',
                                marginLeft: ie6MarginLeft
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
                                left: (winWidth - width) / 2 + 'px',
                                right: 'auto',
                                marginLeft: ie6MarginLeft
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
            var winWidth = docElement.clientWidth || docBody.clientWidth;
            var winHeight = docElement.clientHeight || docBody.clientHeight;
            var rect = Common.getRect($content[0]);
            var container = $layer.parent()[0];
            if (ieVersion <= 6) {
                $('div.' + layerClass.shadow + '.' + layerClass.layer + layerIndex).css({
                    width: container.scrollWidth + 'px',
                    height: container.scrollHeight + 'px'
                });
            }
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