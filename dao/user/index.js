var mysql = require('mysql');
var dbRobot = require('../../dbRobot');
var DateHelper = require('../../common/DateHelper');
var pool = dbRobot.getPool();

var admins = [{
    account: 'yongbo',
    pwd: 'yb5421'
}];

var SQLs = {
    getUser: 'select * from users where user_id = ? and pwd = ?',
    addUser: [
        'insert into users (user_id,user_name,pwd,avatar,createtime,status) ',
        'select ?,?,?,?,?,? from dual ',
        'where not exists(select * from users where user_id = ?)'
    ],
    getSQL: function(keyStr) {
        var obj = this[keyStr];
        if (obj instanceof Array) {
            return obj.join('');
        }
        return obj;
    }
};

//检查是否注册用户
function getUser(uid, pwd, callback) {
    var sql = SQLs.getSQL('getUser');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [uid, pwd],
            function(error, results) {
                conn.release();
                callback.call(this, arguments);
            }
        );
    });

}
//添加用户
function addUser(data, callback) {
    var createtime = DateHelper.format(new Date(),'yyyy-MM-dd hh:mm:ss');
    var sql = SQLs.getSQL('addUser');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['user_id'], data['user_name'], data['pwd'], data['avatar'], createtime, true, data['user_id']],
            function(error, results) {
                conn.release();
                callback.call(this, arguments);
            }
        );
    });

}

function isAdmin(account, pwd) {
    for (var i = 0; i < admins.length; i++) {
        if (admins[i]['account'] == account && admins[i]['pwd'] == pwd) {
            return true;
        }
    }
    return false;
}

exports.isAdmin = isAdmin;
exports.addUser = addUser;
exports.getUser = getUser;
