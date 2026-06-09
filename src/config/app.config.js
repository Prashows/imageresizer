module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'photos/uploads',
  OUTPUT_DIR: process.env.OUTPUT_DIR || 'photos/output',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880,
  
  // ✅ ADD THIS: Passport photo dimensions (2x2 inches at 300 DPI = 600x600 pixels)
  PASSPORT_PHOTO: {
    WIDTH: 600,
    HEIGHT: 600
  }
}