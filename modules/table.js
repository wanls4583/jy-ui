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
        var ieVersion = Common.getIeVersion();
        var scrBarWidth = Common.getScrBarWidth();
        var hCellPadding = 16 * 2;
        var store = {};
        var tableCount = 1;
        var tableClass = {
            view: 'song-table-view',
            table: 'song-table',
            col: 'song-table-col',
            cell: 'song-table-cell',
            tableHeader: 'song-table-header',
            main: 'song-table-main',
            tool: 'song-table-tool',
            toolbar: 'song-table-toolbar',
            toolbarSelf: 'song-table-tool-self',
            editing: 'song-table-editing',
            edit: 'song-table-edit',
            editPrefix: 'song-table-edit-prefix',
            editSuffix: 'song-table-edit-suffix',
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
            fixedShadow: 'song-table-fixed-shadow',
            fixedMain: 'song-table-fixed-main',
            fixeHeader: 'song-table-fixed-header',
            confirm: 'song-table-confirm',
            cancel: 'song-table-cancel',
            mend: 'song-table-mend',
            sort: 'song-table-sort',
            sortUp: 'song-table-sort-up',
            sortDown: 'song-table-sort-down',
            sortHover: 'song-table-sort-hover',
            colResize: 'song-table-col-resize',
            sortConfirm: 'song-table-sort-confirm',
            unselect: 'song-table-unselect',
            error: 'song-table-error',
            fixedEmpty: 'song-fixed-empty'
        }
        // 常用正则验证
        var ruleMap = Form.verifyRules;
        var Table = {
            render: function (option) {
                return new Class(option);
            }
        }

        // 页码类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            this.option = option;
            this.render();
        }

        // 渲染表格
        Class.prototype.render = function () {
            var $elem = $(this.option.elem);
            var $table = $('<table class="' + tableClass.table + '"></table>');
            var $header = $('<div class="' + tableClass.tableHeader + '"></div>')
            var $tableHeader = $('<table class="' + tableClass.table + '"></table>');
            var $tableHeaderHead = $('<thead></thead>');
            var $tableMain = $('<div class="' + tableClass.main + '"></div>');
            var storeData = null;
            var $view = null;
            this.filter = this.filter || $elem.attr('song-filter') || 'table_' + Math.random();
            store[this.filter] = store[this.filter] || {};
            storeData = store[this.filter];
            $view = storeData.$view || $('<div class="' + tableClass.view + '"></div>');
            storeData.tableCount = storeData.tableCount || tableCount++;
            storeData.$elem = $elem;
            storeData.$view = $view;
            storeData.$table = $table;
            storeData.$header = $header;
            storeData.$tableHeader = $tableHeader;
            storeData.$tableHeaderHead = $tableHeaderHead;
            storeData.$tableMain = $tableMain;
            storeData.$filter = null;
            storeData.$exports = null;
            storeData.$fixedLeft = null;
            storeData.$fixedRight = null;
            // 可配置参数-start
            storeData.width = this.option.width;
            storeData.height = this.option.height;
            storeData.data = this.option.data;
            storeData.reqeust = this.option.reqeust;
            storeData.defaultToolbar = this.option.defaultToolbar;
            storeData.toolbar = this.option.toolbar;
            storeData.trigger = this.option.trigger || 'click';
            storeData.nowPage = this.option.nowPage || 1;
            storeData.limit = this.option.limit || 20;
            storeData.stretch = this.option.stretch || false;
            storeData.page = this.option.page === undefined ? true : this.option.page;
            storeData.autoSave = this.option.autoSave === undefined ? true : this.option.autoSave;
            storeData.enterSave = this.option.enterSave === undefined ? true : this.option.enterSave;
            storeData.originCols = this.option.cols[0] instanceof Array ? this.option.cols : [this.option.cols];
            // 可配置参数-end
            storeData._idCount = 0;
            storeData._fixeLeftIdCount = 0;
            storeData._fixeRightIdCount = 0;
            storeData._$tips = [];
            storeData._renderedData = [];
            storeData._sortedData = [];
            storeData._loadedData = [];
            storeData._addedData = [];
            storeData._deletedData = [];
            storeData._editedData = [];
            storeData._checkedData = [];
            storeData._selectedData = null;
            storeData._sortObj = {
                field: '',
                sort: ''
            };
            storeData.timers = storeData.timers || {};
            storeData.tempData = storeData.tempData || {};
            // 已存在view，则不再插入
            if (!$view.parent().length) {
                $view.insertAfter($elem);
                $elem.hide();
            } else {
                $view.empty();
            }
            this.initCols();
            this.createSheet();
            this.renderToolbar();
            this.renderTableHeader();
            this.renderTableBody();
            this.renderPage();
            this.setViewWidth();
            this.setFixedWidth();
            this.stretchTable();
            this.bindEvent();
        }

        // 初始化cols
        Class.prototype.initCols = function () {
            var storeData = store[this.filter];
            var cols = storeData.originCols.concat([]);
            var key = 0;
            cols.map(function (_cols, i) {
                cols[i] = _cols.concat([]);
                // 每个col都自动生成一个唯一key
                cols[i].map(function (col) {
                    col._key = key++;
                });
            });
            // 一级表头
            var firstHeader = cols[0];
            var fixedLeftEnd = -1;
            var fixedLeftCount = 0;
            var fixedRightStart = firstHeader.length;
            var fixedRightCount = 0;
            // 处理固定属性（left列必须开始于第一列且连续）
            for (var i = 0; i < firstHeader.length; i++) {
                if (firstHeader[i].fixed == 'left') {
                    if (i == fixedLeftEnd + 1) {
                        fixedLeftEnd = i;
                        fixedLeftCount += firstHeader[i].colspan >= 2 ? firstHeader[i].colspan : 1;
                    } else {
                        firstHeader[0].fixed = undefined;
                    }
                }
            }
            // 处理固定属性（right必须结束于最后一列且连续）
            for (var i = firstHeader.length - 1; i >= 0; i--) {
                if (firstHeader[i].fixed == 'right') {
                    if (i == fixedRightStart - 1) {
                        fixedRightStart = i;
                        fixedRightCount += firstHeader[i].colspan >= 2 ? firstHeader[i].colspan : 1;
                    } else {
                        firstHeader[0].fixed = undefined;
                    }
                }
            }
            // 用来渲染数据的列数组
            storeData.cols = [];
            storeData.cols = _getDataCol(cols, 0, 1000);
            for (var i = 0; i < fixedLeftCount; i++) {
                storeData.cols[i].fixed = 'left';
            }
            for (var i = 1; i <= fixedRightCount; i++) {
                storeData.cols[storeData.cols.length - i].fixed = 'right';
            }

            function _getDataCol(cols, level, colspan, pCol) {
                for (var i = 0, count = 0; i < colspan && cols[level][i] && count < colspan; i++) {
                    var col = cols[level][i];
                    if (col.colspan >= 2) { // colspan大于1的列不能用于渲染数据
                        if (cols[level + 1] && cols[level + 1].length) { // 有下一级表头
                            _getDataCol(cols, level + 1, col.colspan, col);
                        } else { // 无效的colspan
                            storeData.cols.push(col);
                            col.colspan = undefined;
                        }
                        count += (col.colspan || 1);
                    } else {
                        storeData.cols.push(col);
                        count += 1;
                    }
                    // 上一级对应的父列
                    if (pCol) {
                        pCol.child = pCol.child || [];
                        pCol.child.push(col);
                        col.parent = pCol;
                    }
                }
                // 移除已处理过的列
                cols[level].splice(0, colspan);
                return storeData.cols;
            }
        }

        // 创建样式表
        Class.prototype.createSheet = function () {
            var storeData = store[this.filter];
            if (storeData.sheet) {
                return;
            }
            var node = document.createElement('style');
            node.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(node);
            storeData.sheet = node.styleSheet || node.sheet;
        }

        // 重载表格
        Class.prototype.reload = function (option) {
            this.option = Object.assign(this.option, option || {});
            this.render();
        }

        /**
         * 添加数据行
         * @param {Object} option [{data, id, position}]
         */
        Class.prototype.addRow = function (option) {
            var that = this;
            var storeData = store[this.filter];
            var cols = storeData.cols;
            var data = option.data instanceof Array ? option.data : [option.data];
            var index = -2;
            var renderLength = storeData._renderedData.length;
            if (typeof option.id == undefined) {
                index = storeData._renderedData.length - 1;
            } else {
                for (var i = 0; i < storeData._renderedData.length; i++) {
                    if (option.id != undefined && storeData._renderedData[i]._song_table_id == option.id) {
                        index = i + 1;
                        break;
                    }
                }
            }
            if (option.position == 'before') {
                index--;
            }
            index = index < 0 ? renderLength : index;
            storeData._renderedData = storeData._renderedData.slice(0, index).concat(data).concat(storeData._renderedData.slice(index));
            if (index && index >= renderLength) {
                index = renderLength - 1;
            }
            data.map(function (item) {
                storeData._addedData.push(item);
            });
            _addRow();
            cols[0].fixed == 'left' && _addRow('left');
            cols[cols.length - 1].fixed == 'right' && _addRow('right');
            Form.render('', storeData.$view);

            function _addRow(fixed) {
                var $table = storeData.$table;
                var tr = null;
                if (fixed == 'left') {
                    $table = storeData.$fixedLeftTable;
                } else if (fixed == 'right') {
                    $table = storeData.$fixedRightTable;
                }
                if (option.id) {
                    tr = $table.find('tr[data-id="' + option.id + '"]')[0];
                }
                if (tr) {
                    data.reverse().map(function (item, i) {
                        var $tr = that.createTr(item, fixed);
                        $tr.insertAfter(tr);
                    });
                } else {
                    data.map(function (item, i) {
                        var $tr = that.createTr(item, fixed);
                        $table.append($tr);
                    });
                }
            }
        }

        /**
         * 删除数据行
         * @param {Number} id
         */
        Class.prototype.deleteRow = function (id) {
            var storeData = store[this.filter];
            var cols = storeData.cols;
            _deleteRow();
            cols[0].fixed == 'left' && _deleteRow('left');
            cols[cols.length - 1].fixed == 'right' && _deleteRow('right');

            function _deleteRow(fixed) {
                var $tr = null;
                if (fixed == 'left') {
                    $tr = storeData.$fixedLeftTable.find('tr[data-id="' + id + '"]');
                } else if (fixed == 'right') {
                    $tr = storeData.$fixedRightTable.find('tr[data-id="' + id + '"]');
                } else {
                    $tr = storeData.$table.find('tr[data-id="' + id + '"]')
                }
                // 删除溢出内容弹框
                $tr.children('td').each(function (i, td) {
                    if (td.songBindData.$tip) {
                        var index = storeData._$tips.indexOf(td.songBindData.$tip);
                        storeData._$tips.splice(index, 1);
                        td.songBindData.$tip.remove();
                    }
                });
                $tr.remove();
                if (fixed == 'left' || fixed == 'right') {
                    return;
                }
                for (var i = 0; i < storeData._renderedData.length; i++) {
                    if (id !== undefined && storeData._renderedData[i]._song_table_id == id) {
                        storeData._deletedData.push(storeData._renderedData[i]);
                        for (var j = 0; j < storeData._addedData.length; j++) {
                            if (storeData._addedData[j]._song_table_id == storeData._renderedData[i]._song_table_id) {
                                storeData._addedData.splice(j, 1);
                                break;
                            }
                        }
                        for (var j = 0; j < storeData._editedData.length; j++) {
                            if (storeData._editedData[j]._song_table_id == storeData._renderedData[i]._song_table_id) {
                                storeData._editedData.splice(j, 1);
                                break;
                            }
                        }
                        storeData._renderedData.splice(i, 1);
                        return;
                    }
                }
            }
        }

        /**
         * 保存编辑中的数据
         * @param {Number} id 
         * @param {String} field 
         */
        Class.prototype.save = function (id, field) {
            var that = this;
            var storeData = store[this.filter];
            var result = true;
            var tds = [];
            if (id !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = this.getTdByIdField(id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    storeData.$table.find('tr[data-id="' + id + '"]').each(_filter);
                    if (storeData.$fixedLeftTable) {
                        storeData.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (storeData.$fixedRightTable) {
                        storeData.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 保存所有的数据
                storeData.$table.find('td').each(_filter);
                if (storeData.$fixedLeftTable) {
                    storeData.$fixedLeftTable.find('td').each(_filter);
                }
                if (storeData.$fixedRightTable) {
                    storeData.$fixedRightTable.find('td').each(_filter);
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
                if (typeof col.editable.save == 'function') {
                    var $edit = $(td.children[0].children[0]);
                    value = col.editable.save($edit);
                } else if (td.songBindData.$input) {
                    value = td.songBindData.$input.val();
                } else if (td.songBindData.$select) {
                    value = td.songBindData.$select[0].value;
                } else if (td.songBindData.$checkbox) {
                    value = td.songBindData.$checkbox[0].value
                }
                value = value || '';
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
                td.children[0].innerHTML = col.template ? col.template(td.songBindData.colData, td.songBindData.rowData, td.songBindData.id, col) : fValue;
                $td.removeClass(tableClass.editing);
                td.songBindData.editing = false;
                td.songBindData.$input = undefined;
                td.songBindData.$select = undefined;
                td.songBindData.$checkbox = undefined;
                // 值被修改过
                if (String(originValue) != String(value)) {
                    var pushed = true;
                    for (var i = 0; i < storeData._editedData.length; i++) {
                        if (storeData._editedData[0]._song_table_id == td.songBindData.rowData._song_table_id) {
                            pushed = false;
                            break;
                        }
                    }
                    if (pushed) {
                        storeData._editedData.push(td.songBindData.rowData);
                    }
                    // 触发保存事件
                    that.trigger('save', {
                        id: td.songBindData.id,
                        field: col.field,
                        data: value
                    });
                }
                that.fixRowHeightById(td.songBindData.id, 'auto');
            }
        }

        /**
         * 取消编辑
         * @param {Number} id 
         * @param {String} field 
         */
        Class.prototype.cancel = function (id, field) {
            var that = this;
            var storeData = store[this.filter];
            var tds = [];
            if (id !== undefined) { // 保存某一行的数据
                if (field) {
                    var td = this.getTdByIdField(id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    storeData.$table.find('tr[data-id="' + id + '"]').each(_filter);
                    if (storeData.$fixedLeftTable) {
                        storeData.$fixedLeftTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                    if (storeData.$fixedRightTable) {
                        storeData.$fixedRightTable.find('tr[data-id="' + id + '"]').each(_filter);
                    }
                }
            } else { // 保存所有的数据
                storeData.$table.find('td').each(_filter);
                if (storeData.$fixedLeftTable) {
                    storeData.$fixedLeftTable.find('td').each(_filter);
                }
                if (storeData.$fixedRightTable) {
                    storeData.$fixedRightTable.find('td').each(_filter);
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
                td.children[0].innerHTML = col.template ? col.template(td.songBindData.colData, td.songBindData.rowData, td.songBindData.id, col) : fValue;
                $td.removeClass(tableClass.editing);
                td.songBindData.editing = false;
                td.songBindData.$input = undefined;
                td.songBindData.$select = undefined;
                td.songBindData.$checkbox = undefined;
                that.fixRowHeightById(td.songBindData.id, 'auto');
            }
        }

        /**
         * 编辑数据
         * @param {Number} id 
         * @param {String} field 
         */
        Class.prototype.edit = function (id, field) {
            var that = this;
            var storeData = store[this.filter];
            var tds = [];
            if (id !== undefined) { // 编辑某一行的数据
                if (field) {
                    var td = this.getTdByIdField(id, field);
                    if (!td) {
                        return;
                    }
                    tds = [td];
                } else {
                    storeData.$table.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    if (storeData.$fixedLeftTable) {
                        storeData.$fixedLeftTable.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    }
                    if (storeData.$fixedRightTable) {
                        storeData.$fixedRightTable.find('tr[data-id="' + id + '"]').children('td').each(_filter);
                    }
                }
            } else { // 编辑所有的数据
                storeData.$table.find('td').each(_filter);
                if (storeData.$fixedLeftTable) {
                    storeData.$fixedLeftTable.find('td').each(_filter);
                }
                if (storeData.$fixedRightTable) {
                    storeData.$fixedRightTable.find('td').each(_filter);
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
                if (col.editable && !td.songBindData.editing) {
                    var data = td.songBindData.colData;
                    var $td = $(td);
                    var originTdHeight = td.offsetHeight;
                    var tr = $td.parent()[0];
                    var rowData = tr.songBindData.rowData;
                    var id = tr.songBindData.id;
                    var $cell = $td.children('.' + tableClass.cell);
                    var $edit = $('<div class="' + tableClass.edit + '"></div>');
                    var editable = col.editable === true ? {} : col.editable;
                    $edit.css('width', $cell[0].clientWidth);
                    $cell.empty().append($edit);
                    editable.type = editable.type || 'text';
                    if (typeof editable.edit == 'function') {
                        $edit.append(editable.edit(data, rowData, id, col));
                        $edit.find('input').trigger('focus');
                    } else if (editable.type == 'text' || editable.type == 'number') { // 输入框编辑
                        _editInput(td);
                    } else if (editable.type == 'select') { // 下拉框编辑
                        _editSelect(td);
                    } else if (editable.type == 'checkbox') { // 复选框编辑
                        _editCheckbox(td);
                    }
                    // 触发编辑事件
                    that.trigger('edit', {
                        id: td.songBindData.id,
                        field: col.field,
                        data: data
                    });
                    $(td).addClass(tableClass.editing);
                    td.songBindData.editing = true;
                    // 高度发送变化时重新调整行高
                    if (Math.abs(originTdHeight - td.offsetHeight) > 2) {
                        that.fixRowHeightById(td.songBindData.id, td.offsetHeight);
                    }
                }
            }

            function _editInput(td) {
                var data = td.songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var $input = $('<input class="' + [tableClass.input, 'song-input'].join(' ') + '">');
                $input.val(data);
                $input.on('input propertychange', function () {
                    // 只可输入数字
                    if (td.songBindData.col.editable.type == 'number') {
                        var num = Common.getNum($input.val());
                        if (num !== $input.val()) {
                            $input.val(num);
                        }
                    }
                });
                $edit.empty().append($input);
                td.songBindData.$input = $input;
                // 输入框聚焦
                $input.trigger('focus');
            }

            function _editSelect(td) {
                var col = td.songBindData.col;
                var data = td.songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var selectFilter = 'table_edit_select_' + that.filter + '_' + Math.random();
                var $select = $('<select song-filter="' + selectFilter + '"></select>');
                col.select && col.select.map(function (item) {
                    $select.append('<option value="' + item.value + '" ' + (item.value == data ? 'selected' : '') + '>' + item.label + '</option>');
                });
                var $div = $('<div style="zoom:1;"></div>');
                $edit.empty().append($div);
                $div.append($select);
                // 触发select事件
                Form.render('select(' + selectFilter + ')', td.parentNode);
                Form.on('select(' + selectFilter + ')', function (e) {
                    $select[0].value = e.data;
                    if (storeData.autoSave) {
                        that.save(id, field);
                    }
                });
                $select[0].value = data;
                td.songBindData.$select = $select;
                // 展开下拉框
                setTimeout(function () {
                    $edit.find('div.song-select-title').trigger('click');
                }, 0)
            }

            function _editCheckbox(td) {
                var col = td.songBindData.col;
                var data = td.songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var checkFilter = 'table_edit_checkbox_' + that.filter + '_' + Math.random();
                $edit.addClass(tableClass.checkboxs);
                col.checkbox && col.checkbox.map(function (item) {
                    $edit.append('<input type="checkbox" song-filter="' + checkFilter + '" title="' + item.label + '" value="' + item.value + '" ' + (data && hasValue(data, item.value) > -1 ? 'checked' : '') + '/>');
                });
                // 触发checkbox事件
                Form.render('checkbox(' + checkFilter + ')', td.parentNode);
                Form.on('checkbox(' + checkFilter + ')', function (e) {
                    $edit[0].value = e.data;
                });
                $edit[0].value = data;
                td.songBindData.$checkbox = $edit;
            }
        }

        /**
         * 修复行高
         * @param {Number} id 
         * @param {Number/String} height 
         */
        Class.prototype.fixRowHeightById = function (id, height) {
            var storeData = store[this.filter];
            storeData.$view.find('tr[data-id="' + id + '"]').css('height', height);
        }

        /**
         * 动态设置单元格数据
         * @param {Object} option 
         */
        Class.prototype.setData = function (option) {
            var storeData = store[this.filter];
            var id = option.id;
            var field = option.field;
            var data = option.data;
            var $tr = storeData.$table.find('tr[data-id="' + id + '"]');
            var editFields = [];
            $tr.find('td').each(function (i, td) {
                if (td.songBindData.editing) {
                    editFields.push(td.songBindData.col.field);
                }
            });
            for (var i = 0; i < storeData._renderedData.length; i++) {
                var rowData = storeData._renderedData[i];
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
                        storeData._renderedData.splice(i, _data);
                        $tr.replaceWith(this.createTr(_data));
                        editFields.map(function (field) {
                            this.edit(_data._song_table_id, field);
                        });
                        Form.render('', $tr);
                    }
                    break;
                }
            }
        }

        /**
         * 获取处理过的数据
         * @param {String} type 
         */
        Class.prototype.getData = function (type) {
            var storeData = store[this.filter];
            var data = null;
            type = type || 'render';
            switch (type) {
                case 'render':
                    data = storeData._renderedData;
                    break;
                case 'select':
                    data = storeData._selectedData;
                    break;
                case 'check':
                    data = storeData._checkedData;
                    break;
                case 'add':
                    data = storeData._addedData;
                    break;
                case 'delelte':
                    data = storeData._deletedData;
                    break;
                case 'edit':
                    data = storeData._editedData;
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
         * @param {Number} id 
         * @param {String} field 
         */
        Class.prototype.getTdByIdField = function (id, field) {
            var storeData = store[this.filter];
            var col = this.getColByField(field);
            var td = null;
            if (col.fixed == 'left') {
                td = storeData.$fixedLeftTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else if (col.fixed == 'right') {
                td = storeData.$fixedRightTable.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            } else {
                td = storeData.$table.find('tr[data-id="' + id + '"]').find('td[data-field="' + field + '"]')[0];
            }
            return td;
        }

        /**
         * 根据字段名称返回列配置对象
         * @param {String} field 
         */
        Class.prototype.getColByField = function (field) {
            var storeData = store[this.filter];
            for (var i = 0; i < storeData.cols.length; i++) {
                if (storeData.cols[i].field == field) {
                    return storeData.cols[i];
                }
            }
        }

        /**
         * 根据字段唯一key返回列配置对象
         * @param {String} key 
         */
        Class.prototype.getColByKey = function (key) {
            var storeData = store[this.filter];
            for (var i = 0; i < storeData.cols.length; i++) {
                if (storeData.cols[i]._key == key) {
                    return storeData.cols[i];
                }
            }
        }

        /**
         * 根据id获取行数据
         * @param {String} id 
         */
        Class.prototype.getRowDataById = function (id) {
            var storeData = store[this.filter];
            for (var i = 0; i < storeData._sortedData.length; i++) {
                if (storeData._sortedData[i]._song_table_id == id) {
                    return storeData._sortedData[i];
                }
            }
        }

        /**
         * 生成样式类
         * @param {String} className 
         */
        Class.prototype.getClassNameWithKey = function (col, className) {
            var storeData = store[this.filter];
            return className + '-' + storeData.tableCount + '-' + col._key;
        }

        // 拉伸表格至100%
        Class.prototype.stretchTable = function () {
            var storeData = store[this.filter];
            var hedaerWidth = storeData.$header[0].clientWidth;
            var tableHeaderWidth = storeData.$tableHeader[0].offsetWidth;
            //表格拉伸至容器的宽度
            if (storeData.stretch && tableHeaderWidth < hedaerWidth) {
                var ths = storeData.$view.find('th.' + tableClass.col + '-checkbox,th.' + tableClass.col + '-radio');
                // 确保选择列宽度不变
                ths.each(function (i, th) {
                    $(th).css('width', ieVersion <= 6 ? 51 : 20);
                });
                // ie6及以下，table宽度可能会多出一像素，从而撑破父容器
                storeData.$tableHeader.css({
                    width: storeData.$view[0].clientWidth - (ieVersion <= 6 ? 1 : 0)
                });
                this.setCellStyle();
                storeData.$tableHeader.css({
                    width: 'auto'
                });
            }
        }

        /**
         * 设置表格肠宽
         * @param {Number/Boolean} width 
         * @param {Number} height 
         */
        Class.prototype.setArea = function (width, height) {
            var storeData = store[this.filter];
            storeData.width = Number(width || storeData.width) || 0;
            storeData.height = Number(height || storeData.height) || 0;
            this.setViewWidth();
            if (storeData.stretch) {
                this.stretchTable();
            } else if (height && height != storeData.height) {
                this.setFixedWidth();
            }
        }

        // 设置容器宽高
        Class.prototype.setViewWidth = function () {
            var storeData = store[this.filter];
            if (storeData.width) {
                storeData.$view.css({
                    width: storeData.width
                });
                storeData.$tableMain.css({
                    width: (ieVersion <= 6 ? storeData.width - 2 : storeData.width)
                });
            }
            if (storeData.height) {
                var h = storeData.height;
                storeData.$view.css({
                    height: h
                });
                h -= storeData.$header.height();
                if (storeData.$toolbar) {
                    h -= storeData.$toolbar.outerHeight();
                }
                if (storeData.$pager) {
                    h -= storeData.$pager.outerHeight();
                }
                storeData.$tableMain.css({
                    height: h
                });
            }
        }

        // 设置固定表格容器的宽高
        Class.prototype.setFixedWidth = function () {
            var storeData = store[this.filter];
            var top = storeData.$toolbar ? storeData.$toolbar[0].offsetHeight : 0;
            var hasHscroll = storeData.$tableMain[0].scrollWidth > storeData.$tableMain[0].clientWidth;
            var hasVscroll = storeData.$tableMain[0].scrollHeight > storeData.$tableMain[0].clientHeight
            var height = storeData.$tableMain[0].clientHeight;
            if (storeData.$fixedLeft) {
                storeData.$fixedLeft.css({
                    width: storeData.$fixedLeftTableHeader[0].offsetWidth, // ie6及以下浏览器不设置宽度将撑破父容器
                    top: top
                });
                storeData.$fixedLeftMain.css({
                    height: height
                });
            }
            if (storeData.$fixedRight) {
                var left = 'auto';
                var right = 0;
                if (!hasHscroll) { // 没有横向滚动条
                    right = 'auto';
                    left = storeData.$table[0].offsetWidth - storeData.$fixedRightTableHeader[0].offsetWidth;
                } else if (hasVscroll) { // 有纵向滚动条
                    right = scrBarWidth;
                }
                if (hasVscroll) { // 有纵向滚动条
                    storeData.$mend && storeData.$mend.show();
                } else {
                    storeData.$mend && storeData.$mend.hide();
                }
                storeData.$fixedRight.css({
                    width: storeData.$fixedRightTableHeader[0].offsetWidth, // ie6及以下浏览器不设置宽度将撑破父容器
                    top: top,
                    left: left,
                    right: right
                });
                storeData.$fixedRightMain.css({
                    height: height
                });
            }
        }

        // 渲染工具条
        Class.prototype.renderToolbar = function () {
            var storeData = store[this.filter];
            var $toolbar = $('<div class="' + [tableClass.toolbar, 'song-clear'].join(' ') + '"></div>');
            if (storeData.defaultToolbar) {
                var defaultToolbar = storeData.defaultToolbar;
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
                            storeData.$exports = $exports;
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (storeData.toolbar || storeData.defaultToolbar) {
                storeData.$toolbar = $toolbar;
                $toolbar.append(storeData.toolbar);
                storeData.$view.prepend($toolbar);
            }
        }

        /**
         * 渲染表头
         * @param {String} fixed 
         */
        Class.prototype.renderTableHeader = function (fixed) {
            var that = this;
            var storeData = store[this.filter];
            var $view = storeData.$view;
            var originCols = storeData.originCols;
            // 创建多级表头
            originCols.map(function (cols) {
                var $tr = $('<tr></tr>');
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    if (fixed && col.fixed != fixed) {
                        continue;
                    }
                    col.type = col.type || 'text';
                    var $cell = $('<div class="' + ['song-clear', tableClass.cell + '-' + storeData.tableCount + '-' + col._key, tableClass.cell].join(' ') + '">' + (col.title || '') + '</div>');
                    var $th = $('<th class="' + [tableClass.col + '-' + col.type, tableClass.col + '-' + storeData.tableCount + '-' + col._key].join(' ') + '" data-field="' + (col.field || '') + '"></th>');
                    $th[0].songBindData = {
                        col: col
                    };
                    // 隐藏
                    if (col.hidden) {
                        $th.hide();
                    }
                    // 选择列
                    if (col.type == 'radio' || col.type == 'checkbox') {
                        col.width = 20;
                    }
                    if (col.colspan >= 2) {
                        $th.attr('colspan', col.colspan);
                    } else if (col.sortAble && col.field && !(col.colspan > 1)) { // 可排序
                        if (ieVersion <= 9) {
                            $th[0].onselectstart = function () {
                                return false
                            };
                        }
                        _renderSortIcon($th, $cell, col);
                    } else if (ieVersion <= 9) { // 调整列宽中防止选中文本
                        $th[0].onselectstart = function () {
                            if (storeData.tempData.resizeData) {
                                return false
                            }
                        };
                    }
                    // 文字对齐方式
                    if (col.align) {
                        $th.addClass('song-table-align-' + col.align);
                    }
                    col.rowspan >= 2 && $th.attr('rowspan', col.rowspan);
                    $th.append($cell);
                    $tr.append($th);
                    // 固定列和普通列中值处理其中一个
                    if (fixed || (col.fixed != 'left' && col.fixed != 'right')) {
                        // 单选
                        if (col.type == 'radio') {
                            Form.once('radio(table_radio_' + that.filter + ')', function (e) {
                                storeData._selectedData = that.getRowDataById(e.data);
                            });
                        }
                        // 多选
                        if (col.type == 'checkbox') {
                            var $all = $('<input type="checkbox" song-filter="table_checkbox_' + that.filter + '_all">');
                            $cell.html($all);
                            Form.once('checkbox(table_checkbox_' + that.filter + ')', function (e) {
                                var checkedData = [];
                                for (var i = 0; i < e.data.length; i++) {
                                    checkedData.push(that.getRowDataById(e.data[i]));
                                }
                                storeData._checkedData = checkedData
                                $all.prop('checked', checkedData.length == storeData._sortedData.length);
                                Form.render('checkbox(table_checkbox_' + that.filter + '_all)', storeData.$view);
                            });
                            // 全选或者全不选
                            Form.once('checkbox(table_checkbox_' + that.filter + '_all)', function (e) {
                                var checked = $(e.dom).prop('checked');
                                var checkedData = checked ? storeData._sortedData.concat([]) : [];
                                var boxs = $view.find('input[type="checkbox"][song-filter="table_checkbox_' + that.filter + '"]');
                                boxs.each(function (i, box) {
                                    $(box).prop('checked', checked);
                                });
                                storeData._checkedData = checkedData
                                Form.render('checkbox(table_checkbox_' + that.filter + ')', storeData.$view);
                            });
                        }
                    }
                }
                if (fixed) {
                    if ($th) { // 空$tr无效
                        if (fixed == 'left') {
                            storeData.$fixedLeftTableHeaderHead.append($tr);
                        } else {
                            storeData.$fixedRightTableHeaderHead.append($tr);
                        }
                    }
                    return;
                } else {
                    storeData.$tableHeaderHead.append($tr);
                }
            });
            // 挂载主表表头
            if (!fixed) {
                storeData.$tableHeader.append(storeData.$tableHeaderHead);
                storeData.$header.append(storeData.$tableHeader);
                storeData.$header.insertAfter(storeData.$toolbar);
                this.setCellStyle();
                this.setColStyle();
            }

            // 渲染排序图标
            function _renderSortIcon($th, $cell, col) {
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
                    storeData.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    storeData._sortObj.field = col.field;
                    storeData._sortObj.sort = 'asc';
                    $up.addClass(tableClass.sortConfirm);
                    that.renderTableBody(true);
                    return false;
                });
                $down.on('mouseenter', function () {
                    $down.addClass(tableClass.sortHover);
                }).on('mouseleave', function () {
                    $down.removeClass(tableClass.sortHover);
                }).on('click', function () {
                    storeData.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    storeData._sortObj.field = col.field;
                    storeData._sortObj.sort = 'desc';
                    $down.addClass(tableClass.sortConfirm);
                    that.renderTableBody(true);
                    return false;
                });
            }
        }

        // 设置单元格高度样式表
        Class.prototype.setColStyle = function () {
            var that = this;
            var storeData = store[this.filter];
            var hs = [];
            var ths = storeData.$tableHeaderHead.find('th');
            ths.each(function (i, th) {
                hs.push(ieVersion <= 6 ? th.offsetHeight : $(th).height());
            });
            ths.each(function (i, th) {
                Common.insertRule(storeData.sheet, that.getClassNameWithKey(th.songBindData.col, 'th.' + tableClass.col), 'height:' + hs[i] + 'px;');
            });
        }

        // 设置单元格宽度样式表
        Class.prototype.setCellStyle = function (cols) {
            var that = this;
            var storeData = store[this.filter];
            var ws = [];
            var ths = [];
            // 只设置部分列
            if (cols) {
                cols = cols.map(function (col) {
                    return col._key;
                });
            }
            storeData.$tableHeaderHead.find('th').each(function (i, th) {
                if (cols) {
                    if (cols.indexOf(th.songBindData.col._key) > -1) {
                        ths.push(th);
                    }
                } else if ($(th).is(':visible')) {
                    ths.push(th);
                }
            });
            ths.map(function (th, i) {
                var $cell = $(th.children[0]);
                var width = th.songBindData.col.width;
                width = ieVersion <= 6 ? width + hCellPadding : width;
                $cell.css('width', 'auto');
                if (th.songBindData.col.width) {
                    $cell.css('width', width);
                }
            });
            ths.map(function (th, i) {
                ws.push({
                    tw: ieVersion <= 6 ? th.offsetWidth : th.clientWidth,
                    cw: ieVersion <= 6 ? th.clientWidth : th.clientWidth - hCellPadding
                });
            });
            ths.map(function (th, i) {
                var $cell = $(th.children[0]);
                var cw = th.songBindData.col.colspan > 1 ? 'auto' : ws[i].cw + 'px';
                var cellSelector = that.getClassNameWithKey(th.songBindData.col, '.' + tableClass.cell);
                $cell.css('width', cw);
                Common.deleteRule(storeData.sheet, cellSelector);
                Common.insertRule(storeData.sheet, cellSelector, 'width:' + cw);
            });
            this.setFixedWidth();
        }

        /**
         * 渲染表格
         * @param {Boolean} justSort 
         */
        Class.prototype.renderTableBody = function (justSort) {
            var that = this;
            var storeData = store[this.filter];
            var cols = storeData.cols;
            if (!storeData.$tableMain.inserted) {
                var viewWidth = storeData.$view.width();
                storeData.$tableMain.insertAfter(storeData.$header);
                storeData.$tableMain.css({
                    width: viewWidth
                });
                storeData.$tableMain.inserted = true;
            }

            if (justSort) {
                _render();
            } else if (storeData.data) {
                var start = (storeData.nowPage - 1) * storeData.limit;
                var end = storeData.nowPage * storeData.limit;
                storeData._renderedData = storeData.data.slice(start, end).map(function (item) {
                    return Object.assign({}, item);
                });
                storeData._sortedData = storeData._renderedData.concat([]);
                _render();
            } else {
                this.httpGet(function (res) {
                    storeData._renderedData = res.data;
                    storeData._loadedData = res.data.map(function (item) {
                        return Object.assign({}, item);
                    });
                    storeData._sortedData = storeData._renderedData.concat([]);
                    storeData.pager.count != res.count && storeData.pager.reload({
                        count: res.count
                    });
                    _render();
                });
            }

            // 渲染
            function _render() {
                // 数据排序
                _sort();
                // ie6解析css需要一定时间，方式setCellStyle无效
                if (ieVersion <= 6) {
                    clearTimeout(storeData.renderTimer)
                    storeData.renderTimer = setTimeout(function () {
                        that.renderTr();
                        // 渲染固定列
                        that.renderTableFixed();
                    });
                } else {
                    that.renderTr();
                    // 渲染固定列
                    that.renderTableFixed();
                }
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
                    if (col.sortAble && storeData._sortObj.field == col.field) {
                        if (typeof col.sortAble == 'object') {
                            sortFun = Object.assign(sortFun, col.sortAble);
                        }
                        storeData._sortedData = storeData._renderedData.concat([]);
                        if (storeData._sortObj.sort) {
                            sortFun[storeData._sortObj.sort] && storeData._sortedData.sort(function (a, b) {
                                return sortFun[storeData._sortObj.sort](a[col.field], b[col.field]);
                            });
                        }
                    }
                });
            }
        }

        /**
         * 渲染固定列表格
         */
        Class.prototype.renderTableFixed = function () {
            var storeData = store[this.filter];
            var cols = storeData.cols;
            if (cols.length && cols[0].fixed == 'left') {
                if (!storeData.$fixedLeft) {
                    storeData.$fixedLeft = $('<div class="' + tableClass.fixedLeft + '"></div>');
                    storeData.$fixedLeftHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                    storeData.$fixedLeftMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                    storeData.$fixedLeftTable = $('<table class="' + tableClass.table + '"></table>');
                    storeData.$fixedLeftTableHeader = $('<table class="' + tableClass.table + '"></table>');
                    storeData.$fixedLeftTableHeaderHead = $('<thead></thead>');
                    storeData.$fixedLeftTableHeader.append(storeData.$fixedLeftTableHeaderHead);
                    storeData.$fixedLeftHeader.append(storeData.$fixedLeftTableHeader);
                    storeData.$fixedLeft.append(storeData.$fixedLeftHeader);
                    storeData.$fixedLeft.append(storeData.$fixedLeftMain);
                    storeData.$fixedLeftHeader.css('height', ieVersion <= 6 ? storeData.$tableHeader.outerHeight() : storeData.$tableHeader.height());
                    this.renderTableHeader('left');
                    storeData.$view.append(storeData.$fixedLeft);
                    storeData.$fixedLeftMain.on('mousewheel', function (e) {
                        var wheelDelta = e.originalEvent.wheelDelta;
                        if (wheelDelta < 0) {
                            wheelDelta += 20;
                        } else {
                            wheelDelta -= 20;
                        }
                        storeData.$tableMain[0].scrollTop -= wheelDelta;
                        return false;
                    });
                }
                this.renderTr('left');
            }
            if (cols.length && cols[cols.length - 1].fixed == 'right') {
                if (!storeData.$fixedRight) {
                    storeData.$mend = $('<div class="' + tableClass.mend + '"></div>');
                    storeData.$fixedRight = $('<div class="' + tableClass.fixedRight + '"></div>');
                    storeData.$fixedRightHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                    storeData.$fixedRightMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                    storeData.$fixedRightTable = $('<table class="' + tableClass.table + '"></table>');
                    storeData.$fixedRightTableHeader = $('<table class="' + tableClass.table + '"></table>');
                    storeData.$fixedRightTableHeaderHead = $('<thead></thead>');
                    storeData.$fixedRightTableHeader.append(storeData.$fixedRightTableHeaderHead);
                    storeData.$fixedRightHeader.append(storeData.$fixedRightTableHeader);
                    storeData.$fixedRightHeader.append(storeData.$mend);
                    storeData.$fixedRight.append(storeData.$fixedRightHeader);
                    storeData.$fixedRight.append(storeData.$fixedRightMain);
                    storeData.$fixedRightHeader.css('height', ieVersion <= 6 ? storeData.$tableHeader.outerHeight() : storeData.$tableHeader.height());
                    // ie6及以下浏览器在父容器高度不固定的情况下100%高度无效
                    storeData.$mend.css('height', storeData.$tableHeader[0].clientHeight);
                    this.renderTableHeader('right');
                    storeData.$view.append(storeData.$fixedRight);
                    storeData.$fixedRightMain.on('mousewheel', function (e) {
                        var wheelDelta = e.originalEvent.wheelDelta;
                        if (wheelDelta < 0) {
                            wheelDelta += 20;
                        } else {
                            wheelDelta -= 20;
                        }
                        storeData.$tableMain[0].scrollTop -= wheelDelta;
                        return false;
                    });
                }
                this.renderTr('right');
            }
            if (storeData.$fixedLeft || storeData.$fixedRight) {
                this.setFixedWidth();
            }
        }

        /**
         * 渲染行数据
         * @param {String} fixed 
         */
        Class.prototype.renderTr = function (fixed) {
            var storeData = store[this.filter];
            var $table = storeData.$table;
            var $tableMain = storeData.$tableMain;
            var data = storeData._sortedData;
            // 渲染左固定列
            if (fixed == 'left') {
                $table = storeData.$fixedLeftTable;
                $tableMain = storeData.$fixedLeftMain;
            }
            // 渲染右固定列
            if (fixed == 'right') {
                $table = storeData.$fixedRightTable;
                $tableMain = storeData.$fixedRightMain;
            }
            var trs = $table.children('tbody').children('tr');
            // 取消全选
            storeData.$tableHeaderHead.find('[song-filter="table_checkbox_' + this.filter + '_all"]').prop('checked', false);
            storeData.$fixedLeftTableHeaderHead && storeData.$fixedLeftTableHeaderHead.find('[song-filter="table_checkbox_' + this.filter + '_all"]').prop('checked', false);
            storeData.$fixedRightTableHeaderHead && storeData.$fixedRightTableHeaderHead.find('[song-filter="table_checkbox_' + this.filter + '_all"]').prop('checked', false);
            storeData.$tableHeader.find('[song-filter="table_checkbox_' + this.filter + '_all"]').prop('checked', false);
            storeData._checkedData = [];
            storeData._selectedData = null;
            for (var i = 0; i < data.length; i++) {
                if (trs[i]) { // 重复利用
                    this.replaceTr(data[i], trs[i], fixed);
                } else {
                    $table.append(this.createTr(data[i], fixed));
                }
            }
            // 延迟插入，避免闪屏
            if (!$table.inserted) {
                $tableMain.append($table);
                $table.inserted = true;
            }
            // 删除多余的tr
            for (var i = data.length; i < trs.length; i++) {
                $(trs[i]).remove();
            }
            clearTimeout(storeData.timers.renderTimer);
            storeData.timers.renderTimer = setTimeout(function () {
                Form.render('', storeData.$view);
            }, 0);
        }

        /**
         * 创建表格行
         * @param {Object} data 
         * @param {String} fixed 
         */
        Class.prototype.createTr = function (data, fixed) {
            var storeData = store[this.filter];
            var cols = storeData.cols;
            var id = data.id || data._song_table_id;
            if (id === undefined) {
                if (fixed == 'left') {
                    id = storeData._fixeLeftIdCount++;
                } else if (fixed == 'right') {
                    id = storeData._fixeRightIdCount++;
                } else {
                    id = storeData._idCount++;
                }
            }
            var $tr = $('<tr data-id="' + id + '"></tr>');
            data._song_table_id = id;
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                var $td = null;
                if (fixed) { // 固定列
                    if (col.fixed == fixed) {
                        $td = this.createTd(col, data);
                        $tr.append($td);
                    }
                } else {
                    if (col.fixed == 'left' || col.fixed == 'right') { // 主表格中的占位列
                        $td = $('<td class="' + [tableClass.col + '-' + col.type, tableClass.col + '-' + storeData.tableCount + '-' + col._key, tableClass.fixedEmpty].join(' ') + '" data-field="' + (col.field || '') + '"></td>');
                        $cell = $('<div class="' + ['song-clear', tableClass.cell + '-' + storeData.tableCount + '-' + col._key, tableClass.cell].join(' ') + '"></div>');
                        $td[0].songBindData = {};
                        $td[0].songBindData.colData = data[col.field];
                        $td[0].songBindData.col = col;
                        $td[0].songBindData.rowData = data;
                        $td[0].songBindData.id = id;
                        $td.append($cell);
                    } else {
                        $td = this.createTd(col, data);
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
         * @param {Object} data 
         * @param {DOM} tr 
         * @param {String} fixed 
         */
        Class.prototype.replaceTr = function (data, tr, fixed) {
            var storeData = store[this.filter];
            var cols = storeData.cols;
            var id = data.id || data._song_table_id;
            if (id === undefined) {
                if (fixed == 'left') {
                    id = storeData._fixeLeftIdCount++;
                } else if (fixed == 'right') {
                    id = storeData._fixeRightIdCount++;
                } else {
                    id = storeData._idCount++;
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
         * @param {Object} col 
         * @param {Object} data 
         */
        Class.prototype.createTd = function (col, data) {
            var storeData = store[this.filter];
            var $td = $('<td class="' + [tableClass.col + '-' + col.type, tableClass.col + '-' + storeData.tableCount + '-' + col._key].join(' ') + '" data-field="' + (col.field || '') + '"></td>');
            var $cell = null;
            var id = data._song_table_id;
            $td[0].songBindData = {};
            if (col.type == 'text') { //文本列
                $cell = $('<div class="' + ['song-clear', tableClass.cell].join(' ') + '">' + getCellHtml(data[col.field], data, id, col) + '</div>');
            } else if (col.type == 'radio') { // 单选列
                $cell = $('<div class="' + ['song-clear', tableClass.cell].join(' ') + '"><input type="radio" name="table_radio_' + this.filter + '" value="' + id + '" song-filter="table_radio_' + this.filter + '"/></div>');
                if (storeData._selectedData && storeData._selectedData._song_table_id === id) {
                    $cell.children('input').prop('checked', true);
                }
            } else if (col.type == 'checkbox') { // 多选列
                $cell = $('<div class="' + ['song-clear', tableClass.cell].join(' ') + '"><input type="checkbox" name="table_checkbox_' + this.filter + '" value="' + id + '" song-filter="table_checkbox_' + this.filter + '"/></div>');
                for (var i = 0; i < storeData._checkedData.length; i++) {
                    if (storeData._checkedData[i]._song_table_id === id) {
                        $cell.children('input').prop('checked', true);
                        break;
                    }
                }
            } else if (col.type == 'operate') { // 操作列
                $cell = $('<div class="' + ['song-clear', tableClass.cell].join(' ') + '"></div>');
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
            if (col.align) {
                $td.addClass('song-table-align-' + col.align);
            }
            // 缓存td对应的数据
            $td[0].songBindData.colData = data[col.field];
            $td[0].songBindData.col = col;
            $td[0].songBindData.rowData = data;
            $td[0].songBindData.id = id;
            $cell.addClass(tableClass.cell + '-' + storeData.tableCount + '-' + col._key);
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
        Class.prototype.renderPage = function () {
            var that = this;
            var storeData = store[this.filter];
            if (storeData.page === false) {
                return;
            }
            var $pager = $('<div class="' + tableClass.pager + '"></div>');
            var $elem = $('<div song-filter="table_pager_' + this.filter + '"></div>');
            $pager.append($elem);
            storeData.$pager = $pager;
            storeData.pager = Pager.render({
                elem: $elem[0],
                nowPage: storeData.nowPage,
                limit: storeData.limit,
                size: 'small',
                count: storeData.data ? storeData.data.length : storeData._loadedData.length,
                prev: '<span style="font-weight:bold">' + leftIcon + '</span>',
                next: '<span style="font-weight:bold">' + rightIon + '</span>'
            });
            storeData.pager.on('page', function (page) {
                storeData.nowPage = page;
                that.renderTableBody();
            });
            storeData.pager.on('limit', function (limit) {
                storeData.limit = limit;
            });
            storeData.$pager.insertAfter(storeData.$tableMain);
        }

        Class.prototype.httpGet = function (success, error) {
            var storeData = store[this.filter];
            var data = storeData.reqeust.data || {};
            data[storeData.reqeust.pageName || 'page'] = storeData.nowPage;
            data[storeData.reqeust.limitName || 'limit'] = storeData.limit;
            $.ajax({
                url: storeData.reqeust.url,
                method: storeData.reqeust.method || 'get',
                dataType: storeData.reqeust.dataType || 'json',
                contentType: storeData.reqeust.contentType || 'application/json',
                data: data,
                success: function (res) {
                    storeData.reqeust.success && storeData.reqeust.success(res);
                    success(storeData.reqeust.parseData && storeData.reqeust.parseData(res) || res);
                },
                error: function (res) {
                    storeData.reqeust.error && storeData.reqeust.error(res);
                    error && error(res);
                }
            })
        }

        // 绑定容器的事件
        Class.prototype.bindEvent = function () {
            var that = this;
            var storeData = store[this.filter];
            var editTrigger = storeData.editTrigger || 'click'; //触发编辑的事件类型
            $body.on('click', function (e) {
                var table = $(e.target).parents('table')[0];
                // 点击表格之外的区域，自动保存编辑中的数据
                if (storeData.autoSave && table != storeData.$table[0] &&
                    (!storeData.$fixedLeftTable || table != storeData.$fixedLeftTable[0]) &&
                    (!storeData.$fixedRightTable || table != storeData.$fixedRightTable[0])) {
                    that.save();
                }
                storeData.$exports && storeData.$exports.hide();
                storeData.$filter && storeData.$filter.hide();
            });
            $body.on('mousemove', function (e) {
                // 调整列宽中
                // 延时执行，避免卡顿
                Common.cancelNextFrame(storeData.timers.resizingTimer);
                storeData.timers.resizingTimer = Common.nextFrame(function () {
                    if (storeData.tempData.resizeData) {
                        var x = e.pageX - storeData.tempData.resizeData.pageX;
                        var th = storeData.tempData.resizeData.th;
                        var col = th.songBindData.col;
                        var width = storeData.tempData.resizeData.originWidth + x;
                        col.width = width;
                        that.setCellStyle([th.songBindData.col]);
                        storeData.$tableHeader.css({
                            left: -storeData.$tableMain[0].scrollLeft
                        });
                    }
                }, 0);
            });
            $body.on('mouseup', function (e) {
                // 调整列宽结束
                if (storeData.tempData.resizeData) {
                    storeData.tempData.resizeData = undefined;
                    storeData.$view.removeClass(tableClass.colResize);
                }
            });
            _bindScrollEvent();
            if (storeData.tempData.bindedEvent) {
                return;
            }
            storeData.tempData.bindedEvent = true;
            _bindClickEvent();
            _bindEditEvent();
            _bindHoverEvent();
            _bindColResizeEvent();
            _bindOverflowEvent();
            _bindOrderByEvent();
            _bindToolbarEvent();

            function _bindClickEvent() {
                // 表格中的所有点击事件
                storeData.$view.on('click', function (e) {
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
                        that.filter && that.trigger(event, data);
                    }
                    // 阻止冒泡
                    if (stop) {
                        return false;
                    }
                });
                // 行点击事件
                storeData.$view.delegate('tbody tr', 'click', function () {
                    // 触发行点击事件
                    that.trigger('row', {
                        dom: this,
                        id: this.songBindData.id,
                        data: this.songBindData.rowData
                    });
                });
                // 列点击事件
                storeData.$view.delegate('tbody td', 'click', function () {
                    // 触发单元格点击事件
                    that.trigger('col', {
                        dom: this,
                        id: this.songBindData.id,
                        data: this.songBindData.colData
                    });
                })
            }

            function _bindEditEvent() {
                // 回车保存
                storeData.$view.on('keydown', function (e) {
                    if (storeData.enterSave) {
                        var $td = $(e.target).parents('td');
                        if ($td.length && e.keyCode == 13) {
                            that.save($td[0].songBindData.id, $td[0].songBindData.col.field);
                        }
                    }
                });
                // 点击编辑
                storeData.$view.on(editTrigger, function (e) {
                    var $target = $(e.target);
                    if ($target.attr('song-event')) {
                        return;
                    }
                    var $td = $target.parents('td');
                    if (!$td.length || $td[0].songBindData.editing) {
                        return;
                    }
                    var pass = true;
                    // 先保存真在编辑中的数据
                    if (storeData.autoSave) {
                        pass = that.save();
                    }
                    if ($td[0].songBindData.col.editable && $td[0].songBindData.col.field) {
                        if (pass && $td[0].songBindData.col.editable) {
                            that.edit($td[0].songBindData.id, $td[0].songBindData.col.field);
                        }
                    }
                });
            }

            function _bindHoverEvent() {
                storeData.$view.delegate('tbody tr', 'mousemove', function (e) {
                    var id = this.songBindData.id;
                    Common.cancelNextFrame(storeData.timers.hoverInTimer);
                    storeData.timers.hoverInTimer = Common.nextFrame(function () {
                        storeData.tempData.hoverTrs && storeData.tempData.hoverTrs.removeClass(tableClass.hover);
                        storeData.tempData.hoverTrs = storeData.$view.find('tr[data-id="' + id + '"]');
                        storeData.tempData.hoverTrs.addClass(tableClass.hover);
                        Common.cancelNextFrame(storeData.timers.hoverOutTimer);
                    }, 0);
                }).delegate('tbody tr', 'mouseleave', function (e) {
                    storeData.timers.hoverOutTimer = Common.nextFrame(function () {
                        storeData.tempData.hoverTrs && storeData.tempData.hoverTrs.removeClass(tableClass.hover);
                        storeData.tempData.hoverTrs = undefined;
                    });
                });
            }

            function _bindScrollEvent() {
                // 滚动事件
                storeData.$tableMain.on('scroll', function (e) {
                    storeData.$tableHeader.css({
                        left: -storeData.$tableMain[0].scrollLeft
                    });
                    if (storeData.$fixedLeftMain) {
                        storeData.$fixedLeftMain[0].scrollTop = storeData.$tableMain[0].scrollTop;
                    }
                    if (storeData.$fixedRightMain) {
                        storeData.$fixedRightMain[0].scrollTop = storeData.$tableMain[0].scrollTop;
                    }
                    if (storeData._$tips.length) {
                        var tds = storeData.$view.find('td');
                        storeData._$tips.map(function ($tip) {
                            $tip.remove();
                        });
                        tds.each(function (i, td) {
                            td.songBindData.$tip = undefined;
                        });
                    }
                });
            }

            function _bindColResizeEvent() {
                // 调整列宽事件
                storeData.$view.delegate('th', 'mousemove', function (e) {
                    var th = this;
                    Common.cancelNextFrame(storeData.timers.resizeTimer);
                    storeData.timers.resizeTimer = Common.nextFrame(function () {
                        if (!storeData.tempData.resizeData && !(th.songBindData.col.colspan > 1)) {
                            var $th = $(th);
                            if (e.offsetX > th.clientWidth - 10) {
                                $th.addClass(tableClass.colResize);
                                th.songBindData.$tipIcon && th.songBindData.$tipIcon.remove();
                                th.songBindData.$tipIcon = undefined;
                            } else {
                                $th.removeClass(tableClass.colResize);
                            }
                        }
                    });
                });
                storeData.$view.delegate('th', 'mousedown', function (e) {
                    if (!storeData.tempData.resizeData && $(this).hasClass(tableClass.colResize)) {
                        storeData.tempData.resizeData = {
                            pageX: e.pageX,
                            th: this,
                            originWidth: this.clientWidth - hCellPadding
                        }
                        storeData.$view.addClass(tableClass.colResize);
                    }
                });
            }

            function _bindOverflowEvent() {
                // 内容溢出处理
                storeData.$view.delegate('th,td', 'mousemove', function () {
                    var td = this;
                    Common.cancelNextFrame(storeData.timers.overflowTimer);
                    storeData.timers.overflowTimer = Common.nextFrame(function () {
                        var $td = $(td);
                        // 正在调整列宽中或准备调整列宽
                        if (storeData.tempData.resizeData || $td.hasClass(tableClass.colResize)) {
                            return;
                        }
                        var songBindData = td.songBindData;
                        var col = songBindData.col;
                        var $cell = $td.children('.' + tableClass.cell);
                        if (!songBindData.$tipIcon && col.type == 'text' && !td.songBindData.editing && Common.checkOverflow($cell[0])) {
                            var $div = $('<div class="' + tableClass.tipIcon + '">' + downIcon + '</div>');
                            songBindData.$tipIcon = $div;
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
                                storeData._$tips.push($div);
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
                    });
                }).delegate('th,td', 'mouseleave', function () {
                    this.songBindData.$tipIcon && this.songBindData.$tipIcon.remove();
                    this.songBindData.$tipIcon = undefined;
                });
            }

            function _bindOrderByEvent() {
                // 排序事件
                storeData.$view.delegate('th', 'click', function (e) {
                    var $this = $(this);
                    // 触发排序
                    var col = this.songBindData.col;
                    if (col.sortAble && !storeData.tempData.resizeData && !$this.hasClass(tableClass.colResize)) {
                        var $up = $this.find('div.' + tableClass.sortUp);
                        var $down = $this.find('div.' + tableClass.sortDown);
                        storeData.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                        if (storeData._sortObj.field != col.field) {
                            storeData._sortObj.field = col.field;
                            storeData._sortObj.sort = '';
                        }
                        if (!storeData._sortObj.sort) {
                            storeData._sortObj.sort = 'asc';
                            $up.addClass(tableClass.sortConfirm);
                        } else if (storeData._sortObj.sort == 'asc') {
                            storeData._sortObj.sort = 'desc';
                            $down.addClass(tableClass.sortConfirm);
                        } else {
                            storeData._sortObj.sort = '';
                        }
                        that.renderTableBody(true);
                    }
                });
            }

            function _bindToolbarEvent() {
                // 筛选字段事件
                that.on('filter', function (e) {
                    if (storeData.$filter) {
                        storeData.$filter.toggle();
                    } else {
                        that.createFilter(e.dom);
                    }
                    storeData.$exports && storeData.$exports.hide();
                });
                // 导出事件
                that.on('exports', function (e) {
                    storeData.$exports.toggle();
                    storeData.$filter && storeData.$filter.hide();
                });
                // 导出事件
                that.on('exports-excel', function (e) {
                    that.exportsExecl();
                    storeData.$exports.hide();
                });
                // 导出事件
                that.on('exports-csv', function (e) {
                    that.exportsCsv();
                    storeData.$exports.hide();
                });
                // 打印事件
                that.on('print', function (e) {
                    that.print();
                });
            }
        }

        // 创建过滤器
        Class.prototype.createFilter = function (dom) {
            var that = this;
            var storeData = store[this.filter];
            var $view = storeData.$view;
            var $filter = $('<ul class="' + tableClass.filter + '"></ul>');
            storeData.$filter = $filter;
            for (var i = 0; i < storeData.cols.length; i++) {
                var col = storeData.cols[i];
                if (col.type == 'text') {
                    $filter.append('<li><input type="checkbox" title="' + col.title + '" value="' + col._key + '" checked song-filter="song_table_' + this.filter + '_filter"></li>');
                }
            }
            // 在工具图标下挂载
            $(dom).append($filter);
            $filter.on('click', function () {
                return false;
            });
            Form.on('checkbox(song_table_' + this.filter + '_filter)', function (e) {
                var $input = $(e.dom);
                var value = $input.val();
                var checked = $input.prop('checked');
                var col = that.getColByKey(value);
                var allThs = [];
                var nowTh = null;
                $view.find('th,td').each(function (i, td) {
                    if (td.songBindData.col._key == value) {
                        checked ? $(td).show() : $(td).hide();
                        if (td.tagName.toUpperCase() == 'TH' && !td.songBindData.holder) {
                            nowTh = td;
                        }
                    }
                    if (td.tagName.toUpperCase() == 'TH' && !td.songBindData.holder) {
                        allThs.push(td);
                    }
                });
                // 存在上级父列
                if (col.parent) {
                    _setParentCol(nowTh);
                    that.setCellStyle(col.parent.child);
                } else {
                    that.setFixedWidth();
                }
                storeData.$tableHeader.css({
                    left: -storeData.$tableMain[0].scrollLeft
                });

                // 设置父级列的colspan
                function _setParentCol(th) {
                    var col = th.songBindData.col.parent;
                    var ths = _getThByCol(col);
                    ths.map(function (th) {
                        var $th = $(th);
                        var colspan = th.songBindData.colspan === undefined ? col.colspan : th.songBindData.colspan;
                        checked ? ++colspan : --colspan;
                        // ie7及以下浏览器设置为0时会报错
                        colspan > 0 && $th.attr('colspan', colspan);
                        colspan ? $th.show() : $th.hide();
                        th.songBindData.colspan = colspan;
                    });
                    if (col.parent) {
                        _setParentCol(ths[0]);
                    }
                }

                function _getThByCol(col) {
                    var ths = [];
                    for (var i = 0; i < allThs.length; i++) {
                        if (allThs[i].songBindData.col._key == col._key) {
                            ths.push(allThs[i]);
                        }
                    }
                    return ths;
                }
            });
            Form.render('checkbox(song_table_' + this.filter + '_filter)', $filter);
        }

        // 导出
        Class.prototype.exportsExecl = function () {
            var storeData = store[this.filter];
            if (window.btoa) {
                var trs = null;
                var $table = $(storeData.$tableHeader[0].outerHTML);
                $table.append(storeData.$table.children('tbody').html());
                trs = $table.children('tbody').children('tr');
                // 左固定列中的数据
                storeData.$fixedLeftTable && storeData.$fixedLeftTable.children('tbody').find('tr').each(function (i, tr) {
                    var tds = $(trs[i]).children('td');
                    $(tr).children('td').each(function (i, td) {
                        $(tds[i]).html($(td).html());
                    });
                });
                // 右固定列中的数据
                storeData.$fixedRightTable && storeData.$fixedRightTable.children('tbody').find('tr').each(function (i, tr) {
                    var tds = $(trs[i]).children('td');
                    var _tds = $(tr).children('td');
                    _tds.each(function (i, td) {
                        $(tds[tds.length - _tds.length + i]).html($(td).html());
                    });
                });
                $table.find('.' + tableClass.col + '-radio,.' + tableClass.col + '-checkbox,.' + tableClass.col + '-operate').remove();
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

        Class.prototype.exportsCsv = function () {
            var storeData = store[this.filter];
            var cols = storeData.cols;
            var title = '';
            var dataStr = '';
            cols.map(function (col) {
                title += col.title + ',';
            });
            title = title.slice(0, -1) + '\n';
            storeData._sortedData.map(function (data) {
                var str = '';
                cols.map(function (col) {
                    if (col.type == 'text') {
                        var html = data[col.field];
                        if (col.template) { // 自定义渲染函数
                            html = col.template(data[col.field], data, data._song_table_id, col);
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
        Class.prototype.print = function () {
            var storeData = store[this.filter];
            if (window.print) {
                var $table = $(storeData.$tableHeader[0].outerHTML);
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
                $table.append(storeData.$table.children('tbody').html());
                var trs = $table.children('tbody').children('tr');
                // 左固定列中的数据
                storeData.$fixedLeftTable && storeData.$fixedLeftTable.children('tbody').find('tr').each(function (i, tr) {
                    var tds = $(trs[i]).children('td');
                    $(tr).children('td').each(function (i, td) {
                        $(tds[i]).html($(td).html());
                    });
                });
                // 右固定列中的数据
                storeData.$fixedRightTable && storeData.$fixedRightTable.children('tbody').find('tr').each(function (i, tr) {
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