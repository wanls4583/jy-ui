/*
 * @Author: lisong
 * @Date: 2021-10-08 11:36:46
 * @Description: 
 */
var codes = [];
codes.push('<div class="jy-form-item">\n\
    <label for="" class="jy-form-label">常规用法</label>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">日期时间</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="datetime" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">日期</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="date" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">年月</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="yearmonth" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">年</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="year" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">月</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="month" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-inline">\n\
    <label for="" class="jy-form-label">时间</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="time" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label">范围选择</label>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期时间范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="datetime1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="datetime2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="date1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="date2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">年月范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="yearmonth1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="yearmonth2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">年范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="year1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="year2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">月范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="month1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="month2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="time1" autocomplete="off">\n\
    </div>\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="time2" autocomplete="off">\n\
    </div>\n\
</div>\n\
<div class="jy-form-item">\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>\n\
    <div class="jy-input-inline">\n\
        <input type="text" class="jy-input" id="time3" autocomplete="off">\n\
    </div>\n\
</div>\n\
<script>\n\
require(["./jyui/date.js"], function (Date) {\n\
    Date.render({\n\
        elem: "#datetime",\n\
        type: "datetime"\n\
    });\n\
    Date.render({\n\
        elem: "#date",\n\
        type: "date"\n\
    });\n\
    Date.render({\n\
        elem: "#yearmonth",\n\
        type: "yearmonth"\n\
    });\n\
    Date.render({\n\
        elem: "#year",\n\
        type: "year"\n\
    });\n\
    Date.render({\n\
        elem: "#month",\n\
        type: "month"\n\
    });\n\
    Date.render({\n\
        elem: "#time",\n\
        type: "time"\n\
    });\n\
    Date.render({\n\
        elem: "#datetime1,#datetime2",\n\
        type: "datetime",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#date1,#date2",\n\
        type: "date",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#yearmonth1,#yearmonth2",\n\
        type: "yearmonth",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#month1,#month2",\n\
        type: "month",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#year1,#year2",\n\
        type: "year",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#time1,#time2",\n\
        type: "time",\n\
        range: true\n\
    });\n\
    Date.render({\n\
        elem: "#time3",\n\
        type: "time",\n\
        range: true\n\
    });\n\
})');