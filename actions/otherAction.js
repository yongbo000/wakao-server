var dbRobot = require('../dbRobot');
var userDao = require('../dao/user/index');
var config = require('../config-sample');
var tool = require('../myTool');
var reg = config._reg_isvalid_id;

var rules = [];

function getServerInfo(req, res) {
    var rs = [
        process.env.BAE_ENV_ADDR_SQL_IP,
        process.env.BAE_ENV_ADDR_SQL_PORT,
        process.env.BAE_ENV_APPID,
        process.env.BAE_ENV_ADDR_CHANNEL,
        process.env.BAE_ENV_AK,
        process.env.BAE_ENV_SK
    ];
    res.send(rs.join('<br />'));
}
rules.push({
    pattern: '/config',
    method: 'get',
    action: getServerInfo
});


function addUser(req, res) {
    //检查数据合法性
    if (!tool.checkUser(req.body)) {
        res.send('{"msg": "what are you fucking doing"}');
        return;
    }
    userDao.addUser(req.body, function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "用户已存在"}');
            }
        }
    });
}
rules.push({
    pattern: '/user/add',
    method: 'get',
    action: addUser
});

function girls(req, res) {
    res.render('girls');
}
rules.push({
    pattern: '/girls',
    method: 'get',
    action: girls
});


function indexView(req, res) {
    res.render("index", {
        "key": "test"
    });
}
rules.push({
    pattern: '/index',
    method: 'get',
    action: indexView
});

function noFind(req, res) {
    res.send('骚年，404啦～', 404);
};
rules.push({
    pattern: '*',
    method: 'get',
    action: noFind
});

exports.getRules = function() {
    return rules;
};
