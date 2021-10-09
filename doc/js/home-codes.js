/*
 * @Author: lisong
 * @Date: 2021-10-08 18:27:00
 * @Description: 
 */
var codes = [];
codes.push('<!DOCTYPE html>\r\n\
<html lang="en">\r\n\
<head>\r\n\
    <meta charset="UTF-8">\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n\
    <title>Document</title>\r\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\r\n\
</head>\r\n\
<body>\r\n\
    <script src="./jyui/jquery.js"></script>\r\n\
    <script src="./jyui.min.js"></script>\r\n\
    <script>\r\n\
        JyUi.Dialog.msg("测试");\r\n\
    </script>\r\n\
</body>\r\n\
</html>');
codes.push('<!DOCTYPE html>\r\n\
<html lang="en">\r\n\
<head>\r\n\
    <meta charset="UTF-8">\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n\
    <title>Document</title>\r\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\r\n\
</head>\r\n\
<body>\r\n\
    <script src="./jyui/jquery.js"></script>\r\n\
    <script src="./jyui/common.js"></script>\r\n\
    <script src="./jyui/dialog.js"></script>\r\n\
    <script>\r\n\
        JyUi.Dialog.msg("测试");\r\n\
    </script>\r\n\
</body>\r\n\
</html>');
codes.push('<!DOCTYPE html>\r\n\
<html lang="en">\r\n\
<head>\r\n\
    <meta charset="UTF-8">\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n\
    <title>Document</title>\r\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\r\n\
</head>\r\n\
<body>\r\n\
    <script src="./require.js"></script>\r\n\
    <script>\r\n\
        require(["./jyui/dialog"], function(Dialog) {\r\n\
            Dialog.msg("测试");\r\n\
        });\r\n\
    </script>\r\n\
</body>\r\n\
</html>');
codes.push('<!DOCTYPE html>\r\n\
<html lang="en">\r\n\
<head>\r\n\
    <meta charset="UTF-8">\r\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n\
    <title>Document</title>\r\n\
    <link rel="stylesheet" href="../css/jy-ui.css">\r\n\
</head>\r\n\
<body>\r\n\
    <script src="./require.js"></script>\r\n\
    <script src="./jyui.min.js"></script>\r\n\
    <script>\r\n\
        require(["jyui"], function(Jyui) {\r\n\
            Jyui.Dialog.msg("测试");\r\n\
        });\r\n\
    </script>\r\n\
</body>\r\n\
</html>');