/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Common, Form, Pager) {
        var filterIcon = '&#xe61d;';
        var exprotsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var leftIcon = '&#xe733;';
        var rightIon = '&#xe734;';
        var ieVersion = Common.getIeVersion();
        var Table = {
            render: render,
            on: Common.on,
            once: Common.once,
            trigger: Common.trigger
        }

        // 渲染表格
        function render(option) {
            var $elem = $(option.elem);
            var filter = $elem.attr('song-filter') || '';
            var $view = option.$view || $('<div class="song-table-view"></div>');
            var $table = $('<table class="song-table"></table>');
            var $tableHeader = $('<thead></thead>');
            var $tableBody = $('<tbody></tbody>');
            var $tableMain = $('<div class="song-table-body"></div>');
            if (!option.reload) {
                option = Object.assign({}, option);
                $view.html('');
            } else if (!$elem.length) {
                return;
            }
            option.$view = $view;
            option.$table = $table;
            option.$tableHeader = $tableHeader;
            option.$tableBody = $tableBody;
            option.$tableMain = $tableMain;
            option.nowPage = option.nowPage || 1;
            option.limit = option.limit || 20;
            option.filter = filter;
            option.renderedData = [];
            option.loadedData = [];
            filter && $view.attr('song-filter', filter);
            renderToolbar(option);
            renderTableHeader(option);
            renderTableBody(option, function () {
                _mount();
            });
            if (option.page !== false) {
                renderPage(option);
            }

            function _mount() {
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
                bindEvent(option);
            }

            // 重载表格
            option.reload = function (_option) {
                option = Object.assign(option, _option || {});
                render(option);
            }

            return option;
        }

        // 渲染工具条
        function renderToolbar(option) {
            var $view = option.$view;
            var $toolbar = $('<div class="song-table-toolbar song-row"></div>');
            if (option.defaultToolbar) {
                var defaultToolbar = option.defaultToolbar;
                var $tool = $('<div class="song-table-tool-self"></div>');
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
                    $cell.css({
                        width: col.width + 'px'
                    });
                }
                if (col.minWidth) {
                    // ie7以下不支持min-width
                    if (ieVersion <= 7) {
                        $cell.css({
                            width: col.minWidth + 'px'
                        });
                    } else {
                        $cell.css({
                            'min-width': col.minWidth + 'px'
                        });
                    }
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
                    _createTd();
                    complete && complete();
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
                    for (var col_i = 0; col_i < cols.length; col_i++) {
                        var col = cols[col_i];
                        var $td = $('<td data-field="' + (col.field || '') + '"></td>');
                        var $cell = null;
                        if (!col.type || col.type == 'normal') {
                            $cell = $('<div class="cell">' + (col.template ? col.template(item, index, col) : (col.field ? item[col.field] : '')) + '</div>');
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
                        $td.append($cell);
                        $tr.append($td);
                        $td[0].data = item;
                        if (col.hidden) {
                            $td.hide();
                        }
                    }
                    $tableBody.append($tr);
                }
            }
        }

        // 渲染页码
        function renderPage(option) {
            var $view = option.$view;
            var $pager = $('<div song-filter="table_pager_' + option.filter + '"></div>');
            $view.append($pager);
            option.pager = Pager.render({
                elem: $pager[0],
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

        function bindEvent(option) {
            var $view = option.$view
            if (bindEvent.done) {
                return;
            }
            bindEvent.done = true;
            var filter = $view.attr('song-filter');
            $view.on('click', function (e) {
                var $target = $(e.target);
                var event = $target.attr('song-event');
                if (event) {
                    if (filter) {
                        Table.trigger(event + '(' + filter + ')', {
                            dom: $target[0],
                            data: $target[0].data
                        });
                    }
                    Table.trigger(event, {
                        dom: $target[0],
                        data: $target.parents('td')[0] && $target.parents('td')[0].data || null
                    });
                }
            });
            Table.on('filter', function (e) {
                if ($view.find('.song-table-filter').length > 0) {
                    $view.find('.song-table-filter').toggle();
                } else {
                    createFilter(option, $view, e.dom);
                }
            });
            Table.on('exports', function (e) {});
            Table.on('print', function (e) {});
        }

        // 过滤列表
        function createFilter(option, $view, dom) {
            var filter = $view.attr('song-filter');
            var $filter = $('<ul class="song-table-filter"></ul>');
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
                    $view.find('[data-field="' + value + '"]').show();
                } else {
                    $view.find('[data-field="' + value + '"]').hide();
                }
            });
            Form.render('checkbox(song_table_' + filter + '_filter)');
        }

        return Table;
    }

    if ("function" == typeof define && define.amd) {
        define("table", ['jquery', './common', './form', './pager'], function ($, Common, Form) {
            return factory($, Common, Form, Pager);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = factory(window.$, window.SongUi.Common, window.SongUi.Form, window.SongUi.Pager);
    }
})(window)