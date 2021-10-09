/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push('<button class="jy-btn" onclick="openAlert()">提示框</button>\r\n\
<button class="jy-btn" onclick="openMsg()">提示文字</button>\r\n\
<button class="jy-btn" onclick="openConfirm()">确认框</button>\r\n\
<button class="jy-btn" onclick="openDialog()">自定义框</button>\r\n\
<script>\r\n\
    require(["./jyui/dialog.js"], function (Dialog) {\r\n\
        window.openAlert = function (icon) {\r\n\
            Dialog.alert("点击确认更改图标", {\r\n\
                icon: icon,\r\n\
                yes: function ($layer, index) {\r\n\
                    Dialog.close(index);\r\n\
                    switch (icon) {\r\n\
                        case "success":\r\n\
                            openAlert("error"); break;\r\n\
                        case "error":\r\n\
                            openAlert("warn"); break;\r\n\
                        case "warn":\r\n\
                            openAlert("question"); break;\r\n\
                        case "question": break;\r\n\
                        default:\r\n\
                            openAlert("success"); break;\r\n\
                    }\r\n\
                }\r\n\
            });\r\n\
        }\r\n\
        window.openMsg = function () {\r\n\
            Dialog.msg("信息");\r\n\
        }\r\n\
        window.openConfirm = function () {\r\n\
            Dialog.confirm("确认框", {\r\n\
                yes: function ($layer, index) {\r\n\
                    Dialog.close(index);\r\n\
                }\r\n\
            });\r\n\
        }\r\n\
        window.openDialog = function () {\r\n\
            Dialog.open({\r\n\
                title: "自定义框",\r\n\
                icon: "success",\r\n\
                content: "<div>自定义内容<br>自定义内容</div>",\r\n\
                btn: ["按钮1", "按钮2", "按钮3"],\r\n\
                full: true,\r\n\
                shadow: false,\r\n\
                yes: function ($layer, index) {\r\n\
                    Dialog.close(index);\r\n\
                },\r\n\
                cancel: function ($layer, index) {\r\n\
                    Dialog.close(index);\r\n\
                },\r\n\
                btn2: function ($layer, index) {\r\n\
                    Dialog.close(index);\r\n\
                }\r\n\
            });\r\n\
        }\r\n\
    });\r\n\
</script>');