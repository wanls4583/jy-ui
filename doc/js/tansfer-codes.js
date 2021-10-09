/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push('<div id="transfer" style="width:500px"></div>\r\n\
<script>\r\n\
require(["./jyui/transfer.js"], function (Transfer) {\r\n\
    var transfer = Transfer.render({\r\n\
        elem: "#tansfer",\r\n\
        search: true,\r\n\
        stretch: true,\r\n\
        leftTitle: "标题1",\r\n\
        rightTitle: "标题2",\r\n\
        data: [{\r\n\
            id: 1,\r\n\
            title: "item1",\r\n\
            checked: true\r\n\
        }, {\r\n\
            id: 2,\r\n\
            title: "item2",\r\n\
            disabled: true\r\n\
        }, {\r\n\
            id: 3,\r\n\
            title: "item3"\r\n\
        }, {\r\n\
            id: 4,\r\n\
            title: "item4"\r\n\
        }],\r\n\
        value: [{\r\n\
            id: 5,\r\n\
            title: "item5"\r\n\
        }]\r\n\
    });\r\n\
    transfer.on("change", function (obj) {\r\n\
        console.log(obj);\r\n\
    });\r\n\
});\r\n\
</script>');