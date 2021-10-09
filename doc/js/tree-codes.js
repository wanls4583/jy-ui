/*
 * @Author: lisong
 * @Date: 2021-10-08 10:04:05
 * @Description: 
 */
var codes = [];
codes.push(`<div id="tree"></div>
<script>
require(['./jyui/tree.js'], function (Tree) {
    var tree = Tree.render({
        elem: '#tree1',
        style: 'line',
        showCheckbox: true,
        onlyIconSwitch: false,
        search: true,
        data: [{
            title: 'item1',
            id: '1',
            children: [{
                id: '1-1',
                title: 'item1-1'
            }, {
                id: '1-2',
                title: 'item1-2',
                // disabled: true,
                spread: true,
                children: [{
                    id: '1-2-1',
                    title: 'item1-2-1'
                }]
            }]
        },
        {
            id: '2',
            title: 'item2',
            disabled: true,
            checked: true
        },
        {
            id: '3',
            title: 'item3'
        }]
    });
    tree.on('click', function (obj) {
        // console.log(obj);
    });
    tree.on('change', function (obj) {
        // console.log(obj);
    });
    tree.on('spread', function (obj) {
        // console.log(obj);
    });
    tree.on('close', function (obj) {
        // console.log(obj);
    });
});
</script>`);