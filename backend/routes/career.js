const express = require('express');
const router = express.Router();
const { submitApplication, upload } = require('../controllers/careerController');

router.post('/apply', upload.single('resume'), submitApplication);

module.exports = router;
