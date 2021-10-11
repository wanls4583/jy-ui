/*
 * @Author: lisong
 * @Date: 2021-10-06 10:06:07
 * @Description: 
 */
var codes = [];
codes.push('<div class="jy-tab" jy-tab-close="false" style="width:400px;">\r\n\
    <div class="jy-tab-header">\r\n\
        <div class="jy-tab-header-scroll">\r\n\
            <div class="jy-tab-titles">\r\n\
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>\r\n\
                <div class="jy-tab-title" name="tab2">标签2</div>\r\n\
                <div class="jy-tab-title" name="tab3">标签3</div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-tab-content">\r\n\
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>\r\n\
        <div class="jy-tab-item" target="tab2">内容2</div>\r\n\
        <div class="jy-tab-item" target="tab3">内容3</div>\r\n\
    </div>\r\n\
</div>\r\n\
<script>\r\n\
    require(["jyui/tab"]);\r\n\
</script>');
codes.push('<div class="jy-tab jy-tab-line" style="width:400px;">\r\n\
    <div class="jy-tab-header">\r\n\
        <div class="jy-tab-header-scroll">\r\n\
            <div class="jy-tab-titles">\r\n\
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>\r\n\
                <div class="jy-tab-title" name="tab2">标签2</div>\r\n\
                <div class="jy-tab-title" name="tab3">标签3</div>\r\n\
            </div>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-tab-content">\r\n\
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>\r\n\
        <div class="jy-tab-item" target="tab2">内容2</div>\r\n\
        <div class="jy-tab-item" target="tab3">内容3</div>\r\n\
    </div>\r\n\
</div>\r\n\
<script>\r\n\
    require(["jyui/tab"]);\r\n\
</script>');
codes.push('<div id="tab"></div>\r\n\
<script type="text/javascript">\r\n\
    require(["jyui/tab"], function (Tab) {\r\n\
        Tab.render({\r\n\
            elem: "#tab",\r\n\
            style: "line",\r\n\
            data: [\r\n\
                { title: "标签1", name: "tab1", content: "内容1" },\r\n\
                { title: "标签2", name: "tab2", content: "内容2" }\r\n\
            ]\r\n\
        })\r\n\
    });\r\n\
</script>');