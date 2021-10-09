/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push('<div id="tree"></div>\r\n\
<script>\r\n\
require(["./jyui/tree.js"], function (Tree) {\r\n\
    var tree = Tree.render({\r\n\
        elem: "#tree1",\r\n\
        style: "line",\r\n\
        showCheckbox: true,\r\n\
        onlyIconSwitch: false,\r\n\
        search: true,\r\n\
        data: [{\r\n\
            title: "item1",\r\n\
            id: "1",\r\n\
            children: [{\r\n\
                id: "1-1",\r\n\
                title: "item1-1"\r\n\
            }, {\r\n\
                id: "1-2",\r\n\
                title: "item1-2",\r\n\
                // disabled: true,\r\n\
                spread: true,\r\n\
                children: [{\r\n\
                    id: "1-2-1",\r\n\
                    title: "item1-2-1"\r\n\
                }]\r\n\
            }]\r\n\
        },\r\n\
        {\r\n\
            id: "2",\r\n\
            title: "item2",\r\n\
            disabled: true,\r\n\
            checked: true\r\n\
        },\r\n\
        {\r\n\
            id: "3",\r\n\
            title: "item3"\r\n\
        }]\r\n\
    });\r\n\
    tree.on("click", function (obj) {\r\n\
        // console.log(obj);\r\n\
    });\r\n\
    tree.on("change", function (obj) {\r\n\
        // console.log(obj);\r\n\
    });\r\n\
    tree.on("spread", function (obj) {\r\n\
        // console.log(obj);\r\n\
    });\r\n\
    tree.on("close", function (obj) {\r\n\
        // console.log(obj);\r\n\
    });\r\n\
});\r\n\
</script>');