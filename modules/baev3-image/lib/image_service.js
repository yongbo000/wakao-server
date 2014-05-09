

/*
 * Image service API
 *
 */
var BaeImageTransform = require('./images/image_transform');
var BaeImageComposite = require('./images/image_composite');
var BaeImageQRCode = require('./images/image_QRCode');
var BaeImageVCode = require('./images/image_VCode');
var BaeImageAnnotate = require('./images/image_annotate');
var BaeImageConstant = require('./images/image_constant');
var util = require('util');
var assert = require('assert');
var crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var PROTOCOL_SCHEMA = 'http://';
var SERVER_HOST = 'imageui.api.bae.baidu.com';
var COMMON_PATH = '/rest/2.0/imageui/';
//var URL_HEADER = PROTOCOL_SCHEMA + SERVER_HOST;
var debug = false;

/*
 * error message
 */
var errMsg = {
  INVALID_ARGS: 'Arguments error',
  INVALID_CNAME: 'Arguments error: invalid cname, the length of queue_name must be less than 128B',
  INVALID_START: 'Arguments error: invalid start, start must be equal or greater than 0 ',
  INVALID_LIMIT: 'Arguments error: invalid limit, limit must be greater than 0 ',
  INVALID_VALUE: 'Arguments error: invalid value, type of value must be Number'
};


/*
 * To encode url
 * @param {String} host BCS server hostname
 * @returns {String} encoded url
 * @desc php urlencode is different from js, the way of BCMS server encode is same with php, so js need do some change
 */
function urlencode (str) {
  // http://kevin.vanzonneveld.net
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

/*
 * Get current time
 * @returns {Number} The current time in seconds since the Epoch
 */
function getTimestamp() {
    var timestamp = Math.floor(new Date().getTime() / 1000);
    return timestamp;
}

/*
 * sort Obj with abc
 */
function sortObj(obj) {
  var index = [];
  var tmpObj = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      index.push(i);
    }
  }
  index.sort();

  for(i = 0; i < index.length; i++){
    tmpObj[index[i]] = obj[index[i]];
  }
  return tmpObj;
}
/*
 * Generate sign
 * @see http://developer.baidu.com/wiki/index.php?title=docs/cplat/mq/sign
 * @param {String} method HTTP request method
 * @param {String} url HTTP request url
 * @param {Object} params HTTP request body
 * @param {String} sk User's secret key in bae
 * @returns {String} sign
 */
function getSign(method, url, params, sk) {
    var baseStr = method + url;

    for (var i in params) {
        baseStr += i + '=' + params[i];
    }

    baseStr += sk;
    //var encodeStr = encodeURIComponent(baseStr);
    var encodeStr = urlencode(baseStr);
    if (debug) {
        console.log('getSign: base str = ' + baseStr + ', encode str = ' + encodeStr);
    }

    var md5sum = crypto.createHash('md5');
    md5sum.update(encodeStr);

    var sign = md5sum.digest('hex');
    return sign;
}

/*
 * Common request
 * @param {Object} bodyArgs
 * @param {String} path Url path
 * @param {String} sk User's secret key in bae
 * @param {function} cb cb(err, result)
 */
function request(bodyArgs, path, sk, id, host, cb) {
    assert.ok(bodyArgs.client_id);
    assert.ok(bodyArgs.method);
    assert.ok(path);
    assert.ok(sk);

    bodyArgs.sign = getSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, sk);


    var bodyArgsArray = [];
    for (var i in bodyArgs) {
      if (bodyArgs.hasOwnProperty(i)) {
        bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]));
        }
    }
    var bodyStr = bodyArgsArray.join('&');


    //var bodyStr = querystring.stringify(bodyArgs);

    if (debug) {
        console.log('body length = ' + bodyStr.length + ', body str = ' + bodyStr);
    }

    var options = {
        host: host,
        method: 'POST',
        path: path,
        headers: {'Content-Length': bodyStr.length,
                  'Content-Type':'application/x-www-form-urlencoded'
                 }
    };

    var req = http.request(options, function (res) {
        if (debug) {
            console.log('status = ' + res.statusCode);
            console.log('res header = ');
            console.dir(res.headers);
        }

        var resBody = '';
        res.on('data', function (chunk) {
            resBody += chunk;
        });

        res.on('end', function () {
            if (debug) {
                console.log('res body: ' + resBody);
            }

            //var jsonObj = JSON.parse(resBody);
             try {
              var jsonObj = JSON.parse(resBody);
            } catch(e) {
              cb && cb(e);
              return;
            }
            var errObj = null;
            id.request_id = jsonObj['request_id'];
            if (res.statusCode != 200) {
                /* BCMS error */
                var error_code = 'Unknown';
                if (jsonObj['error_code'] !== undefined) {
                    error_code = jsonObj['error_code'];
                }

                var error_msg = 'Unknown';
                if (jsonObj['error_msg'] !== undefined) {
                    error_msg = jsonObj['error_msg'];
                }

                var request_id = 'Unknown';
                if (jsonObj['error_msg'] !== undefined) {
                    request_id = jsonObj['request_id'];
                }

                errObj = new Error('image error code: ' + error_code +
                                    ', error msg: ' + error_msg +
                                    ', request id: ' + request_id);
            }

            cb(errObj, jsonObj);
        });
    });

    req.on('error', function (e) {
        if (debug) {
            console.log('error : ' + util.inspect(e));
        }
        cb(e, null);
    });

    req.write(bodyStr);
    req.end();
}


/**
 * @name BaeImageService
 * @constructor
 * @param {Object} options Set ak/sk/host
 * @param {String} [options.ak] User API key
 * @param {String} [options.sk] User secret key
 * @param {String} [options.host] Image server host
 */

function BaeImageService(ak, sk, host){
  var self = this;
  var opt = {
    ak: ak,
    sk: sk,
    host: host
  }

  self.ak = opt.ak;
  self.sk = opt.sk;
  self.host = opt.host;
  self.request_id = null;

  self.procTypeAnnotate = 1;
  self.procTypeQRCode = 0;
  self.procTypeComposite = 2;
}

/**
 * Generate VCode
 * @param {Object} option
 * @param {Number(int)} option.len The length of VCode, range: 4-5
 * @param {Number(int)} option.pattern The pattern of VCode, range: 0-3
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.generateVCode = function (option, cb) {
  var self = this;
  var opt = {};
  option = option || {};

  var imageVCode = new BaeImageVCode();
  imageVCode.setLen(option.len);
  imageVCode.setPattern(option.pattern);
  
  opt = imageVCode.getOperations() || {};

  opt['vcservice'] = 0;    // generate VCode
  opt['client_id'] = self.ak;
  opt['method'] = 'process';
  opt['timestamp'] = getTimestamp();
  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}


/**
 * Verify VCode
 * @param {Object} option
 * @param {String} option.input The length of VCode, range: 4-5
 * @param {String} option.secret VCode secret, generate from generateVCode result, range: without restriction
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.verifyVCode = function (option, cb) {
  var self = this;
  var opt = {};
  option = option || {};

  var imageVCode = new BaeImageVCode();
  imageVCode.setInput(option.input);
  imageVCode.setSecret(option.secret);
  
  opt = imageVCode.getOperations() || {};

  opt['vcservice'] = 1;    // verify VCode
  opt['client_id'] = self.ak;
  opt['method'] = 'process';
  opt['timestamp'] = getTimestamp();
  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    if (result['response_params']['status'] !== 0) {
       errObj = new Error('image error code: ' + result['response_params']['status'] +
                                    ', error msg: ' + result['response_params']['str_reason'] +
                                    ', request id: ' + result['request_id']);
      cb && cb(errObj)
      return;
    }
    cb && cb(null, result);
  });
}



/**
 * Transform an image wiht imageTransform
 * @param {String} imageSource Just support URL
 * @param {BaeImageTransform} imageTransform
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyTransformByObject = function (imageSource, imageTransform, cb) {
  var self = this;
  var opt = {};

  _checkURL(imageSource);
  if (!imageTransform || !(imageTransform instanceof BaeImageTransform)) {
    var err = errMsg.INVALID_ARGS + ': [imageTransform] is not an instance of BaeImageTransform';
    throw new Error(err);
  }
  opt = imageTransform.getOperations();
  opt['src'] = imageSource;
  opt['client_id'] = self.ak;
  opt['method'] = 'process';
  opt['timestamp'] = getTimestamp();
  // opt['expires'] = getTimestamp();
  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}

/**
 * Transform an image with option
 * @param {String} imageSource Just support URL
 * @param {Object} option Transform option, refer to BaeImageTransform construct parameter settings
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyTransform = function (imageSource, option, cb) {
  this.applyTransformByObject(imageSource, new BaeImageTransform(option), cb);
}


/**
 * Generate QRCode
 * @param {BaeImageQRcode} imageQRCode
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyQRCodeByObject = function (imageQRCode, cb) {
  var self = this;
  var opt = {};
  var arrOperations = [];

  if (!imageQRCode || !(imageQRCode instanceof BaeImageQRCode)) {
    var err = errMsg.INVALID_ARGS + ': [imageQRCode] is not an instance of BaeImageQRCode';
    throw new Error(err);
  }

  arrOperations[0] = imageQRCode.getOperations() || {};
  if (!arrOperations[0].text) {
    var err = errMsg.INVALID_ARGS + ': no script text';
    throw new Error(err);
  }
  arrOperations[0].text = base64Encode(arrOperations[0].text);
  arrOperations[0].isURL = false;
  arrOperations[0].dataType = 0;

  var dataNum = 1;
  var defaultOperations = {
      size: 3,
      version: 0,
      margin: 4,
      level: 2,
      foreground: '000000',
      background: 'FFFFFF'
  }

  opt['strudata'] = _generateStrudata(arrOperations, dataNum, defaultOperations, self.procTypeQRCode);
  opt['client_id'] = self.ak;
  opt['method'] = 'processExt';
  opt['timestamp'] = getTimestamp();
  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}

/**
 * Generate QRCode with option
 * @param {Object} option QRCode option, refer to BaeImageQRCode construct parameter settings
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyQRCode = function (option, cb) {
  this.applyQRCodeByObject(new BaeImageQRCode(option), cb);
}

/**
 * Generate annontate
 * @param {String} imageSource Just support URL
 * @param {BaeImageAnnotate} imageAnnotate
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyAnnotateByObject = function (imageSource, imageAnnotate, cb) {
  var self = this;
  var opt = {};
  var arrOperations = [];

  _checkURL(imageSource);
  if (!imageAnnotate || !(imageAnnotate instanceof BaeImageAnnotate)) {
    var err = errMsg.INVALID_ARGS + ': [imageAnnotate] is not an instance of BaeImageAnnotate';
    throw new Error(err);
  }

  arrOperations[0] = imageAnnotate.getOperations() || {};
  if (!arrOperations[0].text) {
    var err = errMsg.INVALID_ARGS + ': no script text';
    throw new Error(err);
  }
  arrOperations[0].isURL = true;
  arrOperations[0].dataType = 1;
  arrOperations[0].imageSource = imageSource;
  
  // set color in format for '#000000FF'
  if (arrOperations[0].font_color) {
    var opacity = arrOperations['opacity'] || 0.0;
    arrOperations[0].font_color += dec2hex(Math.ceil(255 - opacity * 255), 2).toUpperCase();
  }

  var base64_text = new Buffer(arrOperations[0]['text']);
  arrOperations[1] = {};
  arrOperations[1].text = base64_text.toString('base64');
  arrOperations[1].isURL = false;
  arrOperations[1].dataType = 0;


  var dataNum = 2;
  var defaultOperations = {
    desttype: 0,
    quality: 80,
    x_offset: 0,
    y_offset: 0,
    font_name: BaeImageConstant.SUN,
    font_color: '#000000FF',
    font_size: 25,
  }

  opt['strudata'] = _generateStrudata(arrOperations, dataNum, defaultOperations, self.procTypeAnnotate);
  opt['client_id'] = self.ak;
  opt['method'] = 'processExt';
  opt['timestamp'] = getTimestamp();

  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}


/**
 * Generate Annotate with option
 * @param {String} imageSource Just support URL
 * @param {Object} option Annotate option, refer to BaeImageAnnotate construct parameter settings
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyAnnotate = function (imageSource, option, cb) {
  this.applyAnnotateByObject(imageSource, new BaeImageAnnotate(option), cb);
}

/**
 * Composite images
 * @param {Object} option
 * @param {Array} option.imageComposites The consist of BaeImageComposite object The length of imageComposites must >= 2
 * @param {Object} option.canvas Make up of canvas.with and canvas.height, Range: 0-10000
 * @param {Number(BaeImageConstant)} option.outputCode Range: 0-3
 * @param {Number(int)} option.quality Range: 0-100
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyCompositeByObject = function (option, cb) {
  var self = this;
  var opt = {};
  var arrOperations = [];
  option = option || {};

  var arrImageComposite = option.imageComposites;
  if (!isArray(arrImageComposite) || arrImageComposite.length < 2) {
    var err = errMsg.INVALID_ARGS + ': short of images, at least two elements';
      throw new Error(err);
  }

  arrImageComposite.forEach(function(imageComposite){
    if (!imageComposite || !(imageComposite instanceof BaeImageComposite)) {
      var err = errMsg.INVALID_ARGS + ': [imageAnnotate] is not an instance of BaeImageAnnotate';
      throw new Error(err);
    }
    imageComposite._setCanvas(option.canvas || {width: 0, height: 0});
    imageComposite._setOutputCode(option.outputCode || BaeImageConstant.JPG);
    imageComposite._setQuality(option.quality || 80);
    var operations = imageComposite.getOperations()
    operations.isURL = true;
    operations.imageSource = imageComposite.getImageSource();
    operations.dataType = 1;
    arrOperations.push(operations);
  });

  var dataNum = arrImageComposite.length;
  var defaultOperations = {

    desttype: 0,
    quality: 80,
    canvas_width: 0,
    canvas_height: 0,
    x_offset: 0,
    y_offset: 0,
    anchor_point: 0,
    opacity: 0.0
  }

  opt['strudata'] = _generateStrudata(arrOperations, dataNum, defaultOperations, self.procTypeComposite);

  opt['client_id'] = self.ak;
  opt['method'] = 'processExt';
  opt['timestamp'] = getTimestamp();
  var path = COMMON_PATH + 'resource';
  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;

    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}

/**
 * Composite images
 * @param {Object} option
 * @param {Array} option.imageCompositeOptionArr ImageComposite option, the length of options array must be more than 2, refer to BaeImageComposite construct parameter settings
 * @param {Object} option.canvas Make up of canvas.with and canvas.height, Range: 0-10000
 * @param {Number(BaeImageConstant)} option.outputCode Range: 0-3
 * @param {Number(int)} option.quality Range: 0-100
 * @param {function} cb cb(err, result)
 */
BaeImageService.prototype.applyComposite = function (option, cb) {

  var options = {};

  var imageComposites = [];
  if (!isArray(option.imageCompositeOptionArr) || option.imageCompositeOptionArr.length < 2) {
    var err = errMsg.INVALID_ARGS + ': [option.imageCompositeOptionArr] must be type of Array and at least two elements';
      throw new Error(err);
  }
  option.imageCompositeOptionArr.forEach(function(ele) {
    imageComposites.push(new BaeImageComposite(ele));
  });
  options['imageComposites'] = imageComposites;
  options['canvas'] = option['canvas'];
  options['outputCode'] = option['outputCode'];
  options['quality'] = option['quality'];
  this.applyCompositeByObject(options, cb);
}


/**
 * Get lastest request_id
 * @return {Number} request_id
 */
BaeImageService.prototype.getRequestId = function () {
  var self = this;
  return self.request_id;
}


/*
 * Check URL
 * @param {String} url
 */
function _checkURL(url) {
  _checkStr(url, 'url', 0, 2048);
  var regURL = /^(http[s]?:\/\/){1}[.]*/;
  if (!regURL.test(url)) {
    var err = errMsg.INVALID_ARGS + ': ['+ url +'] is invalid image source url';
    throw new Error(err);
  }
}

/*
 * Check string
 * @param {String} value
 * @param {String} prompt
 * @param {Number} minValue
 * @param {Number} maxValue
 */
function _checkStr(value, prompt, minValue, maxValue) {

  if (typeof value !== 'string') {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter not a string';
    throw new Error(err);
  }
  if (value < minValue) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter less than minimum';
    throw new Error(err);
  }
  if (value > maxValue) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter greater than maximum';
    throw new Error(err);
  }
}

function _generateStrudata(arrOperations, dataNum, defaultOperations, procType) {
  var data = {}, i, j;

  data['process_type'] = procType.toString();
  data['req_data_num'] = dataNum.toString();
  data['req_data_source'] = [];
  data['source_data'] = {};

  for (i = 0; i < dataNum; i++) {
    data['req_data_source'][i] = {};
    if(arrOperations[i].isURL) {
      data['req_data_source'][i]['sourcemethod'] = 'GET';
      data['req_data_source'][i]['source_url'] = arrOperations[i].imageSource;
    } else {
      data['req_data_source'][i]['sourcemethod'] = 'BODY';
      data['source_data']['data' + 1] = arrOperations[i].text;
    }
    data['req_data_source'][i]['source_data_type'] = arrOperations[i].dataType;
    data['req_data_source'][i]['operations'] = {};

    for (j in defaultOperations) {
      if (defaultOperations.hasOwnProperty(j)) {
        data['req_data_source'][i]['operations'][j] = arrOperations[i][j] || defaultOperations[j];
      }
    }
  }

  // if annotate image, req_data_source[1].operations = {};
  if (procType === 1) {
    data['req_data_source'][1]['operations'] = {};
  }

  // console.log(JSON.stringify(data));
  return JSON.stringify(data);

}


function dec2hex(dec, len) {
  var hex = dec.toString(16);
  while(hex.length < len) {
    hex = '0' + hex;
  }
  return hex;
}

function base64Encode(text) {
  var buf = new Buffer(text);
  return buf.toString('base64');
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

module.exports = BaeImageService;
