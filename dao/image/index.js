var mysql = require('mysql');
var dbRobot = require('../../dbRobot');
var DateHelper = require('../../common/DateHelper');
var pool = dbRobot.getPool();

var SQLs = {
    getAlbums: 'select album_id, album_title, pic_url from images group by album_id',
    getImagesByAlbumId: 'select pic_url,pic_title from images where album_id = ?',
    getRandomImages: 'select pic_url, pic_title from images limit ?,?',
    getImages: 'select * from images where id > ? limit ?,?',
    getSQL: function(keyStr) {
        var obj = this[keyStr];
        if (obj instanceof Array) {
            return obj.join('');
        }
        return obj;
    }
};

function getAlbums(callback) {
    var sql = SQLs.getSQL('getAlbums');
    pool.getConnection(function(err, conn) {
        conn.query(sql, function(error, results) {
            conn.release();
            callback.apply(this, arguments);
        });
    });


}
//获取某专辑下图片
function getImagesByAlbumId(albumId, callback) {
    var sql = SQLs.getSQL('getImagesByAlbumId');
    var params = [albumId];

    /*
    if (size && size > 0) {
        sql += ' limit 0,?';
        params.push(size);
    }
    */

    pool.getConnection(function(err, conn) {
        conn.query(sql, params, function(error, results) {
            conn.release();
            callback.apply(this, arguments);
        });
    });

}
//随机获取图片
function getRandomImages(size, callback) {
    function randomNum(from, to) {
        return Math.random() * (to - from + 1) + from;
    }
    var sql = SQLs.getSQL('getRandomImages');
    var params = [parseInt(randomNum(0, 900).toFixed(0)), parseInt(size)];
    pool.getConnection(function(err, conn) {
        conn.query(sql, params, function(error, results) {
            conn.release();
            callback.apply(this, arguments);
        });
    });

}

//添加图片
function addImage(data, callback) {
    var createtime = DateHelper.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
    data['createtime'] = createtime;

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
            callback.apply(this, [{
                message: '参数不合法'
            }]);
            return;
        }
        params.push(item);
    }
    params.push(data['open_id']);
    params.push(data['from']);

    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            params,
            function(error, results) {
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });

}

function getImages(lastId, size, callback) {
    var sql = SQLs.getSQL('getImages');
    var params = [lastId, 0, size];
    pool.getConnection(function(err, conn) {
        conn.query(
            sql,
            params,
            function(error, results) {
                conn.release();
                callback.apply(this, arguments);
            }
        );
    });
}

exports.getAlbums = getAlbums;
exports.getImagesByAlbumId = getImagesByAlbumId;
exports.getRandomImages = getRandomImages;
exports.getImages = getImages;
exports.addImage = addImage;
