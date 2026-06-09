const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const config = require('../config/app.config');

// Create output directory if it doesn't exist
const outputDir = config.OUTPUT_DIR;
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

class ImageProcessor {
  /**
   * Process image for passport photo
   * @param {string} inputPath - Path to input image
   * @returns {Promise<object>} - Contains output path and dimensions
   */
  static async processPassportPhoto(inputPath) {
    try {
      const filename = path.basename(inputPath);
      const outputFilename = `processed-${Date.now()}-${filename}`;
      const outputPath = path.join(outputDir, outputFilename);

      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      
      // Calculate crop dimensions (center crop for face)
      const { width, height } = metadata;
      const cropSize = Math.min(width, height);
      const left = Math.max(0, Math.floor((width - cropSize) / 2));
      const top = Math.max(0, Math.floor((height - cropSize) * 0.3)); // Slightly higher for face

      // Process image
      await sharp(inputPath)
        .extract({
          left,
          top,
          width: cropSize,
          height: cropSize
        })
        .resize(config.PASSPORT_PHOTO.WIDTH, config.PASSPORT_PHOTO.HEIGHT, {
          fit: 'fill',
          position: 'center'
        })
        .extend({
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        })
        .toFile(outputPath);

      return {
        success: true,
        outputPath,
        filename: outputFilename,
        dimensions: {
          width: config.PASSPORT_PHOTO.WIDTH + 40,
          height: config.PASSPORT_PHOTO.HEIGHT + 40
        }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Generate multiple copies of passport photo
   * @param {string} inputPath - Path to input image
   * @param {number} copies - Number of copies (2x2, 2x3, etc.)
   * @returns {Promise<object>} - Contains output path
   */
  static async generateMultipleCopies(inputPath, copies = 4) {
    try {
      const filename = path.basename(inputPath);
      const outputFilename = `grid-${Date.now()}-${filename}`;
      const outputPath = path.join(outputDir, outputFilename);

      // Get processed photo metadata
      const metadata = await sharp(inputPath).metadata();
      const { width, height } = metadata;

      // Calculate grid layout (2x2 for 4 photos, 2x3 for 6 photos, etc.)
      const cols = 2;
      const rows = Math.ceil(copies / cols);
      
      // Create composite
      const tiles = Array(copies).fill({
        input: inputPath
      });

      await sharp({
        create: {
          width: width * cols,
          height: height * rows,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
        .composite(
          tiles.map((tile, index) => ({
            input: inputPath,
            left: (index % cols) * width,
            top: Math.floor(index / cols) * height
          }))
        )
        .toFile(outputPath);

      return {
        success: true,
        outputPath,
        filename: outputFilename,
        copies,
        dimensions: {
          width: width * cols,
          height: height * rows
        }
      };
    } catch (error) {
      throw new Error(`Grid generation failed: ${error.message}`);
    }
  }

  /**
   * Delete image file
   * @param {string} filePath - Path to file
   */
  static deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
    }
  }
}

module.exports = ImageProcessor;
