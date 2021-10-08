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
    <script src="./modules/jquery.js"></script>
    <script src="./jy-ui.all.js"></script>
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
    <script src="./modules/jquery.js"></script>
    <script src="./modules/common.js"></script>
    <script src="./modules/dialog.js"></script>
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
        require(['./modules/dialog'], function(Dialog) {
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
    <script src="./jy-ui.all.js"></script>
    <script>
        require(['modules/dialog'], function(Dialog) {
            Dialog.msg('测试');
        });
    </script>
</body>
</html>`);