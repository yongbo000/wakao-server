/**
 * Image Annotate
 */
var BaeImageConstant = require('./image_constant');

/**
 * @constructor
 * @param {Object} option
 * @param {String} option.text Set the text script, refer to setText parameter settings
 * @param {Number(float)} option.opacity Set opacity, refer to setOpacity parameter settings
 * @param {Object} option.font refer to setFont parameter settings
 * @param {Object} option.position Set position, refer to setPosition parameter settings
 * @param {Number(BaeImageConstant)} option.outputCode Set outputCode, refer to setOutputCode parameter settings
 * @param {Number(int)} option.quality Set quality, refer to setQuality parameter settings
 */

function BaeImageAnnotate(option) {
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
 * Set text script of annotation
 * @param {String} text Range: 1-500 characters
 */
BaeImageAnnotate.prototype.setText = function (text) {
  var self = this;
  _checkStr(text, 'annotation text', 1, 500 );
  self.text = text;
  self.settings['text'] = text;
}
BaeImageAnnotate.prototype.set_text = BaeImageAnnotate.prototype.setText;

/**
 * Get text script of annotation
 */
BaeImageAnnotate.prototype.getText = function () {
  return this.text;
}

/**
 * Get operations of annotation
 */
BaeImageAnnotate.prototype.getOperations = function () {
  return this.settings;
}

/**
 * Set the opacity of an image
 * @param {Number(float)} opacity Range: 0-1
 */
BaeImageAnnotate.prototype.setOpacity = function (opacity) {
  var self = this;

  _checkFloat(opacity, 'annotation opacity', 0, 1);
  self.settings['opacity'] = opacity;
}
BaeImageAnnotate.prototype.set_opacity = BaeImageAnnotate.prototype.setOpacity;

/**
 * Set Font option
 * @param {Object} option The options of font
 * @param {Number(BaeImageConstant)} [option.name] Default: 0 (SUN)
 * @param {Number(int)} [option.size] The size of font, range: 0-1000, default: 5
 * @param {String(color)} [option.color] Range: 6 bits RGB, default: '000000'
 */
BaeImageAnnotate.prototype.setFont = function (option) {
  var self = this;
  var options = option || {};

  var name = options.name || BaeImageConstant.SUN;
  var size = options.size || 25;
  var color = options.color || '000000';

  _checkInt(name, 'font name', 0, 4);
  _checkInt(size, 'font size', 0, 1000);
  _checkRGB(color);
  self.settings['font_name'] = name;
  self.settings['font_color'] = '#' + color;
  self.settings['font_size'] = size;
}
BaeImageAnnotate.prototype.set_font = BaeImageAnnotate.prototype.setFont;

/**
 * Set position of the text script
 * @param {Object} option The options of position
 * @param {Number(int)} option.x_offset Range: 0-width of the image
 * @param {Number(int)} option.y_offset Range: 0-height of the image
 */
BaeImageAnnotate.prototype.setPosition = function (option) {
  var self = this;
  var options = option || {};
  _checkOptions(options, ['x_offset', 'y_offset']);
  _checkInt(options.x_offset, 'x_offset', 0, Number.MAX_VALUE);
  _checkInt(options.y_offset, 'y_offset',0, Number.MAX_VALUE);

  self.settings['x_offset'] = options.x_offset;
  self.settings['y_offset'] = options.y_offset;
}
BaeImageAnnotate.prototype.set_position = BaeImageAnnotate.prototype.setPosition;

/**
 * Set the output image type
 * @param {Number(BaeImageConstant)} outputCode Support JPG/GIF/BMP/PNG/WEBP
 */
BaeImageAnnotate.prototype.setOutputCode = function (outputCode) {
  var self = this;
  _checkInt(outputCode, 'outputCode', 0, 4);
  self.settings['desttype'] = outputCode;
}
BaeImageAnnotate.prototype.set_outputCode = BaeImageAnnotate.prototype.setOutputCode;

/**
 * Setting the quality of output image
 * @param {Number(int)} [quality] The quality value, range: 0-100, default value: 80
 */
BaeImageAnnotate.prototype.setQuality = function (quality) {
  var self = this;
  var realQuality = quality || 60;

  _checkInt(realQuality, 'quality', 0, 100);
  self.settings['quality'] = realQuality;
}
BaeImageAnnotate.prototype.set_quality = BaeImageAnnotate.prototype.setQuality;

/**
 * Clear operations
 */
BaeImageAnnotate.prototype.clearOperations = function() {
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

module.exports = exports = BaeImageAnnotate;