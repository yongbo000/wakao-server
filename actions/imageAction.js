var dbRobot = require('../dbRobot');
var imageDao = require('../dao/image/index');
var config = require('../config-sample');
var tool = require('../myTool');
var imageRobot = require('../lib/imageRobot');
var reg = config._reg_isvalid_id;

var rules = [];

//添加图片
function addImage(req, res) {
    if (!tool.rightRequest(req)) {
        res.send('what are you fucking doging');
        return;
    }
    imageDao.addImage(req.body, function(error, results) {
        if (error) {
            res.send('{"msg": "' + error.message + '"}');
        } else {
            if (results.affectedRows > 0) {
                res.send('{"msg": "success"}');
            } else {
                res.send('{"msg": "图片已存在"}');
            }
        }
    });
}
rules.push({
    pattern: '/image/add',
    method: 'post',
    action: addImage
});

//获取所有图片
function getImages(req, res) {
    var lastId = req.query['lastId'];
    if (lastId == undefined || !reg.test(lastId)) {
        res.send('what are you fucking doging');
        return;
    }
    imageDao.getImages(lastId, 20, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/images/get',
    method: 'get',
    action: getImages
});


//获取图片专辑
function getAlbums(req, res) {
    /*
    var size = req.query['size'];
    if (size == undefined || !reg.test(size)) {
        size = 10;
    }*/
    imageDao.getAlbums(function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/image/albums',
    method: 'get',
    action: getAlbums
});

//获取某专辑下所有图片
function getImagesByAlbumId(req, res) {
    var albumId = req.query['albumId'];
    if (albumId == undefined || !reg.test(albumId)) {
        res.send('what are you fucking doging');
        return;
    }
    imageDao.getImagesByAlbumId(albumId, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            res.send('{"data": ' + JSON.stringify(results) + '}');
        }
    });
}
rules.push({
    pattern: '/album-images/get',
    method: 'get',
    action: getImagesByAlbumId
});

//获取随机图片
function getRandomImages(req, res) {
    var callback = req.query['callback'];
    var size = req.query['size'];
    if (size == undefined || !reg.test(size)) {
        size = 20;
    }
    imageDao.getRandomImages(size, function(error, results) {
        if (error) {
            res.send('error:' + error.message);
        } else {
            var rs = [];
            rs.push(callback ? callback + '(' : '');
            rs.push('{"data": ' + JSON.stringify(results) + '}')
            rs.push(callback ? ')' : '');
            res.send(rs.join(''));
        }
    });
}
rules.push({
    pattern: '/random-images/get',
    method: 'get',
    action: getRandomImages
});

//图片裁剪
function crop(req, res) {
    var query = req.query;
    var params = {
        width: parseInt(query['width']),
        height: parseInt(query['height']),
        url: query['url']
    };
    imageRobot.crop(params, function(data) {
        res.writeHead(200, {
            'Content-Type': 'image/jpg'
        });
        res.end(data);
    });
}
rules.push({
    pattern: '/crop',
    method: 'get',
    action: crop
});
//图片缩略
function zoom(req, res) {
    var query = req.query;
    if (query['size'] == undefined || query['url'] == undefined || !reg.test(query['size']) || !/^http/.test(query['url'])) {
        res.send('fuck.');
        return;
    }
    var params = {
        size: parseInt(query['size']),
        url: query['url']
    };
    imageRobot.zoom(params, function(data) {
        res.writeHead(200, {
            'Content-Type': 'image/jpg'
        });
        res.end(data);
    });
}
rules.push({
    pattern: '/zoom',
    method: 'get',
    action: zoom
});

exports.getRules = function() {
    return rules;
};
