/*
 * @Author: lisong
 * @Date: 2021-09-2 09:33
 * @Description: 
 */
define(['index', 'modules/jquery'], function (Jyui, $) {
    var domObj = {
        menu: $('.jy-side-menu ul.jy-menu')
    }
    var ieVersion = Jyui.Common.getIeVersion();
    var tab = null;

    function init() {
        initTab();
        initDefaultPage();
    }

    //tab框架相关事件
    function initTab() {
        tab = Jyui.Tab.render({
            elem: '#tab',
            style: 'line'
        });
        tab.on('change', function (obj) {
            selectMenu(obj.data);
        });
        domObj.menu.find('a').on('click', function () {
            var $this = $(this);
            var title = $this.attr('title');
            var url = $this.attr('url');
            url && openTab(title, url);
        });

        _setArea();
        $(window).on('resize', _setArea);

        function _setArea() {
            var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var $headerRight = $('.jy-header-right');
            // ie6不支持同时设置left,right或top,bottom
            if (ieVersion <= 6) {
                var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var $sideMenu = $('.jy-side-menu');
                var $container = $('div.jy-frame-container');
                var $content = $('div.jy-tab-content');
                $headerRight.css('width', winWidth - 201);
                $sideMenu.css('height', winHeight - 61);
                $container.css('width', winWidth - 201);
                $content.css('height', winHeight - 101);
            } else if (ieVersion == 7) {
                var $sideMenu = $('.jy-side-menu');
                var $content = $('div.jy-tab-content');
                // 如果父元素是通过top,bottom获得的高度，子元素百分比高度将无效
                $sideMenu.css('height', winHeight - 61);
                $content.css('height', winHeight - 101);
            }
        }
    }

    //默认打开哪个页面
    function initDefaultPage() {
        var title = '开始使用';
        var url = 'hone.html';
        if (url) {
            openTab(title, url);
        }
    }

    // 选中菜单
    function selectMenu(url) {
        var $a = domObj.menu.find('a[url="' + url + '"]');
        domObj.menu.find('a.jy-menu-checked').removeClass('jy-menu-checked');
        $a.addClass('jy-menu-checked');
        $a.parents('ul', domObj.menu).show();
    }


    function openTab(title, url) {
        tab.addTab({
            title: title,
            name: url,
            content: '<iframe border="0" frameBorder="0" src="' + url + '"></iframe>',
            active: true
        });
        setTimeout(function () {
            selectMenu(url);
        }, 500);
    }

    window.openTab = openTab;
    return {
        init: init
    }
});