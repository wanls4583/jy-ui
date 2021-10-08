/*
 * @Author: lisong
 * @Date: 2021-10-08 11:36:46
 * @Description: 
 */
var codes = [];
codes.push(`<div class="jy-form-item">
    <label for="" class="jy-form-label">常规用法</label>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">日期时间</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="datetime" autocomplete="off">
    </div>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">日期</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="date" autocomplete="off">
    </div>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">年月</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="yearmonth" autocomplete="off">
    </div>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">年</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="year" autocomplete="off">
    </div>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">月</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="month" autocomplete="off">
    </div>
</div>
<div class="jy-form-inline">
    <label for="" class="jy-form-label">时间</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="time" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label">范围选择</label>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期时间范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="datetime1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="datetime2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">日期范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="date1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="date2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">年月范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="yearmonth1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="yearmonth2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">年范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="year1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="year2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">月范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="month1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="month2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="time1" autocomplete="off">
    </div>
    <span style="float:left;line-height:38px;">&nbsp;-&nbsp;</span>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="time2" autocomplete="off">
    </div>
</div>
<div class="jy-form-item">
    <label for="" class="jy-form-label" style="white-space:nowrap;">时间范围</label>
    <div class="jy-input-inline">
        <input type="text" class="jy-input" id="time3" autocomplete="off">
    </div>
</div>
<script>
require(['./modules/date.js'], function (Date) {
    Date.render({
        elem: '#datetime',
        type: 'datetime'
    });
    Date.render({
        elem: '#date',
        type: 'date'
    });
    Date.render({
        elem: '#yearmonth',
        type: 'yearmonth'
    });
    Date.render({
        elem: '#year',
        type: 'year'
    });
    Date.render({
        elem: '#month',
        type: 'month'
    });
    Date.render({
        elem: '#time',
        type: 'time'
    });
    Date.render({
        elem: '#datetime1,#datetime2',
        type: 'datetime',
        range: true
    });
    Date.render({
        elem: '#date1,#date2',
        type: 'date',
        range: true
    });
    Date.render({
        elem: '#yearmonth1,#yearmonth2',
        type: 'yearmonth',
        range: true
    });
    Date.render({
        elem: '#month1,#month2',
        type: 'month',
        range: true
    });
    Date.render({
        elem: '#year1,#year2',
        type: 'year',
        range: true
    });
    Date.render({
        elem: '#time1,#time2',
        type: 'time',
        range: true
    });
    Date.render({
        elem: '#time3',
        type: 'time',
        range: true
    });
})`);