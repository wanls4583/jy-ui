/*
 * @Author: lisong
 * @Date: 2021-10-06 12:27:58
 * @Description: 
 */
var codes = [];
codes.push(`<button class="jy-btn" onclick="openAlert()">提示框</button>
<button class="jy-btn" onclick="openMsg()">提示文字</button>
<button class="jy-btn" onclick="openConfirm()">确认框</button>
<button class="jy-btn" onclick="openDialog()">自定义框</button>
<script>
    require(['./jyui/dialog.js'], function (Dialog) {
        window.openAlert = function (icon) {
            Dialog.alert('点击确认更改图标', {
                icon: icon,
                yes: function ($layer, index) {
                    Dialog.close(index);
                    switch (icon) {
                        case 'success':
                            openAlert('error'); break;
                        case 'error':
                            openAlert('warn'); break;
                        case 'warn':
                            openAlert('question'); break;
                        case 'question': break;
                        default:
                            openAlert('success'); break;
                    }
                }
            });
        }
        window.openMsg = function () {
            Dialog.msg('信息');
        }
        window.openConfirm = function () {
            Dialog.confirm('确认框', {
                yes: function ($layer, index) {
                    Dialog.close(index);
                }
            });
        }
        window.openDialog = function () {
            Dialog.open({
                title: '自定义框',
                icon: 'success',
                content: '<div>自定义内容<br>自定义内容</div>',
                btn: ['按钮1', '按钮2', '按钮3'],
                full: true,
                shadow: false,
                yes: function ($layer, index) {
                    Dialog.close(index);
                },
                cancel: function ($layer, index) {
                    Dialog.close(index);
                },
                btn2: function ($layer, index) {
                    Dialog.close(index);
                }
            });
        }
    });
</script>`)