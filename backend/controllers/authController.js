const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported
const nodemailer = require('nodemailer');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendEmail = async (email, otp) => {
    console.log(`----------------------------------------`);
    console.log(`[Dev] OTP for ${email}: ${otp}`);
    console.log(`----------------------------------------`);

    // Real Nodemailer setup
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'HeavyBuild Verification Code',
                text: `Your One-Time Password (OTP) is: ${otp}\n\nThis code expires in 5 minutes.`
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email Send Error:', error);
            // Don't fail the request if email fails in dev, just log it
            return false;
        }
    }
    return true;
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Register new user (Admin use mainly) OR now public signup
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        username,
        password,
        role: 'user' // Default to user
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Please provide an email' });
    }

    const userExists = await User.findOne({ username: email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = generateOTP();

    try {
        // Save OTP to DB
        await Otp.create({ email, otp });

        // Send Email
        await sendEmail(email, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// @desc    Verify OTP and Create User
// @route   POST /api/auth/verify-signup
// @access  Public
const verifyAndSignup = async (req, res) => {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create User
    const user = await User.create({
        username: email,
        password,
        role: 'user'
    });

    if (user) {
        // Delete OTP used
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Check for user email
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            username: user.username,
            role: user.role, // Send role to frontend
            token: generateToken(user.id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    sendOtp,
    verifyAndSignup,
    updateProfile
};
