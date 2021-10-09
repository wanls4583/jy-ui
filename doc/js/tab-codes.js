/*
 * @Author: lisong
 * @Date: 2021-10-06 10:06:07
 * @Description: 
 */
var codes = [];
codes.push('<div class="jy-tab" style="width:400px;">\n\
    <div class="jy-tab-header">\n\
        <div class="jy-tab-header-scroll">\n\
            <div class="jy-tab-titles">\n\
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>\n\
                <div class="jy-tab-title" name="tab2">标签2</div>\n\
                <div class="jy-tab-title" name="tab3">标签3</div>\n\
            </div>\n\
        </div>\n\
    </div>\n\
    <div class="jy-tab-content">\n\
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>\n\
        <div class="jy-tab-item" target="tab2">内容2</div>\n\
        <div class="jy-tab-item" target="tab3">内容3</div>\n\
    </div>\n\
</div>\n\
<script>\n\
    require(["jyui/tab"]);\n\
</script>');
codes.push('<div class="jy-tab jy-tab-line" style="width:400px;">\n\
    <div class="jy-tab-header">\n\
        <div class="jy-tab-header-scroll">\n\
            <div class="jy-tab-titles">\n\
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>\n\
                <div class="jy-tab-title" name="tab2">标签2</div>\n\
                <div class="jy-tab-title" name="tab3">标签3</div>\n\
            </div>\n\
        </div>\n\
    </div>\n\
    <div class="jy-tab-content">\n\
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>\n\
        <div class="jy-tab-item" target="tab2">内容2</div>\n\
        <div class="jy-tab-item" target="tab3">内容3</div>\n\
    </div>\n\
</div>\n\
<script>\n\
    require(["jyui/tab"]);\n\
</script>');
codes.push('<div id="tab"></div>\n\
<script type="text/javascript">\n\
    require(["jyui/tab"], function (Tab) {\n\
        Tab.render({\n\
            elem: "#tab",\n\
            style: "line",\n\
            data: [\n\
                { title: "标签1", name: "tab1", content: "内容1" },\n\
                { title: "标签2", name: "tab2", content: "内容2" }\n\
            ]\n\
        })\n\
    });\n\
</script>');