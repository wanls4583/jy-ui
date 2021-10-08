/*
 * @Author: lisong
 * @Date: 2021-10-08 16:15:28
 * @Description: 
 */
var codes = [];
codes.push(`<div id="table1"></div>
<script>
    require(['modules/table'], function (Table) {
        var data = [];
        var sexValues = [{
            label: '男',
            value: 1
        }, {
            label: '女',
            value: 2
        }];
        var likeValues = [{
            label: '听歌',
            value: 1
        }, {
            label: '游泳',
            value: 2
        }, {
            label: '看小说',
            value: 3
        }];
        for (var i = 0; i < 1000; i++) {
            var sex = Math.ceil(Math.random() * 2);
            var age = Math.ceil(Math.random() * 100);
            var phone = '1' + Math.ceil(Math.random() * 100000000000);
            var like = Math.ceil(Math.random() * 3);
            var sign = '个性签名' + i;
            data.push({ id: i, user: '匿名用户-0000' + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] });
        };
        var table = Table.render({
            elem: '#table1',
            width: 1000,
            height: 500,
            data: data,
            limit: 10,
            defaultToolbar: true,
            stretch: true,
            toolbar: '<button class="jy-btn jy-btn-sm" jy-event="selected">获取选择的项</button>',
            cols: [{
                type: 'radio'
            }, {
                title: '用户',
                field: 'user'
            }, {
                title: '手机号',
                field: 'phone',
                width: 100,
                attr: { //设置单元属性
                    title: function (value, obj, id, col) {
                        return value;
                    }
                }
            }, {
                title: '性别',
                field: 'sex',
                width: 60,
                values: sexValues,
                style: { //设置单元格样式
                    color: function (value, obj, id, col) {
                        if (value == 2) {
                            return 'red';
                        }
                    }
                }
            }, {
                title: '年龄',
                field: 'age',
                width: 60
            }, {
                title: '签名',
                field: 'sign',
                width: 80
            }, {
                title: '爱好',
                field: 'like',
                values: likeValues
            }]
        });
        table.on('selected', function () {
            Dialog.alert(JSON.stringify(table.getData('select')));
        });
    });
</script>`);
codes.push(`<div id="table1"></div>
<script>
    require(['modules/table', 'modules/dialog'], function (Table, Dialog) {
        var data = [];
        var sexValues = [{
            label: '男',
            value: 1
        }, {
            label: '女',
            value: 2
        }];
        var likeValues = [{
            label: '听歌',
            value: 1
        }, {
            label: '游泳',
            value: 2
        }, {
            label: '看小说',
            value: 3
        }];
        var marriageValues = [{
            label: '未婚',
            value: 1
        }, {
            label: '已婚',
            value: 2
        }];
        for (var i = 0; i < 10000; i++) {
            var sex = Math.ceil(Math.random() * 2);
            var marriage = Math.ceil(Math.random() * 2);
            var age = Math.ceil(Math.random() * 100);
            var phone = '1' + Math.ceil(Math.random() * 100000000000);
            var like = Math.ceil(Math.random() * 3);
            var sign = '个性签名' + i;
            data.push({ id: i, user: '匿名用户-0000' + i, city: '城市-' + i, sex: sex, age: age, marriage: marriage, phone: phone, sign: sign, like: [like] });
        };
        var table = Table.render({
            elem: '#table2',
            width: 1000,
            height: 500,
            data: data,
            limit: 20,
            // ellipsis: false,
            defaultToolbar: true,
            toolbar: \`<button class="jy-btn jy-btn-sm" jy-event="custom-add">添加行</button>
            <button class="jy-btn jy-btn-sm" jy-event="custom-checkall">全选/全不选</button>
            <button class="jy-btn jy-btn-sm" jy-event="custom-checked">获取选中的数据</button>
            <button class="jy-btn jy-btn-sm" jy-event="custom-getadd">获取添加的数据</button>
            <button class="jy-btn jy-btn-sm" jy-event="custom-getdel">获取删除的数据</button>
            <button class="jy-btn jy-btn-sm" jy-event="custom-getedit">获取修改过的数据</button>\`,
            cols: [
                [{
                    type: 'checkbox',
                    fixed: 'left',
                    rowspan: 2
                }, {
                    title: '用户',
                    field: 'user',
                    width: 90,
                    event: 'custom-name',
                    fixed: 'left',
                    rowspan: 2
                }, {
                    title: '手机号',
                    field: 'phone',
                    width: 150,
                    editable: {
                        type: 'number',
                        rules: [{ type: 'number' }]
                    },
                    fixed: 'left',
                    sortAble: true,
                    rowspan: 2
                }, {
                    title: '城市',
                    field: 'city',
                    width: 100,
                    editable: true,
                    rowspan: 2
                }, {
                    title: '性别',
                    field: 'sex',
                    width: 60,
                    values: sexValues,
                    editable: {
                        type: 'select',
                        values: sexValues,
                        rules: [{ type: 'required' }]
                    },
                    rowspan: 2
                }, {
                    title: '年龄',
                    field: 'age',
                    width: 80,
                    editable: {
                        edit: function (value, data, id, col) {
                            return '<input class="jy-table-input jy-inline-block" style="width:50px;" value="' + value + '" /><span>岁</span>';
                        },
                        save: function ($edit) {
                            return $edit.find('input').val();
                        },
                        rules: [{ type: 'number' }]
                    },
                    sortAble: true,
                    rowspan: 2,
                    template: function (value) {
                        return value + '岁';
                    }
                }, {
                    title: '婚姻',
                    field: 'marriage',
                    width: 150,
                    values: marriageValues,
                    editable: {
                        type: 'radio',
                        values: marriageValues,
                        rules: [{ type: 'required' }]
                    },
                    rowspan: 2
                }, {
                    title: '其他信息',
                    field: 'other',
                    align: 'center',
                    colspan: 2
                }, {
                    type: 'operate',
                    title: '操作',
                    width: 170,
                    btns: [{
                        text: '详情',
                        event: 'custom-detail'
                    }, {
                        text: '删除',
                        event: 'custom-del',
                        type: 'danger',
                        stop: true
                    }],
                    event: 'custom-op',
                    fixed: 'right',
                    rowspan: 2
                }],
                [{
                    title: '签名',
                    field: 'sign',
                    width: 200,
                    align: 'center',
                    // holder: true,
                    editable: true
                }, {
                    title: '爱好',
                    field: 'like',
                    width: 150,
                    align: 'center',
                    values: likeValues,
                    // holder: true,
                    editable: {
                        type: 'checkbox',
                        values: likeValues,
                        rules: [{ type: 'required' }]
                    }
                }]
            ]
        });
        table.on('save', function (obj) {
            // console.log(obj);
        });
        table.on('edit', function (obj) {
            // console.log(obj);
        });
        table.on('custom-add', function (obj) {
            var sex = Math.ceil(Math.random() * 2);
            var age = Math.ceil(Math.random() * 100);
            var phone = '1' + Math.ceil(Math.random() * 100000000000);
            var like = Math.ceil(Math.random() * 3);
            var sign = '个性签名' + i;
            table.addRow({
                id: 1,
                data: { id: i, user: '匿名用户-0000' + i, city: '城市-' + i, sex: sex, age: age, phone: phone, sign: sign, like: [like] }
            });
        });
        table.on('custom-del', function (obj) {
            table.deleteRow(obj.data.id);
        });
        table.on('custom-detail', function (obj) {
            Dialog.alert(JSON.stringify(obj.data));
        });
        table.on('custom-op', function (obj) {
            // console.log('custom-op');
        });
        table.on('custom-checkall', function (obj) {
            table.checkAll();
        });
        table.on('custom-checked', function (obj) {
            Dialog.alert(JSON.stringify(table.getData('check')));
        });
        table.on('custom-getadd', function (obj) {
            Dialog.alert(JSON.stringify(table.getData('add')));
        });
        table.on('custom-getdel', function (obj) {
            Dialog.alert(JSON.stringify(table.getData('delelte')));
        });
        table.on('custom-getedit', function (obj) {
            Dialog.alert(JSON.stringify(table.getData('edit')));
        });
        table.on('custom-name', function (obj) {
            Dialog.alert(obj.data.user);
        });
    });
</script>`);