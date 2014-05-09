var dbRobot = require('./dbRobot');
var userDao = require('./dao/user/index');
var config = require('./config-sample');
var reg = config._reg_isvalid_id;

function checkComment(data) {
    var funny_id = data['funny_id'];
    var user_id = data['user_id'];
    var user_name = data['user_name'];
    var content = data['content'];
    var avatar = data['avatar'];

    if(funny_id == undefined || !reg.test(funny_id)){
        return false;
    }
    if(user_id == undefined || !reg.test(user_id)){
        return false;
    }
    if(user_name == undefined || user_name.length == 0){
        return false;
    }
    if(content == undefined || content.length == 0){
        return false;
    }
    if(avatar == undefined || avatar.length == 0){
        return false;
    }
    return true;
}

function doLogin(req, fn) {
    var session = req.session;
    var cookies = req.cookies;
    var cbfn = function (error, results) {
        if (error) {
            fn(true, '{"msg": "' + error.message + '"}');
        } else {
            if (results.length > 0) {
                req.session['uid'] = cookies['uid'];
                fn(false);
            } else {
                fn(true, '{"msg": "登录失败"}');
            }
        }
    }
    if (session['uid'] != undefined) {
        fn(false);
        return;
    }
    if(cookies == undefined || cookies['uid'] == undefined || cookies['pwd'] == undefined){
        fn(true, '{"message":"未登录"}');
        return;
    }
    userDao.getUser(cookies['uid'], cookies['pwd'], cbfn)
}

function doLogin2(req, fn) {
    var cookies = req.cookies;
    if(cookies == undefined || cookies['uid'] == undefined || cookies['uid'] != req.body['user_id']){
        fn(true, '{"message":"未登录"}');
        return;
    }
    fn(false);
}

function checkUser(data) {
    var user_id = data['user_id'];
    var user_name = data['user_name'];
    if(user_id == undefined || !reg.test(user_id)){
        return false;
    }
    if(user_name == undefined || user_name.length == 0){
        return false;
    }
    return true;
}


function rightRequest(req){
    var referer = req.headers['referer'];
    if(referer == 'wakao.me'){
        return true;
    }
    return false;
}

//获取指定范围内的随机数
function randomNum(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

exports.rightRequest = rightRequest;
exports.randomNum = randomNum;
exports.checkUser = checkUser;
exports.doLogin2 = doLogin2;
