/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Form, Pager) {
        var $body = $(window.document.body);
        var filterIcon = '&#xe61d;';
        var exportsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var closeIcon = '&#xe735;';
        var errorIcon = '&#xe60b;';
        var loadingIcon = '&#xe61e;';
        var radioedIcon = '&#xe61c;';
        var radioIcon = '&#xe619;';
        var checkedIcon = '&#xe737;';
        var ieVersion = Common.getIeVersion();
        var hCellPadding = 2;
        var tableCount = 1;
        var tableClass = {
            view: 'song-table-view',
            table: 'song-table',
            col: 'song-table-col',
            cell: 'song-table-cell',
            cellContent: 'song-table-cell-content',
            editCell: 'song-table-cell-edit',
            header: 'song-table-header',
            main: 'song-table-main',
            headerMain: 'song-table-header-main',
            tool: 'song-table-tool',
            toolbar: 'song-table-toolbar',
            toolbarSelf: 'song-table-tool-self',
            editing: 'song-table-editing',
            input: 'song-table-input',
            checkboxs: 'song-table-checkboxs',
            pager: 'song-table-pager',
            filter: 'song-table-filter',
            exports: 'song-table-exports',
            detailIcon: 'song-table-detail-icon',
            detail: 'song-table-detail',
            tipClose: 'song-table-detail-close',
            detail: 'song-table-detail',
            hover: 'song-table-hover',
            leftHeaderMain: 'song-table-header-main-l',
            rightHeaderMain: 'song-table-header-main-r',
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
            resizeLine: 'song-table-resize-line',
            checkbox: 'song-table-checkbox',
            radio: 'song-table-radio',
            checked: 'song-table-checked',
            empty: 'song-table-empty'
        }
        var tpl = {
            table: '<table class="song-table"></table>',
            headerMain: '<div class="song-table-header-main"></div>',
            header: '<div class="song-table-header"></div>',
            main: '<div class="song-table-main"></div>',
            tableHeader: '<table class="song-table"></table>',
            tableHeaderHead: '<thead></thead>',
            empty: '<div class="song-table-empty">暂无数据</div>',
            td: '\
            <td class="<%-(col.align?"song-table-align-"+col.align:"")%>"\
             data-key="<%-key%>-<%-col._key%>"\
             data-col="<%-col._key%>"\
             song-event="<%-col.event||""%>"\
             style="<%for(var k in col.style){%><%-k%>:<%-col.style[k]%>;<%}%><%-(col.hidden?"display:none":"")%>"\
             <%for(var k in col.attr){%> <%-k%>="<%-col.attr[k]%>"<%}%>>\
                <%-cell%>\
            </td>',
            cell: '<div class="song-clear song-table-cell song-table-cell-<%-tableCount%>-<%-col._key%>"><div class="song-table-cell-content"><%-(content||"&nbsp;")%></div></div>',
            radio: '<div class="song-table-radio <%-(checked?"song-table-checked":"")%>" data-key="<%-key%>">\
                <i class="song-radio-icon-checked">' + radioedIcon + '</i>\
                <i class="song-radio-icon-uncheck">' + radioIcon + '</i>\
                <span>&nbsp;</span>\
            </div>',
            checkbox: '<div class="song-table-checkbox <%-(checked?"song-table-checked":"")%>" data-key="<%-key%>">\
                <span class="song-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                <span><%-(title||"&nbsp;")%></span>\
            </div>',
            btn: '<button type="button" class="song-btn song-btn-xs <%-(type?"song-btn-"+type:"")%>" song-event="<%-event%>" style="margin-right:10px" <%-(stop?\'song-stop="true"\':"")%>><%-text%></button>',
            tip: '<div class="song-table-tip"><i class="song-table-icon">' + errorIcon + '</i><span></span></div>',
            loading: '<div class="song-table-loading"><i class="song-table-icon">' + loadingIcon + '</i></div>'
        }
        // 常用正则验证
        var ruleMap = Form.verifyRules;
        var Table = {
            render: function (option) {
                var table = new Class(option);
                return {
                    on: table.on,
                    once: table.once,
                    trigger: table.trigger,
                    reload: table.reload.bind(table),
                    addRow: function (option) {
                        var option = Common.deepAssign(option);
                        option.key = table.getKeyById(option.id);
                        table.addRow(option);
                    },
                    deleteRow: function (id) {
                        var key = table.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        table.deleteRow(key);
                    },
                    checkRow: function (id, checked) {
                        var key = table.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        table.checkRow(key, checked);
                    },
                    checkAll: function (checked) {
                        table.checkAll(checked);
                    },
                    save: function (id, field) {
                        var key = table.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        table.save(key, field);
                    },
                    cancel: function (id, field) {
                        var key = table.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        table.cancel(key, field);
                    },
                    edit: function (id, field) {
                        var key = table.getKeyById(id);
                        if (key === undefined) {
                            return;
                        }
                        table.edit(key, field);
                    },
                    setData: function (option) {
                        var option = Common.deepAssign(option);
                        option.key = table.getKeyById(option.id);
                        if (option.key === undefined) {
                            return;
                        }
                        table.setData(option);
                    },
                    getData: table.getData.bind(table),
                    setArea: table.setArea.bind(table),
                    setColWidth: table.setColWidth.bind(table),
                    showLoading: table.showLoading.bind(table),
                    hideLoading: table.hideLoading.bind(table),
                    exportsExecl: table.exportsExecl.bind(table),
                    exportsCsv: table.exportsCsv.bind(table),
                    print: table.print.bind(table)
                };
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
            this.$elem = $(this.option.elem);
            if (!this.$elem ||
                this.$elem.length == 0 ||
                !this.option ||
                !this.option.cols.length) {
                return;
            }
            this.filter = 'table_' + Math.random();
            this.tableCount = this.tableCount || tableCount++;
            this.$view && this.$view.remove();
            this.$view = $('<div class="' + [tableClass.view, tableClass.view + '-' + this.tableCount].join(' ') + '"></div>');
            this.$table = $(tpl.table);
            this.$headerMain = $(tpl.headerMain);
            this.$header = $(tpl.header);
            this.$tableHeader = $(tpl.tableHeader);
            this.$tableHeaderHead = $(tpl.tableHeaderHead);
            this.$main = $(tpl.main);
            this.$empty = $(tpl.empty);
            this.$filter = null;
            this.$exports = null;
            this.$leftHeaderMain = null;
            this.$rightHeaderMain = null;
            // 可配置参数-start
            this.width = this.option.width;
            this.height = this.option.height;
            this.data = this.option.data;
            this.reqeust = this.option.reqeust;
            this.defaultToolbar = this.option.defaultToolbar;
            this.toolbar = this.option.toolbar;
            this.editTrigger = this.option.editTrigger || 'click';
            this.nowPage = this.option.nowPage || 1;
            this.limit = this.option.limit || 20;
            this.stretch = this.option.stretch || false;
            this.page = this.option.page === undefined ? true : this.option.page;
            this.ellipsis = this.option.ellipsis === undefined ? true : this.option.ellipsis;
            this.autoSave = this.option.autoSave === undefined ? true : this.option.autoSave;
            this.enterSave = this.option.enterSave === undefined ? true : this.option.enterSave;
            this.originCols = this.option.cols[0] instanceof Array ? this.option.cols : [this.option.cols];
            // 可配置参数-end
            this.idCount = 0; // 主表自增id
            this.fixeLeftIdCount = 0; // 左固定表自增id
            this.fixeRightIdCount = 0; // 右固定表自增id
            this.renderedData = []; // 渲染的数据
            this.sortedData = []; // 排过序的数据
            this.addedData = []; // 手动添加的数据
            this.deletedData = []; // 删除的数据
            this.editedData = []; // 编辑过的数据
            this.checkedData = []; // 选中的数据(多选)
            this.selectedData = null; // 选中的数据(单选)
            this.$details = []; // 展开的详情弹框
            this.fixedVisible = false; // 固定表格是否可见
            this.hasLeftFixed = false; // 是否有左侧固定表格
            this.hasRightFixed = false; // 是否有右侧固定表格
            this.sortObj = { // 排序数据
                field: '',
                sort: ''
            };
            this.timers = {}; // 计时器
            this.tempData = {}; // 临时数据
            this.idKeyMap = {}; // 存储原始数据id到内部key的映射
            this.dataMap = {}; // 存储数据映射，可快速找到数据
            this.editMap = { // 存储编辑中的单元格
                list: []
            };
            this.$view.insertAfter(this.$elem);
            this.$elem.hide();
            this.initCols();
            this.createSheet();
            this.renderToolbar();
            this.renderTableHeader();
            this.renderTableFixed();
            this.renderTableBody();
            this.renderPage();
            this.setViewArea();
            ieVersion <= 6 && this.stretchTable();
            this.bindEvent();
        }

        // 初始化cols
        Class.prototype.initCols = function () {
            var that = this;
            var cols = this.originCols.concat([]);
            var key = 0;
            cols.map(function (_cols, i) {
                cols[i] = _cols.concat([]);
                // 每个col都自动生成一个唯一key
                cols[i].map(function (col) {
                    col._key = key++;
                    col.style = col.style || {};
                    col.attr = col.attr || {};
                    if (col.event) {
                        col.style['cursor'] = 'pointer';
                    }
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
            this.cols = [];
            this.cols = _getDataCol(cols, 0, 1000);
            this.cols.map(function (col) {
                col.fixed = undefined;
            });
            for (var i = 0; i < fixedLeftCount; i++) {
                this.cols[i].fixed = 'left';
            }
            for (var i = 1; i <= fixedRightCount; i++) {
                this.cols[this.cols.length - i].fixed = 'right';
            }
            if (this.cols[0].fixed === 'left') {
                this.hasLeftFixed = true;
            }
            if (this.cols[this.cols.length - 1].fixed === 'right') {
                this.hasRightFixed = true;
            }
            this.setDataMap();

            function _getDataCol(cols, level, colspan, pCol) {
                for (var i = 0, count = 0; i < colspan && cols[level][i] && count < colspan; i++) {
                    var col = cols[level][i];
                    if (col.colspan >= 2) { // colspan大于1的列不能用于渲染数据
                        if (cols[level + 1] && cols[level + 1].length) { // 有下一级表头
                            _getDataCol(cols, level + 1, col.colspan, col);
                        } else { // 无效的colspan
                            that.cols.push(col);
                            col.colspan = undefined;
                        }
                        count += (col.colspan || 1);
                    } else {
                        that.cols.push(col);
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
                return that.cols;
            }
        }

        // 创建样式表
        Class.prototype.createSheet = function () {
            if (this.sheet) {
                return;
            }
            var node = document.createElement('style');
            node.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(node);
            this.sheet = node.styleSheet || node.sheet;
            if (!this.ellipsis) {
                // 行高度自适应
                Common.insertRule(this.sheet, '.' + tableClass.view + '-' + this.tableCount + ' tbody tr', 'height:auto');
                // 单元格高度自适应
                Common.insertRule(this.sheet, '.' + tableClass.view + '-' + this.tableCount + ' .' + tableClass.cellContent, 'white-space:normal;text-overflow:unset');
            }
        }

        // 重载表格
        Class.prototype.reload = function (option) {
            this.option = Common.deepAssign(this.option, option || {});
            this.render();
        }

        /**
         * 添加数据行
         * @param {Object} option [{data, key, position}]
         */
        Class.prototype.addRow = function (option) {
            var that = this;
            var data = option.data instanceof Array ? option.data : [option.data];
            var addedData = [];
            var index = _getIndex(option.key);
            _addRow();
            this.hasLeftFixed && _addRow('left');
            this.hasRightFixed && _addRow('right');
            this.setFixedArea();
            this.sortedData = this.sortedData.slice(0, index).concat(addedData).concat(this.sortedData.slice(index));
            this.renderedData = this.renderedData.concat(addedData);
            this.checkAll(false, true);
            addedData.map(function (item) {
                that.addedData.push(item);
            });

            function _getIndex(key) {
                if (key !== undefined) {
                    for (var i = 0; i < that.sortedData.length; i++) {
                        if (that.sortedData[i]._song_table_key == key) {
                            return i;
                        }
                    }
                }
                return that.sortedData.length;
            }

            function _addRow(fixed) {
                var $table = that.$table;
                var tr = null;
                if (fixed == 'left') {
                    $table = that.$leftTable;
                    $tableHeader = that.$leftTableHeader;
                } else if (fixed == 'right') {
                    $table = that.$rightTable;
                    $tableHeader = that.$rightTableHeader;
                }
                if (fixed == 'left') {
                    tr = that.$leftTable.children('tbody').children('tr')[index - 1];
                } else if (fixed == 'right') {
                    tr = that.$rightTable.children('tbody').children('tr')[index - 1];
                } else {
                    tr = that.$table.children('tbody').children('tr')[index - 1];
                }
                if (tr) {
                    data.reverse().map(function (item, i) {
                        var $tr = $(that.createTr(item, fixed));
                        $tr.insertAfter(tr);
                        if (!fixed) {
                            addedData.push(item);
                        }
                        that.fixRowHeight(item._song_table_key, 'auto');
                    });
                } else {
                    data.map(function (item, i) {
                        var $tr = $(that.createTr(item, fixed));
                        $table.append($tr);
                        if (!fixed) {
                            addedData.push(item);
                        }
                        that.fixRowHeight(item._song_table_key, 'auto');
                    });
                }
            }
        }

        /**
         * 删除数据行
         * @param {Number} key
         */
        Class.prototype.deleteRow = function (key) {
            var that = this;
            var rowData = this.getRowDataByKey(key);
            _deleteRow();
            this.hasLeftFixed && _deleteRow('left');
            this.hasRightFixed && _deleteRow('right');
            this.checkAll(this.sortedData.length == this.checkedData.length, true);
            this.setFixedArea();

            function _deleteRow(fixed) {
                var $tr = that.getTrByKey(key, fixed);
                // 删除溢出内容弹框
                $tr.children('td').each(function (i, td) {
                    var songBindData = that.getBindData(td);
                    if (songBindData.$detail) {
                        var index = that.$details.indexOf(songBindData.$detail);
                        that.$details.splice(index, 1);
                        songBindData.$detail.remove();
                    }
                });
                $tr.remove();
                //避免重复处理数据
                if (fixed) {
                    return;
                }
                if (that.selectedData && that.selectedData._song_table_key == key) {
                    that.selectedData = null;
                }
                that.deletedData.push(rowData);
                that.deleteKeyById(rowData.id);
                _deleteData(that.addedData);
                _deleteData(that.editedData);
                _deleteData(that.checkedData);
                _deleteData(that.renderedData);
                _deleteData(that.sortedData);
            }

            function _deleteData(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]._song_table_key == key) {
                        data.splice(i, 1);
                        break;
                    }
                }
            }
        }

        // 单选框选中
        Class.prototype.selectRow = function (key) {
            var col = this.getColByType('radio');
            if (col) {
                this.$view.find('.' + tableClass.checked).removeClass(tableClass.checked);
                this.$view.find('.' + tableClass.radio + '[data-key="' + key + '"]').addClass(tableClass.checked);
                this.selectedData = this.getRowDataByKey(key);
            }
        }

        // 多选框选中/不选中
        Class.prototype.checkRow = function (key, checked) {
            var data = this.getRowDataByKey(key);
            var col = this.getColByType('checkbox');
            if (col) {
                var index = -1;
                for (var i = 0; i < this.checkedData.length; i++) {
                    if (this.checkedData[i]._song_table_key == key) {
                        index = i;
                        break;
                    }
                }
                if (checked === undefined) {
                    checked = index == -1;
                }
                if (checked) {
                    this.checkedData.push(data);
                    this.$view.find('.' + tableClass.checkbox + '[data-key="' + key + '"]').addClass(tableClass.checked);
                } else {
                    this.checkedData.splice(index, 1);
                    this.$view.find('.' + tableClass.checkbox + '[data-key="' + key + '"]').removeClass(tableClass.checked);
                }
                this.checkAll(this.sortedData.length === this.checkedData.length, true);
            }
        }

        // 全选/全不选
        Class.prototype.checkAll = function (checked, justStatus) {
            var col = this.getColByType('checkbox');
            if (col) {
                if (checked === undefined) {
                    checked = this.sortedData.length !== this.checkedData.length;
                }
                if (checked) {
                    if (justStatus) {
                        this.$tableHeader.find('.' + tableClass.checkbox).addClass(tableClass.checked);
                        this.hasLeftFixed && this.$leftTableHeader.find('.' + tableClass.checkbox).addClass(tableClass.checked);
                        this.hasRightFixed && this.$rightTableHeader.find('.' + tableClass.checkbox).addClass(tableClass.checked);
                    } else {
                        this.checkedData = this.sortedData.concat([]);
                        this.$view.find('.' + tableClass.checkbox).addClass(tableClass.checked);
                    }
                } else {
                    if (justStatus) {
                        this.$tableHeader.find('.' + tableClass.checkbox).removeClass(tableClass.checked);
                        this.hasLeftFixed && this.$leftTableHeader.find('.' + tableClass.checkbox).removeClass(tableClass.checked);
                        this.hasRightFixed && this.$rightTableHeader.find('.' + tableClass.checkbox).removeClass(tableClass.checked);
                    } else {
                        this.checkedData = [];
                        this.$view.find('.' + tableClass.checkbox).removeClass(tableClass.checked);
                    }
                }
            }
        }

        /**
         * 保存编辑中的数据
         * @param {Number} key
         * @param {String} field
         */
        Class.prototype.save = function (key, field) {
            var that = this;
            var result = true;
            var tds = [];
            var col = this.getColByField(field);
            if (key !== undefined) { // 保存某一行的数据
                this.editMap[key] && this.editMap[key].map(function (td) {
                    if (!field || col && $(td).attr('data-col') == col._key) {
                        tds.push(td);
                    }
                });
            } else { // 保存所有的数据
                this.editMap.list && this.editMap.list.map(function (td) {
                    tds.push(td);
                });
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                result = _verify(td);
                if (!result) {
                    break;
                }
            }
            if (result) {
                for (var i = 0; i < tds.length; i++) {
                    var td = tds[i];
                    _save(td);
                    _delEditMap(td);
                }
            }
            return result;

            function _delEditMap(td) {
                var songBindData = that.getBindData(td);
                var key = songBindData.rowData._song_table_key;
                var index = that.editMap[key].indexOf(td);
                that.editMap[key].splice(index, 1);
                index = that.editMap.list.indexOf(td);
                that.editMap.list.splice(index, 1);
            }

            /**
             * 获取编辑中的数据
             * @param {DOM} td 
             * @param {Boolean} ifFormat 是否格式化 
             */
            function _getValue(td, ifFormat) {
                var value = null;
                var songBindData = that.getBindData(td);
                var col = songBindData.col;
                if (typeof col.editable.save == 'function') {
                    var $edit = $(td.children[0].children[0]);
                    value = col.editable.save($edit);
                } else if (songBindData.$input) {
                    value = songBindData.$input.val();
                } else if (songBindData.$select) {
                    value = songBindData.$select[0].value;
                } else if (songBindData.$checkbox) {
                    value = songBindData.$checkbox[0].value
                }
                value = value || '';
                if (ifFormat) {
                    var rowData = songBindData.rowData;
                    // 还未保存，避免污染vulue值
                    rowData = Object.assign({}, rowData);
                    rowData.value = value;
                    value = getCellHtml(value, rowData, songBindData.rowData._song_table_key, col);
                }
                return value;
            }

            // 验证输入的数据
            function _verify(td) {
                var pass = true;
                var songBindData = that.getBindData(td);
                var col = songBindData.col;
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
                            that.showTip(msg);
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
                var songBindData = that.getBindData(td);
                var key = songBindData.rowData._song_table_key;
                var col = songBindData.col;
                var $td = $(td);
                var value = _getValue(td);
                var fValue = _getValue(td, true);
                var originValue = songBindData.colData;
                var html = '';
                songBindData.rowData[col.field] = value;
                songBindData.colData = value;
                $td.removeClass(tableClass.editing);
                html = '<div class="' + tableClass.cellContent + '">' + (col.template ? col.template(songBindData.colData, songBindData.rowData, key, col) : fValue) + '</div>';
                songBindData.editing = false;
                songBindData.$input = undefined;
                songBindData.$select = undefined;
                songBindData.$checkbox = undefined;
                td.children[0].innerHTML = html;
                if (col.fixed) {
                    that.getTrByKey(key, that.fixedVisible ? '' : col.fixed).children('td[data-key="' + key + '-' + col._key + '"]')[0].children[0].innerHTML = html;
                }
                // 值被修改过
                if (String(originValue) != String(value)) {
                    var pushed = true;
                    for (var i = 0; i < that.editedData.length; i++) {
                        if (that.editedData[i]._song_table_key == key) {
                            pushed = false;
                            break;
                        }
                    }
                    if (pushed) {
                        that.editedData.push(songBindData.rowData);
                    }
                    // 触发保存事件
                    that.trigger('save', {
                        field: col.field,
                        data: value,
                        rowData: that.delInnerProperty(songBindData.rowData)
                    });
                }
                that.fixRowHeight(key, 'auto');
            }
        }

        /**
         * 取消编辑
         * @param {Number} key 
         * @param {String} field 
         */
        Class.prototype.cancel = function (key, field) {
            var that = this;
            var tds = [];
            var col = this.getColByField(field);
            if (key !== undefined) { // 保存某一行的数据
                this.editMap[key] && this.editMap[key].map(function (td) {
                    if (!field || col && $(td).attr('data-col') == col._key) {
                        tds.push(td);
                    }
                });
            } else { // 保存所有的数据
                this.editMap.list && this.editMap.list.map(function (td) {
                    tds.push(td);
                });
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _save(td);
                _delEditMap(td);
            }

            function _delEditMap(td) {
                var songBindData = that.getBindData(td);
                var key = songBindData.rowData._song_table_key;
                var index = that.editMap[key].indexOf(td);
                that.editMap[key].splice(index, 1);
                index = that.editMap.list.indexOf(td);
                that.editMap.list.splice(index, 1);
            }

            // 获取编辑中的数据
            function _getValue(td) {
                var songBindData = that.getBindData(td);
                var value = songBindData.colData;
                var col = songBindData.col;
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
                        if (Common.indexOf(value, item.value) > -1) {
                            arr.push(item.label);
                        }
                    });
                    value = arr.join('、');
                }
                return value;
            }

            // 保存编辑的数据
            function _save(td) {
                var songBindData = that.getBindData(td);
                var key = songBindData.rowData._song_table_key;
                var col = songBindData.col;
                var $td = $(td);
                var fValue = _getValue(td);
                td.children[0].innerHTML = col.template ? col.template(songBindData.colData, songBindData.rowData, key, col) : fValue;
                $td.removeClass(tableClass.editing);
                songBindData.editing = false;
                songBindData.$input = undefined;
                songBindData.$select = undefined;
                songBindData.$checkbox = undefined;
                that.fixRowHeight(key, 'auto');
            }
        }

        /**
         * 编辑数据
         * @param {Number} key 
         * @param {String} field 
         */
        Class.prototype.edit = function (key, field) {
            var that = this;
            var tds = [];
            var col = this.getColByField(field);
            if (field && col) {
                var td = null;
                if (this.fixedVisible && col.fixed) {
                    td = this.getTrByKey(key, col.fixed).children('td[data-col="' + col._key + '"]')[0];
                } else {
                    td = this.getTrByKey(key).children('td[data-col="' + col._key + '"]')[0];
                }
                if (!td) {
                    return;
                }
                tds = [td];
            } else {
                this.getTrByKey(key).children('td').each(function (i, td) {
                    var songBindData = that.getBindData(td);
                    if (!that.fixedVisible || !songBindData.col.fixed) {
                        tds.push(td);
                    }
                });
                if (this.fixedVisible) {
                    this.hasLeftFixed && this.getTrByKey(key, 'left').children('td').each(function (i, td) {
                        tds.push(td);
                    });
                    this.hasRightFixed && this.getTrByKey(key, 'right').children('td').each(function (i, td) {
                        tds.push(td);
                    });
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _edit(td);
                _setEditMap(td);
            }
            if (!this.ellipsis) {
                this.$main.trigger('scroll');
            }

            function _setEditMap(td) {
                var songBindData = that.getBindData(td);
                var key = songBindData.rowData._song_table_key;
                that.editMap[key] = that.editMap[key] || [];
                that.editMap[key].push(td);
                that.editMap.list.push(td);
            }

            function _edit(td) {
                var songBindData = that.getBindData(td);
                var col = songBindData.col;
                if (col.editable && !songBindData.editing) {
                    var data = songBindData.colData;
                    var originTdHeight = that.ellipsis ? 41 : td.offsetHeight;
                    var rowData = songBindData.rowData;
                    var key = songBindData.rowData._song_table_key;
                    var $cell = $(td.children[0]);
                    var editable = col.editable === true ? {} : col.editable;
                    var $edit = $('<div class="' + tableClass.editCell + '"></div>');
                    $cell.html($edit);
                    editable.type = editable.type || 'text';
                    if (typeof editable.edit == 'function') {
                        $edit.append(editable.edit(data, rowData, key, col));
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
                        field: col.field,
                        data: data,
                        rowData: that.delInnerProperty(songBindData.rowData)
                    });
                    $(td).addClass(tableClass.editing);
                    songBindData.editing = true;
                    // 高度发送变化时重新调整行高
                    Common.nextFrame(function () {
                        var height = td.offsetHeight;
                        if (Math.abs(originTdHeight - height) > 2) {
                            that.fixRowHeight(key, height);
                        }
                    });
                }
            }

            function _editInput(td) {
                var songBindData = that.getBindData(td);
                var data = songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var $input = $('<input class="' + [tableClass.input, 'song-input'].join(' ') + '">');
                $input.val(data);
                $input.on('input propertychange', function () {
                    // 只可输入数字
                    if (songBindData.col.editable.type == 'number') {
                        var num = Common.getNum($input.val());
                        if (num !== $input.val()) {
                            $input.val(num);
                        }
                    }
                });
                $edit.html($input);
                songBindData.$input = $input;
                // 输入框聚焦
                $input.trigger('focus');
            }

            function _editSelect(td) {
                var songBindData = that.getBindData(td);
                var col = songBindData.col;
                var data = songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var selectFilter = 'table_edit_select';
                var $select = $('<select song-filter="' + selectFilter + '"></select>');
                col.select && col.select.map(function (item) {
                    $select.append('<option value="' + item.value + '" ' + (item.value == data ? 'selected' : '') + '>' + item.label + '</option>');
                });
                var $div = $('<div style="zoom:1;"></div>');
                $edit.empty().append($div);
                $div.append($select);
                // 触发select事件
                Form.render('select(' + selectFilter + ')', td);
                Form.on('select(' + selectFilter + ')', function (e) {
                    $select[0].value = e.data;
                    if (that.autoSave) {
                        that.save(key);
                    }
                }, td);
                $select[0].value = data;
                songBindData.$select = $select;
                // 展开下拉框
                setTimeout(function () {
                    $edit.find('div.song-select-title').trigger('click');
                }, 0)
            }

            function _editCheckbox(td) {
                var songBindData = that.getBindData(td);
                var col = songBindData.col;
                var data = songBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var checkFilter = 'table_edit_checkbox';
                $edit.addClass(tableClass.checkboxs);
                col.checkbox && col.checkbox.map(function (item) {
                    $edit.append('<input type="checkbox" song-filter="' + checkFilter + '" title="' + item.label + '" value="' + item.value + '" ' + (data && Common.indexOf(data, item.value) > -1 ? 'checked' : '') + '/>');
                });
                // 触发checkbox事件
                Form.render('checkbox(' + checkFilter + ')', td);
                Form.on('checkbox(' + checkFilter + ')', function (e) {
                    $edit[0].value = e.data;
                }, td);
                $edit[0].value = data;
                songBindData.$checkbox = $edit;
            }
        }

        /**
         * 修复行高
         * @param {Number} key
         */
        Class.prototype.fixRowHeight = function (key, height) {
            if (this.$leftHeaderMain || this.$rightHeaderMain) {
                if (key !== undefined) {
                    var $tr = this.getTrByKey(key);
                    height && $tr.css('height', height);
                    height = $tr[0].clientHeight;
                    this.hasLeftFixed && this.getTrByKey(key, 'left').css('height', ieVersion == 7 ? height - 1 : height);
                    this.hasRightFixed && this.getTrByKey(key, 'right').css('height', ieVersion == 7 ? height - 1 : height);
                } else {
                    var trs = this.$table.children('tbody').children('tr');
                    var heights = [];
                    trs.each(function (i, tr) {
                        heights.push(tr.clientHeight);
                    });
                    this.hasLeftFixed && this.$leftTable.children('tbody').children('tr').each(function (i, tr) {
                        height = heights[i];
                        $(tr).css('height', ieVersion == 7 ? height - 1 : height);
                    });
                    this.hasRightFixed && this.$rightTable.children('tbody').children('tr').each(function (i, tr) {
                        height = heights[i];
                        $(tr).css('height', ieVersion == 7 ? height - 1 : height);
                    });
                }
            }
        }

        /**
         * 动态设置单元格数据
         * @param {Object} option 
         */
        Class.prototype.setData = function (option) {
            var that = this;
            var key = option.key;
            var field = option.field;
            var data = option.data;
            var editFields = [];
            var rowData = this.getRowDataByKey(key);
            if (field) {
                if (rowData[field] != data) {
                    rowData[field] = data;
                }
            } else {
                data = Common.deepAssign({}, data);
                data._song_table_key = key;
                data.id = rowData.id;
                rowData = data;
                if (this.selectedData && this.selectedData._song_table_key == key) {
                    this.selectedData = data;
                }
                _setData(this.addedData, data);
                _setData(this.editedData, data);
                _setData(this.checkedData, data);
                _setData(this.renderedData, data);
                _setData(this.sortedData, data);
            }

            editFields.map(function (field) {
                that.edit(key, field);
            });
            this.getTrByKey(key).each(function (i, tr) {
                _setDom(tr);
            });
            this.hasLeftFixed && this.getTrByKey(key, 'left').each(function (i, tr) {
                _setDom(tr, 'left');
            });
            this.hasRightFixed && this.getTrByKey(key, 'right').each(function (i, tr) {
                _setDom(tr, 'right');
            });
            this.fixRowHeight(key);

            function _setDom(tr, fixed) {
                var $tr = $(tr);
                $tr.children('td').each(function (i, td) {
                    var songBindData = that.getBindData(td);
                    if (songBindData.editing && editFields.indexOf(songBindData.col.field) == -1) {
                        editFields.push(songBindData.col.field);
                    }
                });
                $tr.replaceWith(that.createTr(rowData, fixed));
            }

            function _setData(dataList, data) {
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i]._song_table_key == key) {
                        dataList.splice(i, 1, data);
                        break;
                    }
                }
            }
        }

        /**
         * 获取处理过的数据
         * @param {String} type 
         */
        Class.prototype.getData = function (type) {
            var that = this;
            var data = null;
            type = type || 'render';
            switch (type) {
                case 'render':
                    data = this.renderedData;
                    break;
                case 'select':
                    data = this.selectedData;
                    break;
                case 'check':
                    data = this.checkedData;
                    break;
                case 'add':
                    data = this.addedData;
                    break;
                case 'delelte':
                    data = this.deletedData;
                    break;
                case 'edit':
                    data = this.editedData;
                    break;
            }
            if (data) {
                if (data instanceof Array) {
                    data = data.map(function (item) {
                        return that.delInnerProperty(item);
                    });
                } else {
                    data = this.delInnerProperty(data);
                }
            }

            return data;
        }

        /**
         * 获取tr
         * @param {Number} key 
         * @param {String} fixed 
         */
        Class.prototype.getTrByKey = function (key, fixed) {
            if (fixed == 'left') {
                return this.$leftTable.children('tbody').children('tr[data-key="' + key + '"]');
            } else if (fixed == 'right') {
                return this.$rightTable.children('tbody').children('tr[data-key="' + key + '"]');
            } else {
                return this.$table.children('tbody').children('tr[data-key="' + key + '"]');
            }
        }

        /**
         * 根据字段名称返回列配置对象
         * @param {String} field 
         */
        Class.prototype.getColByField = function (field) {
            for (var i = 0; i < this.cols.length; i++) {
                if (this.cols[i].field == field) {
                    return this.cols[i];
                }
            }
        }

        /**
         * 根据列字段唯一key返回列配置对象
         * @param {String} key 
         */
        Class.prototype.getColByKey = function (key) {
            for (var i = 0; i < this.cols.length; i++) {
                if (this.cols[i]._key == key) {
                    return this.cols[i];
                }
            }
        }

        /**
         * 根据列类型返回列配置对象
         * @param {String} key 
         */
        Class.prototype.getColByType = function (type) {
            for (var i = 0; i < this.cols.length; i++) {
                if (this.cols[i].type == type) {
                    return this.cols[i];
                }
            }
        }

        /**
         * 根据id获取行数据
         * @param {String} key 
         */
        Class.prototype.getRowDataByKey = function (key) {
            return this.dataMap[key].rowData;
        }

        // 获取行或单元格绑定的数据
        Class.prototype.getBindData = function (dom) {
            return this.dataMap[$(dom).attr('data-key')];
        }

        /**
         * 生成样式类
         * @param {String} className 
         */
        Class.prototype.getClassNameWithKey = function (col, className) {
            return className + '-' + this.tableCount + '-' + col._key;
        }

        // 拉伸表格至100%
        Class.prototype.stretchTable = function () {
            if (this.stretch) {
                var hedaerWidth = this.$header[0].clientWidth;
                var tableHeaderWidth = this.$tableHeader[0].offsetWidth;
                //表格拉伸至容器的宽度
                if (tableHeaderWidth < hedaerWidth) {
                    var col = this.getColByType('radio') || this.getColByType('checkbox');
                    // 确保选择列宽度不变
                    col && this.$tableHeader.find('th[data-col="' + col._key + '"]').css('width', 50);
                    // ie下，table宽度可能会多出一像素，从而撑破父容器
                    this.$tableHeader.css({
                        width: this.$main[0].clientWidth
                    });
                    this.setColsWidth();
                    this.$tableHeader.css({
                        width: 'auto'
                    });
                }
                this.stretch = false;
            }
        }

        /**
         * 设置表格长宽
         * @param {Number/Boolean} width 
         * @param {Number} height 
         */
        Class.prototype.setArea = function (width, height) {
            this.width = Number(width || this.width) || 0;
            this.height = Number(height || this.height) || 0;
            this.setViewArea();
            if (this.option.stretch) {
                this.stretch = true;
                this.stretchTable();
            }
            this.setFixedArea();
        }

        // 设置容器宽高
        Class.prototype.setViewArea = function () {
            if (this.width) {
                this.$view.css({
                    width: this.width
                });
                this.$main.css({
                    width: (ieVersion <= 6 ? this.width - 2 : this.width)
                });
            }
            if (this.height) {
                var h = this.height;
                this.$view.css({
                    height: h
                });
                h -= this.$header[0].offsetHeight;
                if (this.$toolbar) {
                    h -= this.$toolbar[0].offsetHeight;
                }
                if (this.$pager) {
                    h -= this.$pager[0].offsetHeight;
                }
                this.$main.css({
                    height: h
                });
            }
        }

        // 设置固定表格容器的宽高
        Class.prototype.setFixedArea = function () {
            var top = this.$toolbar ? this.$toolbar[0].offsetHeight : 0;
            var tableWidth = this.$table[0].offsetWidth;
            // 避免重复触发回流
            var tableMainArea = {
                clientWidth: this.$main[0].clientWidth,
                clientHeight: this.$main[0].clientHeight,
                scrollHeight: this.$main[0].scrollHeight
            }
            var hasHscroll = tableWidth > tableMainArea.clientWidth;
            var height = tableMainArea.clientHeight;
            if (this.$leftHeaderMain) {
                var hedaerWidth = 'auto';
                if (hasHscroll) {
                    // ie6及以下浏览器不设置宽度将撑破父容器
                    if (ieVersion <= 6) {
                        hedaerWidth = this.$leftTableHeader[0].offsetWidth;
                    }
                    this.$leftHeaderMain.show();
                    this.fixedVisible = true;
                    this.$leftHeaderMain.css({
                        width: hedaerWidth,
                        top: top
                    });
                    this.$leftMain.css({
                        height: height
                    });
                } else {
                    this.$leftHeaderMain.hide();
                    this.fixedVisible = false;
                }
            }
            if (this.$rightHeaderMain) {
                var hasVscroll = tableMainArea.scrollHeight > tableMainArea.clientHeight;
                var hedaerWidth = 'auto';
                if (hasHscroll) {
                    // ie6及以下浏览器不设置宽度将撑破父容器
                    if (ieVersion <= 6) {
                        hedaerWidth = this.$rightTableHeader[0].offsetWidth;
                    }
                    this.$rightHeaderMain.show();
                    this.$rightHeaderMain.css({
                        width: hedaerWidth,
                        top: top,
                        right: hasVscroll ? 16 : 0
                    });
                    this.$rightMain.css({
                        height: height
                    });
                    this.$mend.show();
                } else {
                    this.$mend.hide();
                    this.$rightHeaderMain.hide();
                    return;
                }
            }
        }

        // 设置列宽
        Class.prototype.setColWidth = function (col, width) {
            col.width = width;
            this.setColsWidth([col]);
            this.$tableHeader.css({
                left: -this.$main[0].scrollLeft
            });
            if (!this.ellipsis) {
                this.setColsHeight();
                this.fixRowHeight();
                this.setViewArea();
            }
            this.setFixedArea();
        }

        // 设置单元格宽度样式表
        Class.prototype.setColsWidth = function (cols) {
            var that = this;
            var ws = [];
            var ths = [];
            // 只设置部分列
            if (cols) {
                cols = cols.map(function (col) {
                    return col._key;
                });
            }
            this.$tableHeaderHead.find('th').each(function (i, th) {
                var songBindData = that.getBindData(th);
                if (cols) {
                    if (cols.indexOf(songBindData.col._key) > -1) {
                        ths.push(th);
                    }
                } else if ($(th).is(':visible')) {
                    ths.push(th);
                }
            });
            ths.map(function (th, i) {
                var songBindData = that.getBindData(th);
                var $cell = $(th.children[0]);
                var width = songBindData.col.width;
                width = ieVersion <= 6 ? width + hCellPadding : width;
                $cell.css('width', 'auto');
                if (songBindData.col.width) {
                    $cell.css('width', width);
                }
            });
            ths.map(function (th, i) {
                var clientWidth = th.clientWidth;
                ws.push({
                    cw: ieVersion <= 6 ? clientWidth : clientWidth - hCellPadding
                });
            });
            ths.map(function (th, i) {
                var songBindData = that.getBindData(th);
                var $cell = $(th.children[0]);
                var cw = songBindData.col.colspan > 1 ? 'auto' : ws[i].cw + 'px';
                var cellSelector = that.getClassNameWithKey(songBindData.col, '.' + tableClass.cell);
                $cell.css('width', cw);
                Common.deleteRule(that.sheet, cellSelector);
                Common.insertRule(that.sheet, cellSelector, 'width:' + cw);
            });
        }

        // 设置单元格高度样式表
        Class.prototype.setColsHeight = function () {
            var that = this;
            var hs = {};
            var needAdjust = false;
            var ths = this.$tableHeaderHead.find('th');
            var height = this.$tableHeader[0].clientHeight;
            if (this.hasLeftFixed && this.$leftTableHeader[0].clientHeight != height) {
                needAdjust = true;
            }
            if (this.hasRightFixed && this.$rightTableHeader[0].clientHeight != height) {
                needAdjust = true;
            }
            if (!needAdjust) {
                return;
            }
            ths.each(function (i, th) {
                var songBindData = that.getBindData(th);
                if (songBindData.col.fixed) {
                    hs[songBindData.col._key] = ieVersion <= 6 ? th.offsetHeight : th.clientHeight;
                }
            });
            if (this.$leftTableHeaderHead) {
                this.$leftTableHeaderHead.find('th').each(function (i, th) {
                    var songBindData = that.getBindData(th);
                    $(th).css('height', hs[songBindData.col._key]);
                });
            }
            if (this.$rightTableHeaderHead) {
                this.$rightTableHeaderHead.find('th').each(function (i, th) {
                    var songBindData = that.getBindData(th);
                    $(th).css('height', hs[songBindData.col._key]);
                });
            }
        }

        // 设置数据映射(data-key->data)
        Class.prototype.setDataMap = function (data) {
            var that = this;
            var cols = this.cols;
            if (data) {
                if (data.id !== undefined) {
                    this.idKeyMap[data.id] = this.idKeyMap[data.id] || [];
                    if (this.idKeyMap[data.id].indexOf(data._song_table_key) == -1) {
                        this.idKeyMap[data.id].push(data._song_table_key);
                    }
                }
                this.dataMap[data._song_table_key] = {
                    rowData: data
                };
                cols.map(function (col) {
                    that.dataMap[data._song_table_key + '-' + col._key] = {
                        colData: data[col.field],
                        rowData: data,
                        col: col
                    }
                });
            }
            if (!this.dataMap['col-' + cols[0]._key]) {
                this.originCols.map(function (cols) {
                    cols.map(function (col) {
                        that.dataMap['col-' + col._key] = {
                            col: col
                        }
                    });
                });
            }
        }

        // 渲染工具条
        Class.prototype.renderToolbar = function () {
            var $toolbar = $('<div class="' + [tableClass.toolbar, 'song-clear'].join(' ') + '"></div>');
            if (this.defaultToolbar) {
                var defaultToolbar = this.defaultToolbar;
                var $tool = $('<div class="' + tableClass.toolbarSelf + '"></div>');
                // 默认工具条
                if (defaultToolbar) {
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
                            this.$exports = $exports;
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="' + [tableClass.tool, 'song-icon', 'song-display-inline-block'].join(' ') + '" song-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (this.toolbar || this.defaultToolbar) {
                this.$toolbar = $toolbar;
                $toolbar.append(this.toolbar);
                this.$view.prepend($toolbar);
            }
        }

        /**
         * 渲染表头
         * @param {String} fixed 
         */
        Class.prototype.renderTableHeader = function (fixed) {
            var that = this;
            var originCols = this.originCols;
            var $tableHeaderHead = this.$tableHeaderHead;
            if (fixed == 'left') {
                $tableHeaderHead = this.$leftTableHeaderHead;
            } else if (fixed == 'right') {
                $tableHeaderHead = this.$rightTableHeaderHead;
            }
            // 创建多级表头
            originCols.map(function (cols) {
                _renderCols(cols);
            });
            // 挂载主表表头
            if (!fixed) {
                this.$tableHeader.append(this.$tableHeaderHead);
                this.$header.append(this.$tableHeader);
                this.$headerMain.append(this.$header);
                this.$headerMain.insertAfter(this.$toolbar);
                this.setColsWidth();
            }

            function _renderCols(cols) {
                var $tr = $('<tr></tr>');
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    if (fixed && col.fixed != fixed) {
                        continue;
                    }
                    col.type = col.type || 'text';
                    var $content = $('<div class="' + tableClass.cellContent + '">' + (col.title || '&nbsp;') + '</div>');
                    var $cell = $('<div class="' + ['song-clear', tableClass.cell + '-' + that.tableCount + '-' + col._key, tableClass.cell].join(' ') + '"></div>');
                    var $th = $('<th data-col="' + col._key + '" data-key="col-' + col._key + '"></th>');
                    $cell.append($content);
                    // 隐藏
                    if (col.hidden) {
                        $th.hide();
                    }
                    // 选择列
                    if (col.type == 'radio' || col.type == 'checkbox') {
                        col.width = 50;
                    }
                    if (col.colspan >= 2) {
                        $th.attr('colspan', col.colspan);
                    } else if (col.sortAble && col.field && !(col.colspan > 1)) { // 可排序
                        if (ieVersion <= 8) {
                            $th[0].onselectstart = function () {
                                return false
                            };
                        }
                        _renderSortIcon($th, $cell, col);
                    } else if (ieVersion <= 8) { // 调整列宽中防止选中文本
                        $th[0].onselectstart = function () {
                            if (that.tempData.resizeData) {
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
                    // 全选框
                    if (col.type == 'checkbox') {
                        $content.html(Common.htmlTemplate(tpl.checkbox, {
                            checked: false,
                            title: '',
                            key: 'all'
                        }));
                    }
                }
                $tableHeaderHead.append($tr);
            }

            // 渲染排序图标
            function _renderSortIcon($th, $cell, col) {
                var $up = $('<div class="' + tableClass.sortUp + '"></div>');
                var $down = $('<div class="' + tableClass.sortDown + '"></div>');
                var $sort = $('<div class="' + tableClass.sort + '"></div>');
                $sort.append($up);
                $sort.append($down);
                $($cell[0].children[0]).append($sort);
                $th.addClass(tableClass.unselect);
                $up.on('mouseenter', function () {
                    $up.addClass(tableClass.sortHover);
                }).on('mouseleave', function () {
                    $up.removeClass(tableClass.sortHover);
                }).on('click', function () {
                    that.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    that.sortObj.field = col.field;
                    that.sortObj.sort = 'asc';
                    $up.addClass(tableClass.sortConfirm);
                    that.renderTableBody(true);
                    return false;
                });
                $down.on('mouseenter', function () {
                    $down.addClass(tableClass.sortHover);
                }).on('mouseleave', function () {
                    $down.removeClass(tableClass.sortHover);
                }).on('click', function () {
                    that.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                    that.sortObj.field = col.field;
                    that.sortObj.sort = 'desc';
                    $down.addClass(tableClass.sortConfirm);
                    that.renderTableBody(true);
                    return false;
                });
            }
        }

        /**
         * 渲染表格
         * @param {Boolean} justSort 
         */
        Class.prototype.renderTableBody = function (justSort) {
            var that = this;
            var cols = this.cols;
            if (!this.$main.inserted) {
                var viewWidth = this.$view.width();
                this.$main.append(this.$table);
                this.$main.append(this.$empty);
                this.$headerMain.append(this.$main);
                this.$main.css({
                    width: viewWidth
                });
                this.$main.inserted = true;
                Common.nextFrame(function () {
                    that.showLoading();
                }, 0);
            } else {
                that.showLoading();
            }

            if (justSort) {
                _render();
            } else if (this.data) {
                var start = (this.nowPage - 1) * this.limit;
                var end = this.nowPage * this.limit;
                this.renderedData = this.data.slice(start, end).map(function (item) {
                    // 避免污染外部数据
                    return Common.deepAssign({}, item);
                });
                _render();
            } else {
                this.httpGet(function (res) {
                    that.renderedData = res.data;
                    that.pager.count != res.count && that.pager.reload({
                        count: res.count
                    });
                    _render();
                });
            }

            // 渲染
            function _render() {
                // 数据排序
                _sort();
                // ie6解析css需要一定时间，否则setCellStyle无效
                Common.cancelNextFrame(that.timers.renderTimer)
                that.timers.renderTimer = Common.nextFrame(function () {
                    that.idKeyMap = {};
                    that.dataMap = {};
                    that.renderTr();
                    that.hasLeftFixed && that.renderTr('left');
                    that.hasRightFixed && that.renderTr('right');
                }, 0);
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
                that.sortedData = that.renderedData.concat([]);
                cols.map(function (col) {
                    if (col.sortAble && that.sortObj.field == col.field) {
                        if (typeof col.sortAble == 'object') {
                            sortFun = Object.assign(sortFun, col.sortAble);
                        }
                        if (that.sortObj.sort) {
                            sortFun[that.sortObj.sort] && that.sortedData.sort(function (a, b) {
                                return sortFun[that.sortObj.sort](a[col.field], b[col.field]);
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
            var that = this;
            if (this.hasLeftFixed) {
                this.$leftHeaderMain = $('<div class="' + tableClass.leftHeaderMain + '"></div>');
                this.$leftHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                this.$leftMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                this.$leftTable = $('<table class="' + tableClass.table + '"></table>');
                this.$leftTableHeader = $('<table class="' + tableClass.table + '"></table>');
                this.$leftTableHeaderHead = $('<thead></thead>');
                this.$leftTableHeader.append(this.$leftTableHeaderHead);
                this.$leftHeader.append(this.$leftTableHeader);
                this.$leftHeaderMain.append(this.$leftHeader);
                this.$leftMain.append(this.$leftTable);
                this.$leftHeaderMain.append(this.$leftMain);
                this.$view.append(this.$leftHeaderMain);
                this.$leftMain.on('mousewheel', function (e) {
                    var wheelDelta = e.originalEvent.wheelDelta;
                    if (wheelDelta < 0) {
                        wheelDelta += 20;
                    } else {
                        wheelDelta -= 20;
                    }
                    that.$main[0].scrollTop -= wheelDelta;
                    return false;
                });
                this.$leftHeaderMain.hide();
                this.renderTableHeader('left');
            }
            if (this.hasRightFixed) {
                this.$mend = $('<div class="' + tableClass.mend + '"></div>');
                this.$rightHeaderMain = $('<div class="' + tableClass.rightHeaderMain + '"></div>');
                this.$rightHeader = $('<div class="' + tableClass.fixeHeader + '"></div>');
                this.$rightMain = $('<div class="' + tableClass.fixedMain + '"></div>');
                this.$rightTable = $('<table class="' + tableClass.table + '"></table>');
                this.$rightTableHeader = $('<table class="' + tableClass.table + '"></table>');
                this.$rightTableHeaderHead = $('<thead></thead>');
                this.$rightTableHeader.append(this.$rightTableHeaderHead);
                this.$rightHeader.append(this.$rightTableHeader);
                this.$rightHeader.append(this.$mend);
                this.$rightHeaderMain.append(this.$rightHeader);
                this.$rightMain.append(this.$rightTable);
                this.$rightHeaderMain.append(this.$rightMain);
                this.$mend.hide();
                this.$view.append(this.$rightHeaderMain);
                this.$rightMain.on('mousewheel', function (e) {
                    var wheelDelta = e.originalEvent.wheelDelta;
                    if (wheelDelta < 0) {
                        wheelDelta += 20;
                    } else {
                        wheelDelta -= 20;
                    }
                    that.$main[0].scrollTop -= wheelDelta;
                    return false;
                });
                this.$rightHeaderMain.hide();
                this.renderTableHeader('right');
            }
            this.setColsHeight();
        }

        /**
         * 渲染行数据
         * @param {String} fixed 
         */
        Class.prototype.renderTr = function (fixed) {
            var that = this;
            var $table = this.$table;
            var data = this.sortedData;
            this.timers.renderTimer = this.timers.renderTimer || {};

            if (fixed == 'left') { // 渲染左固定列
                $table = this.$leftTable;
            } else if (fixed == 'right') { // 渲染右固定列
                $table = this.$rightTable;
            }
            this.checkAll(false, true);
            this.checkedData = [];
            this.selectedData = null;
            $table.empty();
            _appendTr(0);

            // 避免加载数据量太大时浏览器卡住
            function _appendTr(start) {
                var html = [];
                Common.cancelNextFrame(that.timers.renderTimer[fixed || 'main']);
                for (var i = start, count = 0; i < data.length && count < 100; i++, count++) {
                    html.push(that.createTr(data[i], fixed));
                }
                $table.append(html.join(''));
                if (i < data.length) {
                    that.timers.renderTimer[fixed || 'main'] = Common.nextFrame(function () {
                        _appendTr(i);
                    });
                } else {
                    // 设置固定列行高
                    if (that.hasLeftFixed || that.hasRightFixed) {
                        if (that.hasRightFixed && fixed == 'right') {
                            _complate();
                        } else if (!that.hasRightFixed && that.hasLeftFixed && fixed == 'left') {
                            _complate();
                        }
                    } else {
                        _complate();
                    }
                }
            }

            function _complate() {
                if (!that.sortedData.length) {
                    that.$empty.show();
                    that.$table.hide();
                    that.hideLoading();
                    return;
                }
                that.setFixedArea();
                that.stretchTable();
                !that.ellipsis && that.fixRowHeight();
                that.hideLoading();
                that.$main.trigger('scroll');
            }
        }

        /**
         * 创建表格行
         * @param {Object} data 
         * @param {String} fixed 
         */
        Class.prototype.createTr = function (data, fixed) {
            var cols = this.cols;
            var key = data._song_table_key;
            if (key === undefined) {
                if (fixed == 'left') {
                    key = this.fixeLeftIdCount++;
                } else if (fixed == 'right') {
                    key = this.fixeRightIdCount++;
                } else {
                    key = this.idCount++;
                }
            }
            var tr = '<tr data-key="' + key + '">';
            data._song_table_key = key;
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                if (!fixed || col.fixed == fixed) {
                    tr += this.createTd(col, data, fixed);
                }
            }
            tr += '</tr>';
            !fixed && this.setDataMap(data);
            return tr;
        }

        /**
         * 创建单元格
         * @param {Object} col 
         * @param {Object} data 
         * @param {Boolean} fixed 是否为固定列
         */
        Class.prototype.createTd = function (col, data, fixed) {
            var key = data._song_table_key;
            var td = '';
            var cell = '';
            var content = '';
            if (col.type == 'text') { //文本列
                content = getCellHtml(data[col.field], data, key, col);
            } else if (col.type == 'radio') { // 单选列
                var checked = this.selectedData && this.selectedData._song_table_key == key;
                content = Common.htmlTemplate(tpl.radio, {
                    checked: checked,
                    key: key
                });
            } else if (col.type == 'checkbox') { // 多选列
                var checked = false;
                for (var i = 0; i < this.checkedData.length; i++) {
                    if (this.checkedData[i]._song_table_key == key) {
                        checked = true;
                        break;
                    }
                }
                content = Common.htmlTemplate(tpl.checkbox, {
                    checked: checked,
                    title: '',
                    key: key
                });
            } else if (col.type == 'operate') { // 操作列
                if (col.btns) {
                    for (var btn_i = 0; btn_i < col.btns.length; btn_i++) {
                        var btn = col.btns[btn_i];
                        content += Common.htmlTemplate(tpl.btn, btn);
                    }
                } else {
                    content = col.template(data[col.field], data, key, col);
                }
            }
            var style = {};
            var attr = {};
            // 避免修改函数属性和函数样式
            col = Object.assign({}, col);
            for (var k in col.style) {
                if (typeof col.style[k] == 'function') {
                    style[k] = col.style[k](data[col.field], data, k, col);
                } else {
                    style[k] = col.style[k];
                }
            }
            for (var k in col.attr) {
                if (typeof col.attr[k] == 'function') {
                    attr[k] = col.attr[k](data[col.field], data, k, col);
                } else {
                    attr[k] = col.attr[k];
                }
            }
            col.style = style;
            col.attr = attr;
            cell = Common.htmlTemplate(tpl.cell, {
                tableCount: this.tableCount,
                col: col,
                content: content
            });
            td = Common.htmlTemplate(tpl.td, {
                tableCount: this.tableCount,
                col: col,
                cell: cell,
                key: key
            });
            return td;
        }

        /**
         * 获取渲染单元格的内容
         * @param {*} cellValue 
         * @param {*} data 
         * @param {Number} key 
         * @param {Object} col 
         */
        function getCellHtml(cellValue, data, key, col) {
            var html = cellValue;
            if (col.template) { // 自定义渲染函数
                html = col.template(cellValue, data, key, col);
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
                    if (Common.indexOf(cellValue, obj.value) > -1) {
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
            if (!this.page) {
                return;
            }
            var $pager = $('<div class="' + tableClass.pager + '"></div>');
            var $elem = $('<div song-filter="table_pager_' + this.filter + '"></div>');
            $pager.append($elem);
            this.$pager = $pager;
            this.pager = Pager.render({
                elem: $elem[0],
                nowPage: this.nowPage,
                limits: this.limits,
                limit: this.limit,
                size: 'small',
                count: this.data ? this.data.length : 0,
                prev: '<span style="font-weight:bold">' + leftIcon + '</span>',
                next: '<span style="font-weight:bold">' + rightIon + '</span>'
            });
            this.pager.on('page', function (page) {
                that.nowPage = page;
                that.renderTableBody();
            });
            this.pager.on('limit', function (limit) {
                that.limit = limit;
            });
            this.$pager.insertAfter(this.$headerMain);
        }

        Class.prototype.httpGet = function (success, error) {
            var data = this.reqeust.data || {};
            data[this.reqeust.pageName || 'page'] = this.nowPage;
            data[this.reqeust.limitName || 'limit'] = this.limit;
            $.ajax({
                url: this.reqeust.url,
                method: this.reqeust.method || 'get',
                dataType: this.reqeust.dataType || 'json',
                contentType: this.reqeust.contentType || 'application/json',
                data: data,
                success: function (res) {
                    that.reqeust.success && that.reqeust.success(res);
                    success(that.reqeust.parseData && that.reqeust.parseData(res) || res);
                },
                error: function (res) {
                    that.reqeust.error && that.reqeust.error(res);
                    error && error(res);
                }
            })
        }

        // 加载提示
        Class.prototype.showLoading = function () {
            var $loading = $(tpl.loading);
            var headerHeight = this.$header[0].clientHeight;
            this.hideLoading();
            this.$empty.hide();
            this.$headerMain.append($loading);
            $loading.css({
                marginLeft: -$loading[0].offsetWidth / 2,
                marginTop: headerHeight / 2 - $loading[0].offsetHeight / 2 - 8
            });
            this.tempData.$loading = $loading;
        }

        // 隐藏加载提示
        Class.prototype.hideLoading = function () {
            if (this.tempData.$loading) {
                this.tempData.$loading.remove();
                this.tempData.$loading = undefined;
            }
        }

        // 显示错误提示
        Class.prototype.showTip = function (tip) {
            var $tip = $(tpl.tip);
            var headerHeight = this.$header[0].clientHeight;
            $tip.children('span').text(tip);
            this.$headerMain.append($tip);
            $tip.css({
                marginLeft: -$tip[0].offsetWidth / 2,
                marginTop: headerHeight / 2 - $tip[0].offsetHeight / 2 - 8
            });
            setTimeout(function () {
                $tip.remove();
            }, 1500);
        }

        // 删除内部使用属性
        Class.prototype.delInnerProperty = function (data) {
            var obj = {};
            for (var key in data) {
                // 去掉内部数据字段
                if (key.slice(0, 11) != '_song_table') {
                    obj[key] = data[key];
                }
            }
            return obj;
        }

        // 通过id获取key
        Class.prototype.getKeyById = function (id) {
            var key = this.idKeyMap[id];
            if (key && key.length) {
                key = key[0];
            } else {
                key = undefined;
            }
            return key;
        }

        Class.prototype.deleteKeyById = function (id) {
            var key = this.idKeyMap[id];
            if (key) {
                this.idKeyMap[id] = key.slice(1);
            }
        }

        // 绑定容器的事件
        Class.prototype.bindEvent = function () {
            var that = this;
            var editTrigger = this.editTrigger || 'click'; //触发编辑的事件类型
            $body.on('click', function (e) {
                // 点击表格之外的区域，自动保存编辑中的数据
                if (!that.tempData.viewClick) {
                    that.save();
                }
                that.$exports && that.$exports.hide();
                that.$filter && that.$filter.hide();
            });
            $body.on('mousemove', function (e) {
                // 调整列宽中
                // 延时执行，避免卡顿
                Common.cancelNextFrame(that.timers.resizingTimer);
                that.timers.resizingTimer = Common.nextFrame(function () {
                    var resizeData = that.tempData.resizeData;
                    if (resizeData) {
                        var x = e.pageX - resizeData.pageX;
                        var width = resizeData.originWidth + x;
                        // 列宽最小为30像素
                        if (width > 30) {
                            that.tempData.$resizeLine.css({
                                left: resizeData.left + width
                            });
                            resizeData.width = width;
                        }
                    }
                }, 0);
            });
            $body.on('mouseup', function (e) {
                // 调整列宽结束
                if (that.tempData.resizeData) {
                    var th = that.tempData.resizeData.th;
                    var songBindData = that.getBindData(th);
                    var col = songBindData.col;
                    var width = that.tempData.resizeData.width;
                    that.tempData.$resizeLine.remove();
                    width && that.setColWidth(col, width);
                    that.$view.removeClass(tableClass.colResize);
                    that.tempData.resizeData = undefined;
                    that.tempData.$resizeLine = undefined;
                }
            });
            _bindScrollEvent();
            if (this.tempData.bindedEvent) {
                return;
            }
            this.tempData.bindedEvent = true;
            _bindRadioCheckboxEvent();
            _bindClickEvent();
            _bindEditEvent();
            _bindHoverEvent();
            _bindColResizeEvent();
            _bindOverflowEvent();
            _bindOrderByEvent();
            _bindToolbarEvent();

            function _bindRadioCheckboxEvent() {
                // 点击单选框
                that.$view.delegate('td .' + tableClass.radio, 'click', function () {
                    var $this = $(this);
                    var key = $this.attr('data-key');
                    that.selectRow(key);
                    that.trigger('radio', {
                        dom: this,
                        data: that.selectedData.id
                    });
                });
                // 点击多选框
                that.$view.delegate('td .' + tableClass.checkbox, 'click', function () {
                    var $this = $(this);
                    var key = $this.attr('data-key');
                    that.checkRow(key);
                    that.trigger('checkbox', {
                        dom: this,
                        data: that.checkedData.map(function (item) {
                            return item.id;
                        })
                    });
                });
                // 点击全选
                that.$view.delegate('th .' + tableClass.checkbox, 'click', function () {
                    that.checkAll();
                    that.trigger('checkbox', {
                        dom: this,
                        data: that.checkedData.map(function (item) {
                            return item.id;
                        })
                    });
                });
            }

            function _bindClickEvent() {
                // 表格中的所有点击事件
                that.$view.on('click', function (e) {
                    var $target = $(e.target);
                    var $td = $target.parents('td')
                    var event = $target.attr('song-event');
                    var stop = $target.attr('song-stop');
                    // 用于区分是否点击区域
                    that.tempData.viewClick = true;
                    Common.nextFrame(function () {
                        that.tempData.viewClick = false;
                    });
                    if (!event) {
                        event = $td.attr('song-event');
                        stop = $td.attr('song-stop');
                    }
                    if (event) {
                        var data = {
                            dom: $target[0]
                        }
                        if ($td[0]) {
                            var songBindData = that.getBindData($td[0]);
                            if (songBindData) {
                                data.dom = e.target;
                                data.data = that.delInnerProperty(songBindData.rowData);
                            }
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
                that.$view.delegate('tbody tr', 'click', function () {
                    var songBindData = that.getBindData(this);
                    // 触发行点击事件
                    that.trigger('row', {
                        dom: this,
                        data: that.delInnerProperty(songBindData.rowData)
                    });
                });
                // 列点击事件
                that.$view.delegate('tbody td', 'click', function () {
                    var songBindData = that.getBindData(this);
                    // 触发单元格点击事件
                    that.trigger('col', {
                        dom: this,
                        data: songBindData.colData,
                        rowData: that.delInnerProperty(songBindData.rowData)
                    });
                })
            }

            function _bindEditEvent() {
                // 回车保存
                that.$view.on('keydown', function (e) {
                    if (that.enterSave) {
                        var $td = $(e.target).parents('td');
                        var songBindData = that.getBindData($td[0]);
                        if ($td.length && e.keyCode == 13) {
                            that.save(songBindData.rowData._song_table_key);
                        }
                    }
                });
                // 点击编辑
                that.$view.on(editTrigger, function (e) {
                    var $target = $(e.target);
                    if ($target.attr('song-event')) {
                        return;
                    }
                    var $td = e.target.tagName.toUpperCase() == 'TD' ? $target : $target.parents('td');
                    if (!$td.length) {
                        return;
                    }
                    var songBindData = that.getBindData($td[0]);
                    var key = songBindData.rowData._song_table_key;
                    if (songBindData.editing) {
                        return;
                    }
                    var pass = true;
                    // 先保存真在编辑中的数据
                    if (that.autoSave) {
                        pass = that.save();
                    }
                    if (songBindData.col.editable && songBindData.col.field) {
                        if (pass && songBindData.col.editable) {
                            that.edit(key, songBindData.col.field);
                        }
                    }
                });
            }

            function _bindHoverEvent() {
                // ie8及以下浏览器性能消耗较大
                if (ieVersion <= 8) {
                    return;
                }
                that.$view.delegate('tbody tr', 'mousemove', function (e) {
                    var songBindData = that.getBindData(this);
                    var key = songBindData.rowData._song_table_key;
                    Common.cancelNextFrame(that.timers.hoverInTimer);
                    that.timers.hoverInTimer = Common.nextFrame(function () {
                        _delHover(that.tempData.hoverTrs);
                        that.tempData.hoverTrs = [];
                        that.getTrByKey(key).each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        that.hasLeftFixed && that.getTrByKey(key, 'left').each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        that.hasRightFixed && that.getTrByKey(key, 'right').each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        _addHover(that.tempData.hoverTrs);
                        Common.cancelNextFrame(that.timers.hoverOutTimer);
                    }, 0);
                }).delegate('tbody tr', 'mouseleave', function (e) {
                    that.timers.hoverOutTimer = Common.nextFrame(function () {
                        _delHover(that.tempData.hoverTrs);
                        that.tempData.hoverTrs = undefined;
                    });
                });

                function _addHover(hoverTrs) {
                    hoverTrs && hoverTrs.map(function (tr) {
                        $(tr).addClass(tableClass.hover);
                    });
                }

                function _delHover(hoverTrs) {
                    hoverTrs && hoverTrs.map(function (tr) {
                        $(tr).removeClass(tableClass.hover);
                    });
                }
            }

            function _bindScrollEvent() {
                // 滚动事件
                that.$main.on('scroll', function (e) {
                    that.$tableHeader.css({
                        left: -that.$main[0].scrollLeft
                    });
                    if (that.$leftMain) {
                        that.$leftMain[0].scrollTop = that.$main[0].scrollTop;
                    }
                    if (that.$rightMain) {
                        that.$rightMain[0].scrollTop = that.$main[0].scrollTop;
                    }
                    if (that.$details.length) {
                        var tds = that.$view.find('td');
                        that.$details.map(function ($detail) {
                            $detail.remove();
                        });
                        tds.each(function (i, td) {
                            var songBindData = that.getBindData(td);
                            songBindData.$detail = undefined;
                        });
                    }
                });
            }

            function _bindColResizeEvent() {
                // 调整列宽事件
                that.$view.delegate('th', 'mousemove', function (e) {
                    var th = this;
                    Common.cancelNextFrame(that.timers.resizeTimer);
                    that.timers.resizeTimer = Common.nextFrame(function () {
                        var songBindData = that.getBindData(th);
                        if (!that.tempData.resizeData && !(songBindData.col.colspan > 1)) {
                            var $th = $(th);
                            if (e.offsetX > th.clientWidth - 10) {
                                $th.addClass(tableClass.colResize);
                                songBindData.$detailIcon && songBindData.$detailIcon.remove();
                                songBindData.$detailIcon = undefined;
                            } else {
                                $th.removeClass(tableClass.colResize);
                            }
                        }
                    });
                });
                that.$view.delegate('th', 'mousedown', function (e) {
                    if (!that.tempData.resizeData && $(this).hasClass(tableClass.colResize)) {
                        that.tempData.resizeData = {
                            pageX: e.pageX,
                            th: this,
                            left: $(this).offset().left - that.$view.offset().left, // 调整线left
                            originWidth: this.clientWidth - hCellPadding
                        }
                        var top = that.$toolbar ? that.$toolbar[0].offsetHeight : 0;
                        var height = that.$view[0].clientHeight - top - (that.$pager ? that.$pager[0].offsetHeight : 0);
                        that.tempData.$resizeLine = $('<div class="' + tableClass.resizeLine + '"></div>');
                        that.tempData.$resizeLine.css({
                            top: top,
                            height: height
                        });
                        that.$view.append(that.tempData.$resizeLine);
                        that.$view.addClass(tableClass.colResize);
                    }
                });
            }

            function _bindOverflowEvent() {
                // 单元格高度自适应
                if (!that.ellipsis) {
                    return;
                }
                // 内容溢出处理
                that.$view.delegate('th,td', 'mousemove', function () {
                    var td = this;
                    Common.cancelNextFrame(that.timers.overflowTimer);
                    that.timers.overflowTimer = Common.nextFrame(function () {
                        var $td = $(td);
                        // 正在调整列宽中或准备调整列宽
                        if (that.tempData.resizeData || $td.hasClass(tableClass.colResize)) {
                            return;
                        }
                        var songBindData = that.getBindData(td);
                        var col = songBindData.col;
                        var $cell = $td.children('.' + tableClass.cell);
                        if (!songBindData.$detailIcon && col.type == 'text' && !songBindData.editing && Common.checkOverflow($cell[0].children[0])) {
                            var $div = $('<div class="' + tableClass.detailIcon + '">' + downIcon + '</div>');
                            songBindData.$detailIcon = $div;
                            $cell.append($div);
                            // 点击打开内容详情弹框
                            $div.on('click', function () {
                                var $close = $('<div class="' + tableClass.tipClose + '">' + closeIcon + '</div>');
                                var offset = $cell.offset();
                                var ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                                $div.remove();
                                $div = $('<div class="' + tableClass.detail + '">' + $($cell[0].children[0]).html() + '</div>');
                                $div.append($close);
                                $body.append($div);
                                songBindData.$detail = $div;
                                that.$details.push($div);
                                $div.css({
                                    top: offset.top - 1 + (ieVersion <= 6 ? ie6MarginTop : 0),
                                    left: offset.left - 1
                                });
                                // 点击关闭弹框
                                $close.on('click', function () {
                                    songBindData.$detail = undefined;
                                    songBindData.$detailIcon = undefined;
                                    $div.remove();
                                });
                            });
                        }
                    });
                }).delegate('th,td', 'mouseleave', function () {
                    var songBindData = that.getBindData(this);
                    songBindData.$detailIcon && songBindData.$detailIcon.remove();
                    songBindData.$detailIcon = undefined;
                });
            }

            function _bindOrderByEvent() {
                // 排序事件
                that.$view.delegate('th', 'click', function (e) {
                    var $this = $(this);
                    var songBindData = that.getBindData(this);
                    var col = songBindData.col;
                    if (col.sortAble && !that.tempData.resizeData && !$this.hasClass(tableClass.colResize)) {
                        var $up = $this.find('div.' + tableClass.sortUp);
                        var $down = $this.find('div.' + tableClass.sortDown);
                        that.$view.find('div.' + tableClass.sortConfirm).removeClass(tableClass.sortConfirm);
                        if (that.sortObj.field != col.field) {
                            that.sortObj.field = col.field;
                            that.sortObj.sort = '';
                        }
                        if (!that.sortObj.sort) {
                            that.sortObj.sort = 'asc';
                            $up.addClass(tableClass.sortConfirm);
                        } else if (that.sortObj.sort == 'asc') {
                            that.sortObj.sort = 'desc';
                            $down.addClass(tableClass.sortConfirm);
                        } else {
                            that.sortObj.sort = '';
                        }
                        that.renderTableBody(true);
                    }
                });
            }

            function _bindToolbarEvent() {
                // 筛选字段事件
                that.on('filter', function (e) {
                    if (that.$filter) {
                        that.$filter.toggle();
                    } else {
                        that.createFilter(e.dom);
                    }
                    that.$exports && that.$exports.hide();
                });
                // 导出事件
                that.on('exports', function (e) {
                    that.$exports.toggle();
                    that.$filter && that.$filter.hide();
                });
                // 导出事件
                that.on('exports-excel', function (e) {
                    that.exportsExecl();
                    that.$exports.hide();
                });
                // 导出事件
                that.on('exports-csv', function (e) {
                    that.exportsCsv();
                    that.$exports.hide();
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
            var $view = this.$view;
            var $filter = $('<ul class="' + tableClass.filter + '"></ul>');
            this.$filter = $filter;
            for (var i = 0; i < this.cols.length; i++) {
                var col = this.cols[i];
                if (col.type == 'text') {
                    $filter.append('<li>' + Common.htmlTemplate(tpl.checkbox, {
                        checked: true,
                        title: col.title,
                        key: col._key
                    }) + '</li>');
                }
            }
            // 在工具图标下挂载
            $(dom).append($filter);
            $filter.on('click', function () {
                return false;
            });
            $filter.delegate('li', 'click', function () {
                var $checkbox = $(this).children('.' + tableClass.checkbox);
                var key = $checkbox.attr('data-key');
                var col = that.getColByKey(key);
                var allThs = [];
                var nowTh = null;
                var checked = !$checkbox.hasClass(tableClass.checked);
                $checkbox.toggleClass(tableClass.checked);
                $view.find('th,td').each(function (i, td) {
                    var songBindData = that.getBindData(this);
                    if (songBindData.col._key == key) {
                        checked ? $(td).show() : $(td).hide();
                        if (td.tagName.toUpperCase() == 'TH' && !songBindData.holder) {
                            songBindData.col.hidden = !checked;
                            nowTh = td;
                        }
                    }
                    if (td.tagName.toUpperCase() == 'TH' && !songBindData.holder) {
                        allThs.push(td);
                    }
                });
                // 存在上级父列
                if (col.parent) {
                    _setParentColspan(nowTh);
                    that.setColsWidth(col.parent.child);
                }
                if (!that.ellipsis) {
                    that.fixRowHeight();
                }
                that.$tableHeader.css({
                    left: -that.$main[0].scrollLeft
                });
                that.setColsHeight();
                that.setFixedArea();

                // 设置父级列的colspan
                function _setParentColspan(th) {
                    var songBindData = that.getBindData(th);
                    var col = songBindData.col.parent;
                    var ths = _getThByCol(col);
                    ths.map(function (th) {
                        var $th = $(th);
                        var colspan = songBindData.colspan === undefined ? col.colspan : songBindData.colspan;
                        checked ? ++colspan : --colspan;
                        // ie7及以下浏览器设置为0时会报错
                        colspan > 0 && $th.attr('colspan', colspan);
                        colspan ? $th.show() : $th.hide();
                        songBindData.colspan = colspan;
                    });
                    if (col.parent) {
                        _setParentCol(ths[0]);
                    }
                }

                function _getThByCol(col) {
                    var ths = [];
                    for (var i = 0; i < allThs.length; i++) {
                        var songBindData = that.getBindData(allThs[i]);
                        if (songBindData.col._key == col._key) {
                            ths.push(allThs[i]);
                        }
                    }
                    return ths;
                }
            });
        }

        // 导出
        Class.prototype.exportsExecl = function () {
            if (window.btoa) {
                var $table = $(this.$tableHeader[0].outerHTML);
                var col = this.getColByType('radio') || this.getColByType('checkbox');
                $table.append(this.$table.children('tbody').html());
                col && $table.find('[data-col="' + col._key + '"]').remove();
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
                this.showTip('该浏览器不支持导出，请使用谷歌浏览器');
            }
        }

        Class.prototype.exportsCsv = function () {
            var cols = this.cols;
            var title = '';
            var dataStr = '';
            cols.map(function (col) {
                title += col.title + ',';
            });
            title = title.slice(0, -1) + '\n';
            this.sortedData.map(function (data) {
                var str = '';
                cols.map(function (col) {
                    if (col.type == 'text') {
                        var html = data[col.field];
                        if (col.template) { // 自定义渲染函数
                            html = col.template(data[col.field], data, data._song_table_key, col);
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
                                if (Common.indexOf(data[col.field], obj.value) > -1) {
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
            if (window.print) {
                var $table = $(this.$tableHeader[0].outerHTML);
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
                $table.append(this.$table.children('tbody').html());
                wind.document.write('<head>' + style + '</head><body>' + $table[0].outerHTML + '</body>');
                wind.document.close();
                wind.print();
                wind.close();
            } else {
                this.showTip('该浏览器不支持打印，请使用谷歌浏览器');
            }
        }

        return Table;
    }

    if ("function" == typeof define && define.amd) {
        define("table", ['./jquery', './common', './form', './pager'], function ($, Common, Form) {
            return factory($, Common, Form, Pager);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = factory(window.$, window.SongUi.Common, window.SongUi.Form, window.SongUi.Pager);
    }
})(window)