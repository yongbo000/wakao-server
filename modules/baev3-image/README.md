
Example
-------

```
   var BaeImage = require('bae-image');
   var BaeImageTransform = BaeImage.Transform;
   var BaeImageQRCode = BaeImage.QRCode;
   var BaeImageAnnotate = BaeImage.Annotate;
   var BaeImageConstant = BaeImage.Constant;
   var BaeImageComposite = BaeImage.Composite; 
   var BaeImageService = BaeImage.Service;
   var imageURL = 'http://imgsrc.baidu.com/forum/pic/item/9912c8fcc3cec3fd184c5a27d688d43f87942776.jpg';

   function testTrans(imgService, imageTrans) {

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

     // imageTrans.horizontalFilp();
     // imageTrans.verticalFlip();

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

     /*
     imgService.applyTransformByObject(imageURL, imageTrans, function(err, result) {
      if (err) {
      console.log(err);
      return;
     }
     //console.log(result);
     var data = new Buffer(result['response_params'].image_data, 'base64');
     fs.writeFileSync('./image.jpg', data)

     });
     */
   }

   (function () {
     var opt = {
       ak:'bGUoCievDf4XIjoIYqk7xao2',
       sk:'pNceSAlS4HB8fToDilmXQvwSc6nHInHW',
       host: 'yunservicebus.newoffline.bae.baidu.com'
     };

     var imageService = new BaeImageService(opt);
     var imageTrans = new BaeImageTransform();

     testTrans(imageService, imageTrans);
   
   })()

```