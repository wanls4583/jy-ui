/*
 * @Author: lisong
 * @Date: 2021-09-11 11:36:36
 * @Description: 
 */
!(function (window) {
    function factory($, Common) {
        var tpl = {
            input: '<input type="file" name="file" class="jy-upload-file" <%-multiple?\'multiple="multiple"\':""%>/>',
            form: '<form encType="multipart/form-data" method="post" action="<%-url%>" target="<%-target%>"></form>',
            iframe: '<iframe class="jy-upload-iframe" name="<%-name%>"></iframe>',
            upload: '<div class="jy-upload"></div>'
        }
        var ieVersion = Common.getIeVersion();
        var iframeCount = 0;

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
            this.$elem = $(this.option.elem);
            this.fileName = this.option.fileName || 'file';
            this.multiple = this.option.multiple || '';
            this.limit = Number(this.option.limit) || Infinity;
            this.autoUpload = this.option.autoUpload === undefined ? true : this.option.autoUpload;
            if (this.$elem[0].tagName.toLowerCase() == 'input' && this.$elem[0].type == 'file') {
                this.$fileInput = this.$elem;
            } else {
                this.$fileInput = $(Common.htmlTemplate(tpl.input, {
                    multiple: this.multiple
                }));
            }
            // 兼容ie8及以下浏览器
            if (ieVersion < 9) {
                var $upload = $(tpl.upload);
                $upload.insertAfter(this.$elem);
                this.iframeName = 'iframe-' + iframeCount++;
                this.$iframe = $(Common.htmlTemplate(tpl.iframe, {
                    name: this.iframeName
                }));
                this.$form = $(Common.htmlTemplate(tpl.form, {
                    url: this.option.url,
                    target: this.iframeName
                }));
                this.$form.append(this.$fileInput);
                $upload.append(this.$form);
                $(window.document.body).append(this.$iframe);
            } else {
                this.$fileInput.hide();
                if (this.$elem != this.$fileInput) {
                    this.$fileInput.insertAfter(this.$elem);
                }
            }
            this.bindEvent();
        }

        Class.prototype.bindEvent = function () {
            var that = this;
            if (this.$elem != this.$fileInput) {
                this.$elem.on('click', function () {
                    that.$fileInput.click();
                });
            }
            this.$fileInput.on('change', function () {
                var files = this.files;
                var str = '';
                for (var i = 0; i < files.length; i++) {
                    str += '<div>' + files[i].name + '</div>';
                    if (files[i].size >= that.limit) {
                        that.trigger('size', {
                            data: files[i]
                        });
                        JyUpload.trigger('size', {
                            data: files[i]
                        });
                        return;
                    }
                }
                that.trigger('change', {
                    dom: that.$fileInput[0]
                });
                JyUpload.trigger('change', {
                    dom: that.$fileInput[0]
                });
                that.autoUpload && that.upload();
            });
            this.$iframe && this.$iframe.on('load', function () {
                var result = {};
                try {
                    // 服务器端不能设置"X-Frame-Options"为"deny"，否则获取document将报错
                    result = {
                        data: that.$iframe[0].contentWindow.document.body.innerHTML
                    }
                    if (window.JSON) {
                        result = window.JSON && window.JSON.parse(result.data);
                    }
                } catch (e) {}
                that.trigger('success', result);
                JyUpload.trigger('success', result);
            });
        }

        Class.prototype.upload = function () {
            var that = this;
            if (!this.$fileInput[0].value) {
                Common.showMsg('请选择文件', {
                    icon: 'danger'
                });
                return;
            }
            this.trigger('before', {
                dom: that.$fileInput[0]
            });
            JyUpload.trigger('before', {
                dom: that.$fileInput[0]
            });
            if (this.$iframe) {
                this.$form.submit();
            } else {
                _upload();
            }

            function _upload() {
                var files = that.$fileInput[0].files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var formData = new FormData();
                    formData.append('file', file);
                    $.ajax({
                        type: "post",
                        url: that.option.url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (res) {
                            that.trigger('success', res);
                            JyUpload.trigger('success', res);
                        },
                        error: function (res) {
                            that.trigger('error', {
                                data: res,
                                file: file
                            });
                            JyUpload.trigger('error', {
                                data: res,
                                file: file
                            });
                        }
                    });
                }

            }
        }

        var event = Common.getEvent();
        var JyUpload = {
            on: event.on,
            once: event.once,
            trigger: event.trigger,
            render: function (option) {
                var instance = new Class(option);
                return {
                    on: instance.on,
                    once: instance.once,
                    trigger: instance.trigger,
                    upload: function () {
                        if (!instance.autoUpload) {
                            instance.upload();
                        }
                    }
                }
            }
        }

        return JyUpload;
    }
    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common'], function ($, Common) {
            return factory($, Common);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Upload = factory(window.$, window.JyUi.Common);
    }
})(window)