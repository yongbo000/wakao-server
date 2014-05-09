/****************
#
# 该模块已经弃用，
# 即将被删除。
#
# by yongbo @ 2014/05/01
****************/

var mysql = require('mysql');
var config = require('./config-sample');

//var size = config._size;
var reg = config._reg_isvalid_id;

var channels = {
    'Recommend': 1,
    'NBA': 2
};

var category = {
    'meinv': 1,
    'pet': 2,
    'kid': 3
};

var admins = [{
    account: 'yongbo',
    pwd: 'yb5421'
}];


var dbPool = null;
//获取数据库连接
function getPool() {
    dbPool = dbPool || (dbPool = mysql.createPool({
        host: config._host,
        user: config._user,
        port: config._port,
        password: config._password,
        database: config._db_name
    }));
    return dbPool;
}
//获取指定范围内的随机数
function randomNum(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}
//日期格式转化
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//添加funny
function addFunny(data, res) {
    var pool = getPool();
    //数据库操作回调函数
    var funnyAddCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "数据已存在"}');
            }
        }
    }
    var sql = [
        'insert into funnys (user_id,funny_id,`from`,content,pic,comment_count,createtime) ',
        'select ?,?,?,?,?,?,? from dual ',
        'where not exists(select * from funnys where funny_id = ? and `from` = ?)'
    ].join('');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['user_id'], data['funny_id'], data['from'], data['content'], data['pic'], 0, data['createtime'], data['funny_id'], data['from']],
            function(error, results) {
                conn.release();
                funnyAddCallbackfn(error, results)
            }
        );
    });

}
//分页获取funny
function getFunnyData(page, res) {

    var pool = getPool();
    var offset = (page - 1) * size;

    //数据库操作回调函数
    var funnyGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }

    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from funnys order by id desc limit ?,?', [offset, size],
            function(error, results) {
                conn.release();
                funnyGetCallbackfn(error, results)
            }
        );
    });

}
//添加article
function addArticle(data, res) {
    var pool = getPool();
    //数据库操作回调函数
    var articleAddCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "Well done, Good Job!"}');
            } else {
                res.send('{"msg": "数据已存在"}');
            }
        }
    }
    var sql = [
        'insert into articles (article_id,user_id,user_name,`from`,weixin_account,title,intro_words,content,pic,comment_count,createtime,channel) ',
        'select ?,?,?,?,?,?,?,?,?,?,?,? from dual ',
        'where not exists(select * from articles where article_id = ? and `from` = ?)'
    ].join('');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['article_id'], data['user_id'], data['user_name'], data['from'], data['weixin_account'], data['title'], data['intro_words'], data['content'], data['pic'], 0, data['createtime'], data['channel'], data['article_id'], data['from']],
            function(error, results) {
                conn.release();
                articleAddCallbackfn(error, results)
            }
        );
    });
}
//获取app首页推荐文章
function getOfferArticles(res) {
    var pool = getPool();
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }
    var mId = randomNum(1, 100);
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from articles where pic != "" order by id desc limit ?,5', [mId],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });
}
//分页获取article
function getArticleData(page, res) {
    var pool = getPool();
    var offset = (page - 1) * size;
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from articles order by id desc limit ?,?', [offset, size],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });

}
//按公众号获取article
function getArticleByAccount(account, page, res) {
    var pool = getPool();
    var offset = (page - 1) * size;
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from articles where weixin_account = ? order by id desc limit ?,?', [account, offset, size],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });

}
//按频道获取article
function getArticleByChannel(channel, page, res) {
    var pool = getPool();
    var offset = (page - 1) * size;
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from articles where channel = ? order by id desc limit ?,?', [channels[channel], offset, size],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });

}
//按id获取article
function getArticleById(id, res) {
    var pool = getPool();
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send(JSON.stringify(results));
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from articles where id = ?', [id],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });
}

//删除article
function deleteArticle(id, res) {
    var pool = getPool();
    //数据库操作回调函数
    var articleDeleteCallbackfn = function(error, results) {
        if (error) {
            res.send('{ "msg": "' + error.message + '"}');
        } else {
            res.send('{ "msg": "success"}');
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'delete from articles where id = ?', [id],
            function(error, results) {
                conn.release();
                articleDeleteCallbackfn(error, results)
            }
        );
    });
}

//获取文章内容
function getArticleContentById(id, res) {
    var pool = getPool();
    //数据库操作回调函数
    var articleGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            if (results.length > 0) {
                res.send(results[0]['content'].replace(/src="/igm, 'src="http://bcs.duapp.com/wakao01/'));
            } else {
                res.send('null');
            }
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select content from articles where id = ?', [id],
            function(error, results) {
                conn.release();
                articleGetCallbackfn(error, results)
            }
        );
    });

}
//获取funny评论
function getFunnyComments(id, res) {
    var pool = getPool();
    var sql = 'select * from funny_comments where funny_id = ?';
    //数据库操作回调函数
    var commentGetCallbackfn = function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.length > 0) {
                res.send('{"msg": "success", "data": ' + JSON.stringify(results) + '}');
            } else {
                res.send('{"msg": "null"}');
            }
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query(sql, [id], function(error, results) {
            conn.release();
            commentGetCallbackfn(error, results)
        });
    });

}
//添加funny评论
function addFunnyComment(data, res) {
    var pool = getPool();
    var createtime = new Date().format('yyyy-MM-dd hh:mm:ss')

    //var parent_id = data['parent_id'] || 0;
    //数据库操作回调函数
    var commentAddCallbackfn = function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"');
        } else {
            res.send('{"msg": "success"}');
        }
    }
    pool.getConnection(function(err, conn) {
        conn.query('START TRANSACTION;');
        conn.query('insert into funny_comments value(null,?,?,?,?,?,?);', [data['funny_id'], data['user_id'], data['user_name'], data['content'], data['avatar'], createtime]);
        conn.query('update funnys set comment_count = comment_count + 1 where id = ?', [data['funny_id']]);
        conn.query('COMMIT;', function(error, results) {
            conn.release();
            commentAddCallbackfn(error, results)
        });
    });

}
//检查是否注册用户
function getUser(uid, pwd, fn) {
    var pool = getPool();
    var getUserCallbackfn = function(error, results) {
        fn(error, results);
    }
    pool.getConnection(function(err, conn) {
        conn.query(
            'select * from users where user_id = ? and pwd = ?', [uid, pwd],
            function(error, results) {
                conn.release();
                getUserCallbackfn(error, results)
            }
        );
    });

}
//添加用户
function addUser(data, res) {
    var pool = getPool();
    var createtime = new Date().format('yyyy-MM-dd hh:mm:ss');

    //数据库操作回调函数
    var userAddCallbackfn = function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "用户已存在"}');
            }
        }
    }
    var sql = [
        'insert into users (user_id,user_name,pwd,avatar,createtime,status) ',
        'select ?,?,?,?,?,? from dual ',
        'where not exists(select * from users where user_id = ?)'
    ].join('');
    pool.getConnection(function(err, conn) {
        conn.query(
            sql, [data['user_id'], data['user_name'], data['pwd'], data['avatar'], createtime, true, data['user_id']],
            function(error, results) {
                conn.release();
                userAddCallbackfn(error, results)
            }
        );
    });

}
//添加图片
function addImage(data, res) {
    var pool = getPool();
    var createtime = new Date().format('yyyy-MM-dd hh:mm:ss');
    data['createtime'] = createtime;
    //数据库操作回调函数
    var imageAddCallbackfn = function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "图片已存在"}');
            }
        }
    }
    var str_fileds = 'open_id,from,album_id,album_title,category_id,height,width,pic_url,pic_title,createtime';
    var arr_fileds = str_fileds.split(',');
    var sql = [
        'insert into images (' + str_fileds.replace('from', '`from`') + ') ',
        'select ?,?,?,?,?,?,?,?,?,? from dual ',
        'where not exists(select * from images where open_id = ? and `from` = ?)'
    ].join('');
    var params = [];
    for (var i = 0; i < arr_fileds.length; i++) {
        var item = data[arr_fileds[i]];
        if (item == undefined) {
            res.send('{"msg": "shit!' + arr_fileds[i] + '参数不合法"}');
            return;
        }
        params.push(item);
    }
    params.push(data['open_id']);
    params.push(data['from']);

    pool.getConnection(function(err, conn) {
        conn.query(sql, params,
            function(error, results) {
                conn.release();
                imageAddCallbackfn(error, results)
            }
        );
    });

}

function getImages(lastId, res) {
    var pool = getPool();

    //数据库操作回调函数
    var imageGetCallbackfn = function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    }
    var sql = 'select * from images where id > ? limit ?,?';
    var params = [lastId, 0, size];
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            params,
            function(error, results) {
                conn.release();
                imageGetCallbackfn(error, results)
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

exports.getPool = getPool;
/*
exports.addFunny = addFunny;
exports.addUser = addUser;
exports.getUser = getUser;
exports.addFunnyComment = addFunnyComment;
exports.getFunnyComments = getFunnyComments;
exports.getArticleContentById = getArticleContentById;
exports.getArticleById = getArticleById;
exports.getArticleByChannel = getArticleByChannel;
exports.getArticleByAccount = getArticleByAccount;
exports.getArticleData = getArticleData;
exports.getOfferArticles = getOfferArticles;
exports.addArticle = addArticle;
exports.getFunnyData = getFunnyData;
exports.addFunny = addFunny;
exports.deleteArticle = deleteArticle;
exports.isAdmin = isAdmin;
exports.addImage = addImage;
exports.getImages = getImages;*/
