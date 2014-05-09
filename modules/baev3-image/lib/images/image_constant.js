module.exports = {
  /*output encoding*/
  'JPG': 0,
  'BMP': 1,
  'PNG': 2,
  'GIF': 3,
  'WEBP': 4,

  /*Font constant*/
  'SUN': 0,
  'KAI': 1,
  'HEI': 2,
  'MICROHEI': 3,
  'ARIAL': 4,

  /*Positon constant*/
  'TOP_LEFT': 0,
  'TOP_CENTER': 1,
  'TOP_RIGHT': 2,
  'CENTER_LEFT': 3,
  'CENTER_CENTER': 4,
  'CENTER_RIGHT': 5,
  'BOTTOM_LEFT': 6,
  'BOTTOM_CENTER': 7,
  'BOTTOM_RIGHT': 8,

  /*SDK error constant*/
  'BAE_IMAGEUI_SDK_SYS': 1,
  'BAE_IMAGEUI_SDK_INIT_FAIL': 2,
  'BAE_IMAGEUI_SDK_PARAM': 3,
  'BAE_IMAGEUI_SDK_HTTP_STATUS_ERROR_AND_RESULT_ERROR': 4,
  'BAE_IMAGEUI_SDK_HTTP_STATUS_OK_BUT_RESULT_ERROR': 5,

  /*Transform params key name*/
  'TRANSFORM_ZOOMING': 'size',
  'TRANSFORM_CROPPING':'crop',
  'TRANSFORM_ROTATE': 'rotate',
  'TRANSFORM_HUE': 'hue',
  'TRANSFORM_LIGHTNESS': 'lightness',
  'TRANSFORM_CONTRAST': 'contrast',
  'TRANSFORM_SHARPNESS': 'sharpness',
  'TRANSFORM_SATURATION': 'saturation',
  'TRANSFORM_TRANSCODE': 'transcode',
  'TRANSFORM_QUALITY': 'quality',
  'TRANSFORM_GETGIFFIRSTFRAME': 'getgiffirstframe',
  'TRANSFORM_AUTOROTATE': 'autorotate',
  'TRANSFORM_HORIZONTALFLIP': 'horizontalflip',
  'TRANSFORM_VERTICALFLIP': 'verticalflip',
  'TRANSFORM_CLEAROPERATIONS': 'clearoperations',
  'TRANSFORM_ZOOMING_TYPE_HEIGHT': 1,
  'TRANSFORM_ZOOMING_TYPE_WIDTH': 2,
  'TRANSFORM_ZOOMING_TYPE_PIXELS': 3,
  'TRANSFORM_ZOOMING_TYPE_UNRATIO': 4,

  /*QRCODE params key name*/
  'QRCODE_TEXT': 'text',
  'QRCODE_VERSION': 'version',
  'QRCODE_SIZE': 'size',
  'QRCODE_LEVEL': 'level',
  'QRCODE_MARGIN': 'margin',
  'QRCODE_FOREGROUND': 'foreground',
  'QRCODE_BACKGROUND':'background',
  'QRCODE_CLEAROPERATIONS':'clearoperations',

  /*ANNOTATE params key name*/
  'ANNOTATE_OPACITY': 'opacity',
  'ANNOTATE_FONT': 'font',
  'ANNOTATE_POS': 'pos',
  'ANNOTATE_OUTPUTCODE': 'outputcode',
  'ANNOTATE_QUALITY': 'quality',
  'ANNOTATE_CLEAROPERATIONS':'clearoperations',

  /*COMPOSITE params key name*/
  'COMPOSITE_BAEIMAGESOURCE': 'baeimagesource',
  'COMPOSITE_POS':'pos',
  'COMPOSITE_OPACITY': 'opacity',
  'COMPOSITE_ANCHOR': 'anchor',
  'COMPOSITE_CLEAROPERATIONS': 'clearoperations',

  /*VCode params key name*/
  'VCODE_LEN': 'len',
  'VCODE_PATTERN': 'pattern',
  'VCODE_INPUT': 'input',
  'VCODE_SECRET': 'secret',
  'VCODE_CLEAROPERATIONS':'clearoperations'
}