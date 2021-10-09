/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push('<div id="pager"></div>\n\
<script>\n\
    require(["./jyui/pager.js"], function (Pager) {\n\
        Pager.render({\n\
            elem: "#pager",\n\
            count: 100,\n\
            first: "首页",\n\
            last: "尾页",\n\
            prev: "上一页",\n\
            next: "下一页"\n\
        });\n\
    });\n\
</script>');