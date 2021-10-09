/*
 * @Author: lisong
 * @Date: 2021-10-08 16:15:28
 * @Description: 
 */
var codes = [];
codes.push('<div id="table1"></div>\n\
<script>\n\
    require(["jyui/table"], function (Table) {\n\
        var data = [];\n\
        var sexValues = [{\n\
            label: "男",\n\
            value: 1\n\
        }, {\n\
            label: "女",\n\
            value: 2\n\
        }];\n\
        var likeValues = [{\n\
            label: "听歌",\n\
            value: 1\n\
        }, {\n\
            label: "游泳",\n\
            value: 2\n\
        }, {\n\
            label: "看小说",\n\
            value: 3\n\
        }];\n\
        for (var i = 0; i < 1000; i++) {\n\
            var sex = Math.ceil(Math.random() * 2);\n\
            var age = Math.ceil(Math.random() * 100);\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\n\
            var like = Math.ceil(Math.random() * 3);\n\
            var sign = "个性签名" + i;\n\
            data.push({ id: i, user: "匿名用户-0000" + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] });\n\
        };\n\
        var table = Table.render({\n\
            elem: "#table1",\n\
            width: 1000,\n\
            height: 500,\n\
            data: data,\n\
            limit: 10,\n\
            defaultToolbar: true,\n\
            stretch: true,\n\
            toolbar: "<button class="jy-btn jy-btn-sm" jy-event="selected">获取选择的项</button>",\n\
            cols: [{\n\
                type: "radio"\n\
            }, {\n\
                title: "用户",\n\
                field: "user"\n\
            }, {\n\
                title: "手机号",\n\
                field: "phone",\n\
                width: 100,\n\
                attr: { //设置单元属性\n\
                    title: function (value, obj, id, col) {\n\
                        return value;\n\
                    }\n\
                }\n\
            }, {\n\
                title: "性别",\n\
                field: "sex",\n\
                width: 60,\n\
                values: sexValues,\n\
                style: { //设置单元格样式\n\
                    color: function (value, obj, id, col) {\n\
                        if (value == 2) {\n\
                            return "red";\n\
                        }\n\
                    }\n\
                }\n\
            }, {\n\
                title: "年龄",\n\
                field: "age",\n\
                width: 60\n\
            }, {\n\
                title: "签名",\n\
                field: "sign",\n\
                width: 80\n\
            }, {\n\
                title: "爱好",\n\
                field: "like",\n\
                values: likeValues\n\
            }]\n\
        });\n\
        table.on("selected", function () {\n\
            Dialog.alert(JSON.stringify(table.getData("select")));\n\
        });\n\
    });\n\
</script>');
codes.push('<div id="table1"></div>\n\
<script>\n\
    require(["jyui/table", "jyui/dialog"], function (Table, Dialog) {\n\
        var data = [];\n\
        var sexValues = [{\n\
            label: "男",\n\
            value: 1\n\
        }, {\n\
            label: "女",\n\
            value: 2\n\
        }];\n\
        var likeValues = [{\n\
            label: "听歌",\n\
            value: 1\n\
        }, {\n\
            label: "游泳",\n\
            value: 2\n\
        }, {\n\
            label: "看小说",\n\
            value: 3\n\
        }];\n\
        var marriageValues = [{\n\
            label: "未婚",\n\
            value: 1\n\
        }, {\n\
            label: "已婚",\n\
            value: 2\n\
        }];\n\
        for (var i = 0; i < 10000; i++) {\n\
            var sex = Math.ceil(Math.random() * 2);\n\
            var marriage = Math.ceil(Math.random() * 2);\n\
            var age = Math.ceil(Math.random() * 100);\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\n\
            var like = Math.ceil(Math.random() * 3);\n\
            var sign = "个性签名" + i;\n\
            data.push({ id: i, user: "匿名用户-0000" + i, city: "城市-" + i, sex: sex, age: age, marriage: marriage, phone: phone, sign: sign, like: [like] });\n\
        };\n\
        var table = Table.render({\n\
            elem: "#table2",\n\
            width: 1000,\n\
            height: 500,\n\
            data: data,\n\
            limit: 20,\n\
            // ellipsis: false,\n\
            defaultToolbar: true,\n\
            toolbar: "<button class="jy-btn jy-btn-sm" jy-event="custom-add">添加行</button>\\\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-checkall">全选/全不选</button>\\\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-checked">获取选中的数据</button>\\\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getadd">获取添加的数据</button>\\\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getdel">获取删除的数据</button>\\\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getedit">获取修改过的数据</button>",\n\
            cols: [\n\
                [{\n\
                    type: "checkbox",\n\
                    fixed: "left",\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "用户",\n\
                    field: "user",\n\
                    width: 90,\n\
                    event: "custom-name",\n\
                    fixed: "left",\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "手机号",\n\
                    field: "phone",\n\
                    width: 150,\n\
                    editable: {\n\
                        type: "number",\n\
                        rules: [{ type: "number" }]\n\
                    },\n\
                    fixed: "left",\n\
                    sortAble: true,\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "城市",\n\
                    field: "city",\n\
                    width: 100,\n\
                    editable: true,\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "性别",\n\
                    field: "sex",\n\
                    width: 60,\n\
                    values: sexValues,\n\
                    editable: {\n\
                        type: "select",\n\
                        values: sexValues,\n\
                        rules: [{ type: "required" }]\n\
                    },\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "年龄",\n\
                    field: "age",\n\
                    width: 80,\n\
                    editable: {\n\
                        edit: function (value, data, id, col) {\n\
                            return "<input class="jy-table-input jy-inline-block" style="width:50px;" value="" + value + "" /><span>岁</span>";\n\
                        },\n\
                        save: function ($edit) {\n\
                            return $edit.find("input").val();\n\
                        },\n\
                        rules: [{ type: "number" }]\n\
                    },\n\
                    sortAble: true,\n\
                    rowspan: 2,\n\
                    template: function (value) {\n\
                        return value + "岁";\n\
                    }\n\
                }, {\n\
                    title: "婚姻",\n\
                    field: "marriage",\n\
                    width: 150,\n\
                    values: marriageValues,\n\
                    editable: {\n\
                        type: "radio",\n\
                        values: marriageValues,\n\
                        rules: [{ type: "required" }]\n\
                    },\n\
                    rowspan: 2\n\
                }, {\n\
                    title: "其他信息",\n\
                    field: "other",\n\
                    align: "center",\n\
                    colspan: 2\n\
                }, {\n\
                    type: "operate",\n\
                    title: "操作",\n\
                    width: 170,\n\
                    btns: [{\n\
                        text: "详情",\n\
                        event: "custom-detail"\n\
                    }, {\n\
                        text: "删除",\n\
                        event: "custom-del",\n\
                        type: "danger",\n\
                        stop: true\n\
                    }],\n\
                    event: "custom-op",\n\
                    fixed: "right",\n\
                    rowspan: 2\n\
                }],\n\
                [{\n\
                    title: "签名",\n\
                    field: "sign",\n\
                    width: 200,\n\
                    align: "center",\n\
                    // holder: true,\n\
                    editable: true\n\
                }, {\n\
                    title: "爱好",\n\
                    field: "like",\n\
                    width: 150,\n\
                    align: "center",\n\
                    values: likeValues,\n\
                    // holder: true,\n\
                    editable: {\n\
                        type: "checkbox",\n\
                        values: likeValues,\n\
                        rules: [{ type: "required" }]\n\
                    }\n\
                }]\n\
            ]\n\
        });\n\
        table.on("save", function (obj) {\n\
            // console.log(obj);\n\
        });\n\
        table.on("edit", function (obj) {\n\
            // console.log(obj);\n\
        });\n\
        table.on("custom-add", function (obj) {\n\
            var sex = Math.ceil(Math.random() * 2);\n\
            var age = Math.ceil(Math.random() * 100);\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\n\
            var like = Math.ceil(Math.random() * 3);\n\
            var sign = "个性签名" + i;\n\
            table.addRow({\n\
                id: 1,\n\
                data: { id: i, user: "匿名用户-0000" + i, city: "城市-" + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] }\n\
            });\n\
        });\n\
        table.on("custom-del", function (obj) {\n\
            table.deleteRow(obj.data.id);\n\
        });\n\
        table.on("custom-detail", function (obj) {\n\
            Dialog.alert(JSON.stringify(obj.data));\n\
        });\n\
        table.on("custom-op", function (obj) {\n\
            // console.log("custom-op");\n\
        });\n\
        table.on("custom-checkall", function (obj) {\n\
            table.checkAll();\n\
        });\n\
        table.on("custom-checked", function (obj) {\n\
            Dialog.alert(JSON.stringify(table.getData("check")));\n\
        });\n\
        table.on("custom-getadd", function (obj) {\n\
            Dialog.alert(JSON.stringify(table.getData("add")));\n\
        });\n\
        table.on("custom-getdel", function (obj) {\n\
            Dialog.alert(JSON.stringify(table.getData("delelte")));\n\
        });\n\
        table.on("custom-getedit", function (obj) {\n\
            Dialog.alert(JSON.stringify(table.getData("edit")));\n\
        });\n\
        table.on("custom-name", function (obj) {\n\
            Dialog.alert(obj.data.user);\n\
        });\n\
    });\n\
</script>');