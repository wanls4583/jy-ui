/*
 * @Author: lisong
 * @Date: 2021-08-13 15:51:50
 * @Description: 
 */
if ("function" == typeof define && define.amd) {
    define([
        'jyui/common',
        'jyui/date',
        'jyui/dialog',
        'jyui/form',
        'jyui/select',
        'jyui/menu-nav',
        'jyui/pager',
        'jyui/tab',
        'jyui/table',
        'jyui/transfer',
        'jyui/tree',
        'jyui/upload'
    ], function (Common, _Date, Dialog, Form, Select, MenuNav, Pager, Tab, Table, Transfer, Tree, Upload) {
        return {
            Common: Common,
            Date: _Date,
            Dialog: Dialog,
            Form: Form,
            Select: Select,
            MenuNav: MenuNav,
            Pager: Pager,
            Tab: Tab,
            Table: Table,
            Transfer: Transfer,
            Tree: Tree,
            Upload: Upload
        }
    });
}