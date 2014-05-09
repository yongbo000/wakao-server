/**
 * Image Transform
 */
var BaeImageConstant = require('./image_constant');

/**
 * @constructor
 * @param {Object} [option]
 * @param {Object} option.zooming Set zooming, refer to setZooming parameter settings
 * @param {Object} option.cropping Set cropping, refer to setCropping parameter settings
 * @param {Number(int)} option.rotation Set rotation, refer to setRotation parameter settings
 * @param {Number(int)} option.hue Set hue, refer to setHue parameter settings
 * @param {Number(int)} option.lightness Set lightness, refer to setLightness parameter settings
 * @param {Number(int)} option.contrast Set contrast, refer to setContrast parameter settings
 * @param {Number(int)} option.sharpness Set sharpness, refer to setSharpness parameter settings
 * @param {Number(int)} option.saturation Set saturation, refer to setSaturation parameter settings
 * @param {Object} option.transcoding Set transcoding, refer to setTranscoding parameter settings
 * @param {Number(int)} option.quality Set quality, refer to setQuality parameter settings
 */

function BaeImageTransform(option) {
  this.settings = {};
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
 * Get operations of transform
 */
BaeImageTransform.prototype.getOperations = function () {
  return this.settings;
}

/**
 * Set Zooming
 * @param {Object} option
 * @param {Number(BaeImageConstant)} option.zoomingType The zooming type,including height/width/pixel/unratio
 * @param {Number(int)} option.size The zooming value, width: 0-10000 height: 0-10000 pixel: 0-1000000 unratio: 0-10000
 * @param {Number(int)} [option.height] Just be used for unratio type of zooming, range: 0-10000
 */
BaeImageTransform.prototype.setZooming = function (option) {
  var self = this;
  var options = option || {};

  _checkOptions(options, ['zoomingType', 'size']);

  switch (options.zoomingType) {
    case BaeImageConstant.TRANSFORM_ZOOMING_TYPE_HEIGHT:
    _checkInt(options.size, 'zooming height' , 0, 10000);
    self.settings['size'] =  'b0_' +  options.size;
    break;
    case BaeImageConstant.TRANSFORM_ZOOMING_TYPE_WIDTH:
    _checkInt(options.size, 'zooming width' , 0, 10000);
    self.settings['size'] =  'b' +  options.size + '_0';
    break;
    case BaeImageConstant.TRANSFORM_ZOOMING_TYPE_PIXELS:
    _checkInt(options.size, 'zooming pixels' , 0, 1000000);
    self.settings['size'] =  'p' +  options.size;
    break;
    case BaeImageConstant.TRANSFORM_ZOOMING_TYPE_UNRATIO:
    var height = options.height || 0;
    _checkInt(options.size, 'zooming unratio' , 0, 10000);
    _checkInt(height, 'zooming height(unratio)', 0, 10000);
    self.settings['size'] = 'u' + options.size + '_' + height;
    break;
    default:
    var err = errMsg.INVALID_ARGS + ': invalid zooming type parameters';
    throw new Error(err);
  }

}
BaeImageTransform.prototype.set_zooming = BaeImageTransform.prototype.setZooming;

/**
 * Cropping an image
 * @param {Object} option
 * @param {Number(int)} option.x Start with x coordinates, range: 0-10000
 * @param {Number(int)} option.y Start with y coordinates, range: 0-10000
 * @param {Number(int)} option.width End with x+width, range: 0-10000
 * @param {Number(int)} option.height End with y+height, range:0-10000
 */
BaeImageTransform.prototype.setCropping = function (option) {
  var self = this;
  var options = option || {};

  _checkOptions(options, ['x','y', 'width', 'height']);

  _checkInt(options.x, 'cropping x', 0, 10000);
  _checkInt(options.y, 'cropping y', 0, 10000);
  _checkInt(options.width, 'cropping width', 0, 10000);
  _checkInt(options.height, 'cropping height', 0, 10000);

  self.settings['cut_x'] = options.x;
  self.settings['cut_y'] = options.y;
  self.settings['cut_w'] = options.width;
  self.settings['cut_h'] = options.height;
}
BaeImageTransform.prototype.set_cropping = BaeImageTransform.prototype.setCropping;


/**
 * Rotate an image with any degree
 * @param {Number(int)} degree The rotating value, range: 0-360
 */
BaeImageTransform.prototype.setRotation = function (degree) {
  var self = this;

  _checkInt(degree, 'rotate', 0, 360);
  self.settings['rotate'] = degree;
}
BaeImageTransform.prototype.set_rotation = BaeImageTransform.prototype.setRotation;

/**
 * Setting the hue of an image
 * @param {Number(int)} hue The hue value, range: 1-100
 */
BaeImageTransform.prototype.setHue = function (hue) {
  var self = this;

  _checkInt(hue, 'hue', 1, 100);
  self.settings['hue'] = hue;
}
BaeImageTransform.prototype.set_hue = BaeImageTransform.prototype.setHue;

/**
 * Setting the lightness of an image
 * @param {Number(int)} lightness The lightness value, range: bigger than 1
 */
BaeImageTransform.prototype.setLightness = function (lightness) {
  var self = this;

  _checkInt(lightness, 'lightness', 1, Number.MAX_VALUE);
  self.settings['lightness'] = lightness;
}
BaeImageTransform.prototype.set_lightness = BaeImageTransform.prototype.setLightness;

/**
 * Setting the contrast of an image
 * @param {Number(int)} contrast The contrast value, 0 for degenerate, 1 for enhance
 */
BaeImageTransform.prototype.setContrast = function (contrast) {
  var self = this;

  _checkInt(contrast, 'contrast', 0, 1);
  self.settings['contrast'] = contrast;
}
BaeImageTransform.prototype.set_contrast = BaeImageTransform.prototype.setContrast;

/**
 * Setting the sharpness of an image
 * @param {Number(int)} sharpness The sharpness value, 1-100 for sharpen, 101-200 for vague
 */
BaeImageTransform.prototype.setSharpness = function (sharpness) {
  var self = this;

  _checkInt(sharpness, 'sharpness', 1, 200);
  self.settings['sharpen'] = sharpness;
}
BaeImageTransform.prototype.set_sharpness = BaeImageTransform.prototype.setSharpness;

/**
 * Setting the saturation of an image
 * @param {Number(int)} saturation The saturation value, range: 1-100
 */
BaeImageTransform.prototype.setSaturation = function (saturation) {
  var self = this;

  _checkInt(saturation, 'saturation', 1, 100);
  self.settings['saturation'] = saturation;
}
BaeImageTransform.prototype.set_saturation = BaeImageTransform.prototype.setSaturation;

/**
 * Transcoding the output image with a given type
 * @param {Object} options
 * @param {Number(BaeImageConst)} options.imageType Support by GIF/JPG/WEBP/PNG
 * @param {Number(int)} options.quality The quality of an image, range: 0-100
 */
BaeImageTransform.prototype.setTranscoding = function (option) {
  var self = this;
  var options = option || {};
  var quality = options.quality || 60;

  _checkOptions(options, ['imageType']);

  if (typeof options.imageType !== 'number') {
    var err = errMsg.INVALID_ARGS + ': invalid image type parameters';
    throw new Error(err);
  }
  switch (options.imageType) {
    case BaeImageConstant.GIF:
    _checkInt(quality, 'quality' , 0, 100);
    self.settings['quality'] =  quality;
    self.settings['imgtype'] = 2;
    break;
    case BaeImageConstant.JPG:
    _checkInt(quality, 'quality' , 0, 100);
    self.settings['quality'] =  quality;
    self.settings['imgtype'] = 1;
    break;
    case BaeImageConstant.PNG:
    self.settings['imgtype'] =  3;
    break;
    case BaeImageConstant.WEBP:
    self.settings['imgtype'] =  4;
    break;

    default:
    var err = errMsg.INVALID_ARGS + ': invalid image type parameters';
    throw new Error(err);
  }
}
BaeImageTransform.prototype.set_transcoding = BaeImageTransform.prototype.setTranscoding;

/**
 * Setting the quality of an image
 * @param {Number} [quality] The quality value, range: 0-100, default value: 60
 */
BaeImageTransform.prototype.setQuality = function (quality) {
  var self = this;
  var realQuality = quality || 60;

  _checkInt(realQuality, 'quality', 0, 100);
  self.settings['quality'] = realQuality;
}
BaeImageTransform.prototype.set_quality = BaeImageTransform.prototype.setQuality;

/**
 * Set to get a gif first frame
 */
BaeImageTransform.prototype.setGetGifFirstFrame = function () {
  var self = this;
  self.settings['tieba'] = 1;
}

/**
 * Set autorotate
 */

BaeImageTransform.prototype.setAutorotate = function () {
  var self = this;
  self.settings['autorotate'] = 1;
}

/**
 * Flipping the image horizontally
 */
BaeImageTransform.prototype.horizontalFilp = function () {
  var self = this;
  self.settings['flop'] = 1;
}

/**
 * Flipping the image vertically
 */
BaeImageTransform.prototype.verticalFlip = function () {
  var self = this;
  self.settings['flip'] = 1;
}

/**
 * Clear operations
 */
BaeImageTransform.prototype.clearOperations = function() {
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
      var err = errMsg.INVALID_ARGS + ': parameter [' + ele + '] is must';
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
 * error message
 */
var errMsg = {
  INVALID_ARGS: 'Arguments error'
};

module.exports = exports = BaeImageTransform;