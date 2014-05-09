
;(function(){
    var JSONP = JSONP || {};
    var queueId = 0;
    function parse2URL(baseUrl, params) {
        var key_value = [];
        for (var key in params) {
            key_value.push(key + '=' + params[key]);
        }

        return baseUrl + (key_value.length > 0 ? '?' : '') + key_value.join('&');
    }
    
    function get(url, data, fn) {
        var script = document.createElement('script');
        data.callback = 'window._cb_' + queueId;
        function cb(result) {
            document.body.removeChild(script);
            fn(result);
        };
        (new Function('cb','window._cb_' + queueId + '= cb; return window._cb_' + queueId +';'))(cb);
        
        script.src = parse2URL(url, data);
        document.body.appendChild(script);
        queueId++;
    }

    JSONP = {
        get: get
    };

    window.JSONP = JSONP;
})();


