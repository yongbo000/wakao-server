var dbRobot = require('../dbRobot');
var funnyDao = require('../dao/funny/index');
var config = require('../config-sample');
var tool = require('../myTool');
var reg = config._reg_isvalid_id;

var rules = [];

function addFunny(req, res) {
    if (!tool.rightRequest(req)) {
        res.send('what are you fucking doging');
        return;
    }
    funnyDao.addFunny(req.body, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "数据已存在"}');
            }
        }
    });
}
rules.push({
    pattern: '/funny/add',
    method: 'post',
    action: addFunny
});

function getFunnys(req, res) {
    var page = req.params['page'];
    if (page == undefined || !reg.test(page)) {
        res.send('what are you fucking doing');
        return;
    }
    funnyDao.getFunnys(page, 20, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/funnys/:page',
    method: 'get',
    action: getFunnys
});

function addFunnyComment(req, res) {
    //检查数据合法性
    if (!tool.checkComment(req.body)) {
        res.send('{"msg": "what are you fucking doing"}');
        return;
    }
    funnyDao.addFunnyComment(req.body, function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"');
        } else {
            res.send('{"msg": "success"}');
        }
    });
}
rules.push({
    pattern: '/comment/funny/add',
    method: 'post',
    action: addFunnyComment
});

function getFunnyComments(req, res) {
    var id = req.params['id'];
    if (id == undefined || !reg.test(id)) {
        res.send('what are you fucking doging');
        return;
    }
    funnyDao.getFunnyComments(id, function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.length > 0) {
                res.send('{"msg": "success", "data": ' + JSON.stringify(results) + '}');
            } else {
                res.send('{"msg": "null"}');
            }
        }
    });
}
rules.push({
    pattern: '/comment/funny/get/:id',
    method: 'get',
    action: getFunnyComments
});

function getHotComments(req, res) {
    var size = req.query['size'];
    if (size == undefined || !reg.test(size)) {
        size = 40;
    }
    funnyDao.getHotComments(size, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/funnys/hot/get',
    method: 'get',
    action: getHotComments
});

exports.getRules = function() {
    return rules;
};
