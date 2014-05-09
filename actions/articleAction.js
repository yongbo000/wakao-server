var articleDao = require('../dao/article/index');
var dbRobot = require('../dbRobot');
var config = require('../config-sample');
var tool = require('../myTool');
var reg = config._reg_isvalid_id;

var rules = [];

function deleteArticle(req, res) {
    var id = req.params['id'],
        isAdmin;
    if (id == undefined || !reg.test(id)) {
        res.send('{"msg":"请求错误..."}');
        return;
    }
    isAdmin = dbRobot.isAdmin(req.body['account'], req.body['pwd']);
    if (!isAdmin) {
        res.send('{"msg":"帐号不存在"}');
        return;
    }

    articleDao.deleteArticle(id, function(error, results) {
        if (error) {
            res.send('{ "msg": "' + error.message + '"}');
        } else {
            res.send('{ "msg": "success"}');
        }
    });
}
rules.push({
    pattern: '/delete/article/:id',
    method: 'post',
    action: deleteArticle
});

function addArticle(req, res) {
    if (!tool.rightRequest(req)) {
        res.send('what are you fucking doging');
        return;
    }
    articleDao.addArticle(req.body, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "Well done, Good Job!"}');
            } else {
                res.send('{"msg": "数据已存在"}');
            }
        }
    });
}
rules.push({
    pattern: '/article/add',
    method: 'post',
    action: addArticle
});

function getArticleById(req, res) {
    var id = req.params['id'];
    if (id == undefined || !reg.test(id)) {
        res.send('what are you fucking doging');
        return;
    }
    articleDao.getArticleById(id, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send(JSON.stringify(results));
        }
    });
}
rules.push({
    pattern: '/article/:id',
    method: 'get',
    action: getArticleById
});

function getOfferArticles(req, res) {
    dbRobot.getOfferArticles(res);
}
rules.push({
    pattern: '/home/offers',
    method: 'get',
    action: getOfferArticles
});

function getArticleContentById(req, res) {
    var id = req.params['id'];
    if (id == undefined || !reg.test(id)) {
        res.send('what are you fucking doging');
        return;
    }
    articleDao.getArticleContentById(id, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.length > 0) {
                res.send(results[0]['content'].replace(/src="/igm, 'src="http://bcs.duapp.com/wakao01/'));
            } else {
                res.send('null');
            }
        }
    });
}
rules.push({
    pattern: '/article-content/:id',
    method: 'get',
    action: getArticleContentById
});


//分页获取全部文章数据
function getArticle(req, res) {
    var page = req.params['page'];
    if (page == undefined || !reg.test(page)) {
        res.send('what are you fucking doging');
        return;
    }
    articleDao.getArticle(page, 20, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/articles/:page',
    method: 'get',
    action: getArticle
});

//分页获取指定公众号的文章
function getArticleByAccount(req, res) {
    var account = req.params['account'];
    var page = req.params['page'];
    if (page == undefined || !reg.test(page) || account == undefined || account.length == 0) {
        res.send('what are you fucking doging');
    }
    articleDao.getArticleByAccount(account, page, 20, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/articles/:account/:page',
    method: 'get',
    action: getArticleByAccount
});

//按频道获取文章
function getArticleByChannel(req, res) {
    var channel = req.params['channel'];
    var page = req.params['page'];
    if (page == undefined || !reg.test(page) || channel == undefined || channel.length == 0) {
        res.send('what are you fucking doging');
    }
    articleDao.getArticleByChannel(channel, page, 20, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/articles/:channel/:page',
    method: 'get',
    action: getArticleByChannel
});


exports.getRules = function() {
    return rules;
};
