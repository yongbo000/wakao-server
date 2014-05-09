;(function(){
    var doms = {};//缓存
    function tempToHTML(id, data, def){
        var dom = doms[id] == undefined ? (doms[id] = document.getElementById(id)) : doms[id]; //缓存dom模版，保存在doms对象中
        var parseObj = dom[id] || (dom[id] = (function(html){
            html = html.replace(/([\'|\\])/gm,"\\$1")   //转义掉 \ 和 '
                        .replace(/{([^{}]*)}/gim, "' + (data['$1'] == 'undefined' ? '' : data['$1']) + '")  //转化为包括变量的字符串
                        .replace(/[\n\r]/gm,'');    //去除回车换行
            html = ["return '", html ,"';"].join('');
            //console.log(html);
            return new Function('data', html);
        })(dom.innerHTML));
        
        var len = data.length;
        if(len > 0) {
            for(var i = 0; i < len ; i++) {
                data[i] = parseObj(data[i]);
            }
        } else data[0] = def || '';
        return data.join('');
    }
    window.tempToHTML = tempToHTML;
})();