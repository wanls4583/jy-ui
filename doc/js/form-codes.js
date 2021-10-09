/*
 * @Author: lisong
 * @Date: 2021-10-09 23:16:27
 * @Description: 
 */
var codes = [];
codes.push('<form action="javascript:;" class="jy-form" id="form" style="width:625px;" jy-filter="form-test">\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label jy-required">姓名</label>\r\n\
        <div class="jy-input-block">\r\n\
            <input type="text" class="jy-input" name="name" jy-verify="required">\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label">是否成年</label>\r\n\
        <div class="jy-input-block">\r\n\
            <span>否</span>\r\n\
            <input type="checkbox" name="adult" jy-skin="switch">\r\n\
            <span>是</span>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label">性别</label>\r\n\
        <div class="jy-input-block">\r\n\
            <input type="radio" name="sex" title="男" value="男" checked>\r\n\
            <input type="radio" name="sex" title="女" value="女">\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label">爱好</label>\r\n\
        <div class="jy-input-block">\r\n\
            <input type="checkbox" name="like" title="篮球" value="篮球" checked>\r\n\
            <input type="checkbox" name="like" title="看书" value="看书">\r\n\
            <input type="checkbox" name="like" title="唱歌" value="唱歌">\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label jy-required">城市</label>\r\n\
        <div class="jy-input-block">\r\n\
            <select name="city" jy-verify="required">\r\n\
                <option value=""></option>\r\n\
                <option value="0">北京</option>\r\n\
                <option value="1">上海</option>\r\n\
                <option value="2">广州</option>\r\n\
                <option value="3">深圳</option>\r\n\
                <option value="4">杭州</option>\r\n\
            </select>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div class="jy-form-item">\r\n\
        <label for="" class="jy-form-label">个性签名</label>\r\n\
        <div class="jy-input-block">\r\n\
            <textarea class="jy-textarea" name="sign"></textarea>\r\n\
        </div>\r\n\
    </div>\r\n\
    <div style="text-align:center">\r\n\
        <button type="submit" class="jy-btn">保存</button>\r\n\
    </div>\r\n\
</form>\r\n\
<script>\r\n\
require(["jyui/form"], function (Form) {\r\n\
    Form.render("", "#form");\r\n\
    Form.on("submit(form-test)", function () {\r\n\
        console.log("提交成功");\r\n\
    });\r\n\
});\r\n\
</script>');
codes.push('<input type="text" class="jy-input" jy-verify="required">');
codes.push('<select name="city" jy-verify="required" jy-search="true">\r\n\
    <option value="">选择城市</option>\r\n\
    <option value="1">上海</option>\r\n\
    <option value="2" selected>北京</option>\r\n\
    <option value="3" disabled>广州</option>\r\n\
</select>');
codes.push('<input type="checkbox" name="like" title="篮球" value="篮球" checked>\r\n\
<input type="checkbox" name="like" title="看书" value="看书" disabled>\r\n\
<input type="checkbox" name="like" title="唱歌" value="唱歌">');
codes.push('<input type="radio" name="sex" title="男" value="男" checked>\r\n\
<input type="radio" name="sex" title="女" value="女">');
codes.push('<span>是</span>\r\n\
<input type="checkbox" name="adult" jy-skin="switch" checked>\r\n\
<span>否</span>');
codes.push('<textarea name="sign" class="jy-textarea" style="width:500px;" jy-verify="required"></textarea>');
codes.push('Form.addRule({"max-250": {\r\n\
    msg: "最多输入250个字符",\r\n\
    verify: function (str) {\r\n\
        if (str && str.length > 250) {\r\n\
            return false;\r\n\
        }\r\n\
        return true;\r\n\
    }\r\n\
}})');
codes.push('//只监听属性jy-filter="filter"的radio元素\r\n\
Form.on("radio(filter)", function(event){\r\n\
    //do something\r\n\
});\r\n\
//监听所有raido改变事件\r\n\
Form.on("radio", function(event){\r\n\
    //do something\r\n\
});');
codes.push('//只监听属性jy-filter="filter"的checkbox元素\r\n\
Form.on("checkbox(filter)", function(event){\r\n\
    //do something\r\n\
});\r\n\
//监听所有checkbox改变事件\r\n\
Form.on("checkbox", function(event){\r\n\
    //do something\r\n\
});');
codes.push('//只监听属性jy-filter="filter"的select元素\r\n\
Form.on("select(filter)", function(event){\r\n\
    //do something\r\n\
});\r\n\
//监听所有select改变事件\r\n\
Form.on("select", function(event){\r\n\
    //do something\r\n\
});');
codes.push('//只监听属性jy-filter="filter"的switch元素\r\n\
Form.on("switch(filter)", function(event){\r\n\
    //do something\r\n\
});\r\n\
//监听所有switch改变事件\r\n\
Form.on("switch", function(event){\r\n\
    //do something\r\n\
});');
codes.push('//只监听属性jy-filter="filter"的form元素\r\n\
Form.on("submit(filter)", function(event){\r\n\
    //do something\r\n\
});\r\n\
//监听所有submit事件\r\n\
Form.on("submit", function(event){\r\n\
    //do something\r\n\
});');