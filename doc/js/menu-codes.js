/*
 * @Author: lisong
 * @Date: 2021-10-05 11:06:24
 * @Description: 
 */
var codes = [];
codes.push(`<ul class="jy-menu" jy-menu-check="true" style="width:200px;">
<li>
    <a>菜单1</a>
</li>
<li class="jy-menu-border"></li>
<li class="jy-menu-item-spread">
    <a>菜单2</a>
    <ul>
        <li>
            <a>菜单2-1</a>
        </li>
        <li>
            <a>菜单2-2</a>
        </li>
    </ul>
</li>
<li class="jy-menu-border"></li>
<li>
    <a>菜单3</a>
    <ul class="jy-menu-hover-right">
        <li>
            <a>菜单3-1</a>
        </li>
        <li>
            <a>菜单3-2</a>
        </li>
    </ul>
</li>
</ul>
<script>
    require(['modules/menu-nav']);
</script>
`);
codes.push(`<button class="jy-btn" id="menu3">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>
<ul class="jy-menu jy-menu-absolute" jy-menu-elem="#menu3" jy-menu-trigger="hover">
    <li>
        <a>菜单1</a>
    </li>
    <li class="jy-menu-border"></li>
    <li>
        <a>菜单2</a>
    </li>
    <li>
        <a>菜单3</a>
    </li>
</ul>
<script>
    require(['modules/menu-nav']);
</script>`);
codes.push(`<div id="menu1" style="width:200px"></div>
<script type="text/javascript">
    require(['modules/menu-nav'], function (MenuNav) {
        var menu = MenuNav.render({
            position: 'static',
            elem: '#menu1',
            check: true,
            template: function (item) {
                if (item.title == '菜单1') {
                    return '<span style="color:red">' + '★' + '</span>' + item.title;
                } else {
                    return item.title;
                }
            },
            data: [{
                title: '菜单1',
                id: 0
            },
            {
                title: '菜单2',
                spreadType: 'hover-right',
                children: [
                    { title: '菜单2-1', children: [{ title: '菜单2-1-1' }] },
                    { title: '菜单2-2' }
                ],
                id: 1
            },
            {
                title: '菜单3',
                children: [
                    { title: '菜单3-1' },
                    { title: '菜单3-2', spread: true, children: [{ title: '菜单3-2-1' }] },
                    { title: '菜单3-3', children: [{ title: '菜单3-3-1' }] }
                ],
                id: 2
            }]
        });
        menu.on('click', function (obj) {
            // console.log(obj);
        });
        menu.on('spread', function (obj) {
            // console.log(obj);
        });
        menu.on('close', function (obj) {
            // console.log(obj);
        });
    });
</script>`);
codes.push(`<button class="jy-btn" id="menu2">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>
<script type="text/javascript">
    require(['modules/menu-nav'], function (MenuNav) {
        MenuNav.render({
            elem: '#menu2',
            position: 'absolute',
            trigger: 'hover',
            data: [{
                title: '菜单1'
            },
            {
                title: '菜单2'
            },
            {
                title: '菜单3'
            }]
        });
    });
</script>`);
codes.push(`<ul class="jy-menu jy-menu-nav jy-menu-nav-horizontal">
<li><a>导航菜单1</a></li>
<li><a>导航菜单2</a></li>
<li><a>导航菜单3</a>
    <ul class="jy-menu-hover-down">
        <li><a>菜单3-1</a></li>
        <li><a>菜单3-2</a>
            <ul class="jy-menu-hover-right">
                <li><a>菜单3-2-1</a></li>
                <li><a>菜单3-2-2</a></li>
            </ul>
        </li>
    </ul>
</li>
</ul>
<script>
    require(['modules/menu-nav']);
</script>`);
codes.push(`<ul class="jy-menu jy-menu-nav" style="width:200px;">
<li><a>导航菜单1</a></li>
<li><a>导航菜单2</a></li>
<li class="jy-menu-item-spread"><a>导航菜单3</a>
    <ul>
        <li><a>菜单3-1</a></li>
        <li><a>菜单3-2</a>
            <ul>
                <li><a>菜单3-2-1</a></li>
                <li><a>菜单3-2-2</a></li>
            </ul>
        </li>
    </ul>
</li>
</ul>
<script>
    require(['modules/menu-nav']);
</script>`);
codes.push(`<div id="nav1"></div>
<script>
require(['modules/menu-nav'], function(){
    MenuNav.render({
        elem: '#nav1',
        type: 'nav',
        mode: 'horizontal',
        data: [{
            title: '导航菜单1'
        },
        {
            title: '导航菜单2'
        },
        {
            title: '导航菜单3',
            children: [{
                title: '菜单3-1'
            }, {
                title: '菜单3-2',
                children: [{
                    title: '菜单3-2-1'
                }, {
                    title: '菜单3-2-2'
                }]
            }]
        }]
    });
});
</script>`);
codes.push(`<div id="nav2"></div>
<script>
require(['modules/menu-nav'], function(){
    MenuNav.render({
        elem: '#nav2',
        type: 'nav',
        width: 200,
        data: [{
            title: '导航菜单1',
            children: [{
                title: '导航菜单1-1'
            }, {
                title: '导航菜单1-2',
                spread: true,
                children: [{
                    title: '导航菜单1-2-1'
                }, {
                    title: '导航菜单1-2-2'
                }]
            }]
        },
        {
            title: '导航菜单2'
        },
        {
            title: '导航菜单3'
        }]
    });
});
</script>`);
