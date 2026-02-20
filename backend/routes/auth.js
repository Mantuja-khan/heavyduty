const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, sendOtp, verifyAndSignup, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-signup', verifyAndSignup);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
