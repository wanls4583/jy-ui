/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Form, Pager, Dialog) {
        var filterIcon = '&#xe61d;';
        var exportsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var closeIcon = '&#xe735;';
        var ieVersion = Common.getIeVersion();
        var tableClass = {
            view: 'song-table-view',
            table: 'song-table',
            tableHeader: 'song-table-header',
            main: 'song-table-main',
            tool: 'song-table-tool',
            toolbar: 'song-table-toolbar',
            toolbarSelf: 'song-table-tool-self',
            edit: 'song-table-editting',
            input: 'song-table-input',
            checkboxs: 'song-table-checkboxs',
            pager: 'song-table-pager',
            filter: 'song-table-filter',
            exports: 'song-table-exports',
            tipIcon: 'song-table-tip-icon',
            tip: 'song-table-tip',
            tipClose: 'song-table-tip-close',
            detail: 'song-table-detail',
            hover: 'song-table-hover',
            fixedLeft: 'song-table-fixed-l',
            fixedRight: 'song-table-fixed-r',
            fixedMain: 'song-table-fixed-main'
        }
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
            var filter = $elem.attr('song-filter') || Math.random();
            var $view = option.$view || $('<div class="' + tableClass.view + '"></div>');
            var $table = $('<table class="' + tableClass.table + '"></table>');
            var $tableBody = $('<tbody></tbody>');
            var $header = $('<div class="' + tableClass.tableHeader + '"></div>')
            var $tableHeader = $('<table class="' + tableClass.table + '"></table>');
            var $tableHeaderHead = $('<thead></thead>');
            var $tableMain = $('<div class="' + tableClass.main + '"></div>');
            if (!option.reload) {
                option = Object.assign({}, option);
                $view.html('');
            } else if (!$elem.length) {
                return;
            }
            option.$elem = $elem;
            option.$view = $view;
            option.$table = $table;
            option.$header = $header;
            option.$tableHeader = $tableHeader;
            option.$tableHeaderHead = $tableHeaderHead;
            option.$tableBody = $tableBody;
            option.$tableMain = $tableMain;
            option.$filter = null;
            option.$exports = null;
            option.nowPage = option.nowPage || 1;
            option.limit = option.limit || 20;
            option.stretch = option.stretch || false;
            option._idCount = 0;
            option._filter = filter || 'table_' + Math.random();
            option._renderedData = [];
            option._loadedData = [];
            option._addedData = [];
            option._deletedData = [];
            option._editedData = [];
            option._checkedData = [];
            option._selectedData = null;
            option.enterSave = option.enterSave || false;
            option.width && $view.css({
                width: option.width
            });
            option.height && $view.css({
                height: option.height
            });
            $view.attr('song-filter', option._filter);
            // 已存在view，则不再插入
            if (!$view.parent().length) {
                $view.insertAfter($elem);
                $elem.hide();
            }
            var l = option.cols.filter(function (item) {
                return item.fixed == 'left';
            });
            var r = option.cols.filter(function (item) {
                return item.fixed == 'right';
            });
            var o = option.cols.filter(function (item) {
                return item.fixed != 'left' && item.fixed != 'right';
            });
            // 列排序，使左固定列在左边，右固定列在右边
            option.cols = l.concat(o).concat(r)
            renderToolbar(option);
            renderTableHeader(option);
            renderTableBody(option);
            bindViewEvent(option);
            if (option.page !== false) {
                renderPage(option);
            }
            if (option.height) {
                var h = option.height;
                h -= option.$header.height();
                if (option.$toolbar) {
                    h -= option.$toolbar.outerHeight();
                }
                if (option.$pager) {
                    h -= option.$pager.outerHeight();
                }
                option.$tableMain.css({
                    height: h + 'px'
                });
            }

            option.reload = function (_option) {
                reload(option, _option);
            }

            option.addRow = function (_option) {
                addRow(option, _option);
            }

            option.deleteRow = function (id) {
                deleteRow(option, id);
            }

            option.save = function (id, field) {
                return save(option, id, field);
            }

            option.edit = function (id, field) {
                return edit(option, id, field);
            }

            option.getData = function (type) {
                return getData(option, type);
            }

            option.setData = function (_option) {
                return setData(option, _option);
            }

            return option;
        }

        // 重载表格
        function reload(option, _option) {
            option = Object.assign(option, _option || {});
            render(option);
        }

        /**
         * 添加数据行
         * @param {*} option 
         * @param {*} _option [{data, id, position}]
         */
        function addRow(option, _option) {
            var data = _option.data instanceof Array ? _option.data : [_option.data];
            var index = -2;
            var renderLength = option._renderedData.length;
            if (typeof _option.id == undefined) {
                index = option._renderedData.length - 1;
            } else {
                for (var i = 0; i < option._renderedData.length; i++) {
                    if (_option.id != undefined && option._renderedData[i]._song_table_id == _option.id) {
                        index = i + 1;
                        break;
                    }
                }
            }
            if (_option.position == 'before') {
                index--;
            }
            index = index < 0 ? renderLength : index;
            option._renderedData = option._renderedData.slice(0, index).concat(data).concat(option._renderedData.slice(index));
            if (index && index >= renderLength) {
                index = renderLength - 1;
            }
            data.map(function (item) {
                option._addedData.push(item);
            });
            var tr = null;
            if (_option.id) {
                tr = option.$tableBody.find('tr[data-id="' + _option.id + '"]')[0];
            }
            if (tr) {
                data.reverse().map(function (item, i) {
                    var $tr = createTr(option, item);
                    $tr.insertAfter(tr);
                });
            } else {
                data.map(function (item, i) {
                    var $tr = createTr(option, item);
                    option.$tableBody.append($tr);
                });
            }
            Form.render();
        }

        /**
         * 删除数据行
         * @param {*} option
         * @param {*} id
         */
        function deleteRow(option, id) {
            var $tr = option.$tableBody.find('tr[data-id="' + id + '"]');
            for (var i = 0; i < option._renderedData.length; i++) {
                if (id !== undefined && option._renderedData[i]._song_table_id == id) {
                    option._deletedData.push(option._renderedData[i]);
                    for (var j = 0; j < option._addedData.length; j++) {
                        if (option._addedData[j]._song_table_id == option._renderedData[i]._song_table_id) {
                            option._addedData.splice(j, 1);
                            break;
                        }
                    }
                    for (var j = 0; j < option._editedData.length; j++) {
                        if (option._editedData[j]._song_table_id == option._renderedData[i]._song_table_id) {
                            option._editedData.splice(j, 1);
                            break;
                        }
                    }
                    option._renderedData.splice(i, 1);
                    // 删除溢出内容弹框
                    $tr.children('td').each(function (i, td) {
                        td.songBindData.$tip && td.songBindData.$tip.remove();
                    });
                    $tr.remove();
                    return;
                }
            }
        }

        /**
         * 保存编辑中的数据
         * @param {Object} option 
         * @param {Number} id 
         * @param {String} field 
         */
        function save(option, id, field) {
            var result = true;
            var tds = [];
            if (id !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = getTdById(option, id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    option.$tableBody.find('tr[data-id="' + id + '"]').each(_filter);
                    if (option.$fixedLeftTable) {
                        option.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (option.$fixedRightTable) {
                        option.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 保存所有的数据
                option.$tableBody.find('td').each(_filter);
                if (option.$fixedLeftTable) {
                    option.$fixedLeftTable.find('td').each(_filter);
                }
                if (option.$fixedRightTable) {
                    option.$fixedRightTable.find('td').each(_filter);
                }
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

            function _filter(i, td) {
                if (!$(td).hasClass('song-fixed-empty')) {
                    tds.push(td);
                }
            }

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
                var originValue = td.songBindData.colData;
                td.songBindData.rowData[col.field] = value;
                td.songBindData.colData = value;
                td.children[0].innerHTML = col.template ? col.template(td.songBindData.colData, td.songBindData.id, col) : fValue;
                $td.removeClass(tableClass.edit);
                td.songBindData.editing = false;
                td.songBindData.$input = undefined;
                td.songBindData.$select = undefined;
                td.songBindData.$checkbox = undefined;
                // 值被修改过
                if (String(originValue) != String(value)) {
                    var pushed = true;
                    for (var i = 0; i < option._editedData.length; i++) {
                        if (option._editedData[0]._song_table_id == td.songBindData.rowData._song_table_id) {
                            pushed = false;
                            break;
                        }
                    }
                    if (pushed) {
                        option._editedData.push(td.songBindData.rowData);
                    }
                }
            }
        }

        /**
         * 动态设置单元格数据
         * @param {Object} option 
         * @param {Object} _option 
         */
        function setData(option, _option) {
            var id = _option.id;
            var field = _option.field;
            var data = _option.data;
            var $tr = option.$tableBody.find('tr[data-id="' + id + '"]');
            var editFields = [];
            $tr.find('td').each(function (i, td) {
                if (td.songBindData.editing) {
                    editFields.push(td.songBindData.col.field);
                }
            });
            for (var i = 0; i < option._renderedData.length; i++) {
                var rowData = option._renderedData[i];
                if (rowData._song_table_id == id) {
                    var _data = null;
                    if (field) {
                        if (rowData[field] != data) {
                            rowData[field] = data;
                            _data = rowData;
                        }
                    } else {
                        data._song_table_id = rowData._song_table_id;
                        _data = Object.assign({}, data);
                    }
                    if (_data) {
                        option._renderedData.splice(i, _data);
                        $tr.replaceWith(createTr(option, _data));
                        editFields.map(function (field) {
                            edit(option, _data._song_table_id, field);
                        });
                        Form.render();
                    }
                    break;
                }
            }
        }

        /**
         * 编辑数据
         * @param {Object} option 
         * @param {Number} id 
         * @param {String} field 
         */
        function edit(option, id, field) {
            var tds = [];
            if (id !== undefined) { // 编辑某一行的数据
                if (field) {
                    var td = getTdById(option, id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    option.$tableBody.find('tr[data-id="' + id + '"]').each(_filter);
                    if (option.$fixedLeftTable) {
                        option.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (option.$fixedRightTable) {
                        option.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 编辑所有的数据
                option.$tableBody.find('td').each(_filter);
                if (option.$fixedLeftTable) {
                    option.$fixedLeftTable.find('td').each(_filter);
                }
                if (option.$fixedRightTable) {
                    option.$fixedRightTable.find('td').each(_filter);
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _edit(td);
            }

            function _filter(i, td) {
                if (!$(td).hasClass('song-fixed-empty')) {
                    tds.push(td);
                }
            }

            function _edit(td) {
                var col = td.songBindData.col;
                if (col.editable && !col.editable.editing) {
                    var data = td.songBindData.colData;
                    var editable = col.editable === true ? {} : col.editable;
                    var $cell = $(td.children[0]);
                    editable.type = editable.type || 'text';
                    if (editable.type == 'text' || editable.type == 'number') { // 输入框编辑
                        var $input = $('<input class="' + [tableClass.input, 'song-input'].join(' ') + '">');
                        $input.val(data);
                        $input.on('input propertychange', function () {
                            // 只可输入数字
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
                        var filter = 'table_edit_select_' + option._filter + '_' + Math.random();
                        var $select = $('<select song-filter="' + filter + '"></select>');
                        col.select && col.select.map(function (item) {
                            $select.append('<option value="' + item.value + '" ' + (item.value == data ? 'selected' : '') + '>' + item.label + '</option>');
                        });
                        $cell.empty().append($select);
                        // 触发select事件
                        Form.render('select(' + filter + ')');
                        Form.on('select(' + filter + ')', function (e) {
                            $select[0].value = e.data;
                        });
                        $select[0].value = data;
                        td.songBindData.$select = $select;
                    } else if (editable.type == 'checkbox') { // 复选框编辑
                        var filter = 'table_edit_checkbox_' + option._filter + '_' + Math.random();
                        var $checkbox = $('<div class="' + tableClass.checkboxs + '"></div>');
                        col.checkbox && col.checkbox.map(function (item) {
                            $checkbox.append('<input type="checkbox" song-filter="' + filter + '" title="' + item.label + '" value="' + item.value + '" ' + (data && hasValue(data, item.value) > -1 ? 'checked' : '') + '/>');
                        });
                        $cell.empty().append($checkbox);
                        // 触发checkbox事件
                        Form.render('checkbox(' + filter + ')');
                        Form.on('checkbox(' + filter + ')', function (e) {
                            $checkbox[0].value = e.data;
                        });
                        $checkbox[0].value = data;
                        td.songBindData.$checkbox = $checkbox;
                    }
                    $(td).addClass(tableClass.edit);
                    td.songBindData.editing = true;
                }
            }
        }

        /**
         * 获取处理过的数据
         * @param {Object} option 
         * @param {String} type 
         */
        function getData(option, type) {
            var data = null;
            type = type || 'render';
            switch (type) {
                case 'render':
                    data = option._renderedData;
                    break;
                case 'radio':
                    data = option._selectedData;
                    break;
                case 'checkbox':
                    data = option._checkedData;
                    break;
                case 'add':
                    data = option._addedData;
                    break;
                case 'del':
                    data = option._deletedData;
                    break;
                case 'edit':
                    data = option._editedData;
                    break;
            }
            if (data) {
                if (data instanceof Array) {
                    data = data.map(function (item) {
                        return _delInnerProperty(item);
                    });
                } else {
                    data = _delInnerProperty(data);
                }
            }

            function _delInnerProperty(data) {
                var obj = {};
                for (var key in data) {
                    // 去掉内部数据字段
                    if (key.slice(0, 11) != '_song_table') {
                        obj[key] = data[key];
                    }
                }
                return obj;
            }
            return data;
        }

        /**
         * 获取td
         * @param {Object} option 
         * @param {Number} id 
         * @param {String} field 
         */
        function getTdById(option, id, field) {
            var col = getColByField(option, field);
            var td = null;
            if (col.fixed == 'left') {
                td = option.$fixedLeftTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else if (col.fixed == 'right') {
                td = option.$fixedRightTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else {
                td = option.$table.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            }
            return td;
        }

        /**
         * 根据字段名称返回列配置对象
         * @param {Object} option 
         * @param {String} field 
         */
        function getColByField(option, field) {
            for (var i = 0; i < option.cols.length; i++) {
                if (option.cols[i].field == field) {
                    return option.cols[i];
                }
            }
        }

        // 渲染工具条
        function renderToolbar(option) {
            var $toolbar = $('<div class="' + [tableClass.toolbar, 'song-row'].join(' ') + '"></div>');
            if (option.defaultToolbar) {
                var defaultToolbar = option.defaultToolbar;
                var $tool = $('<div class="' + tableClass.toolbarSelf + '"></div>');
                // 默认工具条
                if (defaultToolbar === true) {
                    defaultToolbar = ['filter', 'exports', 'print']
                }
                for (var i = 0; i < defaultToolbar.length; i++) {
                    switch (defaultToolbar[i]) {
                        case 'filter':
                            $tool.append('<div title="筛选" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="filter" song-stop="true">' + filterIcon + '</div>');
                            break;
                        case 'exports':
                            var $div = $('<div title="导出" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="exports" song-stop="true">' + exportsIcon + '</div>');
                            var $exports = $(
                                '<ul class="' + tableClass.exports + '" style="display:none">\
                                    <li song-stop="true" song-event="exports-excel">导出Excel文件</li>\
                                    <li song-stop="true" song-event="exports-csv">导出Csv文件</li>\
                                </ul>');
                            $div.append($exports);
                            $tool.append($div);
                            option.$exports = $exports;
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (option.toolbar || option.defaultToolbar) {
                option.$toolbar = $toolbar;
                $toolbar.append(option.toolbar);
                option.$view.prepend($toolbar);
            }
        }

        /**
         * 渲染表头
         * @param {Object} option 
         * @param {String} fixed 
         */
        function renderTableHeader(option, fixed) {
            var $view = option.$view;
            var filter = option._filter;
            var $tr = $('<tr></tr>');
            var cols = option.cols;
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (fixed && col.fixed != fixed) {
                    break;
                }
                var width = col.width;
                var $cell = $('<div class="cell">' + (col.title || '') + '</div>');
                var $th = $('<th data-field="' + (col.field || '') + '"></th>');
                $th.append($cell);
                $tr.append($th);
                $th[0].songBindData = {
                    col: col
                };
                col.type = col.type || 'text';
                if (col.hidden) {
                    $th.hide();
                }
                if (col.type == 'radio' || col.type == 'checkbox') {
                    width = 20;
                    $cell.css({
                        'text-overflow': 'unset'
                    });
                }
                if (width) {
                    $cell.css({
                        'width': (ieVersion <= 6 ? width + 30 : width) + 'px'
                    });
                }
                // 固定列和普通列中中渲染一个
                if (fixed || (col.fixed != 'left' && col.fixed != 'right')) {
                    // 单选
                    if (col.type == 'radio' && filter) {
                        Form.once('radio(table_radio_' + filter + ')', function (e) {
                            option._selectedData = option._renderedData[e.data];
                        });
                    }
                    // 多选
                    if (col.type == 'checkbox' && filter) {
                        var $all = $('<input type="checkbox" song-filter="table_checkbox_' + filter + '_all">');
                        $cell.html($all);
                        Form.once('checkbox(table_checkbox_' + filter + ')', function (e) {
                            var checkedData = [];
                            for (var i = 0; i < e.data.length; i++) {
                                checkedData.push(option._renderedData[e.data[i]]);
                            }
                            option._checkedData = checkedData
                            $all.prop('checked', checkedData.length == option._renderedData.length);
                            Form.render('checkbox(table_checkbox_' + filter + '_all)');
                        });
                        // 全选或者全不选
                        Form.once('checkbox(table_checkbox_' + filter + '_all)', function (e) {
                            var checked = $(e.dom).prop('checked');
                            var checkedData = checked ? option._renderedData.concat([]) : [];
                            var boxs = $view.find('input[type="checkbox"][song-filter="table_checkbox_' + filter + '"]');
                            boxs.each(function (i, box) {
                                $(box).prop('checked', checked);
                            });
                            option._checkedData = checkedData
                            Form.render('checkbox(table_checkbox_' + filter + ')');
                        });
                    }
                    if (col.type != 'text') {
                        $th.addClass('song-table-col-' + col.type);
                    }
                }
            }
            if (fixed) {
                if (fixed == 'left') {
                    option.$fixedLeftTableHeaderHead.append($tr);
                } else {
                    option.$fixedRightTableHeaderHead.append($tr);
                }
                return;
            }
            option.$tableHeaderHead.append($tr);
            option.$tableHeader.append(option.$tableHeaderHead);
            option.$header.append(option.$tableHeader);
            option.$header.insertAfter(option.$toolbar);
            var hedaerWidth = option.$header.width();
            var tableHeaderWidth = option.$tableHeader.width();
            if (option.stretch && tableHeaderWidth < hedaerWidth) {
                option.$tableHeader.css({
                    width: hedaerWidth + 'px'
                });
                option.$table.css({
                    width: hedaerWidth + 'px'
                });
                var ths = option.$tableHeaderHead.find('th');
                var ws = [];
                ths.each(function (i, th) {
                    var $th = $(th);
                    var $cell = $th.children('.cell');
                    var tw = $th.width();
                    var cw = $cell.width();
                    var width = 0;
                    if (option.stretch) {
                        width = ieVersion <= 6 ? tw : tw - 30;
                    } else {
                        width = cw;
                    }
                    ws.push(width);
                });
                ths.each(function (i, th) {
                    var $cell = $(th).children('.cell');
                    $cell.css({
                        width: ws[i] + 'px'
                    })
                });
            }
        }

        // 渲染表数据
        function renderTableBody(option, complete) {
            var cols = option.cols;
            if (option.data) {
                var start = (option.nowPage - 1) * option.limit;
                var end = option.nowPage * option.limit;
                option._renderedData = option.data.slice(start, end).map(function (item) {
                    return Object.assign({}, item);
                });
                renderTr(option);
                setTimeout(function () {
                    // 渲染固定列
                    renderTableFixed(option);
                });
                complete && complete();
            } else {
                httpGet(option, function (res) {
                    option._renderedData = res.data;
                    option._loadedData = res.data.map(function (item) {
                        return Object.assign({}, item);
                    });
                    cols[0].fixed == 'left' && renderTr(option, 'left');
                    cols[cols.length - 1].fixed == 'right' && renderTr(option, 'right');
                    renderTr(option);
                    setTimeout(function () {
                        // 渲染固定列
                        renderTableFixed(option);
                    });
                    complete && complete();
                    option.pager.count != res.count && option.pager.reload({
                        count: res.count
                    });
                });
            }

            var viewWidth = option.$view.width();
            option.$table.append(option.$tableBody);
            option.$tableMain.append(option.$table);
            option.$tableMain.insertAfter(option.$header);
            option.$tableMain.css({
                width: viewWidth + 'px'
            });
            var tableWidth = option.$table.width();
            if (option.stretch && tableWidth < viewWidth) {
                option.$table.css({
                    width: viewWidth + 'px'
                });
            }
        }

        /**
         * 渲染固定列表格
         * @param {Object} option 
         */
        function renderTableFixed(option) {
            var cols = option.cols;
            if (cols.length && cols[0].fixed == 'left') {
                option.$fixedLeft = $('<div class="' + tableClass.fixedLeft + '"></div>');
                option.$fixedLeftMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                option.$fixedLeftTable = $('<table class="' + tableClass.table + '"></table>');
                option.$fixedLeftTableHeader = $('<table class="' + tableClass.table + '"></table>');
                option.$fixedLeftTableHeaderHead = $('<thead></thead>');
                option.$fixedLeft.append(option.$fixedLeftTableHeader);
                option.$fixedLeft.append(option.$fixedLeftMain);
                option.$fixedLeftTableHeader.append(option.$fixedLeftTableHeaderHead);
                option.$fixedLeftMain.append(option.$fixedLeftTable);
                option.$fixedLeft.css({
                    height: option.$tableHeader[0].clientHeight + option.$tableMain[0].clientHeight + 'px',
                    top: (option.$toolbar ? option.$toolbar[0].clientHeight : 0) + 'px'
                });
                option.$fixedLeftMain.css({
                    height: option.$tableMain[0].clientHeight + 'px'
                });
                renderTr(option, 'left');
                renderTableHeader(option, 'left');
                option.$view.append(option.$fixedLeft);
            }
            if (cols.length && cols[cols.length - 1].fixed == 'right') {
                option.$fixedRight = $('<div class="' + tableClass.fixedRight + '"></div>');
                option.$fixedRightMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                option.$fixedRightTable = $('<table class="' + tableClass.table + '"></table>');
                option.$fixedRightTableHeader = $('<table class="' + tableClass.table + '"></table>');
                option.$fixedRightTableHeaderHead = $('<thead></thead>');
                option.$fixedRight.append(option.$fixedRightTableHeader);
                option.$fixedRight.append(option.$fixedRightMain);
                option.$fixedRightTableHeader.append(option.$fixedRightTableHeaderHead);
                option.$fixedRightMain.append(option.$fixedRightTable);
                option.$fixedRight.css({
                    height: option.$tableHeader[0].clientHeight + option.$tableMain[0].clientHeight + 'px',
                    top: (option.$toolbar ? option.$toolbar[0].clientHeight : 0) + 'px'
                });
                option.$fixedRightMain.css({
                    height: option.$tableMain[0].clientHeight + 'px'
                });
                renderTr(option, 'right');
                renderTableHeader(option, 'right');
                option.$view.append(option.$fixedRight);
            }
        }

        /**
         * 渲染行数据
         * @param {Object} option 
         * @param {String} fixed 
         */
        function renderTr(option, fixed) {
            var $tableBody = option.$tableBody;
            var filter = option._filter;
            var data = option._renderedData;
            var widths = [];
            // 渲染左固定列
            if (fixed == 'left') {
                $tableBody = option.$fixedLeftTable;
            }
            // 渲染右固定列
            if (fixed == 'right') {
                $tableBody = option.$fixedRightTable;
            }
            option.$tableHeaderHead.find('th').each(function (i, th) {
                widths.push($(th).children('.cell').width());
            });
            $tableBody.html('');
            option.$tableHeader.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
            option._checkedData = [];
            option._selectedData = null;
            for (var i = 0; i < data.length; i++) {
                $tableBody.append(createTr(option, data[i], widths, fixed));
            }
            clearTimeout(renderTr.timer);
            renderTr.timer = setTimeout(function () {
                Form.render();
            }, 0);
        }

        /**
         * 
         * @param {Object} option 
         * @param {Object} data 
         * @param {Array} widths 
         * @param {String} fixed 
         */
        function createTr(option, data, widths, fixed) {
            var cols = option.cols;
            var id = data.id === undefined ? option._idCount++ : data.id;
            var $tr = $('<tr data-id="' + id + '"></tr>');
            data._song_table_id = id;
            if (!widths) {
                widths = [];
                option.$tableHeaderHead.find('th').each(function (i, th) {
                    widths.push($(th).children('.cell').width());
                });
            }
            $tr[0].songBindData = {};
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                var $td = null;
                if (fixed) {
                    if (col.fixed == fixed) {
                        $td = createTd(option, col, data, widths[col_i]);
                        $tr.append($td);
                    }
                } else {
                    if (col.fixed == 'left' || col.fixed == 'right') { // 主表格中的占位列
                        $td = $('<td class="song-fixed-empty" data-field="' + (col.field || '') + '"></td>');
                        $cell = $('<div class="cell"></div>');
                        $cell.css({
                            width: (ieVersion <= 6 ? widths[col_i] + 30 : widths[col_i]) + 'px'
                        });
                        $td.append($cell);
                    } else {
                        $td = createTd(option, col, data, widths[col_i]);
                    }
                    $tr.append($td);
                }
            }
            // 缓存tr对应的数据
            $tr[0].songBindData.rowData = data;
            $tr[0].songBindData.id = id;
            return $tr;
        }

        /**
         * 创建单元格
         * @param {Object} option
         * @param {Object} col 
         * @param {Object} data 
         * @param {Number} width 
         */
        function createTd(option, col, data, width) {
            var filter = option._filter;
            var $td = $('<td data-field="' + (col.field || '') + '"></td>');
            var $cell = null;
            var id = data._song_table_id;
            $td[0].songBindData = {};
            if (col.type == 'text') { //文本列
                var html = data[col.field];
                if (col.template) { // 自定义渲染函数
                    html = col.template(data, id, col);
                } else if (col.select) { // 下列列表中的数据
                    html = '';
                    col.select.map(function (obj) {
                        if (obj.value == data[col.field]) {
                            html = obj.label;
                        }
                    });
                } else if (col.checkbox) { // 复选框中的数据
                    html = '';
                    col.checkbox.map(function (obj) {
                        if (hasValue(data[col.field], obj.value) > -1) {
                            html += ',' + obj.label;
                        }
                    });
                    html = html.slice(1);
                }
                $cell = $('<div class="cell">' + html + '</div>');
            } else if (col.type == 'radio') { // 单选列
                $cell = $('<div class="cell"><input type="radio" name="table_radio_' + filter + '" value="' + id + '" song-filter="table_radio_' + filter + '"/></div>');
                if (option._selectedData && option._selectedData._song_table_id === id) {
                    $cell.children('input').prop('checked', true);
                }
            } else if (col.type == 'checkbox') { // 多选列
                $cell = $('<div class="cell"><input type="checkbox" name="table_checkbox_' + filter + '" value="' + id + '" song-filter="table_checkbox_' + filter + '"/></div>');
                for (var i = 0; i < option._checkedData.length; i++) {
                    if (option._checkedData[i]._song_table_id === id) {
                        $cell.children('input').prop('checked', true);
                        break;
                    }
                }
            } else if (col.type == 'operate') { // 操作列
                $cell = $('<div class="cell"></div>');
                if (col.btns) {
                    for (var btn_i = 0; btn_i < col.btns.length; btn_i++) {
                        var btn = col.btns[btn_i];
                        var $btn = $('<button type="button" class="song-btn song-btn-xs ' + (btn.type ? 'song-btn-' + btn.type : '') + '" song-event="' + btn.event + '" style="margin-right:10px">' + btn.text + '</button>');
                        $cell.append($btn);
                        // 阻止冒泡
                        if (btn.stop) {
                            $btn.attr('song-stop', true);
                        }
                    }
                } else {
                    $cell.append(col.template(data, btn_i, col));
                }
            }
            if (col.type != 'text') {
                $td.addClass('song-table-col-' + col.type);
            }
            $cell.css({
                width: (ieVersion <= 6 ? width + 30 : width) + 'px'
            });
            if (col.type == 'radio' || col.type == 'checkbox') {
                $cell.css({
                    'text-overflow': 'unset'
                });
            }
            // 单元格事件
            if (col.event) {
                $cell.attr('song-event', col.event).css({
                    'cursor': 'pointer'
                });
            }
            // 缓存td对应的数据
            $td[0].songBindData.colData = data[col.field];
            $td[0].songBindData.col = col;
            $td[0].songBindData.rowData = data;
            $td[0].songBindData.id = id;
            $td.append($cell);
            if (col.hidden) {
                $td.hide();
            }
            return $td;
        }

        // 渲染页码
        function renderPage(option) {
            var $pager = $('<div class="' + tableClass.pager + '"></div>');
            var $elem = $('<div song-filter="table_pager_' + option._filter + '"></div>');
            $pager.append($elem);
            option.$pager = $pager;
            option.pager = Pager.render({
                elem: $elem[0],
                nowPage: option.nowPage,
                limit: option.limit,
                size: 'small',
                count: option.data ? option.data.length : option._loadedData.length,
                prev: '<span style="font-weight:bold">' + leftIcon + '</span>',
                next: '<span style="font-weight:bold">' + rightIon + '</span>'
            });
            Pager.on('page(table_pager_' + option._filter + ')', function (page) {
                option.nowPage = page;
                renderTableBody(option);
            });
            Pager.on('limit(table_pager_' + option._filter + ')', function (limit) {
                option.limit = limit;
            });
            option.$pager.insertAfter(option.$tableMain);
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
            var trigger = option.trigger || 'click'; //触发编辑的事件类型
            var $view = option.$view;
            var $tableMain = option.$tableMain;
            var $header = option.$header;
            // 点击表格之外的区域，自动保存编辑中的数据
            $(window.document.body).on('click', function (e) {
                var table = $(e.target).parents('table')[0];
                if (table != option.$table[0] &&
                    (!option.$fixedLeftTable || table != option.$fixedLeftTable[0]) &&
                    (!option.$fixedRightTable || table != option.$fixedRightTable[0])) {
                    option.save();
                }
                option.$exports && option.$exports.hide();
                option.$filter && option.$filter.hide();
            });
            if (option.bindedViewEvent) {
                return;
            }
            option.bindedViewEvent = true;
            var filter = option._filter;
            // 表格中的所有点击事件
            $view.on('click', function (e) {
                var $target = $(e.target);
                var $tr = $target.parents('tr');
                var event = $target.attr('song-event');
                var stop = $target.attr('song-stop');
                if (event) {
                    var data = {
                        dom: $target[0]
                    }
                    if ($tr[0] && $tr[0].songBindData) {
                        data.id = $tr[0].songBindData.id;
                        data.data = $tr[0].songBindData.rowData;
                    }
                    // 触发自定义事件
                    filter && Table.trigger(event + '(' + filter + ')', data);
                }
                // 阻止冒泡
                if (stop) {
                    return false;
                }
            });
            // 回车保存
            $view.on('keydown', function (e) {
                var $td = $(e.target).parents('td');
                if ($td.length && e.keyCode == 13) {
                    option.save($td[0].songBindData.id, $td[0].songBindData.field);
                }
            });
            // 滚动事件
            $tableMain.on('scroll', function (e) {
                $header.children('table').css({
                    left: -$tableMain[0].scrollLeft + 'px'
                });
                if (option.$fixedLeftMain) {
                    option.$fixedLeftMain[0].scrollTop = $tableMain[0].scrollTop;
                }
                if (option.$fixedRightMain) {
                    option.$fixedRightMain[0].scrollTop = $tableMain[0].scrollTop;
                }
            });
            // 点击编辑
            $view.on(trigger, function (e) {
                var $target = $(e.target);
                if ($target.attr('song-event')) {
                    return;
                }
                var $td = $target.parents('td');
                if (!$td.length || $td[0].songBindData.editing) {
                    return;
                }
                // 先保存真在编辑中的数据
                var pass = option.save();
                if (pass && $td[0].songBindData.col.editable) {
                    option.edit($td[0].songBindData.id, $td[0].songBindData.col.field);
                }
            });
            // 行事件
            $view.delegate('tbody tr', 'click', function () {
                // 触发行点击事件
                option._filter && Table.trigger('row(' + option._filter + ')', {
                    dom: this,
                    id: this.songBindData.id,
                    data: this.songBindData.rowData
                });
                // hover改变背景色
            }).delegate('tbody tr', 'mouseenter', function () {
                option.$view.find('tr.' + tableClass.hover).removeClass(tableClass.hover);
                option.$view.find('tr[data-id="' + this.songBindData.id + '"]').addClass(tableClass.hover);
            }).delegate('tbody tr', 'mouseleave', function () {
                option.$view.find('tr[data-id="' + this.songBindData.id + '"]').removeClass(tableClass.hover);
            });
            // 内容溢出处理
            $view.delegate('td', 'mouseenter', function () {
                var songBindData = this.songBindData;
                var col = songBindData.col;
                var $td = $(this);
                var $cell = $td.children('.cell');
                if (col.type == 'text' && !this.songBindData.editing && $cell[0].scrollWidth > $td.width()) {
                    var $div = $('<div class="' + tableClass.tipIcon + '">' + downIcon + '</div>');
                    var ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    $cell.append($div);
                    // 点击打开内容详情弹框
                    $div.on('click', function () {
                        var $close = $('<div class="' + tableClass.tipClose + '">' + closeIcon + '</div>');
                        var offset = $cell.offset();
                        $td.addClass(tableClass.detail);
                        $div.remove();
                        $div = $('<div class="' + tableClass.tip + '">' + $cell.html() + '</div>');
                        $div.append($close)
                        $(window.document.body).append($div);
                        songBindData.$tip = $div;
                        $div.css({
                            top: offset.top + (ieVersion <= 6 ? ie6MarginTop : 0),
                            left: offset.left
                        });
                        // 点击关闭弹框
                        $close.on('click', function () {
                            songBindData.$tip = undefined;
                            $div.remove();
                        });
                    });
                }
            }).delegate('td', 'mouseleave', function () {
                $(this).children('.cell').children('.' + tableClass.tipIcon).remove();
            });
            // 筛选字段事件
            Table.on('filter(' + option._filter + ')', function (e) {
                if (option.$filter) {
                    option.$filter.toggle();
                } else {
                    createFilter(option, e.dom);
                }
                option.$exports && option.$exports.hide();
            });
            // 导出事件
            Table.on('exports(' + option._filter + ')', function (e) {
                option.$exports.toggle();
                option.$filter && option.$filter.hide();
            });
            // 导出事件
            Table.on('exports-excel(' + option._filter + ')', function (e) {
                exportsExecl(option);
                option.$exports.hide();
            });
            // 导出事件
            Table.on('exports-csv(' + option._filter + ')', function (e) {
                exportsCsv(option);
                option.$exports.hide();
            });
            // 打印事件
            Table.on('print(' + option._filter + ')', function (e) {
                print(option);
            });
        }

        // 创建过滤器
        function createFilter(option, dom) {
            var $view = option.$view;
            var filter = option._filter;
            var $filter = $('<ul class="' + tableClass.filter + '"></ul>');
            option.$filter = $filter;
            for (var i = 0; i < option.cols.length; i++) {
                var col = option.cols[i];
                if (col.type == 'text') {
                    $filter.append('<li><input type="checkbox" title="' + col.title + '" value="' + col.field + '" checked song-filter="song_table_' + filter + '_filter"></li>');
                }
            }
            // 在工具图标下挂载
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

        // 导出
        function exportsExecl(option) {
            if (window.btoa) {
                var $table = $(option.$tableHeader[0].outerHTML);
                $table.append(option.$table.html());
                $table.find('.song-table-col-raido,.song-table-col-checkbox,.song-table-col-operate').remove();
                $table.find('th,td').each(function (i, td) {
                    var $td = $(td);
                    $td.text($td.text());
                });
                // Worksheet名
                var worksheet = 'Sheet1'
                var uri = 'data:application/vnd.ms-excel;base64,';
                // 下载的表格模板数据
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office"\
                xmlns:x="urn:schemas-microsoft-com:office:excel" \
                xmlns="http://www.w3.org/TR/REC-html40">\
                <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>\
                <x:Name>' + worksheet + '</x:Name>\
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>\
                </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->\
                </head><body><table>' + $table.html() + '</table></body></html>';
                window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)));
            } else {
                Dialog.alert('该浏览器不支持导出，请使用谷歌浏览器', {
                    icon: 'error'
                });
            }
        }

        function exportsCsv(option) {
            var cols = option.cols;
            var title = '';
            var dataStr = '';
            cols.map(function (col) {
                title += col.title + ',';
            });
            title = title.slice(0, -1) + '\n';
            option._renderedData.map(function (data) {
                var str = '';
                cols.map(function (col) {
                    if (col.type == 'text') {
                        var html = data[col.field];
                        if (col.template) { // 自定义渲染函数
                            html = col.template(data, id, col);
                        } else if (col.select) { // 下列列表中的数据
                            html = '';
                            col.select.map(function (obj) {
                                if (obj.value == data[col.field]) {
                                    html = obj.label;
                                }
                            });
                        } else if (col.checkbox) { // 复选框中的数据
                            html = '';
                            col.checkbox.map(function (obj) {
                                if (hasValue(data[col.field], obj.value) > -1) {
                                    html += '、' + obj.label;
                                }
                            });
                            html = html.slice(1);
                        }
                        str += html + ',';
                    }
                });
                str = str.slice(0, -1) + '\n';
                dataStr += str;
            });

            // encodeURIComponent解决中文乱码
            var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(dataStr);

            // 通过创建a标签实现
            var link = document.createElement("a");
            link.href = uri;

            // 对下载的文件命名
            link.download = "下载.csv";
            link.click();
        }

        // 打印
        function print(option) {
            if (window.print) {
                var $table = $(option.$tableHeader[0].outerHTML);
                var wind = window.open('打开窗口', '_blank', 'toolbar=no,scrollbars=yes,menubar=no');
                var style = '<style>\
                .song-table-col-radio,\
                .song-table-col-checkbox,\
                .song-table-col-operate{\
                    display:none;\
                }\
                table{\
                    width:100%;\
                    border-collapse:collapse;\
                    border-spacing:0;\
                }\
                th,td{\
                    padding:5px 10px;\
                    border:1px solid #ccc;\
                    font-weight:normal;\
                    color:#666;\
                    text-align:left;\
                }</style>';
                $table.append(option.$table.html());
                wind.document.body.innerHTML = style + $table[0].outerHTML;
                wind.print();
                wind.close();
            } else {
                Dialog.alert('该浏览器不支持打印，请使用谷歌浏览器', {
                    icon: 'error'
                });
            }
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
        define("table", ['./jquery', './common', './form', './pager', './dialog'], function ($, Common, Form, Dialog) {
            return factory($, Common, Form, Pager, Dialog);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = factory(window.$, window.SongUi.Common, window.SongUi.Form, window.SongUi.Pager, window.SongUi.Dialog);
    }
})(window)