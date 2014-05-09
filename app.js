var express = require('express')
  , app = express();
var ejs = require('ejs');
var myRouter = require('./routes/index');
var config = require('./config-sample');

var port = config._DEBUG ? 8888 : 18080;


app.configure(function(){
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.engine('.html', ejs.__express);
    app.set('view engine', 'ejs');
    app.set('view options', {
        'open': '{{',
        'close': '}}'
    });

    app.use(express.static(__dirname + '/static'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon());
    app.use(express.cookieParser('mycookie'));
    app.use(express.session());
    //app.use(express.bodyParser());
    app.use(express.urlencoded());
    app.use(express.json());
});



myRouter.initAction(app).run();

app.listen(port);
console.log('server listen at port ' + port);
