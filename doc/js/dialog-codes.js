/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push('<button class="jy-btn" onclick="openAlert()">提示框</button>\n\
<button class="jy-btn" onclick="openMsg()">提示文字</button>\n\
<button class="jy-btn" onclick="openConfirm()">确认框</button>\n\
<button class="jy-btn" onclick="openDialog()">自定义框</button>\n\
<script>\n\
    require(["./jyui/dialog.js"], function (Dialog) {\n\
        window.openAlert = function (icon) {\n\
            Dialog.alert("点击确认更改图标", {\n\
                icon: icon,\n\
                yes: function ($layer, index) {\n\
                    Dialog.close(index);\n\
                    switch (icon) {\n\
                        case "success":\n\
                            openAlert("error"); break;\n\
                        case "error":\n\
                            openAlert("warn"); break;\n\
                        case "warn":\n\
                            openAlert("question"); break;\n\
                        case "question": break;\n\
                        default:\n\
                            openAlert("success"); break;\n\
                    }\n\
                }\n\
            });\n\
        }\n\
        window.openMsg = function () {\n\
            Dialog.msg("信息");\n\
        }\n\
        window.openConfirm = function () {\n\
            Dialog.confirm("确认框", {\n\
                yes: function ($layer, index) {\n\
                    Dialog.close(index);\n\
                }\n\
            });\n\
        }\n\
        window.openDialog = function () {\n\
            Dialog.open({\n\
                title: "自定义框",\n\
                icon: "success",\n\
                content: "<div>自定义内容<br>自定义内容</div>",\n\
                btn: ["按钮1", "按钮2", "按钮3"],\n\
                full: true,\n\
                shadow: false,\n\
                yes: function ($layer, index) {\n\
                    Dialog.close(index);\n\
                },\n\
                cancel: function ($layer, index) {\n\
                    Dialog.close(index);\n\
                },\n\
                btn2: function ($layer, index) {\n\
                    Dialog.close(index);\n\
                }\n\
            });\n\
        }\n\
    });\n\
</script>');