/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push(`<div id="pager"></div>
<script>
    require(['./jyui/pager.js'], function (Pager) {
        Pager.render({
            elem: '#pager',
            count: 100,
            first: '首页',
            last: '尾页',
            prev: '上一页',
            next: '下一页'
        });
    });
</script>`)