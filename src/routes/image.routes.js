const express = require('express');
const upload = require('../config/multer.config');
const ImageController = require('../controllers/image.controller');

const router = express.Router();

// Upload and process image
router.post('/upload', upload.single('file'), ImageController.upload);

// Generate grid of copies
router.post('/grid', ImageController.generateGrid);

// Health check
router.get('/health', ImageController.health);

module.exports = router;
