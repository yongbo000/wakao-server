var yUtil = {};

yUtil.addClass = function (element, value) {
    var reg = new RegExp("\\b" + value + "\\b");
    var oValue = element.className;
    if(reg.test(oValue)){
        return;
    }
    oValue += " ";
    oValue += value;
    element.className = oValue.replace(/(^\s*)|(\s*$)/g, "");
}

yUtil.removeClass = function(element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    if (element.className.match(reg)) {
        var reg = new RegExp('(\\s*)' + className + '(\\s*)');
        element.className = element.className.replace(reg, ' ');
    }
}

yUtil.merge = function(obj1, obj2) { 
    for(var i in obj1) {
        if (obj2[i] != undefined) {
            if (typeof(obj1[i]) == 'object' && !(obj1[i] instanceof Array)) {
                megre(obj1[i], obj2[i])
            } else {
                obj1[i] = obj2[i];
            }
        }
    }
    return obj1;
}