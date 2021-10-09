/*
 * @Author: lisong
 * @Date: 2021-10-05 11:06:24
 * @Description: 
 */
var codes = [];
codes.push('<ul class="jy-menu" jy-menu-check="true" style="width:200px;">\r\n\
<li>\r\n\
    <a>菜单1</a>\r\n\
</li>\r\n\
<li class="jy-menu-border"></li>\r\n\
<li class="jy-menu-item-spread">\r\n\
    <a>菜单2</a>\r\n\
    <ul>\r\n\
        <li>\r\n\
            <a>菜单2-1</a>\r\n\
        </li>\r\n\
        <li>\r\n\
            <a>菜单2-2</a>\r\n\
        </li>\r\n\
    </ul>\r\n\
</li>\r\n\
<li class="jy-menu-border"></li>\r\n\
<li>\r\n\
    <a>菜单3</a>\r\n\
    <ul class="jy-menu-hover-right">\r\n\
        <li>\r\n\
            <a>菜单3-1</a>\r\n\
        </li>\r\n\
        <li>\r\n\
            <a>菜单3-2</a>\r\n\
        </li>\r\n\
    </ul>\r\n\
</li>\r\n\
</ul>\r\n\
<script>\r\n\
    require(["jyui/menu-nav"]);\r\n\
</script>\r\n\
');
codes.push('<button class="jy-btn" id="menu3">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>\r\n\
<ul class="jy-menu jy-menu-absolute" jy-menu-elem="#menu3" jy-menu-trigger="hover">\r\n\
    <li>\r\n\
        <a>菜单1</a>\r\n\
    </li>\r\n\
    <li class="jy-menu-border"></li>\r\n\
    <li>\r\n\
        <a>菜单2</a>\r\n\
    </li>\r\n\
    <li>\r\n\
        <a>菜单3</a>\r\n\
    </li>\r\n\
</ul>\r\n\
<script>\r\n\
    require(["jyui/menu-nav"]);\r\n\
</script>');
codes.push('<div id="menu1" style="width:200px"></div>\r\n\
<script type="text/javascript">\r\n\
    require(["jyui/menu-nav"], function (MenuNav) {\r\n\
        var menu = MenuNav.render({\r\n\
            position: "static",\r\n\
            elem: "#menu1",\r\n\
            check: true,\r\n\
            template: function (item) {\r\n\
                if (item.title == "菜单1") {\r\n\
                    return "<span style="color:red">" + "★" + "</span>" + item.title;\r\n\
                } else {\r\n\
                    return item.title;\r\n\
                }\r\n\
            },\r\n\
            data: [{\r\n\
                title: "菜单1",\r\n\
                id: 0\r\n\
            },\r\n\
            {\r\n\
                title: "菜单2",\r\n\
                spreadType: "hover-right",\r\n\
                children: [\r\n\
                    { title: "菜单2-1", children: [{ title: "菜单2-1-1" }] },\r\n\
                    { title: "菜单2-2" }\r\n\
                ],\r\n\
                id: 1\r\n\
            },\r\n\
            {\r\n\
                title: "菜单3",\r\n\
                children: [\r\n\
                    { title: "菜单3-1" },\r\n\
                    { title: "菜单3-2", spread: true, children: [{ title: "菜单3-2-1" }] },\r\n\
                    { title: "菜单3-3", children: [{ title: "菜单3-3-1" }] }\r\n\
                ],\r\n\
                id: 2\r\n\
            }]\r\n\
        });\r\n\
        menu.on("click", function (obj) {\r\n\
            // console.log(obj);\r\n\
        });\r\n\
        menu.on("spread", function (obj) {\r\n\
            // console.log(obj);\r\n\
        });\r\n\
        menu.on("close", function (obj) {\r\n\
            // console.log(obj);\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<button class="jy-btn" id="menu2">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>\r\n\
<script type="text/javascript">\r\n\
    require(["jyui/menu-nav"], function (MenuNav) {\r\n\
        MenuNav.render({\r\n\
            elem: "#menu2",\r\n\
            position: "absolute",\r\n\
            trigger: "hover",\r\n\
            data: [{\r\n\
                title: "菜单1"\r\n\
            },\r\n\
            {\r\n\
                title: "菜单2"\r\n\
            },\r\n\
            {\r\n\
                title: "菜单3"\r\n\
            }]\r\n\
        });\r\n\
    });\r\n\
</script>');
codes.push('<ul class="jy-menu jy-menu-nav jy-menu-nav-horizontal">\r\n\
<li><a>导航菜单1</a></li>\r\n\
<li><a>导航菜单2</a></li>\r\n\
<li><a>导航菜单3</a>\r\n\
    <ul class="jy-menu-hover-down">\r\n\
        <li><a>菜单3-1</a></li>\r\n\
        <li><a>菜单3-2</a>\r\n\
            <ul class="jy-menu-hover-right">\r\n\
                <li><a>菜单3-2-1</a></li>\r\n\
                <li><a>菜单3-2-2</a></li>\r\n\
            </ul>\r\n\
        </li>\r\n\
    </ul>\r\n\
</li>\r\n\
</ul>\r\n\
<script>\r\n\
    require(["jyui/menu-nav"]);\r\n\
</script>');
codes.push('<ul class="jy-menu jy-menu-nav" style="width:200px;">\r\n\
<li><a>导航菜单1</a></li>\r\n\
<li><a>导航菜单2</a></li>\r\n\
<li class="jy-menu-item-spread"><a>导航菜单3</a>\r\n\
    <ul>\r\n\
        <li><a>菜单3-1</a></li>\r\n\
        <li><a>菜单3-2</a>\r\n\
            <ul>\r\n\
                <li><a>菜单3-2-1</a></li>\r\n\
                <li><a>菜单3-2-2</a></li>\r\n\
            </ul>\r\n\
        </li>\r\n\
    </ul>\r\n\
</li>\r\n\
</ul>\r\n\
<script>\r\n\
    require(["jyui/menu-nav"]);\r\n\
</script>');
codes.push('<div id="nav1"></div>\r\n\
<script>\r\n\
require(["jyui/menu-nav"], function(){\r\n\
    MenuNav.render({\r\n\
        elem: "#nav1",\r\n\
        type: "nav",\r\n\
        mode: "horizontal",\r\n\
        data: [{\r\n\
            title: "导航菜单1"\r\n\
        },\r\n\
        {\r\n\
            title: "导航菜单2"\r\n\
        },\r\n\
        {\r\n\
            title: "导航菜单3",\r\n\
            children: [{\r\n\
                title: "菜单3-1"\r\n\
            }, {\r\n\
                title: "菜单3-2",\r\n\
                children: [{\r\n\
                    title: "菜单3-2-1"\r\n\
                }, {\r\n\
                    title: "菜单3-2-2"\r\n\
                }]\r\n\
            }]\r\n\
        }]\r\n\
    });\r\n\
});\r\n\
</script>');
codes.push('<div id="nav2"></div>\r\n\
<script>\r\n\
require(["jyui/menu-nav"], function(){\r\n\
    MenuNav.render({\r\n\
        elem: "#nav2",\r\n\
        type: "nav",\r\n\
        width: 200,\r\n\
        data: [{\r\n\
            title: "导航菜单1",\r\n\
            children: [{\r\n\
                title: "导航菜单1-1"\r\n\
            }, {\r\n\
                title: "导航菜单1-2",\r\n\
                spread: true,\r\n\
                children: [{\r\n\
                    title: "导航菜单1-2-1"\r\n\
                }, {\r\n\
                    title: "导航菜单1-2-2"\r\n\
                }]\r\n\
            }]\r\n\
        },\r\n\
        {\r\n\
            title: "导航菜单2"\r\n\
        },\r\n\
        {\r\n\
            title: "导航菜单3"\r\n\
        }]\r\n\
    });\r\n\
});\r\n\
</script>');
