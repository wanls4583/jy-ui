/*
 * @Author: lisong
 * @Date: 2021-10-09 22:37:26
 * @Description: 
 */
var codes = [];
codes.push('<input type="text" id="select1" value="2">\r\n\
<script>\r\n\
    require(["jyui/select"], function (Select) {\r\n\
        Select.render({\r\n\
            elem: "#select1",\r\n\
            data: [\r\n\
                { label: "上海", value: 1 },\r\n\
                { label: "广州", value: 2 },\r\n\
                { label: "北京", value: 3 }\r\n\
            ]\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<input type="text" id="select2">\r\n\
<script>\r\n\
    require(["jyui/select"], function (Select) {\r\n\
        Select.render({\r\n\
            elem: "#select2",\r\n\
            type: "input",\r\n\
            data: [\r\n\
                { label: "上海", value: 1 },\r\n\
                { label: "广州", value: 2 },\r\n\
                { label: "北京", value: 3 }\r\n\
            ]\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<input type="text" id="select3">\r\n\
<script>\r\n\
    require(["jyui/select"], function (Select) {\r\n\
        Select.render({\r\n\
            elem: "#select3",\r\n\
            multiselect: true,\r\n\
            data: [\r\n\
                { label: "上海", value: 1 },\r\n\
                { label: "广州", value: 2 },\r\n\
                { label: "北京", value: 3 }\r\n\
            ]\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<input type="text" id="select4">\r\n\
<script>\r\n\
    require(["jyui/select"], function (Select) {\r\n\
        var citys = [{\r\n\
            label: "上海",\r\n\
            value: 1\r\n\
        }, {\r\n\
            label: "广州",\r\n\
            value: 2\r\n\
        }, {\r\n\
            label: "北京",\r\n\
            value: 3\r\n\
        }, {\r\n\
            label: "深圳",\r\n\
            value: 4\r\n\
        }]\r\n\
        Select.render({\r\n\
            elem: "#select4",\r\n\
            search: true,\r\n\
            searchMethod: function (value, cb) {\r\n\
                var data = citys.filter(function (item) {\r\n\
                    return item.label.indexOf(value) > -1;\r\n\
                });\r\n\
                setTimeout(function () {\r\n\
                    cb(data);\r\n\
                }, 500);\r\n\
            }\r\n\
        });\r\n\
    });\r\n\
</script>');