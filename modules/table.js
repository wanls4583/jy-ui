/*
 * @Author: lisong
 * @Date: 2021-05-07 09:40:25
 * @Description: 
 */
!(function () {
    var Table = {
        render: render
    }

    // 渲染表格
    function render(option) {
        var cols = option.cols;
        var $table = $('<table class="song-table"></table>');
        var $tr = $('<tr></tr>');
        for (var i = 0; i < cols.length; i++) {
            var $th = $('<th>' + cols[i].title + '</th>');
            $tr.append($th);
            if (cols[i].hidden) {
                $th.hide();
            }
        }
        $table.append($tr);
        if (option.data) {
            createTd(option.cols, option.data, $table);
        } else {
            get(option.request, function (res) {
                createTd(option.cols, res.data, $table);
            });
        }
        $(option.elem).replaceWith($table);

    }

    function createTd(cols, data, $table) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var $tr = $('<tr data-index="' + i + '"></tr>');
            for (var j = 0; j < cols.length; j++) {
                var col = cols[j];
                var $td = $('<td data-filed="' + col.field + '"><div class="cell">' + item[col.field] + '</div></td>');
                $tr.append($td);
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

    if ("function" == typeof define && define.amd) {
        define("dialog", ['jquery'], function () {
            return Table;
        });
    } else if (window && window.document) {
        window.SongUi = window.SongUi || {};
        window.SongUi.Table = Table;
    }
})(window)