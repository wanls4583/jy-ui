/*
 * @Author: lisong
 * @Date: 2021-10-05 11:06:24
 * @Description: 
 */
var codes = [];
codes.push('<ul class="jy-menu" jy-menu-check="true" style="width:200px;">\n\
<li>\n\
    <a>菜单1</a>\n\
</li>\n\
<li class="jy-menu-border"></li>\n\
<li class="jy-menu-item-spread">\n\
    <a>菜单2</a>\n\
    <ul>\n\
        <li>\n\
            <a>菜单2-1</a>\n\
        </li>\n\
        <li>\n\
            <a>菜单2-2</a>\n\
        </li>\n\
    </ul>\n\
</li>\n\
<li class="jy-menu-border"></li>\n\
<li>\n\
    <a>菜单3</a>\n\
    <ul class="jy-menu-hover-right">\n\
        <li>\n\
            <a>菜单3-1</a>\n\
        </li>\n\
        <li>\n\
            <a>菜单3-2</a>\n\
        </li>\n\
    </ul>\n\
</li>\n\
</ul>\n\
<script>\n\
    require(["jyui/menu-nav"]);\n\
</script>\n\
');
codes.push('<button class="jy-btn" id="menu3">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>\n\
<ul class="jy-menu jy-menu-absolute" jy-menu-elem="#menu3" jy-menu-trigger="hover">\n\
    <li>\n\
        <a>菜单1</a>\n\
    </li>\n\
    <li class="jy-menu-border"></li>\n\
    <li>\n\
        <a>菜单2</a>\n\
    </li>\n\
    <li>\n\
        <a>菜单3</a>\n\
    </li>\n\
</ul>\n\
<script>\n\
    require(["jyui/menu-nav"]);\n\
</script>');
codes.push('<div id="menu1" style="width:200px"></div>\n\
<script type="text/javascript">\n\
    require(["jyui/menu-nav"], function (MenuNav) {\n\
        var menu = MenuNav.render({\n\
            position: "static",\n\
            elem: "#menu1",\n\
            check: true,\n\
            template: function (item) {\n\
                if (item.title == "菜单1") {\n\
                    return "<span style="color:red">" + "★" + "</span>" + item.title;\n\
                } else {\n\
                    return item.title;\n\
                }\n\
            },\n\
            data: [{\n\
                title: "菜单1",\n\
                id: 0\n\
            },\n\
            {\n\
                title: "菜单2",\n\
                spreadType: "hover-right",\n\
                children: [\n\
                    { title: "菜单2-1", children: [{ title: "菜单2-1-1" }] },\n\
                    { title: "菜单2-2" }\n\
                ],\n\
                id: 1\n\
            },\n\
            {\n\
                title: "菜单3",\n\
                children: [\n\
                    { title: "菜单3-1" },\n\
                    { title: "菜单3-2", spread: true, children: [{ title: "菜单3-2-1" }] },\n\
                    { title: "菜单3-3", children: [{ title: "菜单3-3-1" }] }\n\
                ],\n\
                id: 2\n\
            }]\n\
        });\n\
        menu.on("click", function (obj) {\n\
            // console.log(obj);\n\
        });\n\
        menu.on("spread", function (obj) {\n\
            // console.log(obj);\n\
        });\n\
        menu.on("close", function (obj) {\n\
            // console.log(obj);\n\
        });\n\
    });\n\
</script>');
codes.push('<button class="jy-btn" id="menu2">下拉菜单<i class="jy-icon" style="font-size:14px;">&#xe74b;</i></button>\n\
<script type="text/javascript">\n\
    require(["jyui/menu-nav"], function (MenuNav) {\n\
        MenuNav.render({\n\
            elem: "#menu2",\n\
            position: "absolute",\n\
            trigger: "hover",\n\
            data: [{\n\
                title: "菜单1"\n\
            },\n\
            {\n\
                title: "菜单2"\n\
            },\n\
            {\n\
                title: "菜单3"\n\
            }]\n\
        });\n\
    });\n\
</script>');
codes.push('<ul class="jy-menu jy-menu-nav jy-menu-nav-horizontal">\n\
<li><a>导航菜单1</a></li>\n\
<li><a>导航菜单2</a></li>\n\
<li><a>导航菜单3</a>\n\
    <ul class="jy-menu-hover-down">\n\
        <li><a>菜单3-1</a></li>\n\
        <li><a>菜单3-2</a>\n\
            <ul class="jy-menu-hover-right">\n\
                <li><a>菜单3-2-1</a></li>\n\
                <li><a>菜单3-2-2</a></li>\n\
            </ul>\n\
        </li>\n\
    </ul>\n\
</li>\n\
</ul>\n\
<script>\n\
    require(["jyui/menu-nav"]);\n\
</script>');
codes.push('<ul class="jy-menu jy-menu-nav" style="width:200px;">\n\
<li><a>导航菜单1</a></li>\n\
<li><a>导航菜单2</a></li>\n\
<li class="jy-menu-item-spread"><a>导航菜单3</a>\n\
    <ul>\n\
        <li><a>菜单3-1</a></li>\n\
        <li><a>菜单3-2</a>\n\
            <ul>\n\
                <li><a>菜单3-2-1</a></li>\n\
                <li><a>菜单3-2-2</a></li>\n\
            </ul>\n\
        </li>\n\
    </ul>\n\
</li>\n\
</ul>\n\
<script>\n\
    require(["jyui/menu-nav"]);\n\
</script>');
codes.push('<div id="nav1"></div>\n\
<script>\n\
require(["jyui/menu-nav"], function(){\n\
    MenuNav.render({\n\
        elem: "#nav1",\n\
        type: "nav",\n\
        mode: "horizontal",\n\
        data: [{\n\
            title: "导航菜单1"\n\
        },\n\
        {\n\
            title: "导航菜单2"\n\
        },\n\
        {\n\
            title: "导航菜单3",\n\
            children: [{\n\
                title: "菜单3-1"\n\
            }, {\n\
                title: "菜单3-2",\n\
                children: [{\n\
                    title: "菜单3-2-1"\n\
                }, {\n\
                    title: "菜单3-2-2"\n\
                }]\n\
            }]\n\
        }]\n\
    });\n\
});\n\
</script>');
codes.push('<div id="nav2"></div>\n\
<script>\n\
require(["jyui/menu-nav"], function(){\n\
    MenuNav.render({\n\
        elem: "#nav2",\n\
        type: "nav",\n\
        width: 200,\n\
        data: [{\n\
            title: "导航菜单1",\n\
            children: [{\n\
                title: "导航菜单1-1"\n\
            }, {\n\
                title: "导航菜单1-2",\n\
                spread: true,\n\
                children: [{\n\
                    title: "导航菜单1-2-1"\n\
                }, {\n\
                    title: "导航菜单1-2-2"\n\
                }]\n\
            }]\n\
        },\n\
        {\n\
            title: "导航菜单2"\n\
        },\n\
        {\n\
            title: "导航菜单3"\n\
        }]\n\
    });\n\
});\n\
</script>');
