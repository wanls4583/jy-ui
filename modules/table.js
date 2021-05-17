/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Form, Pager, Dialog) {
        var filterIcon = '&#xe61d;';
        var exprotsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var tableClass = {
            view: 'song-table-view',
            table: 'song-table',
            body: 'song-table-body',
            toolbar: 'song-table-toolbar',
            toolbarSelf: 'song-table-tool-self',
            edit: 'song-table-editting',
            input: 'song-table-input',
            checkboxs: 'song-table-checkboxs',
            pager: 'song-table-pager',
            filter: 'song-table-filter'
        }
        var ieVersion = Common.getIeVersion();
        // 常用正则验证
        var ruleMap = {
            'require': {
                reg: /[\s\S]+/,
                msg: '必填项不能为空'
            },
            'number': {
                reg: /\d+/,
                msg: '请输入数字'
            }
        };
        var event = Common.getEvent();
        var Table = {
            render: render,
            on: event.on,
            once: event.once,
            trigger: event.trigger
        }

        // 渲染表格
        function render(option) {
            var $elem = $(option.elem);
            var filter = $elem.attr('song-filter') || '';
            var $view = option.$view || $('<div class="' + tableClass.view + '"></div>');
            var $table = $('<table class="' + tableClass.table + '"></table>');
            var $tableHeader = $('<thead></thead>');
            var $tableBody = $('<tbody></tbody>');
            var $tableMain = $('<div class="' + tableClass.body + '"></div>');
            if (!option.reload) {
                option = Object.assign({}, option);
                $view.html('');
            } else if (!$elem.length) {
                return;
            }
            option.$elem = $elem;
            option.$view = $view;
            option.$table = $table;
            option.$tableHeader = $tableHeader;
            option.$tableBody = $tableBody;
            option.$tableMain = $tableMain;
            option.nowPage = option.nowPage || 1;
            option.limit = option.limit || 20;
            option.filter = filter || 'table_' + Math.random();
            option.renderedData = [];
            option.loadedData = [];
            option.enterSave = option.enterSave || false;
            $view.attr('song-filter', option.filter);
            renderToolbar(option);
            renderTableHeader(option);
            renderTableBody(option);
            mount(option);
            if (option.page !== false) {
                renderPage(option);
            }

            option.reload = function (_option) {
                reload(option, _option);
            }

            option.save = function (rowDataIndex, field) {
                return save(option, rowDataIndex, field);
            }

            option.edit = function (rowDataIndex, field) {
                return edit(option, rowDataIndex, field);
            }

            return option;
        }

        // 重载表格
        function reload(option, _option) {
            option = Object.assign(option, _option || {});
            render(option);
        }

        /**
         * 保存编辑中的数据
         * @param {Object} option 
         * @param {Number} rowDataIndex 
         * @param {String} field 
         */
        function save(option, rowDataIndex, field) {
            var result = true;
            var tds = [];
            if (rowDataIndex !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = getTdByPos(option, rowDataIndex, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    tds = option.$tableBody.find('tr[data-index="' + rowDataIndex + '"]').find('td');
                }
            } else { // 保存所有的数据
                tds = option.$tableBody.find('td');
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                if (td.songBindData && td.songBindData.editing) {
                    result = _verify(td);
                    if (!result) {
                        break;
                    }
                }
            }
            if (result) {
                for (var i = 0; i < tds.length; i++) {
                    var td = tds[i];
                    if (td.songBindData && td.songBindData.editing) {
                        _save(td);
                    }
                }
            }
            return result;

            // 获取编辑中的数据
            function _getValue(td, ifFormat) {
                var value = null;
                var col = td.songBindData.col;
                if (td.songBindData.$input) {
                    value = td.songBindData.$input.val();
                } else if (td.songBindData.$select) {
                    value = td.songBindData.$select[0].value;
                    if (ifFormat) {
                        col.select.map(function (item) {
                            if (item.value == value) {
                                value = item.label;
                            }
                        });
                    }
                } else if (td.songBindData.$checkbox) {
                    value = td.songBindData.$checkbox[0].value
                    if (ifFormat) {
                        var arr = [];
                        value && col.checkbox.map(function (item) {
                            if (hasValue(value, item.value) > -1) {
                                arr.push(item.label);
                            }
                        });
                        value = arr.join('、');
                    }
                }
                return value;
            }

            // 验证输入的数据
            function _verify(td) {
                var pass = true;
                var col = td.songBindData.col;
                var value = _getValue(td);
                // 验证输入内容
                if (col.editable.rules) {
                    for (var i = 0; i < col.editable.rules.length; i++) {
                        var rule = col.editable.rules[i];
                        var msg = rule.msg;
                        if (typeof rule.type == 'string') {
                            rule = ruleMap[rule.type];
                            msg = msg || rule.msg;
                        }
                        if (typeof rule.reg == 'function') {
                            pass = rule.reg(value);
                        } else if (rule.reg) {
                            pass = rule.reg.test(String(value || ''));
                        }
                        if (!pass) {
                            Dialog.msg(msg, {
                                icon: 'error'
                            });
                        }
                    }
                }
                return pass;
            }

            // 保存编辑的数据
            function _save(td) {
                var col = td.songBindData.col;
                var $td = $(td);
                var value = _getValue(td);
                var fValue = _getValue(td, true);
                td.songBindData.rowData[col.field] = value;
                td.songBindData.colData = value;
                td.children[0].innerHTML = col.template ? col.template(td.songBindData.colData, td.songBindData.rowDataIndex, col) : fValue;
                $td.removeClass(tableClass.edit);
                td.songBindData.editing = false;
                td.songBindData.$input = undefined;
                td.songBindData.$select = undefined;
                td.songBindData.$checkbox = undefined;
                Table.trigger('save(' + option.filter + ')', {
                    data: td.colData,
                    dom: td
                });
                Table.trigger('save', {
                    data: td.colData,
                    dom: td
                });
            }
        }

        /**
         * 编辑数据
         * @param {Object} option 
         * @param {Number} rowDataIndex 
         * @param {String} field 
         */
        function edit(option, rowDataIndex, field) {
            var tds = [];
            if (rowDataIndex !== undefined) { // 编辑某一行的数据
                if (field) {
                    var td = getTdByPos(option, rowDataIndex, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    tds = option.$tableBody.find('tr[data-index="' + rowDataIndex + '"]').find('td');
                }
            } else { // 编辑所有的数据
                tds = option.$tableBody.find('td');
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _edit(td);
            }

            function _edit(td) {
                var col = td.songBindData.col;
                if (col.editable && !col.editable.editing) {
                    var data = td.songBindData.colData;
                    var editable = col.editable === true ? {} : col.editable;
                    var $cell = $(td.children[0]);
                    editable.type = editable.type || 'text';
                    if (editable.type == 'text' || editable.type == 'number') { // 输入框编辑
                        var $input = $('<input class="' + [tableClass.$input, 'song-input'].join(' ') + '">');
                        $input.val(data);
                        $input.on('input propertychange', function () {
                            if (editable.type == 'number') {
                                var num = Common.getNum($input.val());
                                if (num !== $input.val()) {
                                    $input.val(num);
                                }
                            }
                        });
                        $cell.empty().append($input);
                        td.songBindData.$input = $input;
                    } else if (editable.type == 'select') { // 下拉框编辑
                        var filter = 'table_edit_select_' + option.filter + '_' + Math.random();
                        var $select = $('<select song-filter="' + filter + '"></select>');
                        col.select && col.select.map(function (item) {
                            $select.append('<option value="' + item.value + '" ' + (item.value == data ? 'selected' : '') + '>' + item.label + '</option>');
                        });
                        $cell.empty().append($select);
                        Form.render('select(' + filter + ')');
                        Form.on('select(' + filter + ')', function (e) {
                            $select[0].value = e.data;
                        });
                        $select[0].value = data;
                        td.songBindData.$select = $select;
                    } else if (editable.type == 'checkbox') { // 复选框编辑
                        var filter = 'table_edit_checkbox_' + option.filter + '_' + Math.random();
                        var $checkbox = $('<div class="' + tableClass.checkboxs + '"></div>');
                        col.checkbox && col.checkbox.map(function (item) {
                            $checkbox.append('<input type="checkbox" song-filter="' + filter + '" title="' + item.label + '" value="' + item.value + '" ' + (data && hasValue(data, item.value) > -1 ? 'checked' : '') + '/>');
                        });
                        $cell.empty().append($checkbox);
                        Form.render('checkbox(' + filter + ')');
                        Form.on('checkbox(' + filter + ')', function (e) {
                            $checkbox[0].value = e.data;
                        });
                        $checkbox[0].value = data;
                        td.songBindData.$checkbox = $checkbox;
                    }
                    $(td).addClass(tableClass.edit);
                    td.songBindData.editing = true;
                    // 触发编辑事件
                    Table.trigger('edit(' + option.filter + ')', {
                        data: data,
                        dom: td
                    });
                    Table.trigger('edit', {
                        data: data,
                        dom: td
                    });
                }
            }
        }

        /**
         * 获取td
         * @param {Object} option 
         * @param {Number} rowDataIndex 
         * @param {String} field 
         */
        function getTdByPos(option, rowDataIndex, field) {
            return option.$tableBody.find('tr[data-index="' + rowDataIndex + '"]').find('td[data-field="' + field + '"]')[0];
        }

        // 挂载
        function mount(option) {
            var $elem = option.$elem;
            var $view = option.$view;
            var $tableMain = option.$tableMain;
            var $table = option.$table;
            var $tableHeader = option.$tableHeader;
            var $tableBody = option.$tableBody;
            if (!$view.parent().length) {
                $view.insertAfter($elem);
                $elem.hide();
            }
            $view.append($tableMain);
            $tableMain.css({
                width: $tableMain.width() + 'px'
            });
            $table.append($tableHeader);
            $table.append($tableBody);
            $tableMain.append($table);
            bindViewEvent(option);
        }

        // 渲染工具条
        function renderToolbar(option) {
            var $view = option.$view;
            var $toolbar = $('<div class="' + [tableClass.toolbar, 'song-row'].join(' ') + '"></div>');
            if (option.defaultToolbar) {
                var defaultToolbar = option.defaultToolbar;
                var $tool = $('<div class="' + tableClass.toolbarSelf + '"></div>');
                if (defaultToolbar === true) {
                    defaultToolbar = ['filter', 'exprots', 'print']
                }
                for (var i = 0; i < defaultToolbar.length; i++) {
                    switch (defaultToolbar[i]) {
                        case 'filter':
                            $tool.append('<div title="筛选" class="song-table-tool song-icon song-display-inline-block" song-event="filter">' + filterIcon + '</div>');
                            break;
                        case 'exprots':
                            $tool.append('<div title="导出" class="song-table-tool song-icon song-display-inline-block" song-event="exprots">' + exprotsIcon + '</div>');
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="song-table-tool song-icon song-display-inline-block" song-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (option.toolbar || option.defaultToolbar) {
                $toolbar.append(option.toolbar);
                $view.append($toolbar);
            }
        }

        // 渲染表头
        function renderTableHeader(option) {
            var $view = option.$view;
            var $tableHeader = option.$tableHeader;
            var filter = option.filter;
            var $tr = $('<tr></tr>');
            var cols = option.cols;
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                var $cell = $('<div class="cell">' + (col.title || '') + '</div>');
                var $th = $('<th data-field="' + (col.field || '') + '"></th>');
                $th.append($cell);
                $tr.append($th);
                if (col.hidden) {
                    $th.hide();
                }
                if (col.width) {
                    // ie6及以下使用的事border-box
                    $th.css({
                        width: (ieVersion <= 6 ? col.width + 30 : col.width) + 'px'
                    });
                }
                // 单选
                if (col.type == 'radio' && filter) {
                    Form.once('radio(table_radio_' + filter + ')', function (e) {
                        option.selectedData = {
                            index: e.data,
                            data: option.renderedData[e.data]
                        }
                        Table.trigger('radio(' + filter + ')', option.renderedData[e.data]);
                        Table.trigger('radio', option.renderedData[e.data]);
                    });
                }
                // 多选
                if (col.type == 'checkbox' && filter) {
                    $cell.html('<input type="checkbox" song-filter="table_checkbox_' + filter + '_all">');
                    Form.once('checkbox(table_checkbox_' + filter + ')', function (e) {
                        var checkedData = [];
                        for (var i = 0; i < e.data.length; i++) {
                            checkedData.push(option.renderedData[e.data[i]]);
                        }
                        option.checkedData = {
                            index: e.data,
                            data: checkedData
                        }
                        Table.trigger('checkbox(' + filter + ')', checkedData);
                        Table.trigger('checkbox', checkedData);
                    });
                    // 全选或者全部选
                    Form.once('checkbox(table_checkbox_' + filter + '_all)', function (e) {
                        var index = [];
                        var checked = $(e.dom).prop('checked');
                        var checkedData = checked ? option.renderedData.concat([]) : [];
                        var boxs = $view.find('input[type="checkbox"][song-filter="table_checkbox_' + filter + '"]');
                        boxs.each(function (i, box) {
                            $(box).prop('checked', checked);
                            checked && index.push(i);
                        });
                        option.checkedData = {
                            index: index,
                            data: checkedData
                        }
                        Table.trigger('checkbox(' + filter + ')', checkedData);
                        Table.trigger('checkbox', checkedData);
                        Form.render('checkbox(table_checkbox_' + filter + ')');
                    });
                }
            }
            $tableHeader.append($tr);
        }

        // 渲染表数据
        function renderTableBody(option, complete) {
            var $tableBody = option.$tableBody;
            if (option.data) {
                var start = (option.nowPage - 1) * option.limit;
                var end = option.nowPage * option.limit;
                option.renderedData = option.data.slice(start, end);
                _createTd();
                complete && complete();
                Form.render();
            } else {
                httpGet(option, function (res) {
                    option.renderedData = res.data;
                    option.loadedData = res.data;
                    _createTd();
                    complete && complete();
                    option.pager.count != res.count && option.pager.reload({
                        count: res.count
                    });
                    Form.render();
                });
            }

            function _createTd() {
                var cols = option.cols;
                var filter = option.filter;
                var data = option.renderedData;
                $tableBody.html('');
                option.$tableHeader.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
                for (var index = 0; index < data.length && index < option.limit; index++) {
                    var item = data[index];
                    var $tr = $('<tr data-index="' + index + '"></tr>');
                    $tr[0].songBindData = {};
                    for (var col_i = 0; col_i < cols.length; col_i++) {
                        var col = cols[col_i];
                        var $td = $('<td data-field="' + (col.field || '') + '"></td>');
                        var $cell = null;
                        $td[0].songBindData = {};
                        if (!col.type || col.type == 'normal') {
                            var html = item[col.field];
                            if (col.template) { // 自定义渲染函数
                                html = col.template(item, index, col);
                            } else if (col.select) { // 下列列表中的数据
                                html = '';
                                col.select.map(function (obj) {
                                    if (obj.value == item[col.field]) {
                                        html = obj.label;
                                    }
                                });
                            } else if (col.checkbox) { // 复选框中的数据
                                html = '';
                                col.checkbox.map(function (obj) {
                                    if (obj.value == item[col.field]) {
                                        html = ',' + obj.label;
                                    }
                                });
                                html = html.slice(1);
                            }
                            $cell = $('<div class="cell">' + html + '</div>');
                        } else if (col.type == 'radio') {
                            $cell = $('<div class="cell"><input type="radio" name="table_radio_' + filter + '" value="' + index + '" song-filter="table_radio_' + filter + '"/></div>');
                        } else if (col.type == 'checkbox') {
                            $cell = $('<div class="cell"><input type="checkbox" name="table_checkbox_' + filter + '" value="' + index + '" song-filter="table_checkbox_' + filter + '"/></div>');
                        } else if (col.type == 'operate') {
                            $cell = $('<div class="cell"></div>');
                            if (col.btns) {
                                for (var btn_i = 0; btn_i < col.btns.length; btn_i++) {
                                    var btn = col.btns[btn_i];
                                    $cell.append('<button class="song-btn song-btn-xs ' + (btn.type ? 'song-btn-' + btn.type : '') + '" song-event="' + btn.event + '" style="margin-right:10px">' + btn.text + '</button>');
                                }
                            } else {
                                $cell.append(col.template(item, btn_i, col));
                            }
                        }
                        $td[0].songBindData.colData = item[col.field];
                        $td[0].songBindData.col = col;
                        $td[0].songBindData.rowDataIndex = index;
                        $td[0].songBindData.rowData = item;
                        $td.append($cell);
                        $tr.append($td);
                        if (col.hidden) {
                            $td.hide();
                        }
                    }
                    $tr[0].songBindData.rowDataIndex = index;
                    $tr[0].songBindData.rowData = item;
                    $tableBody.append($tr);
                }
                bindTableBodyEvent(option);
            }
        }

        // 渲染页码
        function renderPage(option) {
            var $view = option.$view;
            var $pager = $('<div class="' + tableClass.pager + '"></div>');
            var $elem = $('<div song-filter="table_pager_' + option.filter + '"></div>');
            $pager.append($elem);
            $view.append($pager);
            option.pager = Pager.render({
                elem: $elem[0],
                nowPage: option.nowPage,
                limit: option.limit,
                size: 'small',
                count: option.data ? option.data.length : option.loadedData.length,
                prev: '<span style="font-weight:bold">' + leftIcon + '</span>',
                next: '<span style="font-weight:bold">' + rightIon + '</span>'
            });
            Pager.on('page(table_pager_' + option.filter + ')', function (page) {
                option.nowPage = page;
                renderTableBody(option);
            });
            Pager.on('limit(table_pager_' + option.filter + ')', function (limit) {
                option.limit = limit;
            });
        }

        function httpGet(option, success, error) {
            var data = option.reqeust.data || {};
            data[option.reqeust.pageName || 'page'] = option.nowPage;
            data[option.reqeust.limitName || 'limit'] = option.limit;
            $.ajax({
                url: option.reqeust.url,
                method: option.reqeust.method || 'get',
                dataType: option.reqeust.dataType || 'json',
                contentType: option.reqeust.contentType || 'application/json',
                data: data,
                success: function (res) {
                    option.reqeust.success && option.reqeust.success(res);
                    success(option.reqeust.parseData && option.reqeust.parseData(res) || res);
                },
                error: function (res) {
                    option.reqeust.error && option.reqeust.error(res);
                    error && error(res);
                }
            })
        }

        // 绑定容器的事件
        function bindViewEvent(option) {
            var $view = option.$view
            if (option.binded) {
                return;
            }
            option.binded = true;
            var filter = $view.attr('song-filter');
            // 表格中的所有点击事件
            $view.on('click', function (e) {
                var $target = $(e.target);
                var event = $target.attr('song-event');
                if (event) {
                    filter && Table.trigger(event + '(' + filter + ')', {
                        dom: $target[0]
                    });
                    Table.trigger(event, {
                        dom: $target[0]
                    });
                }
            });
            $view.on('keydown', function (e) {
                var $td = $(e.target).parents('td');
                if ($td.length && e.keyCode == 13) {
                    option.save($td[0].songBindData.rowDataIndex, $td[0].songBindData.field);
                }
            });
            // 点击表格之外的区域，自动保存编辑中的数据
            $(window.document.body).on('click', function (e) {
                if ($(e.target).parents('tbody')[0] != option.$tableBody[0]) {
                    option.save();
                }
            });
            Table.on('filter', function (e) {
                if ($view.find('ul.song-table-filter').length > 0) {
                    $view.find('ul.song-table-filter').toggle();
                } else {
                    createFilter(option, e.dom);
                }
            });
            Table.on('exports', function (e) {});
            Table.on('print', function (e) {});
        }

        // 绑定表格体的事件
        function bindTableBodyEvent(option) {
            var trigger = option.trigger || 'click';
            option.$tableBody.on(trigger, function (e) {
                var $target = $(e.target);
                if ($target.attr('song-event')) {
                    return;
                }
                var $td = $target.parents('td');
                if (!$td.length || $td[0].songBindData.editing || $target.parents('tbody')[0] != option.$tableBody[0]) {
                    return;
                }
                // 先保存真在编辑中的数据
                var pass = option.save();
                if (pass && $td[0].songBindData.col.editable) {
                    option.edit($td[0].songBindData.rowDataIndex, $td[0].songBindData.col.field);
                }
            });
        }

        // 创建过滤器
        function createFilter(option, dom) {
            var $view = option.$view;
            var filter = option.filter;
            var $filter = $('<ul class="' + tableClass.filter + '"></ul>');
            for (var i = 0; i < option.cols.length; i++) {
                var col = option.cols[i];
                if (!col.type || col.type == 'normal') {
                    $filter.append('<li><input type="checkbox" title="' + col.title + '" value="' + col.field + '" checked song-filter="song_table_' + filter + '_filter"></li>');
                }
            }
            $(dom).append($filter);
            Form.on('checkbox(song_table_' + filter + '_filter)', function (e) {
                var $input = $(e.dom);
                var value = $input.val();
                var checked = $input.prop('checked');
                if (checked) {
                    $view.find('th[data-field="' + value + '"],td[data-field="' + value + '"]').show();
                } else {
                    $view.find('th[data-field="' + value + '"],td[data-field="' + value + '"]').hide();
                }
            });
            Form.render('checkbox(song_table_' + filter + '_filter)');
        }

        return Table;
    }

    // 查找数组内容
    function hasValue(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return i;
            }
        }
        return -1;
    }

    if ("function" == typeof define && define.amd) {
        define("table", ['./jquery', './common', './form', './pager', 'dialog'], function ($, Common, Form, Dialog) {
            return factory($, Common, Form, Pager, Dialog);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = factory(window.$, window.SongUi.Common, window.SongUi.Form, window.SongUi.Pager, window.SongUi.Dialog);
    }
})(window)