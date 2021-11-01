/*
 * @Author: lijy
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Pager) {
        var $body = $(window.document.body);
        var filterIcon = '&#xe61d;';
        var exportsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var downIcon = '&#xe74b;';
        var closeIcon = '&#xe735;';
        var loadingIcon = '&#xe61e;';
        var radioedIcon = '&#xe61c;';
        var radioIcon = '&#xe619;';
        var checkedIcon = '&#xe737;';
        var ieVersion = Common.getIeVersion();
        var barWidth = Common.getScrBarWidth();
        var hCellPadding = 2;
        var tableCount = 1;
        var classNames = {
            view: 'jy-table-view',
            viewBorder: 'jy-table-view-border',
            table: 'jy-table',
            holder: 'jy-table-col-holder',
            cell: 'jy-table-cell',
            cellContent: 'jy-table-cell-content',
            editCell: 'jy-table-cell-edit',
            header: 'jy-table-header',
            main: 'jy-table-main',
            headerMain: 'jy-table-header-main',
            tool: 'jy-table-tool',
            toolbar: 'jy-table-toolbar',
            toolbarSelf: 'jy-table-tool-self',
            editing: 'jy-table-editing',
            checkboxs: 'jy-table-checkboxs',
            radios: 'jy-table-radios',
            pager: 'jy-table-pager',
            filter: 'jy-table-filter',
            exports: 'jy-table-exports',
            detailIcon: 'jy-table-detail-icon',
            detail: 'jy-table-detail',
            tipClose: 'jy-table-detail-close',
            detail: 'jy-table-detail',
            hover: 'jy-table-hover',
            headerMainLeft: 'jy-table-header-main-l',
            headerMainRgiht: 'jy-table-header-main-r',
            confirm: 'jy-table-confirm',
            cancel: 'jy-table-cancel',
            mend: 'jy-table-mend',
            sort: 'jy-table-sort',
            sortUp: 'jy-table-sort-up',
            sortDown: 'jy-table-sort-down',
            sortHover: 'jy-table-sort-hover',
            colResize: 'jy-table-col-resize',
            sortConfirm: 'jy-table-sort-confirm',
            unselect: 'jy-table-unselect',
            error: 'jy-table-error',
            resizeLine: 'jy-table-resize-line',
            checkbox: 'jy-table-checkbox',
            checkboxEdit: 'jy-table-checkbox-edit',
            radio: 'jy-table-radio',
            radioEdit: 'jy-table-radio-edit',
            checked: 'jy-table-checked',
            input: 'jy-table-input',
            select: 'jy-table-select',
            selectTitle: 'jy-table-select-title',
            selectActive: 'jy-table-select-active',
            empty: 'jy-table-empty',
            downAnimation: 'jy-table-animation-hover-down'
        }
        var tpl = {
            table: '<table class="jy-table"></table>',
            thead: '<thead></thead>',
            tbody: '<tbody></tbody>',
            headerMain: '<div class="jy-table-header-main"></div>',
            headerMainLeft: '<div class="jy-table-header-main-l"></div>',
            headerMainRgiht: '<div class="jy-table-header-main-r"></div>',
            headerMain: '<div class="jy-table-header-main"></div>',
            header: '<div class="jy-table-header"></div>',
            main: '<div class="jy-table-main"></div>',
            empty: '<div class="jy-table-empty">暂无数据</div>',
            td: '\
            <td class="<%-(col.align?"jy-table-align-"+col.align:"")%>"\
             data-key="<%-key%>-<%-col._col_key%>"\
             data-col="<%-col._col_key%>"\
             jy-event="<%-col.event||""%>"\
             <%if(col.style){%>\
             style="<%for(var k in col.style){%><%-k%>:<%-col.style[k]%>;<%}%><%-(col.hidden?"display:none":"")%>"\
             <%}%>\
             <%for(var k in col.attr){%> <%-k%>="<%-col.attr[k]%>"<%}%>>\
                <%-cell%>\
            </td>',
            cell: '<div class="jy-clear jy-table-cell jy-table-cell-<%-tableCount%>-<%-col._col_key%>"><div class="jy-table-cell-content"><%-(!content&&String(content)!="0"?"&nbsp;":content)%></div></div>',
            radio: '<div class="jy-table-radio <%-(checked?"jy-table-checked":"")%>" data-key="<%-key%>">\
                <i class="jy-radio-icon-checked">' + radioedIcon + '</i>\
                <i class="jy-radio-icon-uncheck">' + radioIcon + '</i>\
                <span>&nbsp;</span>\
            </div>',
            radioEdit: '<div class="jy-table-radio-edit <%-(checked?"jy-table-checked":"")%>">\
                <i class="jy-radio-icon-checked">' + radioedIcon + '</i>\
                <i class="jy-radio-icon-uncheck">' + radioIcon + '</i>\
                <span><%-(title||"&nbsp;")%></span>\
            </div>',
            checkbox: '<div class="jy-table-checkbox <%-(checked?"jy-table-checked":"")%>" data-key="<%-key%>">\
                <span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                <span><%-(title||"&nbsp;")%></span>\
            </div>',
            checkboxEdit: '<div class="jy-table-checkbox-edit <%-(checked?"jy-table-checked":"")%>">\
                <span class="jy-checkbox-icon"><i>' + checkedIcon + '</i></span>\
                <span><%-(title||"&nbsp;")%></span>\
            </div>',
            select: '<div class="jy-table-select jy-table-select-open">\
                <div class="jy-table-select-title">\
                    <input type="text" class="jy-table-input" placeholder="请选择" readonly><i>' + downIcon + '</i>\
                </div>\
                <dl class="jy-table-select-dl"></dl>\
            </div>',
            dd: '<dd class="<%-(selected?"jy-table-select-active":"")%>"><%-title%></dd>',
            btn: '<button type="button" class="jy-btn jy-btn-xs <%-(type?"jy-btn-"+type:"")%>" jy-event="<%-event%>" style="margin-right:<%-last?0:10%>px" <%-(stop?\'jy-stop="true"\':"")%>><%-text%></button>',
            loading: '<div class="jy-table-loading"><i class="jy-table-icon">' + loadingIcon + '</i></div>'
        }
        // 常用正则验证
        var ruleMap = {
            required: {
                msg: '必填项不能为空',
                rule: /[\S]+/
            },
            number: {
                msg: '请输入数字',
                rule: /^\-?\d+(\.\d*)?$/
            },
            int: {
                msg: '请输入整数',
                rule: /^\-?\d+$/
            },
            date: {
                msg: '请输入正确的日期',
                rule: /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
            },
            phone: {
                msg: '请输入正确的手机号',
                rule: /^1(3|4|5|6|7|8|9)\d{9}$/
            },
            email: {
                msg: '请输入正确的邮箱',
                rule: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
            },
            identify: {
                msg: '请输入正确的身份证',
                rule: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/i
            },
            url: {
                rule: /^(#|(http(s?)):\/\/|\/\/)[^\s]+\.[^\s]+$/,
                msg: '请输入正确的链接'
            }
        };

        // 页码类
        function Class(option) {
            var event = Common.getEvent();
            this.on = event.on;
            this.once = event.once;
            this.trigger = event.trigger;
            // 排除data字段，防止data数据过大时浏览器奔溃
            this.option = Common.deepAssign({}, option, ['data']);
            this.option.data = option.data;
            this.render();
        }

        // 渲染表格
        Class.prototype.render = function () {
            this.$elem = $(this.option.elem);
            this.filter = 'table_' + Math.random();
            this.tableCount = this.tableCount || tableCount++;
            this.$elem.next('.' + classNames.view).remove();
            this.$view && this.$view.remove();
            this.$view = $('<div class="' + [classNames.view, classNames.view + '-' + this.tableCount].join(' ') + '"></div>');
            this.$viewBorder = $('<div class="' + classNames.viewBorder + '"></div>');
            this.$table = $(tpl.table);
            this.$tableColGroup = $('<colgroup></colgroup>');
            this.$tableTbody = $(tpl.tbody);
            this.$headerMain = $(tpl.headerMain);
            this.$header = $(tpl.header);
            this.$headerTable = $(tpl.table);
            this.$headerTableColGroup = $('<colgroup></colgroup>');
            this.$headerTableThead = $('<thead></thead>');
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
            this.request = this.option.request;
            this.defaultToolbar = this.option.defaultToolbar;
            this.toolbar = this.option.toolbar;
            this.editTrigger = this.option.editTrigger || 'click';
            this.nowPage = this.option.nowPage || 1;
            this.limit = this.option.limit || 20;
            this.stretch = this.option.stretch || false; //是否拉伸表格宽度，使其充满容器
            this.autoHeight = this.option.autoHeight || false; //高度自适应，充满父容器
            this.page = this.option.page === undefined ? true : this.option.page;
            this.ellipsis = this.option.ellipsis === undefined ? true : this.option.ellipsis;
            this.autoSave = this.option.autoSave === undefined ? true : this.option.autoSave;
            this.enterSave = this.option.enterSave === undefined ? true : this.option.enterSave;
            this.multilevelCols = this.option.cols[0] instanceof Array ? this.option.cols : [this.option.cols];
            this.spanMethod = this.option.spanMethod;
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
            this.tempData = {}; // 临时数据
            this.idKeyMap = {}; // 存储原始数据id到内部key的映射
            this.dataMap = {}; // 存储数据映射，可快速找到数据
            this.editMap = {} // 存储编辑中的单元格
            this.sortObj = { // 排序数据
                field: '',
                sort: ''
            };
            // 清除之前的计时器
            for (var key in this.timers) {
                clearTimeout(this.timers[key]);
                clearInterval(this.timers[key]);
                Common.cancelNextFrame(this.timers[key]);
            }
            this.timers = {}; //计时器
            this.$view.append(this.$viewBorder);
            this.$view.insertAfter(this.$elem);
            this.$elem.hide();
            this.initCols();
            this.createSheet();
            this.renderToolbar();
            this.renderTableHead();
            this.renderTableBody();
            this.renderTableFixed();
            this.renderPage();
            this.setViewArea();
            this.setColsWidth();
            this.stretchTable();
            this.bindEvent();
            this.heartbeat();
        }

        // 初始化cols
        Class.prototype.initCols = function () {
            var that = this;
            var cols = this.multilevelCols.concat([]);
            var key = 0;
            var firstLevelCols = [];
            cols.map(function (_cols, i) {
                cols[i] = _cols.concat([]);
                // 每个col都自动生成一个唯一key
                cols[i].map(function (col) {
                    col._col_key = key++;
                    col.style = col.style || {};
                    col.attr = col.attr || {};
                    if (col.event) {
                        col.style['cursor'] = 'pointer';
                    }
                    if (i === 0) {
                        firstLevelCols.push(col);
                    }
                });
            });
            _setColRelation(cols, 0, 1000);
            // 列排序-begin
            cols = firstLevelCols.filter(function (col) {
                return col.fixed == 'left';
            });
            cols = cols.concat(firstLevelCols.filter(function (col) {
                if (col.fixed != 'left' && col.fixed != 'right') {
                    col.fixed = undefined;
                    return true;
                }
                return false;
            }));
            cols = cols.concat(firstLevelCols.filter(function (col) {
                return col.fixed == 'right';
            }));
            // 多级表头
            this.multilevelCols = [cols];
            // 用来渲染数据的列数组
            this.cols = [];
            _setDataAndMutilLevelCol(cols, 1);
            // 列排序-end
            this.initCols.hasTyped = false;
            this.cols.map(function (col) {
                // 确保只有一个选中类型有效
                if (col.type == 'radio' || col.type == 'checkbox') {
                    if (that.initCols.hasTyped) {
                        col.type = 'text';
                        col.hidden = true;
                    }
                    that.initCols.hasTyped = true;
                }
            });
            if (this.multilevelCols[0][0].fixed === 'left') {
                this.hasLeftFixed = true;
            }
            if (this.multilevelCols[0][this.multilevelCols[0].length - 1].fixed === 'right') {
                this.hasRightFixed = true;
            }
            this.setColMap();

            // 设置父子关系
            function _setColRelation(cols, level, colspan, pCol) {
                for (var i = 0, count = 0; i < colspan && cols[level][i] && count < colspan; i++) {
                    var col = cols[level][i];
                    if (col.colspan >= 2) { // colspan大于1的列不能用于渲染数据
                        if (cols[level + 1] && cols[level + 1].length) { // 有下一级表头
                            _setColRelation(cols, level + 1, col.colspan, col);
                        } else { // 无效的colspan
                            col.colspan = undefined;
                        }
                        count += (col.colspan || 1);
                    } else {
                        count += 1;
                    }
                    // 上一级对应的父列
                    if (pCol) {
                        pCol.child = pCol.child || [];
                        pCol.child.push(col);
                        col.parent = pCol;
                        // 是否显示子列依赖于父列
                        col.hidden = pCol.hidden || col.hidden;
                    }
                }
                if (pCol) {
                    // 设置完父子关系后，设置col的有效colspan
                    var _colspan = 0;
                    pCol.child.map(function (_col) {
                        _colspan += _col.hidden ? 0 : 1;
                    });
                    pCol.colspan = _colspan;
                    if (!_colspan) {
                        pCol.hidden = true;
                    }
                }
                // 只有一级表头可以设置固定列
                if (level > 0) {
                    col.fixed = undefined;
                }
                // 移除已处理过的列
                cols[level].splice(0, colspan);
            }

            function _setDataAndMutilLevelCol(cols, level) {
                cols.map(function (col) {
                    if (col.child) {
                        that.multilevelCols[level] = that.multilevelCols[level] || [];
                        that.multilevelCols[level] = that.multilevelCols[level].concat(col.child);
                        _setDataAndMutilLevelCol(col.child, level + 1);
                    } else {
                        that.cols.push(col);
                    }
                });
            }
        }

        // 心跳检测view是否从文档中删除
        Class.prototype.heartbeat = function () {
            var that = this;
            // 不能这样赋值，否则调用contains时，浏览器报非法调用
            // var contains = document.contains || document.documentElement.contains;
            Common.cancelNextFrame(this.timers.heartbeatTimer);
            if (document.contains && !document.contains(this.$view[0]) ||
                document.documentElement.contains && !document.documentElement.contains(this.$view[0])) {
                // 清除计时器
                for (var key in this.timers) {
                    clearTimeout(this.timers[key]);
                    clearInterval(this.timers[key]);
                    Common.cancelNextFrame(this.timers[key]);
                }
                return;
            }
            Common.nextFrame(function () {
                that.heartbeat();
            });
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
                Common.insertRule(this.sheet, '.' + classNames.view + '-' + this.tableCount + ' tbody tr', 'height:auto');
                // 单元格高度自适应
                Common.insertRule(this.sheet, '.' + classNames.view + '-' + this.tableCount + ' .' + classNames.cellContent, 'white-space:normal;text-overflow:unset');
            }
        }

        // 重载表格
        Class.prototype.reload = function (option) {
            option = option || {};
            this.option = Common.deepAssign(this.option, option, ['data']);
            if (option.data) {
                this.option.data = option.data;
            }
            this.render();
        }

        // 重载表格数据
        Class.prototype.reloadData = function (option) {
            option = option || {};
            if (option.data) {
                this.data = option.data;
            }
            if (option.nowPage) {
                this.nowPage = option.nowPage;
            }
            if (option.request) {
                Common.deepAssign(this.option.request, option.request);
            }
            this.renderTableBody();
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
            this.$leftHeaderMain && _addRow('left');
            this.$rightHeaderMain && _addRow('right');
            this.sortedData = this.sortedData.slice(0, index).concat(addedData).concat(this.sortedData.slice(index));
            this.renderedData = this.renderedData.concat(addedData);
            this.checkAll(false, true);
            this.hideEmpty();
            this.setFixedArea();
            addedData.map(function (item) {
                that.addedData.push(item);
            });

            function _getIndex(key) {
                if (key !== undefined) {
                    for (var i = 0; i < that.sortedData.length; i++) {
                        if (that.sortedData[i]._row_key == key) {
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
                    tr = that.$leftTable.children('tbody').children('tr')[index - 1];
                } else if (fixed == 'right') {
                    $table = that.$rightTable;
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
                    });
                } else {
                    data.map(function (item, i) {
                        var $tr = $(that.createTr(item, fixed));
                        $table.append($tr);
                        if (!fixed) {
                            addedData.push(item);
                        }
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
            this.$leftHeaderMain && _deleteRow('left');
            this.$rightHeaderMain && _deleteRow('right');
            this.checkAll(this.sortedData.length == this.checkedData.length, true);
            this.delEditTdMap(key);
            if (!this.renderedData.length) {
                this.$table.hide();
                this.$empty.show();
            }

            function _deleteRow(fixed) {
                var $tr = that.getTrByKey(key, fixed);
                // 删除溢出内容弹框
                $tr.children('td').each(function (i, td) {
                    var jyBindData = that.getBindData(td);
                    if (jyBindData.$detail) {
                        var index = that.$details.indexOf(jyBindData.$detail);
                        that.$details.splice(index, 1);
                        jyBindData.$detail.remove();
                    }
                });
                $tr.remove();
                //避免重复处理数据
                if (fixed) {
                    return;
                }
                if (that.selectedData && that.selectedData._row_key == key) {
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
                    if (data[i]._row_key == key) {
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
                this.$view.find('td div.' + classNames.checked).removeClass(classNames.checked);
                this.$view.find('td div.' + classNames.radio + '[data-key="' + key + '"]').addClass(classNames.checked);
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
                    if (this.checkedData[i]._row_key == key) {
                        index = i;
                        break;
                    }
                }
                if (checked === undefined) {
                    checked = index == -1;
                }
                if (checked) {
                    this.checkedData.push(data);
                    this.$view.find('td div.' + classNames.checkbox + '[data-key="' + key + '"]').addClass(classNames.checked);
                } else {
                    this.checkedData.splice(index, 1);
                    this.$view.find('td div.' + classNames.checkbox + '[data-key="' + key + '"]').removeClass(classNames.checked);
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
                        this.$headerTable.find('div.' + classNames.checkbox).addClass(classNames.checked);
                        this.$leftHeaderTable && this.$leftHeaderTable.find('div.' + classNames.checkbox).addClass(classNames.checked);
                        this.$rightHeaderTable && this.$rightHeaderTable.find('div.' + classNames.checkbox).addClass(classNames.checked);
                    } else {
                        this.checkedData = this.sortedData.concat([]);
                        this.$headerMain.find('div.' + classNames.checkbox).addClass(classNames.checked);
                        this.$leftHeaderMain && this.$leftHeaderMain.find('div.' + classNames.checkbox).addClass(classNames.checked);
                        this.$rightHeaderMain && this.$rightHeaderMain.find('div.' + classNames.checkbox).addClass(classNames.checked);
                    }
                } else {
                    if (justStatus) {
                        this.$headerTable.find('div.' + classNames.checkbox).removeClass(classNames.checked);
                        this.$leftHeaderTable && this.$leftHeaderTable.find('div.' + classNames.checkbox).removeClass(classNames.checked);
                        this.$rightHeaderTable && this.$rightHeaderTable.find('div.' + classNames.checkbox).removeClass(classNames.checked);
                    } else {
                        this.checkedData = [];
                        this.$headerMain.find('div.' + classNames.checkbox).removeClass(classNames.checked);
                        this.$leftHeaderMain && this.$leftHeaderMain.find('div.' + classNames.checkbox).removeClass(classNames.checked);
                        this.$rightHeaderMain && this.$rightHeaderMain.find('div.' + classNames.checkbox).removeClass(classNames.checked);
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
                    if (!field || col && $(td).attr('data-col') == col._col_key) {
                        tds.push(td);
                    }
                });
            } else { // 保存所有的数据
                for (var k in this.editMap) {
                    var arr = this.editMap[k];
                    arr && arr.map(function (td) {
                        tds.push(td);
                    });
                }
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
                    key !== undefined && that.delEditTdMap(key, td);
                }
                key === undefined && that.delEditTdMap();
            }
            return result;

            /**
             * 获取编辑中的数据
             * @param {DOM} td 
             * @param {Boolean} ifFormat 是否格式化 
             */
            function _getValue(td, ifFormat) {
                var value = null;
                var jyBindData = that.getBindData(td);
                var col = jyBindData.col;
                var editable = that.getEditAble(jyBindData);;
                if (typeof editable.save == 'function') {
                    var $edit = $(td.children[0].children[0]);
                    value = editable.save($edit);
                } else if (jyBindData.$input) {
                    value = jyBindData.$input.val();
                } else if (jyBindData.$select) {
                    value = jyBindData.$select[0].value;
                } else if (jyBindData.$checkbox) {
                    value = jyBindData.$checkbox[0].value
                } else if (jyBindData.$radio) {
                    value = jyBindData.$radio[0].value
                }
                value = value || '';
                if (ifFormat) {
                    var rowData = jyBindData.rowData;
                    // 还未保存，避免污染vulue值
                    rowData = Object.assign({}, rowData);
                    rowData[col.field] = value;
                    value = that.getCellHtml(rowData, col);
                }
                return value;
            }

            // 验证输入的数据
            function _verify(td) {
                var pass = true;
                var jyBindData = that.getBindData(td);
                var value = _getValue(td);
                var editable = that.getEditAble(jyBindData);
                // 验证输入内容
                if (editable.rules) {
                    for (var i = 0; i < editable.rules.length; i++) {
                        var rule = editable.rules[i];
                        var msg = rule.msg;
                        if (typeof rule.type == 'string') {
                            rule = ruleMap[rule.type];
                            msg = msg || rule.msg;
                            if (!value && rule.type != 'required') {
                                continue;
                            }
                        }
                        if (typeof rule.rule == 'function') {
                            pass = that.callByDataAndCol(rule.rule, jyBindData.rowData, jyBindData.col, value);
                        } else if (rule.rule) {
                            pass = rule.rule.test(String(value || ''));
                        }
                        if (!pass) {
                            msg && that.showMsg(msg);
                            break;
                        }
                    }
                }
                if (!pass) {
                    $(td).addClass(classNames.error);
                } else {
                    $(td).removeClass(classNames.error);
                }
                return pass;
            }

            // 保存编辑的数据
            function _save(td) {
                var jyBindData = that.getBindData(td);
                var key = jyBindData.rowData._row_key;
                var col = jyBindData.col;
                var $td = $(td);
                var value = _getValue(td);
                var fValue = _getValue(td, true);
                var originValue = jyBindData.colData;
                var html = '';
                jyBindData.rowData[col.field] = value;
                jyBindData.colData = value;
                $td.removeClass(classNames.editing);
                html = '<div class="' + classNames.cellContent + '">' + (col.template ? that.callByDataAndCol(col.template, jyBindData.rowData, col) : fValue) + '</div>';
                jyBindData.editing = false;
                jyBindData.$input = undefined;
                jyBindData.$select = undefined;
                jyBindData.$checkbox = undefined;
                td.children[0].innerHTML = html;
                if (col.fixed) {
                    that.getTrByKey(key, that.fixedVisible ? '' : col.fixed).children('td[data-key="' + key + '-' + col._col_key + '"]')[0].children[0].innerHTML = html;
                }
                // 值被修改过
                if (String(originValue) != String(value)) {
                    var pushed = true;
                    for (var i = 0; i < that.editedData.length; i++) {
                        if (that.editedData[i]._row_key == key) {
                            pushed = false;
                            break;
                        }
                    }
                    if (pushed) {
                        that.editedData.push(jyBindData.rowData);
                    }
                    // 触发保存事件
                    that.trigger('save', {
                        data: value,
                        dom: td.children[0].children[0],
                        field: col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                }
                td.style.height && that.setTdHeight(key, col, 'auto');
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
                    if (!field || col && $(td).attr('data-col') == col._col_key) {
                        tds.push(td);
                    }
                });
            } else { // 保存所有的数据
                for (var key in this.editMap) {
                    var arr = this.editMap[key];
                    arr && arr.map(function (td) {
                        tds.push(td);
                    });
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _save(td);
                key !== undefined && that.delEditTdMap(key, td);
            }
            key === undefined && that.delEditTdMap();

            // 获取编辑中的数据
            function _getValue(td) {
                var jyBindData = that.getBindData(td);
                var value = jyBindData.colData;
                var editable = that.getEditAble(jyBindData);
                if (editable.type === 'select' || editable.type === 'checkbox' || editable.type === 'radio') {
                    var values = editable.values;
                    values = typeof values === 'function' ? that.callByDataAndCol(values, jyBindData.rowData, jyBindData.col) : values;
                    if (editable.type === 'select') {
                        values.map(function (item) {
                            if (item.value == value) {
                                value = item.label;
                            }
                        });
                    } else {
                        var arr = [];
                        value && values.map(function (item) {
                            if (Common.indexOf(value, item.value) > -1) {
                                arr.push(item.label);
                            }
                        });
                        value = arr.join('、');
                    }
                }
                return value;
            }

            // 保存编辑的数据
            function _save(td) {
                var jyBindData = that.getBindData(td);
                var key = jyBindData.rowData._row_key;
                var col = jyBindData.col;
                var $td = $(td);
                var fValue = _getValue(td);
                td.children[0].innerHTML = col.template ? that.callByDataAndCol(col.template, jyBindData.rowData, col) : fValue;
                $td.removeClass(classNames.editing);
                jyBindData.editing = false;
                jyBindData.$input = undefined;
                jyBindData.$select = undefined;
                jyBindData.$checkbox = undefined;
                td.style.height && that.setTdHeight(key, col, 'auto');
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
                    td = this.getTrByKey(key, col.fixed).children('td[data-col="' + col._col_key + '"]')[0];
                } else {
                    td = this.getTrByKey(key).children('td[data-col="' + col._col_key + '"]')[0];
                }
                if (!td) {
                    return;
                }
                tds = [td];
            } else {
                this.getTrByKey(key).children('td').each(function (i, td) {
                    var jyBindData = that.getBindData(td);
                    if (!that.fixedVisible || !jyBindData.col.fixed) {
                        tds.push(td);
                    }
                });
                if (this.fixedVisible) {
                    this.$leftHeaderMain && this.getTrByKey(key, 'left').children('td').each(function (i, td) {
                        tds.push(td);
                    });
                    this.$rightHeaderMain && this.getTrByKey(key, 'right').children('td').each(function (i, td) {
                        tds.push(td);
                    });
                }
            }
            for (var i = 0; i < tds.length; i++) {
                var td = tds[i];
                _edit(td);
                that.setEditTdMap(key, td);
            }
            if (!this.ellipsis) {
                this.$main.trigger('scroll');
            }

            function _edit(td) {
                var jyBindData = that.getBindData(td);
                var col = jyBindData.col;
                var editable = that.getEditAble(jyBindData);
                if (editable && !jyBindData.editing) {
                    var data = jyBindData.colData;
                    var originTdHeight = that.ellipsis ? 41 : td.offsetHeight;
                    var rowData = jyBindData.rowData;
                    var key = jyBindData.rowData._row_key;
                    var $cell = $(td.children[0]);
                    var $edit = $('<div class="' + classNames.editCell + '"></div>');
                    var height = td.clientHeight - 2;
                    var h = 0;
                    $cell.html($edit);
                    editable.type = editable.type || 'text';
                    if (typeof editable.edit == 'function') {
                        $edit.append(that.callByDataAndCol(editable.edit, rowData, col));
                        $edit.find('input').on('input propertychange', function () {
                            // 触发输入事件
                            that.trigger('edit.input', {
                                data: this.value,
                                dom: this,
                                field: jyBindData.col.field,
                                rowData: Common.delInnerProperty(jyBindData.rowData)
                            });
                        }).trigger('focus');
                    } else if (editable.type == 'text' || editable.type == 'number') { // 输入框编辑
                        _editInput(td);
                    } else if (editable.type == 'select') { // 下拉框编辑
                        _editSelect(td);
                    } else if (editable.type == 'radio') { // 单选框
                        _editRadio(td);
                    } else if (editable.type == 'checkbox') { // 复选框编辑
                        _editCheckbox(td);
                    }
                    h = $edit[0].clientHeight;
                    // 垂直居中
                    height > h && $edit.css('padding', (height - h) / 2 + 'px 0');
                    // 触发编辑事件
                    that.trigger('edit', {
                        data: data,
                        dom: $edit[0],
                        field: col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                    $(td).addClass(classNames.editing);
                    jyBindData.editing = true;
                    h += 2;
                    // 高度发送变化时重新调整行高
                    if (Math.abs(originTdHeight - h) > 2) {
                        that.setTdHeight(key, col, h + (ieVersion <= 6 ? 1 : 0));
                    }
                }
            }

            function _editInput(td) {
                var jyBindData = that.getBindData(td);
                var data = jyBindData.colData;
                var height = td.clientHeight - 2;
                var $edit = $(td.children[0].children[0]);
                var $input = $('<input class="' + [classNames.input].join(' ') + '">');
                $input.val(data);
                height > 38 && $input.css({
                    'height': height,
                    'line-height': height + 'px'
                });
                $input.on('input propertychange', function () {
                    var editable = that.getEditAble(jyBindData);
                    // 只可输入数字
                    if (editable.type == 'number') {
                        // 小数位数
                        var dot = editable.dot !== undefined ? Number(editable.dot) : Infinity;
                        var num = Common.getNum($input.val(), dot);
                        if (num !== $input.val()) {
                            $input.val(num);
                        }
                    }
                    // 触发输入事件
                    that.trigger('edit.input', {
                        data: $input.val(),
                        dom: $input[0],
                        field: jyBindData.col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                });
                $edit.html($input);
                jyBindData.$input = $input;
                // 输入框聚焦
                Common.nextFrame(function () {
                    $input.trigger('focus');
                });
            }

            function _editSelect(td) {
                var jyBindData = that.getBindData(td);
                var editable = that.getEditAble(jyBindData);
                var values = editable.values;
                var data = jyBindData.colData;
                var height = td.clientHeight - 2;
                var $edit = $(td.children[0].children[0]);
                var $select = $(tpl.select);
                var $title = $select.children('.' + classNames.selectTitle);
                var $input = $title.children('input');
                var $dl = $select.children('dl');
                values = typeof values === 'function' ? that.callByDataAndCol(values, jyBindData.rowData, jyBindData.col) : values;
                height > 38 && $input.css({
                    'height': height,
                    'line-height': height + 'px'
                });
                values.map(function (item) {
                    var selected = false;
                    var $dd = null;
                    if (data == item.value) {
                        selected = true;
                        $input.val(item.label);
                    }
                    $dd = $(Common.htmlTemplate(tpl.dd, {
                        selected: selected,
                        title: item.label
                    }));
                    $dd[0].value = item.value;
                    $dd[0].label = item.label;
                    $dl.append($dd);
                });
                $dl.delegate('dd', 'click', function () {
                    $dl.find('dd.' + classNames.selectActive).removeClass(classNames.selectActive);
                    $(this).addClass(classNames.selectActive);
                    $input.val(this.label);
                    $select[0].value = this.value;
                    $dl.hide();
                    // 触发更改事件
                    that.trigger('edit.change', {
                        data: this.value,
                        dom: $select[0],
                        field: jyBindData.col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                    return false;
                });
                $title.on('click', function () {
                    $dl.toggle();
                    return false;
                });
                $select[0].value = data;
                $edit.append($select);
                jyBindData.$select = $select;
            }

            function _editCheckbox(td) {
                var jyBindData = that.getBindData(td);
                var editable = that.getEditAble(jyBindData);
                var values = editable.values;
                var data = jyBindData.colData.concat([]);
                var $edit = $(td.children[0].children[0]);
                var $checkboxs = $('<div class="' + classNames.checkboxs + '"></div>');
                values = typeof values === 'function' ? that.callByDataAndCol(values, jyBindData.rowData, jyBindData.col) : values;
                values.map(function (item) {
                    var checked = false;
                    var $checkbox = null;
                    if (Common.indexOf(data, item.value) > -1) {
                        checked = true;
                    }
                    $checkbox = $(Common.htmlTemplate(tpl.checkboxEdit, {
                        checked: checked,
                        title: item.label
                    }));
                    $checkbox[0].value = item.value;
                    $checkboxs.append($checkbox);
                });
                $checkboxs.delegate('.' + classNames.checkboxEdit, 'click', function () {
                    var $this = $(this);
                    var value = this.value;
                    var index = Common.indexOf($checkboxs[0].value, value);
                    if (index > -1) {
                        $checkboxs[0].value.splice(index, 1);
                        $this.removeClass(classNames.checked);
                    } else {
                        $checkboxs[0].value.push(value);
                        $this.addClass(classNames.checked);
                    }
                    // 触发更改事件
                    that.trigger('edit.change', {
                        data: this.value,
                        dom: this,
                        field: jyBindData.col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                    return false;
                });
                $edit.append($checkboxs);
                $checkboxs[0].value = data;
                jyBindData.$checkbox = $checkboxs;
            }

            function _editRadio(td) {
                var jyBindData = that.getBindData(td);
                var editable = that.getEditAble(jyBindData);
                var values = editable.values;
                var data = jyBindData.colData;
                var $edit = $(td.children[0].children[0]);
                var $radios = $('<div class="' + classNames.radios + '"></div>');
                values = typeof values === 'function' ? that.callByDataAndCol(values, jyBindData.rowData, jyBindData.col) : values;
                values.map(function (item) {
                    var checked = false;
                    var $radio = null;
                    if (data == item.value) {
                        checked = true;
                    }
                    $radio = $(Common.htmlTemplate(tpl.radioEdit, {
                        checked: checked,
                        title: item.label
                    }));
                    $radio[0].value = item.value;
                    $radios.append($radio);
                });
                $radios.delegate('.' + classNames.radioEdit, 'click', function () {
                    $radios.find('div.' + classNames.checked).removeClass(classNames.checked);
                    $(this).addClass(classNames.checked);
                    $radios[0].value = this.value;
                    // 触发更改事件
                    that.trigger('edit.change', {
                        data: this.value,
                        dom: this,
                        field: jyBindData.col.field,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                    return false;
                });
                $edit.append($radios);
                $radios[0].value = data;
                jyBindData.$radio = $radios;
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
                var col = this.getColByField(field);
                if (!col || rowData[field] == data) {
                    return;
                }
                rowData[field] = data;
                this.setDataMap(data, rowData._row_key, col._col_key);
            } else {
                data = Common.deepAssign({}, data);
                data._row_key = key;
                data.id = rowData.id;
                rowData = data;
                if (this.selectedData && this.selectedData._row_key == key) {
                    this.selectedData = data;
                }
                _setData(this.addedData, data);
                _setData(this.editedData, data);
                _setData(this.checkedData, data);
                _setData(this.renderedData, data);
                _setData(this.sortedData, data);
            }

            this.getTrByKey(key).each(function (i, tr) {
                _setDom(tr);
            });
            this.$leftHeaderMain && this.getTrByKey(key, 'left').each(function (i, tr) {
                _setDom(tr, 'left');
            });
            this.$rightHeaderMain && this.getTrByKey(key, 'right').each(function (i, tr) {
                _setDom(tr, 'right');
            });
            // 更新整行后，处于编辑中的单元重新出发编辑
            if (!field) {
                this.delEditTdMap(key);
                editFields.map(function (field) {
                    that.edit(key, field);
                });
            }

            function _setDom(tr, fixed) {
                var $tr = $(tr);
                if (field) { //更新单元格
                    var col = that.getColByField(field);
                    var rowData = that.getBindData(tr).rowData;
                    if (col) {
                        var content = that.getCellHtml(rowData, col);
                        $tr.find('td[data-col="' + col._col_key + '"]').find('.' + classNames.cellContent).html(content);
                    }
                } else { //更新整行
                    $tr.children('td').each(function (i, td) {
                        var jyBindData = that.getBindData(td);
                        if (jyBindData.editing && editFields.indexOf(jyBindData.col.field) == -1) {
                            editFields.push(jyBindData.col.field);
                        }
                    });
                    $tr.replaceWith(that.createTr(rowData, fixed));
                }
            }

            function _setData(dataList, data) {
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i]._row_key == key) {
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
            var data = null;
            type = type || 'render';
            switch (type) {
                case 'render':
                    data = this.sortedData;
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
                case 'delete':
                    data = this.deletedData;
                    break;
                case 'edit':
                    data = this.editedData;
                    break;
            }
            if (data) {
                if (data instanceof Array) {
                    data = data.map(function (item) {
                        return Common.delInnerProperty(item);
                    });
                } else {
                    data = Common.delInnerProperty(data);
                }
            }

            return data;
        }

        /**
         * 根据外部id获取数据
         * @param {Number} id 
         */
        Class.prototype.getDataById = function (id) {
            for (var i = 0; i < this.renderedData.length; i++) {
                if (this.renderedData[i].id == id) {
                    return Common.delInnerProperty(this.renderedData[i]);
                }
            }
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
            for (var i = 0; i < this.multilevelCols.length; i++) {
                var cols = this.multilevelCols[i]
                for (var j = 0; j < cols.length; j++) {
                    if (cols[j].field == field) {
                        return cols[j];
                    }
                }
            }
        }

        /**
         * 根据列字段唯一key返回列配置对象
         * @param {String} key 
         */
        Class.prototype.getColByKey = function (key) {
            for (var i = 0; i < this.multilevelCols.length; i++) {
                var cols = this.multilevelCols[i]
                for (var j = 0; j < cols.length; j++) {
                    if (cols[j]._col_key == key) {
                        return cols[j];
                    }
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
            var key = $(dom).attr('data-key');
            if (dom.tagName.toUpperCase() === 'TH') {
                return this.colMap[key];
            } else {
                return this.dataMap[key];
            }
        }

        /**
         * 生成样式类
         * @param {String} className 
         */
        Class.prototype.getClassNameWithKey = function (col, className) {
            return className + '-' + this.tableCount + '-' + col._col_key;
        }

        /**
         * 获取编辑配置对象
         * @param {Object} jyBindData 
         */
        Class.prototype.getEditAble = function (jyBindData) {
            var col = jyBindData.col;
            var editable = null;
            if (typeof col.editable === 'function') {
                editable = this.callByDataAndCol(col.editable, jyBindData.rowData, jyBindData.col);
            } else {
                editable = col.editable;
            }
            if (editable && typeof editable != 'object') {
                editable = {};
            }
            return editable;
        }

        // 拉伸表格至100%
        Class.prototype.stretchTable = function () {
            var that = this;
            // view处于隐藏状态时，不能有效处理
            if (!this.$view.is(':visible')) {
                Common.cancelNextFrame(this.timers.stretchTableTimer);
                this.timers.stretchTableTimer = Common.nextFrame(function () {
                    that.stretchTable();
                });
                return;
            }
            if (this.stretch) {
                var hedaerWidth = this.$header[0].clientWidth;
                var tableHeaderWidth = this.$headerTable[0].offsetWidth;
                //表格拉伸至容器的宽度
                if (tableHeaderWidth < hedaerWidth - barWidth) {
                    // ie下，table宽度可能会多出一像素，从而撑破父容器
                    // 出现纵向滚动条时需要减去滚动条的宽度
                    this.setColsWidth(null, this.$main[0].offsetWidth - barWidth - 1);
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
            var that = this;
            if (!this.$view.is(':visible')) {
                Common.cancelNextFrame(this.timers.setAreaTimer);
                this.timers.setAreaTimer = Common.nextFrame(function () {
                    that.setArea(width, height);
                });
                return;
            }
            this.width = width || this.width;
            this.height = height || this.height;
            this.option.width = this.width;
            this.option.height = this.height;
            this.stretch = this.option.stretch || false;
            this.setViewArea();
            this.setColsWidth();
            this.stretchTable();
            this.setFixedArea();
        }

        // 设置容器宽高
        Class.prototype.setViewArea = function () {
            var that = this;
            // view处于隐藏状态时，不能有效设置main的宽高
            if (!this.$view.is(':visible')) {
                Common.cancelNextFrame(this.timers.setViewAreaTimer);
                this.timers.setViewAreaTimer = Common.nextFrame(function () {
                    that.setViewArea();
                });
                return;
            }
            var height = 0;
            if (that.width) {
                that.$view.css({
                    width: that.width
                });
            }
            if (that.height) {
                height = that.height;
            } else if (that.autoHeight) {
                var $parent = that.$view.parent();
                height = $parent[0].clientHeight;
                height -= that.$view[0].offsetTop;
                height -= Common.getMarginPadding($parent[0]).paddingBottom;
                height -= 1;
            }
            if (height) {
                that.$view.css({
                    height: height
                });
            }
            this.setMainArea();
        }

        Class.prototype.setMainArea = function () {
            var width = this.$view[0].clientWidth;
            this.$main.css({
                width: width - 2
            });
            if (this.height && this.height != 'auto' || this.autoHeight) {
                var height = this.$view[0].clientHeight;
                height -= this.$header[0].offsetHeight;
                if (this.$toolbar) {
                    height -= this.$toolbar[0].offsetHeight;
                }
                if (this.$pager) {
                    height -= this.$pager[0].offsetHeight;
                }
                this.$main.css({
                    height: height - 2
                });
            }
        }

        // 设置所有表格的宽度
        Class.prototype.setTableWidth = function () {
            var width = 0;
            this.cols.map(function (col) {
                width += !col.hidden && col._col_width || 0;
            });
            this.$view.find('table.' + classNames.table).css('width', width);
            this.$empty.css('width', width);
        }

        Class.prototype.setFixedArea = function () {
            var that = this;
            // view处于隐藏状态时，不能有效设置
            if (!this.$view.is(':visible')) {
                Common.cancelNextFrame(this.timers.setFixedAreaTimer);
                this.timers.setFixedAreaTimer = Common.nextFrame(function () {
                    that.setFixedArea();
                });
                return;
            }
            var leftWidth = 1;
            var rightWidth = 1;
            var mainRect = null;
            var height = 0;
            var headerHeight = 0;
            var toolbarHeight = 0;
            var hasHscrollBar = false;
            var scrollTop = 0;
            if (this.$leftHeaderMain || this.$rightHeaderMain) {
                mainRect = {
                    clientWidth: this.$main[0].clientWidth,
                    clientHeight: this.$main[0].clientHeight,
                    scrollHeight: this.$main[0].scrollHeight,
                    scrollWidth: this.$main[0].scrollWidth,
                    offsetWidth: this.$main[0].offsetWidth,
                    offsetHeight: this.$main[0].offsetHeight
                }
                hasHscrollBar = mainRect.scrollWidth > mainRect.clientWidth;
            }
            if (hasHscrollBar) {
                var ths = this.$headerTableThead.children('tr').first().children('th');
                ths.each(function (i, th) {
                    var col = that.getBindData(th).col;
                    if (col.fixed === 'left' && !col.hidden) {
                        leftWidth += col._col_width;
                    }
                    if (col.fixed === 'right' && !col.hidden) {
                        rightWidth += col._col_width;
                    }
                });
                headerHeight = this.$header[0].offsetHeight;
                height = headerHeight + mainRect.clientHeight;
                toolbarHeight = this.$toolbar && this.$toolbar[0].offsetHeight || 0;
                scrollTop = this.$main[0].scrollTop;
                this.fixedVisible = true;
                if (this.$leftHeaderMain) {
                    this.$leftHeaderMain.css({
                        'top': toolbarHeight,
                        'width': leftWidth,
                        'height': height
                    }).show();
                    this.$leftMain.css({
                        'height': mainRect.clientHeight
                    });
                    this.$leftMain[0].scrollTop = scrollTop;
                }
                if (this.$rightHeaderMain) {
                    var hasVscrollBar = mainRect.scrollHeight > mainRect.clientHeight;
                    this.$rightHeaderMain.css({
                        'top': toolbarHeight,
                        'width': rightWidth,
                        'height': height,
                        'right': hasVscrollBar ? mainRect.offsetWidth - mainRect.clientWidth : 0
                    }).show();
                    this.$rightMain.css({
                        'top': headerHeight,
                        'height': mainRect.clientHeight
                    });
                    this.$rightMain[0].scrollTop = scrollTop;
                    // ie7的bug（当元素为overflow:hidden且父元素也为overflow:hidden是，right:0无效）
                    if (ieVersion == 7) {
                        this.$rightMain.css({
                            'left': -mainRect.scrollWidth + rightWidth
                        });
                        this.$rightHeader.css({
                            'left': -mainRect.scrollWidth + rightWidth
                        });
                    }
                    if (hasVscrollBar) {
                        this.$mend.css({
                            'top': toolbarHeight,
                            'height': headerHeight
                        }).show();
                    } else {
                        this.$mend.hide();
                    }
                }
            } else { //没有横向滚动条时，隐藏fixed表格
                this.$leftHeaderMain && this.$leftHeaderMain.hide();
                this.$rightHeaderMain && this.$rightHeaderMain.hide();
                this.$mend && this.$mend.hide();
                this.fixedVisible = false;
            }
        }

        // 设置列宽
        Class.prototype.setColWidth = function (col, width) {
            if (typeof col === 'string') {
                col = this.getColByField(col);
            }
            col.width = width;
            this.setColsWidth([col]);
            this.$headerTable.css({
                left: -this.$main[0].scrollLeft
            });
            if (!this.ellipsis) {
                this.setViewArea();
            }
            this.setFixedArea();
        }

        // 设置单元格宽度样式表
        Class.prototype.setColsWidth = function (cols, tableWidth) {
            var that = this;
            // view处于隐藏状态时，不能有效设置
            if (!this.$view.is(':visible')) {
                Common.cancelNextFrame(this.timers.setColsWidthTimer);
                this.timers.setColsWidthTimer = Common.nextFrame(function () {
                    that.setColsWidth();
                });
                return;
            }
            var ths = [];
            var widths = [];
            var allCols = {};
            var colKeys = this.cols.map(function (col) {
                return col._col_key;
            });
            this.$view.find('.' + classNames.table + ' col').each(function (i, col) {
                var colKey = $(col).attr('data-col');
                if (colKeys.indexOf(Number(colKey)) > -1) {
                    allCols[colKey] = allCols[colKey] || [];
                    allCols[colKey].push(col);
                }
            });
            // 只设置部分列
            if (cols) {
                cols = cols.map(function (col) {
                    return col._col_key;
                });
            }
            this.$headerTable.css({
                'width': tableWidth || 'auto',
                'table-layout': 'auto'
            });
            this.$headerTableThead.find('th').each(function (i, th) {
                var jyBindData = that.getBindData(th);
                if (colKeys.indexOf(jyBindData.col._col_key) > -1) {
                    if (cols) {
                        if (cols.indexOf(jyBindData.col._col_key) > -1) {
                            ths.push(th);
                        }
                    } else if (!jyBindData.col.hidden) {
                        ths.push(th);
                    }
                }
            });
            ths.map(function (th, i) {
                var jyBindData = that.getBindData(th);
                var width = jyBindData.col.width || 'auto';
                $(th.children[0]).css('width', width);
                allCols[jyBindData.col._col_key].map(function (_col) {
                    $(_col).css('width', 'auto');
                });
                if (['radio', 'checkbox'].indexOf(jyBindData.col.type) > -1) {
                    $(th).css('width', width);
                }
                widths[i] = jyBindData.col.width;
            });
            ths.map(function (th, i) {
                // view处于隐藏状态时，td的宽度获取不到，默认为100
                widths[i] = th.offsetWidth || widths[i] || 100;
            });
            ths.map(function (th, i) {
                var width = widths[i];
                var jyBindData = that.getBindData(th);
                jyBindData.col._col_width = width;
                allCols[jyBindData.col._col_key].map(function (col) {
                    // ie7中，col定义的宽度对应于clientWidth
                    $(col).css('width', ieVersion == 7 ? width - 1 : width);
                });
                $(th.children[0]).css('width', 'auto');
            });
            this.$headerTable.css({
                'table-layout': 'fixed'
            });
            this.setTableWidth();
            this.setMainArea(); //设置完列宽后，view可能被撑开
        }

        // 设置单元格高度（编辑时，高度可能变化）
        Class.prototype.setTdHeight = function (key, col, height) {
            this.$view.find('td[data-key="' + (key + '-' + col._col_key) + '"]').css('height', height);
        }

        // 设置数据映射(data-key->data)
        Class.prototype.setDataMap = function (data, rowKey, colKey) {
            var that = this;
            var cols = this.cols;
            if (data) {
                if (data.id !== undefined) {
                    this.idKeyMap[data.id] = this.idKeyMap[data.id] || [];
                    if (this.idKeyMap[data.id].indexOf(data._row_key) == -1) {
                        this.idKeyMap[data.id].push(data._row_key);
                    }
                }
                // 只更新某一个单元格的值
                if (rowKey !== undefined && colKey !== undefined) {
                    that.dataMap[rowKey + '-' + colKey].colData = data;
                    return;
                }
                this.dataMap[data._row_key] = {
                    rowData: data
                };
                cols.map(function (col) {
                    that.dataMap[data._row_key + '-' + col._col_key] = {
                        colData: data[col.field],
                        rowData: data,
                        col: col
                    }
                });
            }
        }

        // 设置列配置数据映射(key->col)
        Class.prototype.setColMap = function () {
            var that = this;
            this.colMap = {};
            this.multilevelCols.map(function (cols) {
                cols.map(function (col) {
                    that.colMap['col-' + col._col_key] = {
                        col: col
                    }
                });
            });
        }

        // 设置单元格(编辑中)映射(data-key->td)
        Class.prototype.setEditTdMap = function (key, td) {
            this.editMap[key] = this.editMap[key] || [];
            if (this.editMap[key].indexOf(td) == -1) {
                this.editMap[key].push(td);
            }
        }

        // 删除单元格映射(data-key->td)
        Class.prototype.delEditTdMap = function (key, td) {
            if (key !== undefined) {
                this.editMap[key] = this.editMap[key];
                if (this.editMap[key]) {
                    if (td) {
                        var index = this.editMap[key].indexOf(td);
                        index > -1 && this.editMap[key].splice(index, 1);
                    } else {
                        this.editMap[key] = undefined;
                    }
                }
            } else if (td) {
                for (var key in this.editMap) {
                    var arr = this.editMap[key];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] === td) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
            } else {
                this.editMap = {};
            }
        }

        // 渲染工具条
        Class.prototype.renderToolbar = function () {
            var $toolbar = $('<div class="' + [classNames.toolbar, 'jy-clear'].join(' ') + '"></div>');
            if (this.defaultToolbar) {
                var defaultToolbar = this.defaultToolbar;
                var $tool = $('<div class="' + classNames.toolbarSelf + '"></div>');
                // 默认工具条
                if (defaultToolbar) {
                    defaultToolbar = ['filter', 'exports', 'print']
                }
                for (var i = 0; i < defaultToolbar.length; i++) {
                    switch (defaultToolbar[i]) {
                        case 'filter':
                            $tool.append('<div title="筛选" class="' + [classNames.tool, 'jy-icon', 'jy-inline-block'].join(' ') + '" jy-event="filter">' + filterIcon + '</div>');
                            break;
                        case 'exports':
                            var $div = $('<div title="导出" class="' + [classNames.tool, 'jy-icon', 'jy-inline-block'].join(' ') + '" jy-event="exports">' + exportsIcon + '</div>');
                            var $exports = $(
                                '<ul class="' + classNames.exports + '" style="display:none">\
                                    <li jy-event="exports-excel">导出Excel文件</li>\
                                    <li jy-event="exports-csv">导出Csv文件</li>\
                                </ul>');
                            $div.append($exports);
                            $tool.append($div);
                            this.$exports = $exports;
                            break;
                        case 'print':
                            $tool.append('<div title="打印" class="' + [classNames.tool, 'jy-icon', 'jy-inline-block'].join(' ') + '" jy-event="print">' + printIcon + '</div>');
                            break;
                    }
                }
                $toolbar.append($tool);
            }
            if (this.toolbar || this.defaultToolbar) {
                this.$toolbar = $toolbar;
                $toolbar.append(this.toolbar);
                this.$viewBorder.prepend($toolbar);
            }
        }

        /**
         * 渲染表头
         */
        Class.prototype.renderTableHead = function () {
            var that = this;
            var multilevelCols = this.multilevelCols;
            // 创建多级表头
            multilevelCols.map(function (cols) {
                _renderCols(cols);
            });
            _renderColgroup();
            // 挂载表头
            this.$headerTable.append(this.$headerTableColGroup);
            this.$headerTable.append(this.$headerTableThead);
            this.$header.append(this.$headerTable);
            this.$headerMain.append(this.$header);
            this.$viewBorder.append(this.$headerMain);

            // 渲染表头
            function _renderCols(cols) {
                var $tr = $('<tr></tr>');
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    col.type = col.type || 'text';
                    var $content = $('<div class="' + classNames.cellContent + '">' + (col.title || '&nbsp;') + '</div>');
                    var $cell = $('<div class="' + ['jy-clear', classNames.cell + '-' + that.tableCount + '-' + col._col_key, classNames.cell].join(' ') + '"></div>');
                    var $th = $('<th data-col="' + col._col_key + '" data-key="col-' + col._col_key + '"></th>');
                    $cell.append($content);
                    // 隐藏
                    if (col.hidden) {
                        $th.hide();
                    }
                    // 选择列
                    if (['radio', 'checkbox'].indexOf(col.type) > -1) {
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
                        $th.addClass('jy-table-align-' + col.align);
                    }
                    // 检查子列是否为占位列
                    if (col.child) {
                        var holder = true;
                        // 子列全部为holder才有效
                        col.child.map(function (_col) {
                            if (!_col.holder) {
                                holder = false;
                            }
                        });
                        if (holder) {
                            $th.css('border-bottom', 0);
                            col._childHolder = true;
                        }
                    }
                    if (col.parent && col.parent._childHolder) {
                        $th.addClass(classNames.holder);
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
                that.$headerTableThead.append($tr);
            }

            // 主表中的占位表头
            function _renderColgroup() {
                var cols = that.cols;
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    var colStr = '<col data-col="' + col._col_key + '"/>';
                    if (!col.hidden) {
                        that.$headerTableColGroup.append(colStr);
                        that.$tableColGroup.append(colStr);
                    }
                }
            }

            // 渲染排序图标
            function _renderSortIcon($th, $cell, col) {
                var $up = $('<div class="' + classNames.sortUp + '"></div>');
                var $down = $('<div class="' + classNames.sortDown + '"></div>');
                var $sort = $('<div class="' + classNames.sort + '"></div>');
                $sort.append($up);
                $sort.append($down);
                $($cell[0].children[0]).append($sort);
                $th.addClass(classNames.unselect);
                $up.on('mouseenter', function () {
                    $up.addClass(classNames.sortHover);
                }).on('mouseleave', function () {
                    $up.removeClass(classNames.sortHover);
                }).on('click', function () {
                    that.$view.find('div.' + classNames.sortConfirm).removeClass(classNames.sortConfirm);
                    that.sortObj.field = col.field;
                    that.sortObj.sort = 'asc';
                    $up.addClass(classNames.sortConfirm);
                    that.renderTableBody(true);
                    return false;
                });
                $down.on('mouseenter', function () {
                    $down.addClass(classNames.sortHover);
                }).on('mouseleave', function () {
                    $down.removeClass(classNames.sortHover);
                }).on('click', function () {
                    that.$view.find('div.' + classNames.sortConfirm).removeClass(classNames.sortConfirm);
                    that.sortObj.field = col.field;
                    that.sortObj.sort = 'desc';
                    $down.addClass(classNames.sortConfirm);
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
                this.$table.append(this.$tableColGroup);
                this.$table.append(this.$tableTbody);
                // 对于移动端浏览器，需要先隐藏table，渲染完数据后再显示，否则 table-layout:fixed 无效
                this.$table.hide();
                this.$main.append(this.$table);
                this.$main.append(this.$empty);
                this.$headerMain.append(this.$main);
                this.$main.inserted = true;
                this.showLoading();
            } else {
                this.showLoading();
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
            } else if (this.request) {
                this.httpGet(function (res) {
                    that.renderedData = res.data;
                    that.pager && that.pager.setCount(res.count);
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
                    that.editMap = {};
                    that.checkedData = [];
                    that.selectedData = null;
                    that.renderTr();
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
                that.sortedData = that.renderedData.map(function (item, index) {
                    item._row_index = index;
                    return item;
                });
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
            if (this.hasLeftFixed) {
                if (!this.$leftHeaderMain) {
                    this.$leftHeaderMain = $(tpl.headerMainLeft);
                    this.$leftHeader = $(tpl.header);
                    this.$leftHeaderTable = $(tpl.table);
                    this.$leftMain = $(tpl.main);
                    this.$leftTable = $(tpl.table);
                    this.$leftHeader.append(this.$leftHeaderTable);
                    this.$leftMain.append(this.$leftTable);
                    this.$leftHeaderMain.append(this.$leftHeader);
                    this.$leftHeaderMain.append(this.$leftMain);
                    this.$viewBorder.append(this.$leftHeaderMain);
                }
                this.$leftHeaderTable.html(this.$headerTable.html());
                this.$leftTable.html(this.$table.html());
            }
            if (this.hasRightFixed) {
                if (!this.$rightHeaderMain) {
                    this.$rightHeaderMain = $(tpl.headerMainRgiht);
                    this.$rightHeader = $(tpl.header);
                    this.$rightHeaderTable = $(tpl.table);
                    this.$rightMain = $(tpl.main);
                    this.$rightTable = $(tpl.table);
                    this.$rightHeader.append(this.$rightHeaderTable);
                    this.$rightMain.append(this.$rightTable);
                    this.$rightHeaderMain.append(this.$rightHeader);
                    this.$rightHeaderMain.append(this.$rightMain);
                    this.$mend = $('<div class="' + classNames.mend + '"></div>');
                    this.$viewBorder.append(this.$rightHeaderMain);
                    this.$viewBorder.append(this.$mend);
                }
                this.$rightHeaderTable.html(this.$headerTable.html());
                this.$rightTable.html(this.$table.html());
            }
        }

        /**
         * 渲染行数据
         */
        Class.prototype.renderTr = function () {
            var that = this;
            var data = this.sortedData;
            this.$tableTbody.empty();
            _appendTr(0);

            // 避免加载数据量太大时浏览器卡住
            function _appendTr(start) {
                var html = [];
                Common.cancelNextFrame(that.timers.renderTimer);
                for (var i = start, count = 0; i < data.length && count < 100; i++, count++) {
                    html.push(that.createTr(data[i]));
                }
                that.$tableTbody.append(html.join(''));
                if (i < data.length) {
                    that.timers.renderTimer = Common.nextFrame(function () {
                        _appendTr(i);
                    });
                } else {
                    _complete();
                }
            }

            function _complete() {
                that.renderTableFixed();
                that.hideLoading();
                that.trigger('complete');
                if (that.sortedData.length) {
                    that.hideEmpty();
                } else {
                    that.showEmepty();
                    return;
                }
                that.setFixedArea();
                that.checkAll(false, true);
                that.$main.trigger('scroll');
            }
        }

        /**
         * 创建表格行
         * @param {Object} data 
         */
        Class.prototype.createTr = function (data) {
            var cols = this.cols;
            var key = data._row_key;
            if (key === undefined) {
                key = this.idCount++;
            }
            var tr = '<tr data-key="' + key + '">';
            data._row_key = key;
            for (var col_i = 0; col_i < cols.length; col_i++) {
                var col = cols[col_i];
                tr += this.createTd(col, data);
            }
            tr += '</tr>';
            this.setDataMap(data);
            return tr;
        }

        /**
         * 创建单元格
         * @param {Object} col 
         * @param {Object} data 
         */
        Class.prototype.createTd = function (col, data) {
            var key = data._row_key;
            var td = '';
            var cell = '';
            var content = '';
            if (col.type == 'numbers') { //序号
                content = data._row_index + (this.nowPage - 1) * this.limit + 1;
            } else if (col.type == 'text') { //文本列
                content = this.getCellHtml(data, col);
            } else if (col.type == 'radio') { // 单选列
                var checked = this.selectedData && this.selectedData._row_key == key;
                content = Common.htmlTemplate(tpl.radio, {
                    checked: checked,
                    key: key
                });
            } else if (col.type == 'checkbox') { // 多选列
                var checked = false;
                for (var i = 0; i < this.checkedData.length; i++) {
                    if (this.checkedData[i]._row_key == key) {
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
                    var btns = typeof col.btns === 'function' ? (this.callByDataAndCol(col.btns, data, col) || []) : col.btns;
                    for (var btn_i = 0; btn_i < btns.length; btn_i++) {
                        var btn = btns[btn_i];
                        content += Common.htmlTemplate(tpl.btn, {
                            text: btn.text,
                            event: btn.event,
                            type: btn.type,
                            stop: btn.stop,
                            last: btn_i == btns.length - 1
                        });
                    }
                } else {
                    content = this.callByDataAndCol(col.template, data, col)
                }
            }
            var style = {};
            var attr = {};
            // 避免修改函数属性和函数样式
            col = Object.assign({}, col);
            for (var k in col.style) {
                if (typeof col.style[k] == 'function') {
                    style[k] = this.callByDataAndCol(col.style[k], data, col);
                } else {
                    style[k] = col.style[k];
                }
            }
            for (var k in col.attr) {
                if (typeof col.attr[k] == 'function') {
                    attr[k] = this.callByDataAndCol(col.attr[k], data, col);
                } else {
                    attr[k] = col.attr[k];
                }
            }
            if (this.spanMethod) {
                var obj = this.callByDataAndCol(this.spanMethod, data, col) || {};
                if (obj.rowspan !== undefined) {
                    attr.rowspan = obj.rowspan;
                }
                if (obj.colspan !== undefined) {
                    attr.colspan = obj.colspan;
                }
            }
            if (attr.rowspan === 0 || attr.colspan === 0) {
                style['display'] = 'none';
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
         * @param {*} data 
         * @param {Object} col 
         */
        Class.prototype.getCellHtml = function (data, col) {
            var cellValue = data[col.field];
            var html = cellValue;
            if (col.template) { // 自定义渲染函数
                html = this.callByDataAndCol(col.template, data, col);
            } else if (col.values) { // 有value列表
                html = '';
                if (cellValue instanceof Array) {
                    col.values.map(function (obj) {
                        if (cellValue && cellValue.length && Common.indexOf(cellValue, obj.value) > -1) {
                            html += ',' + obj.label;
                        }
                    });
                    html = html.slice(1);
                } else {
                    col.values.map(function (obj) {
                        if (obj.value == cellValue) {
                            html = obj.label;
                        }
                    });
                }
            }
            return html;
        }

        // 渲染页码
        Class.prototype.renderPage = function () {
            var that = this;
            if (!this.page) {
                return;
            }
            var $pager = $('<div class="' + classNames.pager + '"></div>');
            var $elem = $('<div jy-filter="table_pager_' + this.filter + '"></div>');
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
            var that = this;
            var data = this.request.data || {};
            data[this.request.pageName || 'page'] = this.nowPage;
            data[this.request.limitName || 'limit'] = this.limit;
            $.ajax({
                url: this.request.url,
                method: this.request.method || 'get',
                dataType: this.request.dataType || 'json',
                contentType: this.request.contentType || 'application/json',
                data: data,
                success: function (res) {
                    that.request.success && that.request.success(res);
                    success(that.request.parseData && that.request.parseData(res) || res);
                },
                error: function (res) {
                    that.request.error && that.request.error(res);
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

        // 显示为空标识
        Class.prototype.showEmepty = function () {
            this.$empty.show();
            this.$table.hide();
            this.$leftHeaderMain && this.$leftHeaderMain.hide();
            this.$rightHeaderMain && this.$rightHeaderMain.hide();
        }

        Class.prototype.hideEmpty = function () {
            this.$empty.hide();
            this.$table.show();
        }

        // 显示错误提示
        Class.prototype.showMsg = function (tip) {
            Common.showMsg(tip, {
                container: this.$headerMain,
                icon: 'danger'
            });
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

        // 显示/隐藏某一列
        Class.prototype.toggleCol = function (col, checked, stopCheckParent) {
            var that = this;
            var allThs = [];
            var $checkbox = this.$filter && this.$filter.find('div.' + classNames.checkbox + '[data-key="' + col._col_key + '"]') || $('<div></div>');
            if (checked == undefined) {
                checked = Boolean(col.hidden);
            }
            if (col.hidden == !checked) {
                return;
            }
            // 有子列，则子列也需要进行toggle
            if (col.child) {
                col.child.map(function (_col) {
                    if (_col.parent == col) {
                        that.toggleCol(_col, checked, true);
                    }
                });
            }
            col.hidden = !checked;
            this.$view.find('th,td').each(function (i, td) {
                var jyBindData = that.getBindData(this);
                var $td = $(td);
                if (jyBindData.col._col_key == col._col_key) {
                    if (td.tagName.toUpperCase() === 'TD') {
                        var span = that.spanMethod && that.callByDataAndCol(that.spanMethod, jyBindData.rowData, jyBindData.col);
                        if (span && (span.rowspan == 0 || span.colspan == 0) || !checked) {
                            $td.hide();
                        } else {
                            $td.show();
                        }
                    } else {
                        checked ? $td.show() : $td.hide();
                    }
                }
                if (td.tagName.toUpperCase() == 'TH') {
                    allThs.push(td);
                }
            });
            checked ? $checkbox.addClass(classNames.checked) : $checkbox.removeClass(classNames.checked);
            // 存在子列
            col.child && _checkColspan(col);
            this.toggleHolderCol(col, checked);
            // 递归执行的子列不需要处理如下操作
            if (!stopCheckParent) {
                col.parent && _checkColspan(col.parent, true);
                // 表头总高度可能发生变化，所以需要重新设置main的高度
                this.setViewArea();
                this.setFixedArea();
                this.$headerTable.css({
                    left: -this.$main[0].scrollLeft
                });
            }

            function _checkColspan(col, isParent) {
                var colspan = 0;
                col.child.map(function (_col) {
                    colspan += _col.hidden ? 0 : 1;
                });
                if (col.colspan != colspan) {
                    col.colspan = colspan;
                    _getThByCol(col).map(function (th) {
                        $(th).attr('colspan', colspan || 1);
                    });
                    // 检查的是父列
                    if (isParent) {
                        var $checkbox = that.$filter && that.$filter.find('div.' + classNames.checkbox + '[data-key="' + col._col_key + '"]') || $('<div></div>');
                        _getThByCol(col).map(function (th) {
                            var $th = $(th);
                            $(th).attr('colspan', colspan || 1);
                            if (colspan) {
                                col.hidden = true;
                                $th.show();
                                $checkbox.addClass(classNames.checked);
                            } else {
                                col.hidden = false;
                                $th.hide();
                                $checkbox.removeClass(classNames.checked);
                            }
                        });
                    }
                }
            }

            function _getThByCol(col) {
                var ths = [];
                for (var i = 0; i < allThs.length; i++) {
                    var jyBindData = that.getBindData(allThs[i]);
                    if (jyBindData.col._col_key == col._col_key) {
                        ths.push(allThs[i]);
                    }
                }
                return ths;
            }
        }

        // 新增/删除colgroup中的col
        Class.prototype.toggleHolderCol = function (col, checked) {
            if (col.child) {
                return;
            }
            this.$headerTable.css({
                'width': 'auto',
                'table-layout': 'auto'
            });
            if (checked) {
                var width = 0;
                // 对于初始化时就隐藏的列，其没有_width
                col._col_width = col._col_width || col.width + 3 || 100;
                width = ieVersion == 7 ? col._col_width - 1 : col._col_width
                var index = -1;
                for (var i = 0; i < this.cols.length; i++) {
                    var _col = this.cols[i];
                    if (_col._col_key == col._col_key) {
                        index = i;
                        break;
                    }
                }
                while (index > 0) {
                    index--;
                    var _col = this.cols[index];
                    if (_col && !_col.hidden) {
                        this.$view.find('col[data-col="' + _col._col_key + '"]').each(function (i, _col) {
                            $('<col data-col="' + col._col_key + '" style="width:' + width + 'px"/>').insertAfter(_col);
                        });
                        index = Infinity;
                        break;
                    }
                }
                while (index < this.cols.length - 1) {
                    index++;
                    var _col = this.cols[index];
                    if (_col && !_col.hidden) {
                        this.$view.find('col[data-col="' + _col._col_key + '"]').each(function (i, _col) {
                            $('<col data-col="' + col._col_key + '" style="width:' + width + 'px"/>').insertBefore(_col);
                        });
                        break;
                    }
                }
            } else {
                this.$view.find('col[data-col="' + col._col_key + '"]').remove();
            }
            this.$headerTable.css({
                'table-layout': 'fixed'
            });
            this.setTableWidth();
        }

        // 执行回调函数，避免外部回调污染内部数据
        Class.prototype.callByDataAndCol = function (cb, rowData, col, other) {
            rowData = Common.delInnerProperty(rowData);
            col = Common.delInnerProperty(col);
            if (other !== undefined) {
                return cb(other, rowData[col.field], rowData, rowData._row_index, col);
            } else {
                return cb(rowData[col.field], rowData, rowData._row_index, col);
            }
        }

        // 绑定容器的事件
        Class.prototype.bindEvent = function () {
            var that = this;
            var editTrigger = this.editTrigger || 'click'; //触发编辑的事件类型
            if (!this.bindedEvent) {
                _bindBodyEvent();
                this.bindedEvent = true;
            }
            _bindRadioCheckboxEvent();
            _bindScrollEvent();
            _bindClickEvent();
            _bindEditEvent();
            _bindHoverEvent();
            _bindColResizeEvent();
            _bindOverflowEvent();
            _bindOrderByEvent();
            _bindToolbarEvent();

            function _bindBodyEvent() {
                $(window).on('resize', function () {
                    that.setArea();
                });
                $body.on('click', function (e) {
                    // 点击表格体之外的区域，自动保存编辑中的数据
                    if (!that.tempData.stopBodyEvent) {
                        that.save();
                        that.$exports && that.$exports.hide();
                        that.$filter && that.$filter.hide();
                    }
                    that.tempData.stopBodyEvent = false;
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
                        var jyBindData = that.getBindData(th);
                        var col = jyBindData.col;
                        var width = that.tempData.resizeData.width;
                        that.tempData.$resizeLine.remove();
                        width && that.setColWidth(col, width);
                        that.$view.removeClass(classNames.colResize);
                        that.tempData.resizeData = undefined;
                        that.tempData.$resizeLine = undefined;
                    }
                });
            }

            function _bindRadioCheckboxEvent() {
                // 点击单选框
                that.$view.delegate('td .' + classNames.radio, 'click', function () {
                    var $this = $(this);
                    var key = $this.attr('data-key');
                    that.selectRow(key);
                    that.trigger('change', {
                        dom: this,
                        data: that.selectedData.id
                    });
                });
                // 点击多选框
                that.$view.delegate('td .' + classNames.checkbox, 'click', function () {
                    var $this = $(this);
                    var key = $this.attr('data-key');
                    var $td = $this.parents('td');
                    var rowspan = $td.attr('rowspan');
                    that.checkRow(key);
                    if (rowspan > 1) {
                        var $tr = $td.parent('tr').next('tr');
                        for (var i = 1; i < rowspan && $tr.length; i++) {
                            key = $tr.attr('data-key');
                            that.checkRow(key);
                            $tr = $tr.next('tr');
                        }
                    }
                    that.trigger('change', {
                        dom: this,
                        data: that.checkedData.map(function (item) {
                            return item.id;
                        })
                    });
                });
                // 点击全选
                that.$view.delegate('th .' + classNames.checkbox, 'click', function () {
                    that.checkAll();
                    that.trigger('change', {
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
                    var $td = $target.parents('td');
                    _triggerEvent($target);

                    // 向上触发自定义事件
                    function _triggerEvent($dom) {
                        var event = $dom.attr('jy-event');
                        var stop = $dom.attr('jy-stop');
                        if (event) {
                            var data = {
                                dom: $target[0]
                            }
                            if ($td[0]) {
                                var jyBindData = that.getBindData($td[0]);
                                if (jyBindData) {
                                    data.data = Common.delInnerProperty(jyBindData.rowData);
                                }
                            }
                            // 触发自定义事件
                            that.trigger(event, data);
                        }
                        if ($dom[0] && $dom[0] !== that.$view[0] && !stop) {
                            _triggerEvent($dom.parent());
                        }
                    }
                });
                // 点击表格体时不触发阻止触发body事件
                that.$view.delegate('tbody', 'click', function () {
                    that.tempData.stopBodyEvent = true;
                });
                // 行点击事件
                that.$view.delegate('tbody tr', 'click', function () {
                    var jyBindData = that.getBindData(this);
                    // 触发行点击事件
                    that.trigger('row', {
                        dom: this,
                        data: Common.delInnerProperty(jyBindData.rowData)
                    });
                });
                // 列点击事件
                that.$view.delegate('tbody td', 'click', function () {
                    var jyBindData = that.getBindData(this);
                    // 触发单元格点击事件
                    that.trigger('col', {
                        dom: this,
                        data: jyBindData.colData,
                        rowData: Common.delInnerProperty(jyBindData.rowData)
                    });
                })
            }

            function _bindEditEvent() {
                // 回车保存
                that.$view.on('keydown', function (e) {
                    if (that.enterSave) {
                        var $td = $(e.target).parents('td');
                        if ($td.length && e.keyCode == 13) {
                            var jyBindData = that.getBindData($td[0]);
                            that.save(jyBindData.rowData._row_key);
                        }
                    }
                });
                // 点击编辑
                that.$view.on(editTrigger, function (e) {
                    var $target = $(e.target);
                    if ($target.attr('jy-event')) {
                        return;
                    }
                    var $td = e.target.tagName.toUpperCase() == 'TD' ? $target : $target.parents('td');
                    if (!$td.length) {
                        return;
                    }
                    var jyBindData = that.getBindData($td[0]);
                    var key = jyBindData.rowData._row_key;
                    var pass = true;
                    var editable = that.getEditAble(jyBindData);
                    if (!jyBindData.editing) {
                        // 先保存正在编辑中的数据
                        if (that.autoSave) {
                            pass = that.save();
                        }
                        if (editable && jyBindData.col.field) {
                            pass && that.edit(key, jyBindData.col.field);
                        }
                    }
                    if (editable && jyBindData.col.field) {
                        that.tempData.stopBodyEvent = true;
                    }
                });
            }

            function _bindHoverEvent() {
                // ie8及以下浏览器性能消耗较大
                if (ieVersion <= 8) {
                    return;
                }
                that.$view.delegate('tbody tr', 'mousemove', function (e) {
                    var jyBindData = that.getBindData(this);
                    var key = jyBindData.rowData._row_key;
                    Common.cancelNextFrame(that.timers.hoverInTimer);
                    that.timers.hoverInTimer = Common.nextFrame(function () {
                        _delHover(that.tempData.hoverTrs);
                        that.tempData.hoverTrs = [];
                        that.getTrByKey(key).each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        that.$leftHeaderMain && that.getTrByKey(key, 'left').each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        that.$rightHeaderMain && that.getTrByKey(key, 'right').each(function (i, tr) {
                            that.tempData.hoverTrs.push(tr);
                        });
                        _addHover(that.tempData.hoverTrs);
                    }, 0);
                }).delegate('tbody tr', 'mouseleave', function (e) {
                    Common.cancelNextFrame(that.timers.hoverOutTimer);
                    that.timers.hoverOutTimer = Common.nextFrame(function () {
                        _delHover(that.tempData.hoverTrs);
                        that.tempData.hoverTrs = undefined;
                    });
                });

                function _addHover(hoverTrs) {
                    hoverTrs && hoverTrs.map(function (tr) {
                        $(tr).addClass(classNames.hover);
                    });
                }

                function _delHover(hoverTrs) {
                    hoverTrs && hoverTrs.map(function (tr) {
                        $(tr).removeClass(classNames.hover);
                    });
                }
            }

            function _bindScrollEvent() {
                // 滚动事件
                that.$main.on('scroll', function (e) {
                    that.$headerTable.css({
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
                            var jyBindData = that.getBindData(td);
                            jyBindData.$detail = undefined;
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
                        var jyBindData = that.getBindData(th);
                        if (!that.tempData.resizeData && !jyBindData.col.child && ['radio', 'checkbox'].indexOf(jyBindData.col.type) == -1) {
                            var $th = $(th);
                            if (e.offsetX > th.clientWidth - 10) {
                                $th.addClass(classNames.colResize);
                                jyBindData.$detailIcon && jyBindData.$detailIcon.remove();
                                jyBindData.$detailIcon = undefined;
                            } else {
                                $th.removeClass(classNames.colResize);
                            }
                        }
                    });
                });
                that.$view.delegate('th', 'mousedown', function (e) {
                    if (!that.tempData.resizeData && $(this).hasClass(classNames.colResize)) {
                        that.tempData.resizeData = {
                            pageX: e.pageX,
                            th: this,
                            left: $(this).offset().left - that.$view.offset().left, // 调整线left
                            originWidth: this.clientWidth - hCellPadding
                        }
                        var top = that.$toolbar ? that.$toolbar[0].offsetHeight : 0;
                        var height = that.$view[0].clientHeight - top - (that.$pager ? that.$pager[0].offsetHeight : 0);
                        that.tempData.$resizeLine = $('<div class="' + classNames.resizeLine + '"></div>');
                        that.tempData.$resizeLine.css({
                            top: top,
                            height: height
                        });
                        that.$viewBorder.append(that.tempData.$resizeLine);
                        that.$view.addClass(classNames.colResize);
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
                        if (that.tempData.resizeData || $td.hasClass(classNames.colResize)) {
                            return;
                        }
                        var jyBindData = that.getBindData(td);
                        var col = jyBindData.col;
                        var $cell = $td.children('.' + classNames.cell);
                        if (!jyBindData.$detailIcon && col.type == 'text' && !jyBindData.editing && Common.checkOverflow($cell[0].children[0])) {
                            var $div = $('<div class="' + classNames.detailIcon + '">' + downIcon + '</div>');
                            jyBindData.$detailIcon = $div;
                            $cell.append($div);
                            // 点击打开内容详情弹框
                            $div.on('click', function () {
                                var $close = $('<div class="' + classNames.tipClose + '">' + closeIcon + '</div>');
                                var offset = $cell.offset();
                                var ie6MarginTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                                $div.remove();
                                $div = $('<div class="' + classNames.detail + '">' + $($cell[0].children[0]).html() + '</div>');
                                $div.append($close);
                                $body.append($div);
                                jyBindData.$detail = $div;
                                that.$details.push($div);
                                $div.css({
                                    top: offset.top - 1 + (ieVersion <= 6 ? ie6MarginTop : 0),
                                    left: offset.left - 1
                                });
                                // 点击关闭弹框
                                $close.on('click', function () {
                                    jyBindData.$detail = undefined;
                                    jyBindData.$detailIcon = undefined;
                                    $div.remove();
                                });
                            });
                        }
                    });
                }).delegate('th,td', 'mouseleave', function () {
                    var jyBindData = that.getBindData(this);
                    jyBindData.$detailIcon && jyBindData.$detailIcon.remove();
                    jyBindData.$detailIcon = undefined;
                    Common.cancelNextFrame(that.timers.overflowTimer);
                });
            }

            function _bindOrderByEvent() {
                // 排序事件
                that.$view.delegate('th', 'click', function (e) {
                    var $this = $(this);
                    var jyBindData = that.getBindData(this);
                    var col = jyBindData.col;
                    if (col.sortAble && !that.tempData.resizeData && !$this.hasClass(classNames.colResize)) {
                        var $up = $this.find('div.' + classNames.sortUp);
                        var $down = $this.find('div.' + classNames.sortDown);
                        that.$view.find('div.' + classNames.sortConfirm).removeClass(classNames.sortConfirm);
                        if (that.sortObj.field != col.field) {
                            that.sortObj.field = col.field;
                            that.sortObj.sort = '';
                        }
                        if (!that.sortObj.sort) {
                            that.sortObj.sort = 'asc';
                            $up.addClass(classNames.sortConfirm);
                        } else if (that.sortObj.sort == 'asc') {
                            that.sortObj.sort = 'desc';
                            $down.addClass(classNames.sortConfirm);
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
                        if (that.$filter.is(':visible')) {
                            that.$filter.addClass(classNames.downAnimation);
                        } else {
                            that.$filter.removeClass(classNames.downAnimation);
                        }
                    } else {
                        that.createFilter(e.dom);
                        that.$filter.addClass(classNames.downAnimation);
                    }
                    that.$exports && that.$exports.hide();
                    that.tempData.stopBodyEvent = true;
                });
                // 导出事件
                that.on('exports', function (e) {
                    that.$exports.toggle();
                    that.$filter && that.$filter.hide();
                    that.tempData.stopBodyEvent = true;
                    if (that.$exports.is(':visible')) {
                        that.$exports.addClass(classNames.downAnimation);
                    } else {
                        that.$exports.removeClass(classNames.downAnimation);
                    }
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
            var $filter = $('<ul class="' + classNames.filter + '"></ul>');
            var addedCols = [];
            this.$filter = $filter;
            this.multilevelCols.map(function (cols) {
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    // 如果是占位列，则添加其父代中不为占位列的col
                    if (col.holder) {
                        col = col.parent;
                        while (col && col.holder) {
                            col = col.parent;
                        }
                    }
                    if (col && col.type == 'text' && addedCols.indexOf(col) == -1) {
                        addedCols.push(col);
                        $filter.append('<li>' + Common.htmlTemplate(tpl.checkbox, {
                            checked: !col.hidden,
                            title: col.title,
                            key: col._col_key
                        }) + '</li>');
                    }
                }
            });
            // 在工具图标下挂载
            $(dom).append($filter);
            $filter.delegate('li', 'click', function () {
                var $checkbox = $(this).children('div.' + classNames.checkbox);
                var col = that.getColByKey($checkbox.attr('data-key'));
                that.toggleCol(col);
            });
        }

        // 导出
        Class.prototype.exportsExecl = function () {
            if (window.btoa) {
                var $table = $(this.$headerTable[0].outerHTML);
                var col = this.getColByType('radio') || this.getColByType('checkbox');
                $table.append(this.$table.children('tbody').html());
                col && $table.find('[data-col="' + col._col_key + '"]').remove();
                $table.find('th,td').each(function (i, td) {
                    var $td = $(td);
                    if (td.style.display == 'none') {
                        $td.remove();
                    } else {
                        $td.text($td.text());
                    }
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
                this.showMsg('该浏览器不支持导出，请使用谷歌浏览器');
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
                            var div = document.createElement('div');
                            html = that.callByDataAndCol(col.template, data, col);
                            div.innerHTML = html;
                            // csv不支持格式
                            html = div.innerText;
                        } else if (col.values) { // 有values列表
                            html = '';
                            if (cellValue instanceof Array) {
                                col.values.map(function (obj) {
                                    if (cellValue && cellValue.length && Common.indexOf(cellValue, obj.value) > -1) {
                                        html += ',' + obj.label;
                                    }
                                });
                                html = html.slice(1);
                            } else {
                                col.values.map(function (obj) {
                                    if (obj.value == cellValue) {
                                        html = obj.label;
                                    }
                                });
                            }
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
                var wind = window.open('', '_blank', 'toolbar=no,scrollbars=yes,menubar=no');
                var style = '<style>\
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
                wind.document.write('<head>' + style + '</head><body>' + this.getPrintTableHtml() + '</body>');
                wind.document.close();
                wind.print();
                wind.close();
            } else {
                this.showMsg('该浏览器不支持打印，请使用谷歌浏览器');
            }
        }

        // 获取用于打印的表格html
        Class.prototype.getPrintTableHtml = function () {
            var $table = $(this.$headerTable[0].outerHTML);
            $table.append(this.$table.children('tbody').html());
            this.cols.map(function (item) {
                if (item.type !== 'text') {
                    $table.find('th[data-col="' + item._col_key + '"],td[data-col="' + item._col_key + '"]').remove();
                }
            });
            $table.find('th,td').each(function (i, td) {
                var $td = $(td);
                $td.text($td.text());
            });
            $table[0].style = '';
            return $table[0].outerHTML;
        }

        var Table = {
            render: function (option) {
                var $elem = $(option.elem);
                if (!$elem || $elem.length == 0) {
                    Common.showMsg('jyui.table：elem元素不存在', {
                        icon: 'error'
                    });
                    return;
                }
                var table = new Class(option);
                obj = {
                    on: table.on,
                    once: table.once,
                    trigger: table.trigger,
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
                    getView: function () {
                        return table.$view;
                    },
                    toggleCol: function (field, checked) {
                        var col = table.getColByField(field);
                        table.toggleCol(col, checked);
                    },
                    reload: table.reload.bind(table),
                    reloadData: table.reloadData.bind(table),
                    getData: table.getData.bind(table),
                    getDataById: table.getDataById.bind(table),
                    setArea: table.setArea.bind(table),
                    setColWidth: table.setColWidth.bind(table),
                    showLoading: table.showLoading.bind(table),
                    hideLoading: table.hideLoading.bind(table),
                    showEmepty: table.showEmepty.bind(table),
                    exportsExecl: table.exportsExecl.bind(table),
                    exportsCsv: table.exportsCsv.bind(table),
                    print: table.print.bind(table),
                    getPrintTableHtml: table.getPrintTableHtml.bind(table)
                };
                return obj;
            }
        }

        return Table;
    }

    if ("function" == typeof define && define.amd) {
        define(['./jquery', './common', './pager'], function ($, Common, Pager) {
            return factory($, Common, Pager);
        });
    } else {
        window.JyUi = window.JyUi || {};
        window.JyUi.Table = factory(window.$, window.JyUi.Common, window.JyUi.Pager);
    }
})(window)