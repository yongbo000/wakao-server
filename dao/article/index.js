var mysql = require('mysql');
var dbRobot = require('../../dbRobot');
var pool = dbRobot.getPool();

var channels = {
    'Recommend': 1,
    'NBA':2
};

var SQLs = {
    addArticle: [
        'insert into articles (article_id,user_id,user_name,`from`,weixin_account,title,intro_words,content,pic,comment_count,createtime,channel) ',
        'select ?,?,?,?,?,?,?,?,?,?,?,? from dual ',
        'where not exists(select * from articles where article_id = ? and `from` = ?)'
    ],
    getOfferArticles: 'select * from articles where pic != "" order by id desc limit ?,5',
    getArticle: 'select * from articles order by id desc limit ?,?',
    getArticleByAccount: 'select * from articles where weixin_account = ? order by id desc limit ?,?',
    getArticleByChannel: 'select * from articles where channel = ? order by id desc limit ?,?',
    getArticleById: 'select * from articles where id = ?',
    deleteArticle: 'delete from articles where id = ?',
    getArticleContentById:'select content from articles where id = ?',
    getSQL: function(keyStr) {
        var obj = this[keyStr];
        if (obj instanceof Array) {
            return obj.join('');
        }
        return obj;
    }
};

//获取app首页推荐文章
function getOfferArticles(callback) {
    var mId = randomNum(1, 100);
    var sql = SQLs.getSQL('getOfferArticles');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [mId],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//添加article
function addArticle(data, callback) {
    var sql = SQLs.getSQL('addArticle');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [ data['article_id'], data['user_id'], data['user_name'], data['from'], data['weixin_account'], data['title'], data['intro_words'], data['content'], data['pic'], 0, data['createtime'], data['channel'],data['article_id'], data['from']],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//分页获取article
function getArticle(page, size, callback) {
    var offset = (page - 1)*size;
    var sql = SQLs.getSQL('getArticle');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [ offset, size ],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//按公众号获取article
function getArticleByAccount(account, page, size, callback) {
    var offset = (page - 1)*size;
    var sql = SQLs.getSQL('getArticleByAccount');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [account, offset, size],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });

}

//按频道获取article
function getArticleByChannel(channel, page, size, callback) {
    var offset = (page - 1)*size;
    var sql = SQLs.getSQL('getArticleByChannel');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [channels[channel], offset, size],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });

}
//按id获取article
function getArticleById(id, callback) {
    var sql = SQLs.getSQL('getArticleById');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [id],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//删除article
function deleteArticle(id, callback) {
    var sql = SQLs.getSQL('deleteArticle');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [id],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

//获取文章内容
function getArticleContentById(id, callback) {
    var sql = SQLs.getSQL('getArticleContentById');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            [id],
            function(error,results){
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });

}
//暴露接口
exports.addArticle = addArticle;
exports.getArticle = getArticle;
exports.getArticleByAccount = getArticleByAccount;
exports.getArticleByChannel = getArticleByChannel;
exports.getArticleById = getArticleById;
exports.getArticleContentById = getArticleContentById;
exports.getOfferArticles = getOfferArticles;
exports.deleteArticle = deleteArticle;

