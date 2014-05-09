/**
 * Image VCode
 */
var BaeImageConstant = require('./image_constant');

/**
 * @constructor
 */

function BaeImageVCode() {
  this.settings = {};
  this.text = '';
  this.secret = '';

}

/**
 * Set the bits of the verification code
 * @param {Number(int)} len Range: 4-5
 */
BaeImageVCode.prototype.setLen = function (len) {
  var self = this;
  _checkInt(len, 'verification code len', 4, 5);
  self.settings['len'] = len;
}
BaeImageVCode.prototype.set_len = BaeImageVCode.prototype.setLen;

/**
 * Get operations of VCode
 */
BaeImageVCode.prototype.getOperations = function () {
  return this.settings;
}

/**
 * Set the pattern of the verification code
 * @param {Number(int)}  Range: 0-3
 */
BaeImageVCode.prototype.setPattern = function (pattern) {
  var self = this;
  _checkInt(pattern, 'verification code pattern', 0, 3);
  self.settings['setno'] = pattern ;
}
BaeImageVCode.prototype.set_pattern = BaeImageVCode.prototype.setPattern;

/**
 * Set the input of the verification code
 * @param {String} input Range: 4-5
 */
BaeImageVCode.prototype.setInput = function (input) {
  var self = this;
  _checkStr(input, 'verification code input', 4, 5);
  self.settings['input'] = input ;
  self.text = input;
}
BaeImageVCode.prototype.set_input = BaeImageVCode.prototype.setInput;

/**
 * Set the secret text of the verification code
 * @param {String} sercret Range: without restriction
 */
BaeImageVCode.prototype.setSecret = function (secret) {
  var self = this;
  _checkStr(secret, 'verification code secret', 1, Number.MAX_VALUE);
  self.settings['vcode'] = secret;
  self.secret = secret;
}
BaeImageVCode.prototype.set_secret = BaeImageVCode.prototype.setSecret;

BaeImageVCode.prototype.getInput = function () {
  return this.text;
}

BaeImageVCode.prototype.getSecret = function () {
  return this.secret;
}

/**
 * Clear operations
 */
BaeImageVCode.prototype.clearOperations = function() {
  var self = this;
  self.settings = {};
}


/*
 * Check options
 * @param {Object} options
 * @param {Array} must
 */
function _checkOptions(options, must) {

  must.forEach(function (ele) {
    if (!options.hasOwnProperty(ele)) {
      var err = errMsg.INVALID_ARGS + ': ' + ele + ' is must';
      throw new Error(err);
    }
  });
}

/*
 * Check int
 * @param {Number} value
 * @param {String} prompt
 * @param {Number} minValue
 * @param {Number} maxValue
 */
function _checkInt(value, prompt, minValue, maxValue) {
  var regInt = /^-?\d+$/;
  if (typeof value !== 'number' || !regInt.test(value)) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter not an integer';
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
/*
 * Check string
 * @param {String} value
 * @param {String} prompt
 * @param {Number} minValue
 * @param {Number} maxValue
 */
function _checkFloat(value, prompt, minValue, maxValue) {
  var regFloat = /^(-?\d+)(\.\d+)?$/;

  if (typeof value !== 'number' || !regFloat.test(value)) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter not a float';
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
  if (value.length < minValue) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter less than minimum';
    throw new Error(err);
  }
  if (value.length > maxValue) {
    var err = errMsg.INVALID_ARGS + ': [' + prompt + '] parameter greater than maximum';
    throw new Error(err);
  }
}

/*
 * Check RGB
 * @param {String} color The RGB string of 6 bit, like this: '0F0F0F'
 */
function _checkRGB(color) {
  _checkStr(color, 'RGB', 6, 6);
  var regRGB = /[AaBbCcDdEeFf0123456789]{6}/;
  if (!regRGB.test(color)) {
    var err = errMsg.INVALID_ARGS + ': ['+ color +'] is invalid RGB color';
    throw new Error(err);
  }
}

/*
 * error message
 */
var errMsg = {
  INVALID_ARGS: 'Arguments error'
  
};

module.exports = exports = BaeImageVCode;