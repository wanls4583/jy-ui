/*
 * @Author: lisong
 * @Date: 2021-10-08 16:15:28
 * @Description: 
 */
var codes = [];
codes.push('<div id="table1"></div>\r\n\
<script>\r\n\
    require(["jyui/table"], function (Table) {\r\n\
        var data = [];\r\n\
        var sexValues = [{\r\n\
            label: "男",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "女",\r\n\
            value: 2\r\n\
        }];\r\n\
        var likeValues = [{\r\n\
            label: "听歌",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "游泳",\r\n\
            value: 2\r\n\
        }, {\r\n\
            label: "看小说",\r\n\
            value: 3\r\n\
        }];\r\n\
        for (var i = 0; i < 1000; i++) {\r\n\
            var sex = Math.ceil(Math.random() * 2);\r\n\
            var age = Math.ceil(Math.random() * 100);\r\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\r\n\
            var like = Math.ceil(Math.random() * 3);\r\n\
            var sign = "个性签名" + i;\r\n\
            data.push({ id: i, user: "匿名用户-0000" + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] });\r\n\
        };\r\n\
        var table = Table.render({\r\n\
            elem: "#table1",\r\n\
            width: 1000,\r\n\
            height: 500,\r\n\
            data: data,\r\n\
            limit: 10,\r\n\
            defaultToolbar: true,\r\n\
            stretch: true,\r\n\
            toolbar: "<button class="jy-btn jy-btn-sm" jy-event="selected">获取选择的项</button>",\r\n\
            cols: [{\r\n\
                type: "radio"\r\n\
            }, {\r\n\
                title: "用户",\r\n\
                field: "user"\r\n\
            }, {\r\n\
                title: "手机号",\r\n\
                field: "phone",\r\n\
                width: 100,\r\n\
                attr: { //设置单元属性\r\n\
                    title: function (value, obj, id, col) {\r\n\
                        return value;\r\n\
                    }\r\n\
                }\r\n\
            }, {\r\n\
                title: "性别",\r\n\
                field: "sex",\r\n\
                width: 60,\r\n\
                values: sexValues,\r\n\
                style: { //设置单元格样式\r\n\
                    color: function (value, obj, id, col) {\r\n\
                        if (value == 2) {\r\n\
                            return "red";\r\n\
                        }\r\n\
                    }\r\n\
                }\r\n\
            }, {\r\n\
                title: "年龄",\r\n\
                field: "age",\r\n\
                width: 60\r\n\
            }, {\r\n\
                title: "签名",\r\n\
                field: "sign",\r\n\
                width: 80\r\n\
            }, {\r\n\
                title: "爱好",\r\n\
                field: "like",\r\n\
                values: likeValues\r\n\
            }]\r\n\
        });\r\n\
        table.on("selected", function () {\r\n\
            Dialog.alert(JSON.stringify(table.getData("select")));\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<div id="table2"></div>\r\n\
<script>\r\n\
    require(["jyui/table", "jyui/dialog"], function (Table, Dialog) {\r\n\
        var data = [];\r\n\
        var sexValues = [{\r\n\
            label: "男",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "女",\r\n\
            value: 2\r\n\
        }];\r\n\
        var likeValues = [{\r\n\
            label: "听歌",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "游泳",\r\n\
            value: 2\r\n\
        }, {\r\n\
            label: "看小说",\r\n\
            value: 3\r\n\
        }];\r\n\
        var marriageValues = [{\r\n\
            label: "未婚",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "已婚",\r\n\
            value: 2\r\n\
        }];\r\n\
        for (var i = 0; i < 10000; i++) {\r\n\
            var sex = Math.ceil(Math.random() * 2);\r\n\
            var marriage = Math.ceil(Math.random() * 2);\r\n\
            var age = Math.ceil(Math.random() * 100);\r\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\r\n\
            var like = Math.ceil(Math.random() * 3);\r\n\
            var sign = "个性签名" + i;\r\n\
            data.push({ id: i, user: "匿名用户-0000" + i, city: "城市-" + i, sex: sex, age: age, marriage: marriage, phone: phone, sign: sign, like: [like] });\r\n\
        };\r\n\
        var table = Table.render({\r\n\
            elem: "#table2",\r\n\
            width: 1000,\r\n\
            height: 500,\r\n\
            data: data,\r\n\
            limit: 20,\r\n\
            // ellipsis: false,\r\n\
            defaultToolbar: true,\r\n\
            toolbar: \'<button class="jy-btn jy-btn-sm" jy-event="custom-add">添加行</button>\\\r\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-checkall">全选/全不选</button>\\\r\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-checked">获取选中的数据</button>\\\r\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getadd">获取添加的数据</button>\\\r\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getdel">获取删除的数据</button>\\\r\n\
            <button class="jy-btn jy-btn-sm" jy-event="custom-getedit">获取修改过的数据</button>\',\r\n\
            cols: [\r\n\
                [{\r\n\
                    type: "checkbox",\r\n\
                    fixed: "left",\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "用户",\r\n\
                    field: "user",\r\n\
                    width: 90,\r\n\
                    event: "custom-name",\r\n\
                    fixed: "left",\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "手机号",\r\n\
                    field: "phone",\r\n\
                    width: 150,\r\n\
                    editable: {\r\n\
                        type: "number",\r\n\
                        rules: [{ type: "number" }]\r\n\
                    },\r\n\
                    fixed: "left",\r\n\
                    sortAble: true,\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "城市",\r\n\
                    field: "city",\r\n\
                    width: 100,\r\n\
                    editable: true,\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "性别",\r\n\
                    field: "sex",\r\n\
                    width: 60,\r\n\
                    values: sexValues,\r\n\
                    editable: {\r\n\
                        type: "select",\r\n\
                        values: sexValues,\r\n\
                        rules: [{ type: "required" }]\r\n\
                    },\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "年龄",\r\n\
                    field: "age",\r\n\
                    width: 80,\r\n\
                    editable: {\r\n\
                        edit: function (value, data, id, col) {\r\n\
                            return \'<input class="jy-table-input jy-inline-block" style="width:50px;" value="" + value + "" /><span>岁</span>\';\r\n\
                        },\r\n\
                        save: function ($edit) {\r\n\
                            return $edit.find("input").val();\r\n\
                        },\r\n\
                        rules: [{ type: "number" }]\r\n\
                    },\r\n\
                    sortAble: true,\r\n\
                    rowspan: 2,\r\n\
                    template: function (value) {\r\n\
                        return value + "岁";\r\n\
                    }\r\n\
                }, {\r\n\
                    title: "婚姻",\r\n\
                    field: "marriage",\r\n\
                    width: 150,\r\n\
                    values: marriageValues,\r\n\
                    editable: {\r\n\
                        type: "radio",\r\n\
                        values: marriageValues,\r\n\
                        rules: [{ type: "required" }]\r\n\
                    },\r\n\
                    rowspan: 2\r\n\
                }, {\r\n\
                    title: "其他信息",\r\n\
                    field: "other",\r\n\
                    align: "center",\r\n\
                    colspan: 2\r\n\
                }, {\r\n\
                    type: "operate",\r\n\
                    title: "操作",\r\n\
                    width: 170,\r\n\
                    btns: [{\r\n\
                        text: "详情",\r\n\
                        event: "custom-detail"\r\n\
                    }, {\r\n\
                        text: "删除",\r\n\
                        event: "custom-del",\r\n\
                        type: "danger",\r\n\
                        stop: true\r\n\
                    }],\r\n\
                    event: "custom-op",\r\n\
                    fixed: "right",\r\n\
                    rowspan: 2\r\n\
                }],\r\n\
                [{\r\n\
                    title: "签名",\r\n\
                    field: "sign",\r\n\
                    width: 200,\r\n\
                    align: "center",\r\n\
                    // holder: true,\r\n\
                    editable: true\r\n\
                }, {\r\n\
                    title: "爱好",\r\n\
                    field: "like",\r\n\
                    width: 150,\r\n\
                    align: "center",\r\n\
                    values: likeValues,\r\n\
                    // holder: true,\r\n\
                    editable: {\r\n\
                        type: "checkbox",\r\n\
                        values: likeValues,\r\n\
                        rules: [{ type: "required" }]\r\n\
                    }\r\n\
                }]\r\n\
            ]\r\n\
        });\r\n\
        table.on("save", function (obj) {\r\n\
            // console.log(obj);\r\n\
        });\r\n\
        table.on("edit", function (obj) {\r\n\
            // console.log(obj);\r\n\
        });\r\n\
        table.on("custom-add", function (obj) {\r\n\
            var sex = Math.ceil(Math.random() * 2);\r\n\
            var age = Math.ceil(Math.random() * 100);\r\n\
            var phone = "1" + Math.ceil(Math.random() * 100000000000);\r\n\
            var like = Math.ceil(Math.random() * 3);\r\n\
            var sign = "个性签名" + i;\r\n\
            table.addRow({\r\n\
                id: 1,\r\n\
                data: { id: i, user: "匿名用户-0000" + i, city: "城市-" + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] }\r\n\
            });\r\n\
        });\r\n\
        table.on("custom-del", function (obj) {\r\n\
            table.deleteRow(obj.data.id);\r\n\
        });\r\n\
        table.on("custom-detail", function (obj) {\r\n\
            Dialog.alert(JSON.stringify(obj.data));\r\n\
        });\r\n\
        table.on("custom-op", function (obj) {\r\n\
            // console.log("custom-op");\r\n\
        });\r\n\
        table.on("custom-checkall", function (obj) {\r\n\
            table.checkAll();\r\n\
        });\r\n\
        table.on("custom-checked", function (obj) {\r\n\
            Dialog.alert(JSON.stringify(table.getData("check")));\r\n\
        });\r\n\
        table.on("custom-getadd", function (obj) {\r\n\
            Dialog.alert(JSON.stringify(table.getData("add")));\r\n\
        });\r\n\
        table.on("custom-getdel", function (obj) {\r\n\
            Dialog.alert(JSON.stringify(table.getData("delelte")));\r\n\
        });\r\n\
        table.on("custom-getedit", function (obj) {\r\n\
            Dialog.alert(JSON.stringify(table.getData("edit")));\r\n\
        });\r\n\
        table.on("custom-name", function (obj) {\r\n\
            Dialog.alert(obj.data.user);\r\n\
        });\r\n\
    });\r\n\
</script>');