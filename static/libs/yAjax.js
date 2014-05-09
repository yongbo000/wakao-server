var yAjax = (function () {
    function parse2URL(params, baseUrl) {
        var key_value = [];
        for (var key in params) {
            key_value.push(key + '=' + params[key]);
        }

        return baseUrl + (key_value.length > 0 ? '?' : '') + key_value.join('&');
    }
    var xhr = (function () {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else {
            try{
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }catch(e){
                xhr = new ActiveXObject('MSXML2.DOMDocument');
            }
            
        }
        return xhr;
    })();
    var get = function (url, data, callback) {
        request.call(this, url, data, callback, 'GET');
    }
    var post = function (url, data, callback) {
        request.call(this, url, data, callback, 'POST');
    }
    var request = function (url, data, callback, method) {
        var data = data || {};
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (callback) {
                        callback(xhr.responseText, xhr.responseXML);
                    }
                }
            }
        }
        if (method == 'POST') {
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        } else if (method == 'GET') {
            xhr.open(method, parse2URL(data, url), true);
            xhr.send();
        }
    }
    return {
        get: get,
        post: post
    };
})();

