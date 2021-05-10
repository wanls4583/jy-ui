/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    function factory($, Form) {
        var filterIcon = '&#xe61d;';
        var exprotsIcon = '&#xe618;';
        var printIcon = '&#xe62c;';
        var Table = {
            render: render,
            on: on,
            trigger: trigger
        }

        // 监听事件
        function on(filter, callback) {
            on[filter] = on[filter] || [];
            on[filter].push(callback);
        }

        // 触发事件
        function trigger(filter, event) {
            var arr = on[filter];
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i](event);
                }
            }
        }

        // 渲染表格
        function render(option) {
            var $elem = $(option.elem);
            var filter = $elem.attr('song-filter') || '';
            if (!$elem.length) {
                return;
            }
            var cols = option.cols;
            var $view = $('<div class="song-table-view"></div>');
            var $tableBody = $('<div class="song-table-body"></div>')
            var $table = $('<table class="song-table"></table>');
            var $toolbar = $('<div class="song-table-toolbar song-row"></div>');
            var $tr = $('<tr></tr>');
            filter && $view.attr('song-filter', filter);
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
                    if (window.document.documentMode <= 7) {
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
                        $view[0].selectedData = {
                            index: e.data,
                            data: option.loadedData[e.data]
                        }
                        Table.trigger('radio(' + filter + ')', option.loadedData[e.data]);
                        Table.trigger('radio', option.loadedData[e.data]);
                    });
                }
                // 多选
                if (col.type == 'checkbox' && filter) {
                    $cell.html('<input type="checkbox" song-filter="table_checkbox_' + filter + '_all">');
                    Form.once('checkbox(table_checkbox_' + filter + ')', function (e) {
                        var checkedData = [];
                        for (var i = 0; i < e.data.length; i++) {
                            checkedData.push(option.loadedData[e.data[i]]);
                        }
                        $view[0].checkedData = {
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
                        var checkedData = checked ? option.loadedData.concat([]) : [];
                        var boxs = $view.find('input[type="checkbox"][song-filter="table_checkbox_' + filter + '"]');
                        boxs.each(function (i, box) {
                            $(box).prop('checked', checked);
                            checked && index.push(i);
                        });
                        $view[0].checkedData = {
                            index: index,
                            data: checkedData
                        }
                        Table.trigger('checkbox(' + filter + ')', checkedData);
                        Table.trigger('checkbox', checkedData);
                        Form.render('checkbox(table_checkbox_' + filter + ')');
                    });
                }
            }
            $table.append($tr);
            if (option.data) {
                option.loadedData = option.data.concat([]);
                createTd(option.cols, option.data, filter, $table);
                _mount();
            } else {
                get(option.request, function (res) {
                    createTd(option.cols, res.data, filter, $table);
                    _mount();
                });
            }
            if (option.toolbar) {
                $toolbar.append(option.toolbar);
            }
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
                $view.append($toolbar);
            }

            function _mount() {
                $elem.replaceWith($view);
                $view.append($tableBody);
                $tableBody.css({
                    width: $tableBody.width() + 'px'
                });
                $tableBody.append($table);
                Form.render();
                bindEvent($view, cols);
            }
        }

        function renderHeader() {

        }
        
        function createTd(cols, data, filter, $table) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var $tr = $('<tr data-index="' + i + '"></tr>');
                for (var j = 0; j < cols.length; j++) {
                    var col = cols[j];
                    var $cell = null;
                    if (!col.type || col.type == 'normal') {
                        $cell = $('<div class="cell">' + (col.template ? col.template(item, i, col) : (col.field ? item[col.field] : '')) + '</div>');
                    } else if (col.type == 'radio') {
                        $cell = $('<div class="cell"><input type="radio" name="table_radio_' + filter + '" value="' + i + '" song-filter="table_radio_' + filter + '"/></div>')
                    } else if (col.type == 'checkbox') {
                        $cell = $('<div class="cell"><input type="checkbox" name="table_checkbox_' + filter + '" value="' + i + '" song-filter="table_checkbox_' + filter + '"/></div>')
                    }
                    var $td = $('<td data-field="' + (col.field || '') + '"></td>');
                    $td.append($cell);
                    $tr.append($td);
                    $td[0].data = item;
                    if (col.hidden) {
                        $td.hide();
                    }
                }
                $table.append($tr);
            }
        }

        function get(option, success, error) {
            $.ajax({
                url: option.url,
                method: option.method || 'get',
                dataType: option.dataType || 'json',
                contentType: option.contentType || 'application/json',
                data: option.data || {},
                success: function (res) {
                    option.success && option.success(res);
                    success(option.parseData && option.parseData(res) || res);
                },
                error: function (res) {
                    option.error && option.error(res);
                    error && error(res);
                }
            })
        }

        function bindEvent($view, cols) {
            if(bindEvent.done) {
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
                    createFilter($view, e.dom, cols);
                }
            });
            Table.on('exports', function (e) {
                console.log('exports')
            });
            Table.on('print', function (e) {
                console.log('print')
            });
        }

        // 过滤列表
        function createFilter($view, dom, cols) {
            var filter = $view.attr('song-filter');
            var $filter = $('<ul class="song-table-filter"></ul>');
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                $filter.append('<li><input type="checkbox" title="' + col.title + '" value="' + col.field + '" checked song-filter="' + filter + '"></li>');
            }
            $(dom).append($filter);
            Form.on('checkbox(' + filter + ')', function (e) {
                var $input = $(e.dom);
                var value = $input.val();
                var checked = $input.prop('checked');
                if (checked) {
                    $view.find('[data-field="' + value + '"]').show();
                } else {
                    $view.find('[data-field="' + value + '"]').hide();
                }
            });
        }

        return Table;
    }

    if ("function" == typeof define && define.amd) {
        define("table", ['jquery', './form'], function ($, form) {
            return factory($, form);
        });
    } else {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = factory(window.$, window.SongUi.Form);
    }
})(window)