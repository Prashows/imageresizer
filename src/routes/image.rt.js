const express = require('express');
const upload = require('../config/multer.config');
const imageController = require('../controllers/image.service.controller');

const router = express.Router();

router.post('/upload', (req, res) => {

    res.json({
    success: true,
    message: "Upload route working"
  });
})

    //pload.single('image'), imageController.upload);

router.get('/health', imageController.health);

module.exports = router;
