/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Form, Pager, Dialog) {
        var $body = $(window.document.body);
        var filterIcon = '&#xe61d;';
        var exportsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var closeIcon = '&#xe735;';
        var confirmIcon = '&#xe737;';
        var cancelIcon = '&#xe735;';
        var ieVersion = Common.getIeVersion();
        var scrBarWidth = Common.getScrBarWidth();
        var cellPadding = 16 * 2;
        var store = {};
        var tableClass = {
            view: 'song-table-view',
            table: 'song-table',
            cell: 'song-table-cell',
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
            fixedMain: 'song-table-fixed-main',
            fixeHeader: 'song-table-fixed-header',
            confirm: 'song-table-confirm',
            cancel: 'song-table-cancel',
            mend: 'song-table-mend',
            sort: 'song-table-sort',
            sortUp: 'song-table-sort-up',
            sortDown: 'song-table-sort-down',
            sortHover: 'song-table-sort-hover',
            sortConfirm: 'song-table-sort-confirm',
            unselect: 'song-table-unselect',
            error: 'song-table-error',
            fixedEmpty: 'song-fixed-empty'
        }
        // 常用正则验证
        var ruleMap = Form.verifyRules;
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
            var filter = $elem.attr('song-filter') || 'table_' + Math.random();
            var $table = $('<table class="' + tableClass.table + '"></table>');
            var $tableHead = $('<thead></thead>');
            var $header = $('<div class="' + tableClass.tableHeader + '"></div>')
            var $tableHeader = $('<table class="' + tableClass.table + '"></table>');
            var $tableHeaderHead = $('<thead></thead>');
            var $tableMain = $('<div class="' + tableClass.main + '"></div>');
            var sotreData = store[filter] || {};
            var $view = sotreData.$view || $('<div class="' + tableClass.view + '"></div>');
            store[filter] = sotreData;
            sotreData.$elem = $elem;
            sotreData.$view = $view;
            sotreData.$table = $table;
            sotreData.$tableHead = $tableHead;
            sotreData.$header = $header;
            sotreData.$tableHeader = $tableHeader;
            sotreData.$tableHeaderHead = $tableHeaderHead;
            sotreData.$tableMain = $tableMain;
            sotreData.$filter = null;
            sotreData.$exports = null;
            sotreData.option = option;
            // 可配置参数-start
            sotreData.width = option.width;
            sotreData.height = option.height;
            sotreData.data = option.data;
            sotreData.reqeust = option.reqeust;
            sotreData.defaultToolbar = option.defaultToolbar;
            sotreData.toolbar = option.toolbar;
            sotreData.trigger = option.trigger || 'click';
            sotreData.nowPage = option.nowPage || 1;
            sotreData.limit = option.limit || 20;
            sotreData.stretch = option.stretch || false;
            sotreData.page = option.page === undefined ? true : option.page;
            sotreData.autoSave = option.autoSave === undefined ? true : option.autoSave;
            sotreData.enterSave = option.enterSave === undefined ? true : option.enterSave;
            // 可配置参数-end
            sotreData._filter = filter;
            sotreData._idCount = 0;
            sotreData._fixeLeftIdCount = 0;
            sotreData._fixeRightIdCount = 0;
            sotreData._$tips = [];
            sotreData._renderedData = [];
            sotreData._sortedData = [];
            sotreData._loadedData = [];
            sotreData._addedData = [];
            sotreData._deletedData = [];
            sotreData._editedData = [];
            sotreData._checkedData = [];
            sotreData._selectedData = null;
            sotreData._sortObj = {
                field: '',
                sort: ''
            }
            $view.attr('song-filter', sotreData._filter);
            // 已存在view，则不再插入
            if (!$view.parent().length) {
                $view.insertAfter($elem);
                $elem.hide();
            } else {
                $view.empty();
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
            sotreData.cols = l.concat(o).concat(r)
            renderToolbar(filter);
            renderTableHeader(filter);
            renderTableBody(filter);
            renderPage(filter);
            setArea(filter);
            bindViewEvent(filter);
            option.reload = function (_option) {
                reload(filter, _option);
            }

            option.addRow = function (_option) {
                addRow(filter, _option);
            }

            option.deleteRow = function (id) {
                deleteRow(filter, id);
            }

            option.save = function (id, field) {
                return save(filter, id, field);
            }

            option.cancel = function (id, field) {
                cancel(filter, id, field);
            }

            option.edit = function (id, field) {
                edit(filter, id, field);
            }

            option.getData = function (type) {
                return getData(filter, type);
            }

            option.setData = function (_option) {
                return setData(filter, _option);
            }

            option.setArea = function (width, height) {
                return setArea(filter, width, height);
            }

            return option;
        }

        // 重载表格
        function reload(filter, _option) {
            var sotreData = store[filter];
            option = Object.assign(sotreData.option, _option || {});
            render(option);
        }

        /**
         * 添加数据行
         * @param {String} filter 
         * @param {Object} _option [{data, id, position}]
         */
        function addRow(filter, _option) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            var data = _option.data instanceof Array ? _option.data : [_option.data];
            var index = -2;
            var renderLength = sotreData._renderedData.length;
            if (typeof _option.id == undefined) {
                index = sotreData._renderedData.length - 1;
            } else {
                for (var i = 0; i < sotreData._renderedData.length; i++) {
                    if (_option.id != undefined && sotreData._renderedData[i]._song_table_id == _option.id) {
                        index = i + 1;
                        break;
                    }
                }
            }
            if (_option.position == 'before') {
                index--;
            }
            index = index < 0 ? renderLength : index;
            sotreData._renderedData = sotreData._renderedData.slice(0, index).concat(data).concat(sotreData._renderedData.slice(index));
            if (index && index >= renderLength) {
                index = renderLength - 1;
            }
            data.map(function (item) {
                sotreData._addedData.push(item);
            });
            _addRow();
            cols[0].fixed == 'left' && _addRow('left');
            cols[cols.length - 1].fixed == 'right' && _addRow('right');
            Form.render();

            function _addRow(fixed) {
                var $table = sotreData.$table;
                var tr = null;
                if (fixed == 'left') {
                    $table = sotreData.$fixedLeftTable;
                } else if (fixed == 'right') {
                    $table = sotreData.$fixedRightTable;
                }
                if (_option.id) {
                    tr = $table.find('tr[data-id="' + _option.id + '"]')[0];
                }
                if (tr) {
                    data.reverse().map(function (item, i) {
                        var $tr = createTr(filter, item, fixed);
                        $tr.insertAfter(tr);
                    });
                } else {
                    data.map(function (item, i) {
                        var $tr = createTr(filter, item, fixed);
                        $table.append($tr);
                    });
                }
            }
        }

        /**
         * 删除数据行
         * @param {String} filter
         * @param {Number} id
         */
        function deleteRow(filter, id) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            _deleteRow();
            cols[0].fixed == 'left' && _deleteRow('left');
            cols[cols.length - 1].fixed == 'right' && _deleteRow('right');

            function _deleteRow(fixed) {
                var $tr = null;
                if (fixed == 'left') {
                    $tr = sotreData.$fixedLeftTable.find('tr[data-id="' + id + '"]');
                } else if (fixed == 'right') {
                    $tr = sotreData.$fixedRightTable.find('tr[data-id="' + id + '"]');
                } else {
                    $tr = sotreData.$table.find('tr[data-id="' + id + '"]')
                }
                // 删除溢出内容弹框
                $tr.children('td').each(function (i, td) {
                    if (td.songBindData.$tip) {
                        var index = sotreData._$tips.indexOf(td.songBindData.$tip);
                        sotreData._$tips.splice(index, 1);
                        td.songBindData.$tip.remove();
                    }
                });
                $tr.remove();
                if (fixed == 'left' || fixed == 'right') {
                    return;
                }
                for (var i = 0; i < sotreData._renderedData.length; i++) {
                    if (id !== undefined && sotreData._renderedData[i]._song_table_id == id) {
                        sotreData._deletedData.push(sotreData._renderedData[i]);
                        for (var j = 0; j < sotreData._addedData.length; j++) {
                            if (sotreData._addedData[j]._song_table_id == sotreData._renderedData[i]._song_table_id) {
                                sotreData._addedData.splice(j, 1);
                                break;
                            }
                        }
                        for (var j = 0; j < sotreData._editedData.length; j++) {
                            if (sotreData._editedData[j]._song_table_id == sotreData._renderedData[i]._song_table_id) {
                                sotreData._editedData.splice(j, 1);
                                break;
                            }
                        }
                        sotreData._renderedData.splice(i, 1);
                        return;
                    }
                }
            }
        }

        /**
         * 保存编辑中的数据
         * @param {String} filter 
         * @param {Number} id 
         * @param {String} field 
         */
        function save(filter, id, field) {
            var sotreData = store[filter];
            var result = true;
            var tds = [];
            if (id !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = getTdById(filter, id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    sotreData.$table.find('tr[data-id="' + id + '"]').each(_filter);
                    if (sotreData.$fixedLeftTable) {
                        sotreData.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (sotreData.$fixedRightTable) {
                        sotreData.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 保存所有的数据
                sotreData.$table.find('td').each(_filter);
                if (sotreData.$fixedLeftTable) {
                    sotreData.$fixedLeftTable.find('td').each(_filter);
                }
                if (sotreData.$fixedRightTable) {
                    sotreData.$fixedRightTable.find('td').each(_filter);
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
                if (!$(td).hasClass(tableClass.fixedEmpty)) {
                    tds.push(td);
                }
            }

            /**
             * 获取编辑中的数据
             * @param {DOM} td 
             * @param {Boolean} ifFormat 是否格式化 
             */
            function _getValue(td, ifFormat) {
                var value = null;
                var col = td.songBindData.col;
                if (td.songBindData.$input) {
                    value = td.songBindData.$input.val();
                } else if (td.songBindData.$select) {
                    value = td.songBindData.$select[0].value;
                } else if (td.songBindData.$checkbox) {
                    value = td.songBindData.$checkbox[0].value
                }
                if (ifFormat) {
                    var rowData = td.parentNode.songBindData.rowData;
                    rowData = Object.assign({}, rowData);
                    rowData.value = value;
                    value = getCellHtml(value, rowData, td.songBindData.id, col);
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
                        if (typeof rule.rule == 'function') {
                            pass = rule.rule(value);
                        } else if (rule.rule) {
                            pass = rule.rule.test(String(value || ''));
                        }
                        if (!pass) {
                            Dialog.msg(msg, {
                                icon: 'error'
                            });
                            break;
                        }
                    }
                }
                if (!pass) {
                    $(td).addClass(tableClass.error);
                } else {
                    $(td).removeClass(tableClass.error);
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
                    for (var i = 0; i < sotreData._editedData.length; i++) {
                        if (sotreData._editedData[0]._song_table_id == td.songBindData.rowData._song_table_id) {
                            pushed = false;
                            break;
                        }
                    }
                    if (pushed) {
                        sotreData._editedData.push(td.songBindData.rowData);
                    }
                    // 触发保存事件
                    Table.trigger('save(' + sotreData._filter + ')', {
                        id: td.songBindData.id,
                        field: col.field,
                        data: value
                    });
                }
            }
        }

        /**
         * 取消编辑
         * @param {String} filter 
         * @param {Number} id 
         * @param {String} field 
         */
        function cancel(filter, id, field) {
            var sotreData = store[filter];
            var tds = [];
            if (id !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = getTdById(filter, id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    sotreData.$table.find('tr[data-id="' + id + '"]').each(_filter);
                    if (sotreData.$fixedLeftTable) {
                        sotreData.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (sotreData.$fixedRightTable) {
                        sotreData.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 保存所有的数据
                sotreData.$table.find('td').each(_filter);
                if (sotreData.$fixedLeftTable) {
                    sotreData.$fixedLeftTable.find('td').each(_filter);
                }
                if (sotreData.$fixedRightTable) {
                    sotreData.$fixedRightTable.find('td').each(_filter);
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                if (td.songBindData && td.songBindData.editing) {
                    _save(td);
                }
            }

            function _filter(i, td) {
                if (!$(td).hasClass(tableClass.fixedEmpty)) {
                    tds.push(td);
                }
            }

            // 获取编辑中的数据
            function _getValue(td) {
                var value = td.songBindData.colData;
                var col = td.songBindData.col;
                if (col.select) {
                    col.select.map(function (item) {
                        if (item.value == value) {
                            value = item.label;
                        }
                    });
                }
                if (col.checkbox) {
                    var arr = [];
                    value && col.checkbox.map(function (item) {
                        if (hasValue(value, item.value) > -1) {
                            arr.push(item.label);
                        }
                    });
                    value = arr.join('、');
                }
                return value;
            }

            // 保存编辑的数据
            function _save(td) {
                var col = td.songBindData.col;
                var $td = $(td);
                var fValue = _getValue(td);
                td.children[0].innerHTML = col.template ? col.template(td.songBindData.colData, td.songBindData.id, col) : fValue;
                $td.removeClass(tableClass.edit);
                td.songBindData.editing = false;
                td.songBindData.$input = undefined;
                td.songBindData.$select = undefined;
                td.songBindData.$checkbox = undefined;
            }
        }

        /**
         * 编辑数据
         * @param {String} filter 
         * @param {Number} id 
         * @param {String} field 
         */
        function edit(filter, id, field) {
            var sotreData = store[filter];
            var tds = [];
            if (id !== undefined) { // 编辑某一行的数据
                if (field) {
                    var td = getTdById(filter, id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    sotreData.$table.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    if (sotreData.$fixedLeftTable) {
                        sotreData.$fixedLeftTable.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    }
                    if (sotreData.$fixedRightTable) {
                        sotreData.$fixedRightTable.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    }
                }
            } else { // 编辑所有的数据
                sotreData.$table.find('td').each(_filter);
                if (sotreData.$fixedLeftTable) {
                    sotreData.$fixedLeftTable.find('td').each(_filter);
                }
                if (sotreData.$fixedRightTable) {
                    sotreData.$fixedRightTable.find('td').each(_filter);
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _edit(td);
            }

            function _filter(i, td) {
                if (!$(td).hasClass(tableClass.fixedEmpty)) {
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
                        // 输入框聚焦
                        $input.trigger('focus');
                    } else if (editable.type == 'select') { // 下拉框编辑
                        var selectFilter = 'table_edit_select_' + filter + '_' + Math.random();
                        var $select = $('<select song-filter="' + selectFilter + '"></select>');
                        col.select && col.select.map(function (item) {
                            $select.append('<option value="' + item.value + '" ' + (item.value == data ? 'selected' : '') + '>' + item.label + '</option>');
                        });
                        $cell.empty().append($select);
                        // 触发select事件
                        Form.render('select(' + selectFilter + ')');
                        Form.on('select(' + selectFilter + ')', function (e) {
                            $select[0].value = e.data;
                            if (sotreData.autoSave) {
                                save(filter, id, field);
                            }
                        });
                        $select[0].value = data;
                        td.songBindData.$select = $select;
                        // 展开下拉框
                        setTimeout(function () {
                            $cell.find('.song-select-title').trigger('click');
                        }, 0)
                    } else if (editable.type == 'checkbox') { // 复选框编辑
                        var checkFilter = 'table_edit_checkbox_' + filter + '_' + Math.random();
                        var $checkbox = $('<div class="' + tableClass.checkboxs + '"></div>');
                        col.checkbox && col.checkbox.map(function (item) {
                            $checkbox.append('<input type="checkbox" song-filter="' + checkFilter + '" title="' + item.label + '" value="' + item.value + '" ' + (data && hasValue(data, item.value) > -1 ? 'checked' : '') + '/>');
                        });
                        $cell.empty().append($checkbox);
                        // 触发checkbox事件
                        Form.render('checkbox(' + checkFilter + ')');
                        Form.on('checkbox(' + checkFilter + ')', function (e) {
                            $checkbox[0].value = e.data;
                        });
                        $checkbox[0].value = data;
                        td.songBindData.$checkbox = $checkbox;
                    }
                    // 触发编辑事件
                    Table.trigger('edit(' + sotreData._filter + ')', {
                        id: td.songBindData.id,
                        field: col.field,
                        data: data
                    });
                    if (editable.type != 'select' && editable.icon) {
                        var $confirm = $('<div class="' + tableClass.confirm + '" title="完成编辑">' + confirmIcon + '</div>')
                        var $cancel = $('<div class="' + tableClass.cancel + '" title="取消编辑">' + cancelIcon + '</div>')
                        $cell.append($confirm);
                        $cell.append($cancel);
                        // 编辑完成事件
                        $confirm.on('click', function () {
                            save(filter, id, field);
                            return false;
                        });
                        // 取消编辑
                        $cancel.on('click', function () {
                            sotreData.cancel(id, field);
                            return false;
                        });
                    }
                    $(td).addClass(tableClass.edit);
                    td.songBindData.editing = true;
                }
            }
        }

        /**
         * 动态设置单元格数据
         * @param {String} filter 
         * @param {Object} _option 
         */
        function setData(filter, _option) {
            var sotreData = store[filter];
            var id = _option.id;
            var field = _option.field;
            var data = _option.data;
            var $tr = sotreData.$table.find('tr[data-id="' + id + '"]');
            var editFields = [];
            $tr.find('td').each(function (i, td) {
                if (td.songBindData.editing) {
                    editFields.push(td.songBindData.col.field);
                }
            });
            for (var i = 0; i < sotreData._renderedData.length; i++) {
                var rowData = sotreData._renderedData[i];
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
                        sotreData._renderedData.splice(i, _data);
                        $tr.replaceWith(createTr(filter, _data));
                        editFields.map(function (field) {
                            edit(filter, _data._song_table_id, field);
                        });
                        Form.render();
                    }
                    break;
                }
            }
        }

        /**
         * 获取处理过的数据
         * @param {String} filter 
         * @param {String} type 
         */
        function getData(filter, type) {
            var sotreData = store[filter];
            var data = null;
            type = type || 'render';
            switch (type) {
                case 'render':
                    data = sotreData._renderedData;
                    break;
                case 'select':
                    data = sotreData._selectedData;
                    break;
                case 'check':
                    data = sotreData._checkedData;
                    break;
                case 'add':
                    data = sotreData._addedData;
                    break;
                case 'delelte':
                    data = sotreData._deletedData;
                    break;
                case 'edit':
                    data = sotreData._editedData;
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
         * @param {String} filter 
         * @param {Number} id 
         * @param {String} field 
         */
        function getTdById(filter, id, field) {
            var sotreData = store[filter];
            var col = getColByField(filter, field);
            var td = null;
            if (col.fixed == 'left') {
                td = sotreData.$fixedLeftTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else if (col.fixed == 'right') {
                td = sotreData.$fixedRightTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else {
                td = sotreData.$table.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            }
            return td;
        }

        /**
         * 根据字段名称返回列配置对象
         * @param {String} filter 
         * @param {String} field 
         */
        function getColByField(filter, field) {
            var sotreData = store[filter];
            for (var i = 0; i < sotreData.cols.length; i++) {
                if (sotreData.cols[i].field == field) {
                    return sotreData.cols[i];
                }
            }
        }

        /**
         * 根据id获取行数据
         * @param {String} filter 
         * @param {String} id 
         */
        function getRowDataById(filter, id) {
            var sotreData = store[filter];
            for (var i = 0; i < sotreData._sortedData.length; i++) {
                if (sotreData._sortedData[i]._song_table_id == id) {
                    return sotreData._sortedData[i];
                }
            }
        }

        /**
         * 设置表格肠宽
         * @param {String} filter 
         * @param {Number} width 
         * @param {Number} height 
         */
        function setArea(filter, width, height) {
            var sotreData = store[filter];
            sotreData.width = Number(width || sotreData.width);
            sotreData.height = Number(height || sotreData.height);
            if (sotreData.width) {
                sotreData.$view.css({
                    width: sotreData.width + 'px'
                });
                sotreData.$tableMain.css({
                    width: (ieVersion <= 6 ? sotreData.width - 2 : sotreData.width) + 'px'
                });
            }
            if (sotreData.height) {
                var h = sotreData.height;
                sotreData.$view.css({
                    height: h + 'px'
                });
                h -= sotreData.$header.height();
                if (sotreData.$toolbar) {
                    h -= sotreData.$toolbar.outerHeight();
                }
                if (sotreData.$pager) {
                    h -= sotreData.$pager.outerHeight();
                }
                sotreData.$tableMain.css({
                    height: h + 'px'
                });
            }
            var hedaerWidth = sotreData.$header[0].clientWidth;
            var tableHeaderWidth = sotreData.$tableHeader[0].offsetWidth;
            //表格拉伸至容器的宽度
            if (sotreData.stretch && tableHeaderWidth < hedaerWidth) {
                // 确保选择列宽度不变
                sotreData.$view.find('th.song-table-col-checkbox,th.song-table-col-radio').each(function (i, th) {
                    $(th).css('width', this.clientWidth);
                });
                sotreData.$tableHeader.css({
                    'width': '100%'
                });
                // ie6及以下，table宽度为100%时可能会多出一像素，从而撑破父容器，这里避免产生滚动条
                if (ieVersion <= 6) {
                    sotreData.$tableMain.css({
                        overflow: 'hidden'
                    });
                }
            }
            _setTableWidth();
            if (sotreData.$fixedLeft) {
                sotreData.$fixedLeft.css({
                    width: sotreData.$fixedLeftTableHeader[0].offsetWidth + 'px', // ie6及以下浏览器不设置宽度将撑破父容器
                    top: (sotreData.$toolbar ? sotreData.$toolbar[0].clientHeight : 0) + 'px'
                });
                sotreData.$fixedLeftMain.css({
                    height: sotreData.$tableMain[0].clientHeight + 'px'
                });
            }
            if (sotreData.$fixedRight) {
                var left = 'auto';
                var right = scrBarWidth;
                if (sotreData.$tableMain[0].scrollWidth == sotreData.$tableMain[0].clientWidth) {
                    right = 'auto';
                    left = sotreData.$table[0].offsetWidth - sotreData.$fixedRightTableHeader[0].offsetWidth;
                    sotreData.$mend && sotreData.$mend.hide();
                } else {
                    sotreData.$mend && sotreData.$mend.show();
                }
                sotreData.$fixedRight.css({
                    width: sotreData.$fixedRightTableHeader[0].offsetWidth + 'px', // ie6及以下浏览器不设置宽度将撑破父容器
                    top: (sotreData.$toolbar ? sotreData.$toolbar[0].clientHeight : 0) + 'px',
                    left: left,
                    right: right
                });
                sotreData.$fixedRightMain.css({
                    height: sotreData.$tableMain[0].clientHeight + 'px'
                });
            }

            setCellWidth(filter);
            sotreData.$fixedLeft && setCellWidth(filter, 'left');
            sotreData.$fixedRight && setCellWidth(filter, 'right');

            // 设置表格宽度
            function _setTableWidth() {
                sotreData.$table.css({
                    width: ieVersion <= 6 ? sotreData.$tableHeader.outerWidth() : sotreData.$tableHeader.width(),
                    tableLayout: 'fixed'
                });
                if (sotreData.$fixedLeft) {
                    sotreData.$fixedRightTable.css({
                        width: ieVersion <= 6 ? sotreData.$fixedRightTableHeaderHead.outerWidth() : sotreData.$fixedRightTableHeaderHead.width(),
                        tableLayout: 'fixed'
                    });
                }
                if (sotreData.$fixedRight) {
                    sotreData.$fixedRightTable.css({
                        width: ieVersion <= 6 ? sotreData.$fixedRightTableHeaderHead.outerWidth() : sotreData.$fixedRightTableHeaderHead.width(),
                        tableLayout: 'fixed'
                    });
                }
            }
        }

        /**
         * 设置单元格宽度
         * @param {String} filter 
         * @param {String} fixed 
         */
        function setCellWidth(filter, fixed) {
            var sotreData = store[filter];
            var ws = [];
            var $tableHead = sotreData.$tableHead;
            var $tableHeader = sotreData.$tableHeader;
            sotreData.$tableHeaderHead.find('th').each(function (i, th) {
                // 先去掉之前设置的宽度，使其自适应
                if (th.songBindData.flex) {
                    $(th).children('.' + tableClass.cell).css('width', 'auto');
                }
            });
            sotreData.$tableHeaderHead.find('th').each(function (i, th) {
                // 获取自适应宽度
                if (th.songBindData.flex) {
                    var $th = $(th);
                    var tw = $th[0].clientWidth;
                    tw = ieVersion <= 6 ? tw : tw - cellPadding;
                    ws.push(tw);
                }
            });
            if (fixed == 'left') { // 左侧固定表格
                sotreData.$fixedLeftTableHeaderHead.find('tr').each(_eachLeft);
                $tableHead = sotreData.$fixedLeftTableHead;
                $tableHeader = sotreData.$fixedLeftTableHeader;
            } else if (fixed == 'right') { // 右侧固定表格
                sotreData.$fixedRightTableHeaderHead.find('tr').each(_eachRight);
                $tableHead = sotreData.$fixedRightTableHead;
                $tableHeader = sotreData.$fixedRightTableHeader;
            } else { // 主表格
                sotreData.$tableHeaderHead.find('tr').each(_eachLeft);
            }
            ws = [];
            $tableHeader.find('th').each(function (i, th) {
                ws.push(ieVersion <= 6 ? th.offsetWidth : th.clientWidth);
            });
            $tableHead.find('th').each(function (i, th) {
                $(th).css({
                    width: ws[i]
                });
            });

            function _eachLeft(i, tr) {
                $(tr).children('th').each(function (i, td) {
                    if (td.songBindData.flex) {
                        var $td = $(td);
                        $td.children('.' + tableClass.cell).css({
                            width: ws[i] + 'px'
                        });
                    }
                });
            }

            function _eachRight(i, tr) {
                var tds = $(tr).children('th');
                var last = ws.length - tds.length;
                tds.each(function (i, td) {
                    if (td.songBindData.flex) {
                        var $td = $(td);
                        $td.children('.' + tableClass.cell).css({
                            width: ws[last + i] + 'px'
                        });
                    }
                });
            }
        }

        // 渲染工具条
        function renderToolbar(filter) {
            var sotreData = store[filter];
            var $toolbar = $('<div class="' + [tableClass.toolbar, 'song-row'].join(' ') + '"></div>');
            if (sotreData.defaultToolbar) {
                var defaultToolbar = sotreData.defaultToolbar;
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
                            sotreData.$exports = $exports;
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (sotreData.toolbar || sotreData.defaultToolbar) {
                sotreData.$toolbar = $toolbar;
                $toolbar.append(sotreData.toolbar);
                sotreData.$view.prepend($toolbar);
            }
        }

        /**
         * 渲染表头
         * @param {String} filter 
         * @param {String} fixed 
         */
        function renderTableHeader(filter, fixed) {
            var sotreData = store[filter];
            var $view = sotreData.$view;
            var $tr = $('<tr></tr>');
            var $holdTr = $('<tr style="*display:none;"></tr>'); // 用于控制主表单元格宽度
            var cols = sotreData.cols;
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (fixed && col.fixed != fixed) {
                    continue;
                }
                col.type = col.type || 'text';
                var width = col.width;
                var $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '">' + (col.title || '') + '</div>');
                var $th = $('<th class="song-table-col-' + col.type + '" data-field="' + (col.field || '') + '"></th>');
                var $holdTh = $('<th class="song-table-col-' + col.type + '" data-field="' + (col.field || '') + '" style="height:0px;border-top:0;border-bottom:0;"></th>');
                $th.append($cell);
                $tr.append($th);
                $holdTr.append($holdTh);
                $th[0].songBindData = {
                    col: col
                };
                if (col.hidden) {
                    $th.hide();
                    $holdTh.hide();
                }
                if (col.type == 'radio' || col.type == 'checkbox') {
                    width = 20;
                }
                if (width) {
                    $cell.css({
                        'width': (ieVersion <= 6 ? width + cellPadding : width) + 'px'
                    });
                } else {
                    $th[0].songBindData.flex = true;
                }
                // 可排序
                if (col.sortAble && col.field) {
                    _renderSortIcon($th, col);
                }
                // 固定列和普通列中值处理其中一个
                if (fixed || (col.fixed != 'left' && col.fixed != 'right')) {
                    // 单选
                    if (col.type == 'radio' && filter) {
                        Form.once('radio(table_radio_' + filter + ')', function (e) {
                            sotreData._selectedData = getRowDataById(filter, e.data);
                        });
                    }
                    // 多选
                    if (col.type == 'checkbox' && filter) {
                        var $all = $('<input type="checkbox" song-filter="table_checkbox_' + filter + '_all">');
                        $cell.html($all);
                        Form.once('checkbox(table_checkbox_' + filter + ')', function (e) {
                            var checkedData = [];
                            for (var i = 0; i < e.data.length; i++) {
                                checkedData.push(getRowDataById(filter, e.data[i]));
                            }
                            sotreData._checkedData = checkedData
                            $all.prop('checked', checkedData.length == sotreData._sortedData.length);
                            Form.render('checkbox(table_checkbox_' + filter + '_all)');
                        });
                        // 全选或者全不选
                        Form.once('checkbox(table_checkbox_' + filter + '_all)', function (e) {
                            var checked = $(e.dom).prop('checked');
                            var checkedData = checked ? sotreData._sortedData.concat([]) : [];
                            var boxs = $view.find('input[type="checkbox"][song-filter="table_checkbox_' + filter + '"]');
                            boxs.each(function (i, box) {
                                $(box).prop('checked', checked);
                            });
                            sotreData._checkedData = checkedData
                            Form.render('checkbox(table_checkbox_' + filter + ')');
                        });
                    }
                }
            }
            if (fixed) {
                if (fixed == 'left') {
                    sotreData.$fixedLeftTableHeaderHead.append($tr);
                    sotreData.$fixedLeftTableHead.append($holdTr);
                } else {
                    sotreData.$fixedRightTableHeaderHead.append($tr);
                    sotreData.$fixedRightTableHead.append($holdTr);
                }
                return;
            } else {
                sotreData.$tableHead.append($holdTr);
                sotreData.$tableHeaderHead.append($tr);
                sotreData.$tableHeader.append(sotreData.$tableHeaderHead);
                sotreData.$header.append(sotreData.$tableHeader);
                sotreData.$header.insertAfter(sotreData.$toolbar);
            }

            // 渲染排序图标
            function _renderSortIcon($th, col) {
                var $up = $('<div class="' + tableClass.sortUp + '"></div>');
                var $down = $('<div class="' + tableClass.sortDown + '"></div>');
                var $sort = $('<div class="' + tableClass.sort + '"></div>');
                $sort.append($up);
                $sort.append($down);
                $cell.append($sort);
                $th.addClass(tableClass.unselect);
                $up.on('mouseenter', function () {
                    $up.addClass(tableClass.sortHover);
                }).on('mouseleave', function () {
                    $up.removeClass(tableClass.sortHover);
                }).on('click', function () {
                    sotreData.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    sotreData._sortObj.field = col.field;
                    sotreData._sortObj.sort = 'asc';
                    $up.addClass(tableClass.sortConfirm);
                    renderTableBody(filter, true);
                    return false;
                });
                $down.on('mouseenter', function () {
                    $down.addClass(tableClass.sortHover);
                }).on('mouseleave', function () {
                    $down.removeClass(tableClass.sortHover);
                }).on('click', function () {
                    sotreData.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    sotreData._sortObj.field = col.field;
                    sotreData._sortObj.sort = 'desc';
                    $down.addClass(tableClass.sortConfirm);
                    renderTableBody(filter, true);
                    return false;
                });
            }
        }

        /**
         * 渲染表格
         * @param {String} filter 
         * @param {Boolean} justSort 
         */
        function renderTableBody(filter, justSort) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            if (!sotreData.$tableMain.inserted) {
                var viewWidth = sotreData.$view.width();
                sotreData.$table.append(sotreData.$tableHead);
                sotreData.$tableMain.append(sotreData.$table);
                sotreData.$tableMain.insertAfter(sotreData.$header);
                sotreData.$tableMain.css({
                    width: viewWidth + 'px'
                });
                sotreData.$tableMain.inserted = true;
            }

            if (justSort) {
                _render();
            } else if (sotreData.data) {
                var start = (sotreData.nowPage - 1) * sotreData.limit;
                var end = sotreData.nowPage * sotreData.limit;
                sotreData._renderedData = sotreData.data.slice(start, end).map(function (item) {
                    return Object.assign({}, item);
                });
                sotreData._sortedData = sotreData._renderedData.concat([]);
                _render();

            } else {
                httpGet(filter, function (res) {
                    sotreData._renderedData = res.data;
                    sotreData._loadedData = res.data.map(function (item) {
                        return Object.assign({}, item);
                    });
                    sotreData._sortedData = sotreData._renderedData.concat([]);
                    sotreData.pager.count != res.count && sotreData.pager.reload({
                        count: res.count
                    });
                    _render();
                });
            }

            // 渲染
            function _render() {
                // 数据排序
                _sort();
                renderTr(filter);
                // 渲染固定列
                renderTableFixed(filter);
                _fixHeader();
            }

            // 排序
            function _sort() {
                // 默认排序
                var sortFun = {
                    asc: function (a, b) {
                        return a - b;
                    },
                    desc: function (a, b) {
                        return b - a;
                    }
                }
                cols.map(function (col) {
                    if (col.sortAble && sotreData._sortObj.field == col.field) {
                        if (typeof col.sortAble == 'object') {
                            sortFun = Object.assign(sortFun, col.sortAble);
                        }
                        sotreData._sortedData = sotreData._renderedData.concat([]);
                        if (sotreData._sortObj.sort) {
                            sortFun[sotreData._sortObj.sort] && sotreData._sortedData.sort(function (a, b) {
                                return sortFun[sotreData._sortObj.sort](a[col.field], b[col.field]);
                            });
                        }
                    }
                });
            }

            // 修复表头右侧16px(滚动条宽度)空白问题
            function _fixHeader() {
                if (sotreData.$table[0].clientHeight > sotreData.$tableMain[0].clientHeight) {
                    if (!sotreData.$mend) {
                        sotreData.$mend = $('<div class="' + tableClass.mend + '"></div>');
                        // ie6及以下浏览器在父容器高度不固定的情况下100%高度无效
                        sotreData.$mend.css('height', sotreData.$tableHeader[0].clientHeight);
                        if (sotreData.$fixedRightHeader) {
                            sotreData.$fixedRightHeader.append(sotreData.$mend);
                        } else {
                            sotreData.$tableHeader.append(sotreData.$mend);
                        }
                    }
                } else {
                    sotreData.$mend && sotreData.$mend.remove();
                }
            }
        }

        /**
         * 渲染固定列表格
         * @param {String} filter 
         */
        function renderTableFixed(filter) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            if (cols.length && cols[0].fixed == 'left') {
                if (!sotreData.$fixedLeft) {
                    sotreData.$fixedLeft = $('<div class="' + tableClass.fixedLeft + '"></div>');
                    sotreData.$fixedLeftTableHead = $('<thead></thead>');
                    sotreData.$fixedLeftHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                    sotreData.$fixedLeftMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                    sotreData.$fixedLeftTable = $('<table class="' + tableClass.table + '"></table>');
                    sotreData.$fixedLeftTableHeader = $('<table class="' + tableClass.table + '"></table>');
                    sotreData.$fixedLeftTableHeaderHead = $('<thead></thead>');
                    sotreData.$fixedLeftTableHeader.append(sotreData.$fixedLeftTableHeaderHead);
                    sotreData.$fixedLeftHeader.append(sotreData.$fixedLeftTableHeader);
                    sotreData.$fixedLeft.append(sotreData.$fixedLeftHeader);
                    sotreData.$fixedLeftTable.append(sotreData.$fixedLeftTableHead);
                    sotreData.$fixedLeftMain.append(sotreData.$fixedLeftTable);
                    sotreData.$fixedLeft.append(sotreData.$fixedLeftMain);
                    renderTableHeader(filter, 'left');
                    sotreData.$view.append(sotreData.$fixedLeft);
                }
                renderTr(filter, 'left');
            }
            if (cols.length && cols[cols.length - 1].fixed == 'right') {
                if (!sotreData.$fixedRight) {
                    sotreData.$fixedRight = $('<div class="' + tableClass.fixedRight + '"></div>');
                    sotreData.$fixedRightTableHead = $('<thead></thead>');
                    sotreData.$fixedRightHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                    sotreData.$fixedRightMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                    sotreData.$fixedRightTable = $('<table class="' + tableClass.table + '"></table>');
                    sotreData.$fixedRightTableHeader = $('<table class="' + tableClass.table + '"></table>');
                    sotreData.$fixedRightTableHeaderHead = $('<thead></thead>');
                    sotreData.$fixedRightTableHeader.append(sotreData.$fixedRightTableHeaderHead);
                    sotreData.$fixedRightHeader.append(sotreData.$fixedRightTableHeader);
                    sotreData.$fixedRight.append(sotreData.$fixedRightHeader);
                    sotreData.$fixedRightTable.append(sotreData.$fixedRightTableHead);
                    sotreData.$fixedRightMain.append(sotreData.$fixedRightTable);
                    sotreData.$fixedRight.append(sotreData.$fixedRightMain);
                    renderTableHeader(filter, 'right');
                    sotreData.$view.append(sotreData.$fixedRight);
                }
                renderTr(filter, 'right');
            }
            if (sotreData.$fixedLeft || sotreData.$fixedRight) {
                setArea(filter, sotreData.width, sotreData.height);
            }
        }

        /**
         * 渲染行数据
         * @param {String} filter 
         * @param {String} fixed 
         */
        function renderTr(filter, fixed) {
            var sotreData = store[filter];
            var $table = sotreData.$table;
            var data = sotreData._sortedData;
            // 渲染左固定列
            if (fixed == 'left') {
                $table = sotreData.$fixedLeftTable;
            }
            // 渲染右固定列
            if (fixed == 'right') {
                $table = sotreData.$fixedRightTable;
            }
            var trs = $table.children('tbody').children('tr');
            // 取消全选
            sotreData.$tableHeaderHead.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
            sotreData.$fixedLeftTableHeaderHead && sotreData.$fixedLeftTableHeaderHead.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
            sotreData.$fixedRightTableHeaderHead && sotreData.$fixedRightTableHeaderHead.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
            sotreData.$tableHeader.find('[song-filter="table_checkbox_' + filter + '_all"]').prop('checked', false);
            sotreData._checkedData = [];
            sotreData._selectedData = null;
            for (var i = 0; i < data.length; i++) {
                if (trs[i]) { // 重复利用
                    replaceTr(filter, data[i], trs[i], fixed);
                } else {
                    $table.append(createTr(filter, data[i], fixed));
                }
            }
            // 删除多余的tr
            for (var i = data.length; i < trs.length; i++) {
                $(trs[i]).remove();
            }
            clearTimeout(renderTr.timer);
            renderTr.timer = setTimeout(function () {
                Form.render();
            }, 0);
        }

        /**
         * 创建表格行
         * @param {String} filter 
         * @param {Object} data 
         * @param {String} fixed 
         */
        function createTr(filter, data, fixed) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            var id = data.id || data._song_table_id;
            if (id === undefined) {
                if (fixed == 'left') {
                    id = sotreData._fixeLeftIdCount++;
                } else if (fixed == 'right') {
                    id = sotreData._fixeRightIdCount++;
                } else {
                    id = sotreData._idCount++;
                }
            }
            var $tr = $('<tr data-id="' + id + '"></tr>');
            data._song_table_id = id;
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                var $td = null;
                if (fixed) { // 固定列
                    if (col.fixed == fixed) {
                        $td = createTd(filter, col, data);
                        $tr.append($td);
                    }
                } else {
                    if (col.fixed == 'left' || col.fixed == 'right') { // 主表格中的占位列
                        $td = $('<td class="' + ['song-table-col-' + col.type, tableClass.fixedEmpty].join(' ') + '" data-field="' + (col.field || '') + '"></td>');
                        $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '"></div>');
                        $td[0].songBindData = {};
                        $td[0].songBindData.colData = data[col.field];
                        $td[0].songBindData.col = col;
                        $td[0].songBindData.rowData = data;
                        $td[0].songBindData.id = id;
                        $td.append($cell);
                    } else {
                        $td = createTd(filter, col, data);
                    }
                    $tr.append($td);
                }
            }
            $tr[0].songBindData = {};
            // 缓存tr对应的数据
            $tr[0].songBindData.rowData = data;
            $tr[0].songBindData.id = id;
            return $tr;
        }

        /**
         * 更换表格行内容(增加渲染效率)
         * @param {String} filter 
         * @param {Object} data 
         * @param {DOM} tr 
         * @param {String} fixed 
         */
        function replaceTr(filter, data, tr, fixed) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            var id = data.id || data._song_table_id;
            if (id === undefined) {
                if (fixed == 'left') {
                    id = sotreData._fixeLeftIdCount++;
                } else if (fixed == 'right') {
                    id = sotreData._fixeRightIdCount++;
                } else {
                    id = sotreData._idCount++;
                }
            }
            data._song_table_id = id;
            $(tr).attr('data-id', id);
            var tds = $(tr).children('td');
            var td_i = 0;
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                var html = getCellHtml(data[col.field], data, id, col);
                if (fixed) { // 固定列
                    if (col.fixed == fixed) {
                        _setHtml(tds[td_i++], html, data, id, col);
                    }
                } else {
                    if (col.fixed == 'left' || col.fixed == 'right') {
                        td_i++;
                    } else {
                        _setHtml(tds[td_i++], html, data, id, col);
                    }
                }
            }
            tr.songBindData = {};
            // 缓存tr对应的数据
            tr.songBindData.rowData = data;
            tr.songBindData.id = id;

            // 设置单元格内容
            function _setHtml(td, html, data, id, col) {
                var $td = $(td);
                if (col.type == 'text') {
                    $td.removeAttr('class');
                    $td.children('.' + tableClass.cell).html(html);
                } else if (col.type == 'radio' || col.type == 'checkbox') {
                    $td.find('input[type="' + col.type + '"]').val(id).prop('checked', false);
                }
                // 设置单元格属性
                if (col.attr) {
                    for (var key in col.attr) {
                        $td.removeAttr(key);
                        $td.attr(key, typeof col.attr[key] == 'function' ? col.attr[key](data[col.field], data, id, col) : col.attr[key]);
                    }
                }
                // 设置单元格样式
                if (col.style) {
                    $td.removeAttr('style');
                    for (var key in col.style) {
                        $td.css(key, typeof col.style[key] == 'function' ? col.style[key](data[col.field], data, id, col) : col.style[key])
                    }
                }
                td.songBindData.colData = data[col.field];
                td.songBindData.col = col;
                td.songBindData.rowData = data;
                td.songBindData.id = id;
            }
        }

        /**
         * 创建单元格
         * @param {String} filter
         * @param {Object} col 
         * @param {Object} data 
         */
        function createTd(filter, col, data) {
            var sotreData = store[filter];
            var $td = $('<td class="song-table-col-' + col.type + '" data-field="' + (col.field || '') + '"></td>');
            var $cell = null;
            var id = data._song_table_id;
            $td[0].songBindData = {};
            if (col.type == 'text') { //文本列
                $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '">' + getCellHtml(data[col.field], data, id, col) + '</div>');
            } else if (col.type == 'radio') { // 单选列
                $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '"><input type="radio" name="table_radio_' + filter + '" value="' + id + '" song-filter="table_radio_' + filter + '"/></div>');
                if (sotreData._selectedData && sotreData._selectedData._song_table_id === id) {
                    $cell.children('input').prop('checked', true);
                }
            } else if (col.type == 'checkbox') { // 多选列
                $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '"><input type="checkbox" name="table_checkbox_' + filter + '" value="' + id + '" song-filter="table_checkbox_' + filter + '"/></div>');
                for (var i = 0; i < sotreData._checkedData.length; i++) {
                    if (sotreData._checkedData[i]._song_table_id === id) {
                        $cell.children('input').prop('checked', true);
                        break;
                    }
                }
            } else if (col.type == 'operate') { // 操作列
                $cell = $('<div class="' + ['song-row', tableClass.cell].join(' ') + '"></div>');
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
                    $cell.append(col.template(data[col.field], data, id, col));
                }
            }
            // 设置单元格属性
            if (col.attr) {
                for (var key in col.attr) {
                    $td.attr(key, typeof col.attr[key] == 'function' ? col.attr[key](data[col.field], data, id, col) : col.attr[key]);
                }
            }
            // 设置单元格样式
            if (col.style) {
                for (var key in col.style) {
                    $td.css(key, typeof col.style[key] == 'function' ? col.style[key](data[col.field], data, id, col) : col.style[key])
                }
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

        /**
         * 获取渲染单元格的内容
         * @param {*} cellValue 
         * @param {*} data 
         * @param {Object} col 
         */
        function getCellHtml(cellValue, data, id, col) {
            var html = cellValue;
            if (col.template) { // 自定义渲染函数
                html = col.template(cellValue, data, id, col);
            } else if (col.select) { // 下列列表中的数据
                html = '';
                col.select.map(function (obj) {
                    if (obj.value == cellValue) {
                        html = obj.label;
                    }
                });
            } else if (col.checkbox) { // 复选框中的数据
                html = '';
                col.checkbox.map(function (obj) {
                    if (hasValue(cellValue, obj.value) > -1) {
                        html += ',' + obj.label;
                    }
                });
                html = html.slice(1);
            }
            return html;
        }

        // 渲染页码
        function renderPage(filter) {
            var sotreData = store[filter];
            if (sotreData.page === false) {
                return;
            }
            var $pager = $('<div class="' + tableClass.pager + '"></div>');
            var $elem = $('<div song-filter="table_pager_' + sotreData._filter + '"></div>');
            $pager.append($elem);
            sotreData.$pager = $pager;
            sotreData.pager = Pager.render({
                elem: $elem[0],
                nowPage: sotreData.nowPage,
                limit: sotreData.limit,
                size: 'small',
                count: sotreData.data ? sotreData.data.length : sotreData._loadedData.length,
                prev: '<span style="font-weight:bold">' + leftIcon + '</span>',
                next: '<span style="font-weight:bold">' + rightIon + '</span>'
            });
            Pager.on('page(table_pager_' + sotreData._filter + ')', function (page) {
                sotreData.nowPage = page;
                renderTableBody(filter);
            });
            Pager.on('limit(table_pager_' + sotreData._filter + ')', function (limit) {
                sotreData.limit = limit;
            });
            sotreData.$pager.insertAfter(sotreData.$tableMain);
        }

        function httpGet(filter, success, error) {
            var sotreData = store[filter];
            var data = sotreData.reqeust.data || {};
            data[sotreData.reqeust.pageName || 'page'] = sotreData.nowPage;
            data[sotreData.reqeust.limitName || 'limit'] = sotreData.limit;
            $.ajax({
                url: sotreData.reqeust.url,
                method: sotreData.reqeust.method || 'get',
                dataType: sotreData.reqeust.dataType || 'json',
                contentType: sotreData.reqeust.contentType || 'application/json',
                data: data,
                success: function (res) {
                    sotreData.reqeust.success && sotreData.reqeust.success(res);
                    success(sotreData.reqeust.parseData && sotreData.reqeust.parseData(res) || res);
                },
                error: function (res) {
                    sotreData.reqeust.error && sotreData.reqeust.error(res);
                    error && error(res);
                }
            })
        }

        // 绑定容器的事件
        function bindViewEvent(filter) {
            var sotreData = store[filter];
            var trigger = sotreData.trigger || 'click'; //触发编辑的事件类型
            var $view = sotreData.$view;
            var $tableMain = sotreData.$tableMain;
            var $header = sotreData.$header;
            // 点击表格之外的区域，自动保存编辑中的数据
            $body.on('click', function (e) {
                var table = $(e.target).parents('table')[0];
                if (sotreData.autoSave && table != sotreData.$table[0] &&
                    (!sotreData.$fixedLeftTable || table != sotreData.$fixedLeftTable[0]) &&
                    (!sotreData.$fixedRightTable || table != sotreData.$fixedRightTable[0])) {
                    save(filter);
                }
                sotreData.$exports && sotreData.$exports.hide();
                sotreData.$filter && sotreData.$filter.hide();
            });
            if (sotreData.bindedViewEvent) {
                return;
            }
            sotreData.bindedViewEvent = true;
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
                if (sotreData.enterSave) {
                    var $td = $(e.target).parents('td');
                    if ($td.length && e.keyCode == 13) {
                        save(filter, $td[0].songBindData.id, $td[0].songBindData.col.field);
                    }
                }
            });
            // 滚动事件
            $tableMain.on('scroll', function (e) {
                $header.children('table').css({
                    left: -$tableMain[0].scrollLeft + 'px'
                });
                if (sotreData.$fixedLeftMain) {
                    sotreData.$fixedLeftMain[0].scrollTop = $tableMain[0].scrollTop;
                }
                if (sotreData.$fixedRightMain) {
                    sotreData.$fixedRightMain[0].scrollTop = $tableMain[0].scrollTop;
                }
                if (sotreData._$tips.length) {
                    var tds = sotreData.$table.find('td');
                    sotreData._$tips.map(function ($tip) {
                        $tip.remove();
                    });
                    tds.each(function (i, td) {
                        td.songBindData.$tip = undefined;
                    });
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
                if ($td[0].songBindData.col.editable && $td[0].songBindData.col.field) {
                    var pass = true;
                    // 先保存真在编辑中的数据
                    if (sotreData.autoSave) {
                        pass = save(filter);
                    }
                    if (pass && $td[0].songBindData.col.editable) {
                        edit(filter, $td[0].songBindData.id, $td[0].songBindData.col.field);
                    }
                }
            });
            // 行事件
            $view.delegate('tbody tr', 'click', function () {
                // 触发行点击事件
                sotreData._filter && Table.trigger('row(' + sotreData._filter + ')', {
                    dom: this,
                    id: this.songBindData.id,
                    data: this.songBindData.rowData
                });
                // hover改变背景色
            }).delegate('tbody tr', 'mouseenter', function () {
                sotreData.$view.find('tr.' + tableClass.hover).removeClass(tableClass.hover);
                sotreData.$view.find('tr[data-id="' + this.songBindData.id + '"]').addClass(tableClass.hover);
            }).delegate('tbody tr', 'mouseleave', function () {
                sotreData.$view.find('tr[data-id="' + this.songBindData.id + '"]').removeClass(tableClass.hover);
            });
            // 内容溢出处理
            $view.delegate('td', 'mouseenter', function () {
                var songBindData = this.songBindData;
                var col = songBindData.col;
                var $td = $(this);
                var $cell = $td.children('.' + tableClass.cell);
                if (col.type == 'text' && !this.songBindData.editing && $cell[0].scrollWidth > $td[0].clientWidth) {
                    var $div = $('<div class="' + tableClass.tipIcon + '">' + downIcon + '</div>');
                    $cell.append($div);
                    // 点击打开内容详情弹框
                    $div.on('click', function () {
                        var $close = $('<div class="' + tableClass.tipClose + '">' + closeIcon + '</div>');
                        var offset = $cell.offset();
                        var ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                        $td.addClass(tableClass.detail);
                        $div.remove();
                        $div = $('<div class="' + tableClass.tip + '">' + $cell.html() + '</div>');
                        $div.append($close);
                        $body.append($div);
                        songBindData.$tip = $div;
                        sotreData._$tips.push($div);
                        $div.css({
                            top: offset.top - 1 + (ieVersion <= 6 ? ie6MarginTop : 0),
                            left: offset.left - 1
                        });
                        // 点击关闭弹框
                        $close.on('click', function () {
                            songBindData.$tip = undefined;
                            $div.remove();
                        });
                    });
                }
            }).delegate('td', 'mouseleave', function () {
                $(this).children('.' + tableClass.cell).children('.' + tableClass.tipIcon).remove();
            });
            // 排序事件
            $view.delegate('th', 'click', function () {
                var $this = $(this);
                // 触发排序
                var col = this.songBindData.col;
                if (col.sortAble) {
                    var $up = $this.find('div.' + tableClass.sortUp);
                    var $down = $this.find('div.' + tableClass.sortDown);
                    $view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    if (sotreData._sortObj.field != col.field) {
                        sotreData._sortObj.field = col.field;
                        sotreData._sortObj.sort = '';
                    }
                    if (!sotreData._sortObj.sort) {
                        sotreData._sortObj.sort = 'asc';
                        $up.addClass(tableClass.sortConfirm);
                    } else if (sotreData._sortObj.sort == 'asc') {
                        sotreData._sortObj.sort = 'desc';
                        $down.addClass(tableClass.sortConfirm);
                    } else {
                        sotreData._sortObj.sort = '';
                    }
                    renderTableBody(filter, true);
                }
            });
            // 筛选字段事件
            Table.on('filter(' + sotreData._filter + ')', function (e) {
                if (sotreData.$filter) {
                    sotreData.$filter.toggle();
                } else {
                    createFilter(filter, e.dom);
                }
                sotreData.$exports && sotreData.$exports.hide();
            });
            // 导出事件
            Table.on('exports(' + sotreData._filter + ')', function (e) {
                sotreData.$exports.toggle();
                sotreData.$filter && sotreData.$filter.hide();
            });
            // 导出事件
            Table.on('exports-excel(' + sotreData._filter + ')', function (e) {
                exportsExecl(filter);
                sotreData.$exports.hide();
            });
            // 导出事件
            Table.on('exports-csv(' + sotreData._filter + ')', function (e) {
                exportsCsv(filter);
                sotreData.$exports.hide();
            });
            // 打印事件
            Table.on('print(' + sotreData._filter + ')', function (e) {
                print(filter);
            });
        }

        // 创建过滤器
        function createFilter(filter, dom) {
            var sotreData = store[filter];
            var $view = sotreData.$view;
            var $filter = $('<ul class="' + tableClass.filter + '"></ul>');
            sotreData.$filter = $filter;
            for (var i = 0; i < sotreData.cols.length; i++) {
                var col = sotreData.cols[i];
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
                setArea(filter);
            });
            Form.render('checkbox(song_table_' + filter + '_filter)');
        }

        // 导出
        function exportsExecl(filter) {
            var sotreData = store[filter];
            if (window.btoa) {
                var $table = $(sotreData.$tableHeader[0].outerHTML);
                $table.append(sotreData.$table.children('tbody').html());
                $table.find('.song-table-col-radio,.song-table-col-checkbox,.song-table-col-operate').remove();
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

        function exportsCsv(filter) {
            var sotreData = store[filter];
            var cols = sotreData.cols;
            var title = '';
            var dataStr = '';
            cols.map(function (col) {
                title += col.title + ',';
            });
            title = title.slice(0, -1) + '\n';
            sotreData._sortedData.map(function (data) {
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
        function print(filter) {
            var sotreData = store[filter];
            if (window.print) {
                var $table = $(sotreData.$tableHeader[0].outerHTML);
                var wind = window.open('', '_blank', 'toolbar=no,scrollbars=yes,menubar=no');
                var style = '<style>\
                .song-table-col-radio,\
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
                $table.append(sotreData.$table.children('tbody').html());
                var trs = $table.children('tbody').children('tr');
                // 左固定列中的数据
                sotreData.$fixedLeftTable && sotreData.$fixedLeftTable.children('tbody').find('tr').each(function (i, tr) {
                    var tds = $(trs[i]).children('td');
                    $(tr).children('td').each(function (i, td) {
                        $(tds[i]).html($(td).html());
                    });
                });
                // 右固定列中的数据
                sotreData.$fixedRightTable && sotreData.$fixedRightTable.children('tbody').find('tr').each(function (i, tr) {
                    var tds = $(trs[i]).children('td');
                    var _tds = $(tr).children('td');
                    _tds.each(function (i, td) {
                        $(tds[tds.length - _tds.length + i]).html($(td).html());
                    });
                });
                wind.document.write('<head>' + style + '</head><body>' + $table[0].outerHTML + '</body>');
                wind.document.close();
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