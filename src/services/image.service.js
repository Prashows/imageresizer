const ImageProcessor = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

class ImageService {
  /**
   * Upload and process image
   * @param {object} file - Multer file object
   * @returns {Promise<object>} - Processed image details
   */
  static async uploadAndProcess(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    try {
      const inputPath = file.path;
      const result = await ImageProcessor.processPassportPhoto(inputPath);
      
      return {
        success: true,
        message: 'Image processed successfully',
        original: {
          filename: file.originalname,
          size: file.size,
          path: inputPath
        },
        processed: result
      };
    } catch (error) {
      // Clean up uploaded file if processing fails
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * Generate multiple copies
   * @param {string} imagePath - Path to processed image
   * @param {number} copies - Number of copies
   * @returns {Promise<object>} - Grid image details
   */
  static async generateGrid(imagePath, copies = 4) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error('Image file not found');
      }

      const result = await ImageProcessor.generateMultipleCopies(imagePath, copies);
      
      return {
        success: true,
        message: 'Grid generated successfully',
        grid: result
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get file download URL
   * @param {string} filename - Name of the file
   * @returns {string} - Download URL
   */
  static getDownloadUrl(filename) {
    return `/output/${filename}`;
  }

  /**
   * Cleanup old files (optional)
   * @param {number} maxAge - Max age in milliseconds
   */
  static cleanupOldFiles(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const outputDir = process.env.OUTPUT_DIR || 'output';
    const now = Date.now();

    [uploadDir, outputDir].forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtimeMs > maxAge) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted old file: ${file}`);
            } catch (error) {
              console.error(`Error deleting file ${file}:`, error);
            }
          }
        });
      }
    });
  }
}

module.exports = ImageService;
