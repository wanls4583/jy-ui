/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push(`<div id="transfer" style="width:500px"></div>
<script>
require(['./jyui/transfer.js'], function (Transfer) {
    var transfer = Transfer.render({
        elem: '#tansfer',
        search: true,
        stretch: true,
        leftTitle: '标题1',
        rightTitle: '标题2',
        data: [{
            id: 1,
            title: 'item1',
            checked: true
        }, {
            id: 2,
            title: 'item2',
            disabled: true
        }, {
            id: 3,
            title: 'item3'
        }, {
            id: 4,
            title: 'item4'
        }],
        value: [{
            id: 5,
            title: 'item5'
        }]
    });
    transfer.on('change', function (obj) {
        console.log(obj);
    });
});
</script>`);