/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push('<div id="tree"></div>\n\
<script>\n\
require(["./jyui/tree.js"], function (Tree) {\n\
    var tree = Tree.render({\n\
        elem: "#tree1",\n\
        style: "line",\n\
        showCheckbox: true,\n\
        onlyIconSwitch: false,\n\
        search: true,\n\
        data: [{\n\
            title: "item1",\n\
            id: "1",\n\
            children: [{\n\
                id: "1-1",\n\
                title: "item1-1"\n\
            }, {\n\
                id: "1-2",\n\
                title: "item1-2",\n\
                // disabled: true,\n\
                spread: true,\n\
                children: [{\n\
                    id: "1-2-1",\n\
                    title: "item1-2-1"\n\
                }]\n\
            }]\n\
        },\n\
        {\n\
            id: "2",\n\
            title: "item2",\n\
            disabled: true,\n\
            checked: true\n\
        },\n\
        {\n\
            id: "3",\n\
            title: "item3"\n\
        }]\n\
    });\n\
    tree.on("click", function (obj) {\n\
        // console.log(obj);\n\
    });\n\
    tree.on("change", function (obj) {\n\
        // console.log(obj);\n\
    });\n\
    tree.on("spread", function (obj) {\n\
        // console.log(obj);\n\
    });\n\
    tree.on("close", function (obj) {\n\
        // console.log(obj);\n\
    });\n\
});\n\
</script>');