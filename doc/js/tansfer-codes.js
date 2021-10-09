/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push('<div id="transfer" style="width:500px"></div>\n\
<script>\n\
require(["./jyui/transfer.js"], function (Transfer) {\n\
    var transfer = Transfer.render({\n\
        elem: "#tansfer",\n\
        search: true,\n\
        stretch: true,\n\
        leftTitle: "标题1",\n\
        rightTitle: "标题2",\n\
        data: [{\n\
            id: 1,\n\
            title: "item1",\n\
            checked: true\n\
        }, {\n\
            id: 2,\n\
            title: "item2",\n\
            disabled: true\n\
        }, {\n\
            id: 3,\n\
            title: "item3"\n\
        }, {\n\
            id: 4,\n\
            title: "item4"\n\
        }],\n\
        value: [{\n\
            id: 5,\n\
            title: "item5"\n\
        }]\n\
    });\n\
    transfer.on("change", function (obj) {\n\
        console.log(obj);\n\
    });\n\
});\n\
</script>');