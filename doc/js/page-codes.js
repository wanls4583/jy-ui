/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push('<div id="pager"></div>\r\n\
<script>\r\n\
    require(["./jyui/pager.js"], function (Pager) {\r\n\
        Pager.render({\r\n\
            elem: "#pager",\r\n\
            count: 100,\r\n\
            first: "首页",\r\n\
            last: "尾页",\r\n\
            prev: "上一页",\r\n\
            next: "下一页"\r\n\
        });\r\n\
    });\r\n\
</script>');