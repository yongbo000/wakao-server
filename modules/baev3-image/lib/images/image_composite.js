/**
 * Image Composite
 */
var BaeImageConstant = require('./image_constant');

/**
 * @constructor
 * @param {Object} [option]
 * @param {String(URL)} option.imageSource Set the image source, refer to setImage parameter settings
 * @param {Number(float)} option.opacity Set opacity, refer to setOpacity parameter settings
 * @param {Object} option.position Set position, refer to setPosition parameter settings
 * @param {Number(BaeImageConstant)} option.anchor Set anchor, refer to setAnchor parameter settings
 */

function BaeImageComposite(option) {
  this.settings = {};
  this.imageSource = '';  // Now just suport URL
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
 * Set the image source
 * @param {String(URL)} imageSource Image source URL
 */
BaeImageComposite.prototype.setImageSource = function (imageSource) {
  var self = this;

  _checkURL(imageSource);
  self.imageSource = imageSource;
}
BaeImageComposite.prototype.set_imageSource = BaeImageComposite.prototype.setImageSource;

/**
 * Get imageSource
 */
BaeImageComposite.prototype.getImageSource = function () {
  return this.imageSource;
}

/**
 * Get operations of Composite
 */
BaeImageComposite.prototype.getOperations = function () {
  return this.settings;
}

/**
 * Set position of the image apart from anchor point
 * @param {Object} option The position option
 * @param {Number(int)} option.x_offset Range: without restriction
 * @param {Number(int)} option.y_offset Range: without restriciton
 */
BaeImageComposite.prototype.setPosition = function (option) {
  var self = this;
  var options = option || {};
  _checkOptions(options, ['x_offset', 'y_offset']);
  _checkInt(options.x_offset, 'Composite x_offset', -Number.MAX_VALUE, Number.MAX_VALUE);
  _checkInt(options.y_offset, 'Composite y_offset', -Number.MAX_VALUE, Number.MAX_VALUE);
  self.settings['x_offset'] = options.x_offset;
  self.settings['y_offset'] = options.y_offset;
}
BaeImageComposite.prototype.set_position = BaeImageComposite.prototype.setPosition;

/**
 * Set opacity of the image
 * @param {Number(float)} opacity Range: 0-1
 */
BaeImageComposite.prototype.setOpacity = function (opacity) {
  var self = this;

  _checkFloat(opacity, 'Composite opacity', 0.0, 1.0);
  self.settings['opacity'] = opacity;
}
BaeImageComposite.prototype.set_opacity = BaeImageComposite.prototype.setOpacity;

/**
 * Set anchor point of the image
 * @param {Number(BaeImageConstant)} anchor Range: 0-8
 */
BaeImageComposite.prototype.setAnchor = function (anchor) {
  var self = this;

  _checkInt(anchor, 'Composite anchor', 0, 8);
  self.settings['anchor_point'] = anchor ;
}
BaeImageComposite.prototype.set_anchor = BaeImageComposite.prototype.setAnchor;


/**
 * Set the output image type
 * @param {Number(BaeImageConstant)} outputCode Support JPG/GIF/BMP/PNG
 * @private
 */
BaeImageComposite.prototype._setOutputCode = function (outputCode) {
  var self = this;
  _checkInt(outputCode, 'Composite outputCode', 0, 3);
  self.settings['desttype'] = outputCode;
}

/**
 * Setting the quality of output image
 * @param {Number(int)} [quality] The quality value, range: 1-100, default value: 80
 * @private
 */
BaeImageComposite.prototype._setQuality = function (quality) {
  var self = this;
  var realQuality = quality || 80;

  _checkInt(realQuality, 'Composite quality', 0, 100);
  self.settings['quality'] = realQuality;
}

/**
 * Set canvas of composite image
 * @param {Object} option
 * @param {Number(int)} option.width Range: 0-10000
 * @param {Number(int)} option.height Range: 0-10000
 * @private
 */
BaeImageComposite.prototype._setCanvas = function (option) {
  var self = this;
  _checkInt(option.width, 'Composite canvas width', 0, 10000);
  _checkInt(option.height, 'Composite canvas height', 0, 10000);
  self.settings['canvas_width'] = option.width;
  self.settings['canvas_height'] = option.height;
}


/**
 * Clear operations
 */
BaeImageComposite.prototype.clearOperations = function() {
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
 * error message
 */
var errMsg = {
  INVALID_ARGS: 'Arguments error',
  INVALID_CNAME: 'Arguments error: invalid cname, the length of queue_name must be less than 128B',
  INVALID_START: 'Arguments error: invalid start, start must be equal or greater than 0 ',
  INVALID_LIMIT: 'Arguments error: invalid limit, limit must be greater than 0 ',
  INVALID_VALUE: 'Arguments error: invalid value, type of value must be Number'
};

module.exports = exports = BaeImageComposite;