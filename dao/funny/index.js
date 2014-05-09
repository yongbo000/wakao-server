var mysql = require('mysql');
var dbRobot = require('../../dbRobot');
var DateHelper = require('../../common/DateHelper');
var pool = dbRobot.getPool();

var SQLs = {
    getHotComments: 'select * from (select * from funnys where comment_count > 0 order by id desc limit ?,?) as t order by comment_count desc,id desc',
    addFunny: [
        'insert into funnys (user_id,funny_id,`from`,content,pic,comment_count,createtime) ',
        'select ?,?,?,?,?,?,? from dual ',
        'where not exists(select * from funnys where funny_id = ? and `from` = ?)'
    ],
    getFunnys: 'select * from funnys order by id desc limit ?,?',
    getFunnyComments: 'select * from funny_comments where funny_id = ?',
    addFunnyComment: [
        'START TRANSACTION;',
        'insert into funny_comments value(null,?,?,?,?,?,?);',
        'update funnys set comment_count = comment_count + 1 where id = ?;',
        'COMMIT;'
    ],
    getSQL: function(keyStr) {
        var obj = this[keyStr];
        if (obj instanceof Array) {
            return obj.join('');
        }
        return obj;
    }

};

//获取热门funny
function getHotComments(size, callback) {
    var sql = SQLs.getSQL('getHotComments');
    var params = [0, size];

    pool.getConnection(function(err, conn) {
        conn.query(sql, params, function(error, results) {
            conn.release();
            callback.apply(this, arguments);
        });
    });

}

//添加funny
function addFunny(data, callback) {
    var sql = SQLs.getSQL('addFunny');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['user_id'], data['funny_id'], data['from'], data['content'], data['pic'], 0, data['createtime'], data['funny_id'], data['from']],
            function(error, results) {
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });

}

//分页获取funny
function getFunnys(page, size, callback) {
    var offset = (page - 1) * size;
    var sql = SQLs.getSQL('getFunnys');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [offset, size],
            function(error, results) {
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//获取funny评论
function getFunnyComments(id, callback) {
    var sql = SQLs.getSQL('getFunnyComments');
    pool.getConnection(function(err, conn) {
        conn.query(sql, [id], function(error, results) {
            conn.release();
            callback.apply(this, arguments);
        });
    });

}
//添加funny评论
function addFunnyComment(data, callback) {
    var createtime = DateHelper.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
    var sql = SQLs.getSQL('addFunnyComment');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['funny_id'], data['user_id'], data['user_name'], data['content'], data['avatar'], createtime, data['funny_id']],
            function(error, results) {
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

exports.getHotComments = getHotComments;
exports.addFunny = addFunny;
exports.getFunnys = getFunnys;
exports.addFunnyComment = addFunnyComment;
exports.getFunnyComments = getFunnyComments;
