/*
 * @Author: lisong
 * @Date: 2021-10-06 10:06:07
 * @Description: 
 */
var codes = [];
codes.push(`<div class="jy-tab" style="width:400px;">
    <div class="jy-tab-header">
        <div class="jy-tab-header-scroll">
            <div class="jy-tab-titles">
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>
                <div class="jy-tab-title" name="tab2">标签2</div>
                <div class="jy-tab-title" name="tab3">标签3</div>
            </div>
        </div>
    </div>
    <div class="jy-tab-content">
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>
        <div class="jy-tab-item" target="tab2">内容2</div>
        <div class="jy-tab-item" target="tab3">内容3</div>
    </div>
</div>
<script>
    require(['jyui/tab']);
</script>`);
codes.push(`<div class="jy-tab jy-tab-line" style="width:400px;">
    <div class="jy-tab-header">
        <div class="jy-tab-header-scroll">
            <div class="jy-tab-titles">
                <div class="jy-tab-title jy-tab-title-active" name="tab1">标签1</div>
                <div class="jy-tab-title" name="tab2">标签2</div>
                <div class="jy-tab-title" name="tab3">标签3</div>
            </div>
        </div>
    </div>
    <div class="jy-tab-content">
        <div class="jy-tab-item jy-tab-item-active" target="tab1">内容1</div>
        <div class="jy-tab-item" target="tab2">内容2</div>
        <div class="jy-tab-item" target="tab3">内容3</div>
    </div>
</div>
<script>
    require(['jyui/tab']);
</script>`);
codes.push(`<div id="tab"></div>
<script type="text/javascript">
    require(['jyui/tab'], function (Tab) {
        Tab.render({
            elem: '#tab',
            style: 'line',
            data: [
                { title: '标签1', name: 'tab1', content: '内容1' },
                { title: '标签2', name: 'tab2', content: '内容2' }
            ]
        })
    });
</script>`);