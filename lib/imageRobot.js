var http = require('http');
var config = require('../config-sample');
var BaeImage = require('../modules/baev3-image');
var BaeImageTransform = BaeImage.Transform;
var BaeImageConstant = BaeImage.Constant;
var BaeImageService = BaeImage.Service;

var hostname = 'image.duapp.com'
var ak = 'OqIG5KgoaGqVPeHghtkYTGaq';
var sk = 'qalD337NHjfPjKBXjsNG70BZwMGdeHH6';

var option = {
  host: hostname,
  ak: config.ak,
  sk: config.sk
}

//var imageService = new BaeImageService(option);
var imageService = new BaeImageService(ak, sk, hostname);

function crop(params, fn) {
    var imageTrans = new BaeImageTransform();
    imageTrans.setCropping({
        x: 0,
        y: 0,
        width: params.width,
        height: params.height
    });
    // 返回base64编码的图片
    imageService.applyTransformByObject(params.url, imageTrans, function (err, result) {
        if (err) {
            fn(err);
        } else {
            var data = new Buffer(result['response_params'].image_data, 'base64');
            fn(data);
        }
    });
}

function zoom(params, fn) {
    var imageTrans = new BaeImageTransform();
    imageTrans.setZooming({
        zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_WIDTH,
        size: params.size
    });

    // 返回base64编码的图片
    imageService.applyTransformByObject(params.url, imageTrans, function (err, result) {
        if (err) {
            fn(err);
        } else {
            var data = new Buffer(result['response_params'].image_data, 'base64');
            fn(data);
        }
    });
}

exports.crop = crop;
exports.zoom = zoom;
