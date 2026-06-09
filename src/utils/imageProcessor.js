const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { config } = require('process');


const outputDir = process.env.OUTPUT_DIR || 'output';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });

}

class imageProcessor{
    /// image processing function it takes input path 
    //@param <string> inputPath - the path of the input image

    static async processImage(inputPath) {

        const filename = path.basename(inputPath);
        const outputPath = path.join(outputDir, `processed-${filename}`);

        const metadata = await sharp( inputPath).metadata();

        const {width , height} = metadata;
        const cropsize = Math.min(width, height);
        const left = Math.floor(0, (width - cropsize)/2);
        const top = Math.floor(0, (height - cropsize)*2); 

        await sharp(inputPath).extract({ left, top, width: cropsize, height: cropsize })
        .resize(config.PASSPORT_PHOTO.WIDTH, config.PASSPORT_PHOTO.HEIGHT,{ fit : 'fill' ,position : 'center' })
        .extend({top: 0, bottom: 0, left: 0, right: 0, background: config.PASSPORT_PHOTO.BACKGROUND })
        .toFile(outputPath);

        return{
            success : true,
            outputPath,
            filename : `processed-${filename}`,
            dimensions: {
          width: config.PASSPORT_PHOTO.WIDTH + 40,
          height: config.PASSPORT_PHOTO.HEIGHT + 40
        }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  

    static deleteFile(filePath) {
         try {
        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
            } 
        }   catch (error) {
      console.error(`Error deleting file: ${error.message}`);
    }
  } 

}


module.exports = ImageProcessor;









};