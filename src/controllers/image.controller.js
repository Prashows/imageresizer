const ImageService = require('../services/image.service');

class ImageController {
  /**
   * Upload and process image
   * POST /api/images/upload
   */
  static async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const result = await ImageService.uploadAndProcess(req.file);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          original: result.original,
          processed: {
            filename: result.processed.filename,
            downloadUrl: ImageService.getDownloadUrl(result.processed.filename),
            dimensions: result.processed.dimensions
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate grid of copies
   * POST /api/images/grid
   */
  static async generateGrid(req, res, next) {
    try {
      const { imagePath, copies } = req.body;

      if (!imagePath) {
        return res.status(400).json({
          success: false,
          message: 'Image path is required'
        });
      }

      const copiesCount = copies || 4;

      const result = await ImageService.generateGrid(imagePath, copiesCount);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          grid: {
            filename: result.grid.filename,
            downloadUrl: ImageService.getDownloadUrl(result.grid.filename),
            copies: result.grid.copies,
            dimensions: result.grid.dimensions
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check
   * GET /api/images/health
   */
  static health(req, res) {
    res.json({
      success: true,
      message: 'Image service is running'
    });
  }
}

module.exports = ImageController;
