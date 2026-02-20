const express = require('express');
const router = express.Router();
const {
    createEnquiry,
    getEnquiries,
    deleteEnquiry,
    updateEnquiryStatus
} = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(createEnquiry).get(protect, admin, getEnquiries);
router.route('/:id').delete(protect, admin, deleteEnquiry).put(protect, admin, updateEnquiryStatus);

module.exports = router;
