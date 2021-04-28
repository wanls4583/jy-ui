/*
 * @Author: lisong
 * @Date: 2021-04-28 09:59:36
 * @Description: 
 */
!(function (window) {
    var Dialog = {

    };
    if ("object" == typeof module && module && "object" == typeof module.exports) {
        module.exports = Dialog;
    } else if ("function" == typeof define && define.amd) {
        define("dialog", ['jquery'], function () {
            return Dialog;
        });
    } else if (window && window.document) {
        window.SongUi = window.SongUi || {};
        window.SongUi.Dialog = Dialog;
    }
})(window)