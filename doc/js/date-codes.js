/*
 * @Author: lisong
 * @Date: 2021-10-08 11:36:46
 * @Description: 
 */
var codes = [];
codes.push('<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label">常规用法</label>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">日期时间</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="datetime" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">日期</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="date" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">年月</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="yearmonth" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">年</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="year" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">月</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="month" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-inline">\r\n\
    <label for="" class="jy-form-label">时间</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="time" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label">范围选择</label>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期时间范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="datetime1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="datetime2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="date1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="date2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">年月范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="yearmonth1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="yearmonth2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">年范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="year1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="year2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">月范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="month1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="month2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="time1" autocomplete="off">\r\n\
    </div>\r\n\
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="time2" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<div class="jy-form-item">\r\n\
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>\r\n\
    <div class="jy-input-inline">\r\n\
        <input type="text" class="jy-input" id="time3" autocomplete="off">\r\n\
    </div>\r\n\
</div>\r\n\
<script>\r\n\
require(["./jyui/date.js"], function (Date) {\r\n\
    Date.render({\r\n\
        elem: "#datetime",\r\n\
        type: "datetime"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#date",\r\n\
        type: "date"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#yearmonth",\r\n\
        type: "yearmonth"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#year",\r\n\
        type: "year"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#month",\r\n\
        type: "month"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#time",\r\n\
        type: "time"\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#datetime1,#datetime2",\r\n\
        type: "datetime",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#date1,#date2",\r\n\
        type: "date",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#yearmonth1,#yearmonth2",\r\n\
        type: "yearmonth",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#month1,#month2",\r\n\
        type: "month",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#year1,#year2",\r\n\
        type: "year",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#time1,#time2",\r\n\
        type: "time",\r\n\
        range: true\r\n\
    });\r\n\
    Date.render({\r\n\
        elem: "#time3",\r\n\
        type: "time",\r\n\
        range: true\r\n\
    });\r\n\
})');