var BaeImage = require('../index');
var BaeImageTransform = BaeImage.Transform;
var BaeImageQRCode = BaeImage.QRCode;
var BaeImageAnnotate = BaeImage.Annotate;
var BaeImageConstant = BaeImage.Constant;
var BaeImageComposite = BaeImage.Composite;

var BaeImageService = BaeImage.Service;
var fs = require('fs');
var imageURL = 'http://b.hiphotos.baidu.com/album/s%3D1400%3Bq%3D90/sign=06c5af40c93d70cf48faae09c8ecea71/9922720e0cf3d7ca0230c20ff21fbe096a63a981.jpg';
var imageURL0 = 'http://imgsrc.baidu.com/forum/pic/item/9912c8fcc3cec3fd184c5a27d688d43f87942776.jpg';
function testTrans(imgService, imageTrans) {
  //imageTrans.setHue(50);

  // test for zooming
  /*
  imageTrans.setZooming({zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_HEIGHT,
    size: 100})
  imageTrans.setZooming({zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_WIDTH,
    size: 100})
  imageTrans.setZooming({zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_PIXELS,
    size: 1000000})
  imageTrans.setZooming({zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_UNRATIO,
    size: 1000, height: 1000})
  */
  
  // test for copping
  /*
  imageTrans.setCopping({
    x: 0,
    y: 0,
    width: 10000,
    height: 10000
  }); 
  */

  // test for rotation
  // imageTrans.setRotation(180);

  // test for hue
  // imageTrans.setHue(10);

  // test for lightness
  // imageTrans.setLightness(10000);

  // test for contrast
  // imageTrans.setContrast(1);

  // test for sharpness
  // imageTrans.setSharpness(10);

  // test for saturation
  // imageTrans.setSaturation(50);

  // test for transcoding
  // imageTrans.setTranscoding({imageType: BaeImageConstant.GIF, quality: 10})

  // test for quality
  // imageTrans.setQuality(70);
  
   imageTrans.horizontalFilp();
  // imageTrans.verticalFlip();
  /*
  var option = {
    zooming: {
      zoomingType: BaeImageConstant.TRANSFORM_ZOOMING_TYPE_HEIGHT,
      size: 1000
    },
    rotation: 180,
    hue: 10,
    contrast: 0,
    lightness: 10,
    sharpness: 10,
    saturation: 50,

    quality: 70
  }
  
  imgService.applyTransform(imageURL, option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    //console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image.jpg', data)

  });
  */
  
  imgService.applyTransformByObject(imageURL, imageTrans, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    //console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image.jpg', data)

  });
  
}


function testQRCode(imageService, imageQRCode){

  /*
  imageQRCode.setText('hello, image');
  imageQRCode.setVersion(2);
  imageQRCode.setSize(50);
  imageQRCode.setLevel(3);
  imageQRCode.setMargin(3);
  imageQRCode.setForeground('000000');
  imageQRCode.setBackground('FFFFFF');

  imageService.applyQRCodeByObject(imageURL, imageQRCode, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image1.jpg', data)

  });
  */
  var data = new Array(20).join('b');
  var option = {
    dd: 123,
    text: data,
    size: 10,
    level: 2,
    version: 10,
    margin: 3,
    foreground: '000000',
    background: 'FFFFFF'
  }
  imageService.applyQRCode(option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image1.jpg', data)

  });

}


function testAnnotate(imageService, imageAnnotate){

  var option = {
    text: 'do or die',
    /*
    opacity: 0.5,
    font: {
      name: 4,
      color: '0F0F0F',
      size: 100
    },
    position: {
      x_offset: 1,
      y_offset: 1
    },
    outputCode: 0,
    quality: 50,
    */
  }

  imageService.applyAnnotate(imageURL, option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image2.jpg', data)

  });

}

function testComposite(imageService){

  var option = {
    imageCompositeOptionArr: [
    {
      imageSource: imageURL,
      position: {
        x_offset: 0,
        y_offset: 0

      },
      opacity: 0.5,
      //anchor: 4
    },
    {
      imageSource: imageURL0,
      position: {
        x_offset: 0,
        y_offset: 0
      },
      opacity: 0.5,
      //anchor: 4
    }
    ],
    
    canvas: {
      width: 1000,
      height:1000
    },
    
    //outputCode: 0,
    //quality: 100
  }

  imageService.applyComposite(option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(result);
    var data = new Buffer(result['response_params'].image_data, 'base64');
    fs.writeFileSync('./image3.jpg', data)

  });

}

function testVCode(imageService){
  
  /*
  var option = {
    len: 4,
    pattern: 2
  }

  imageService.generateVCode(option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    
  });
  */
  
  var option = {
    secret: '0013699983070164C96B1E11FCDB33FE942E06E77681D827267B7CEABD3775FA99BB926D4A9CBD5EFF5FDDFAEAFEE773F9F82762122190115A284194A17D8AC9BDF96FF4EA89EF704CE5A26458B1C5ED77981C5BEE4D72FCE1084AE71C246C055A5BD3E38B3C28D1753F381E5F14C382949107D63B64F0D6FAAD4AD2BCB4C402F04EF9B3138BD6F0808DCD64113E95B9F00597350F6053B4063FCFDD03A10D8DF534516C39790CD93EE2E5413EBC1975995D12606E9B02B2',
    input: 'ae3l'
  }
  
  imageService.verifyVCode(option, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
  

}


(function () {
  var opt = {
    //ak:'Y5W94TTpwjd1OyODHaWbxFWs',
    //sk:'H4xhmgO962xSwAaPErE4ojEGtbQ9BQvV',
    //host: 'bus.api.baidu.com'
    ak:'bGUoCievDf4XIjoIYqk7xao2',
    sk:'pNceSAlS4HB8fToDilmXQvwSc6nHInHW',
    host: 'yunservicebus.newoffline.bae.baidu.com'
  };

  var imageService = new BaeImageService(opt);
  var imageTrans = new BaeImageTransform();
  var imageQRCode = new BaeImageQRCode();
  var imageAnnotate = new BaeImageAnnotate();

   // testTrans(imageService, imageTrans);
   // testQRCode(imageService, imageQRCode);
   // testAnnotate(imageService, imageAnnotate);
   // testComposite(imageService);
    testVCode(imageService);

})()