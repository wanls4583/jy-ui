/*
 * @Author: lisong
 * @Date: 2021-10-08 18:27:00
 * @Description: 
 */
var codes = [];
codes.push('<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
    <meta charset="UTF-8">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
    <title>Document</title>\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\n\
</head>\n\
<body>\n\
    <script src="./jyui/jquery.js"></script>\n\
    <script src="./jyui.min.js"></script>\n\
    <script>\n\
        JyUi.Dialog.msg("测试");\n\
    </script>\n\
</body>\n\
</html>');
codes.push('<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
    <meta charset="UTF-8">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
    <title>Document</title>\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\n\
</head>\n\
<body>\n\
    <script src="./jyui/jquery.js"></script>\n\
    <script src="./jyui/common.js"></script>\n\
    <script src="./jyui/dialog.js"></script>\n\
    <script>\n\
        JyUi.Dialog.msg("测试");\n\
    </script>\n\
</body>\n\
</html>');
codes.push('<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
    <meta charset="UTF-8">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
    <title>Document</title>\n\
    <link rel="stylesheet" href="./css/jy-ui.css">\n\
</head>\n\
<body>\n\
    <script src="./require.js"></script>\n\
    <script>\n\
        require(["./jyui/dialog"], function(Dialog) {\n\
            Dialog.msg("测试");\n\
        });\n\
    </script>\n\
</body>\n\
</html>');
codes.push('<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
    <meta charset="UTF-8">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
    <title>Document</title>\n\
    <link rel="stylesheet" href="../css/jy-ui.css">\n\
</head>\n\
<body>\n\
    <script src="./require.js"></script>\n\
    <script src="./jyui.min.js"></script>\n\
    <script>\n\
        require(["jyui"], function(Jyui) {\n\
            Jyui.Dialog.msg("测试");\n\
        });\n\
    </script>\n\
</body>\n\
</html>');