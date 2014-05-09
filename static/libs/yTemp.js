function yTemp() { }
yTemp.prototype.temps = {};
yTemp.prototype.parse_functions = {};
yTemp.prototype.parse2HTML = function (tempId, data, def) {
    var ytemp = this;
    var temps = ytemp.temps;
    var parse_functions = ytemp.parse_functions;
    var temp = temps[tempId] == undefined ? (temps[tempId] = document.getElementById(tempId)) : temps[tempId]; //缓存dom模版
    if (!(data instanceof Array)) {
        data = new Array(data);
    }

    //缓存转换函数
    var parse_function = parse_functions[tempId] || (parse_functions[tempId] = (function (html) {
        html = html.replace(/([\'|\\])/gm, "\\$1")   //转义掉 \ 和 '
                    .replace(/{([^{}]*)}/gim, "' + (data['$1'] == 'undefined' ? '" + (def || '') + "' : data['$1']) + '")  //转化为包括变量的字符串
                    .replace(/[\n\r]/gm, '');    //去除回车换行
        html = ["return '", html, "';"].join('');
        return new Function('data', html);
    })(temp.innerHTML));


    var len = data.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            data[i] = parse_function(data[i]);
        }
    } else data[0] = '';
    return data.join('');
}