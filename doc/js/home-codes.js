/*
 * @Author: lisong
 * @Date: 2021-10-08 18:27:00
 * @Description: 
 */
var codes = [];
codes.push(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./css/jy-ui.css">
</head>
<body>
    <script src="./jyui/jquery.js"></script>
    <script src="./jyui.min.js"></script>
    <script>
        JyUi.Dialog.msg('测试');
    </script>
</body>
</html>`);
codes.push(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./css/jy-ui.css">
</head>
<body>
    <script src="./jyui/jquery.js"></script>
    <script src="./jyui/common.js"></script>
    <script src="./jyui/dialog.js"></script>
    <script>
        JyUi.Dialog.msg('测试');
    </script>
</body>
</html>`);
codes.push(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./css/jy-ui.css">
</head>
<body>
    <script src="./require.js"></script>
    <script>
        require(['./jyui/dialog'], function(Dialog) {
            Dialog.msg('测试');
        });
    </script>
</body>
</html>`);
codes.push(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../css/jy-ui.css">
</head>
<body>
    <script src="./require.js"></script>
    <script src="./jyui.min.js"></script>
    <script>
        require(['jyui'], function(Jyui) {
            Jyui.Dialog.msg('测试');
        });
    </script>
</body>
</html>`);