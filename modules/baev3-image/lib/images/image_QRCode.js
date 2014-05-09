/*
 * Image QRCode
 * @author: zhangyaodong@baidu.com
 */

var BaeImageConstant = require('./image_constant');

/**
 * @constructor
 * @param {Object} [option]
 * @param {String} option.text Set the text script, refer to setText parameter settings
 * @param {Number(int)} option.version Set version, refer to setVersion parameter settings
 * @param {Number(int)} option.size Set size, refer to setSize parameter settings
 * @param {Number(int)} option.level Set level, refer to setLevel parameter settings
 * @param {Number(int)} option.margin Set margin, refer to setMargin parameter settings
 * @param {String(RGB)} option.foreground Set foreground, refer to setForeground parameter settings
 * @param {String(RGB)} option.background Set background, refer to setBackground parameter settings
 */

function BaeImageQRCode(option) {
  this.settings = {};
  this.text = '';
  var options = option || {};

  // set options
  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      if (typeof this['set_' + i] === 'function') {
        this['set_' + i](options[i]);        
      }
    }
  }
}

/**
 * Set the text script
 * @param {String} text The text script to generate QR, range: 1-500 characters
 */
BaeImageQRCode.prototype.setText = function (text) {
  var self = this;
  // TODO: Change UTF-8 to GBK???
  _checkStr(text, 'QRCode text', 1, 500);
  self.text = text;
  self.settings['text'] = text;
}
BaeImageQRCode.prototype.set_text = BaeImageQRCode.prototype.setText;

/**
 * Get text script of QRCode
 */
BaeImageQRCode.prototype.getText = function () {
  return this.text;
}

/**
 * Get operations of QRCode
 */
BaeImageQRCode.prototype.getOperations = function () {
  return this.settings;
}

/**
 * Set the version of the QR code
 * @param {Number(int)} version Range: 0-30
 */
BaeImageQRCode.prototype.setVersion = function (version) {
  var self = this;
  _checkInt(version, 'version', 0, 30);
  self.settings['version'] = version;
}
BaeImageQRCode.prototype.set_version = BaeImageQRCode.prototype.setVersion;

/**
 * Set the size of the QR code
 * @param {Number(int)} size Range: 1-100
 */
BaeImageQRCode.prototype.setSize = function (size) {
  var self = this;
  _checkInt(size, 'size', 1, 100);
  self.settings['size'] = size;
}
BaeImageQRCode.prototype.set_size = BaeImageQRCode.prototype.setSize;

/**
 * Set the error correction level of the QR code
 * @param {Number(int)} level Range: 1-4
 */
BaeImageQRCode.prototype.setLevel = function (level) {
  var self = this;
  _checkInt(level, 'level', 1, 4);
  self.settings['level'] = level;
}
BaeImageQRCode.prototype.set_level = BaeImageQRCode.prototype.setLevel;

/**
 * Set the margin of the QR code
 * @param {Number(int)} margin Range: 1-100
 */
BaeImageQRCode.prototype.setMargin = function (margin) {
  var self = this;
  _checkInt(margin, 'margin', 1, 100);
  self.settings['margin'] = margin;
}
BaeImageQRCode.prototype.set_margin = BaeImageQRCode.prototype.setMargin;

/**
 * Set the foreground color of QR code
 * @param {String(RGB)} foreground Range: 6 bits RGB
 */
BaeImageQRCode.prototype.setForeground = function (foreground) {
  var self = this;
  _checkRGB(foreground);
  self.settings['foreground'] = foreground;
}
BaeImageQRCode.prototype.set_foreground = BaeImageQRCode.prototype.setForeground;

/**
 * Set the background color of QR code
 * @param {String(RGB)} background Range: 6 bits RGB
 */
BaeImageQRCode.prototype.setBackground = function (background) {
  var self = this;
  _checkRGB(background);
  self.settings['background'] = background;
}
BaeImageQRCode.prototype.set_background = BaeImageQRCode.prototype.setBackground;

/**
 * Clear operations
 */
BaeImageQRCode.prototype.clearOperations = function() {
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

module.exports = exports = BaeImageQRCode;