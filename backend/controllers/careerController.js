const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure Multer for memory storage (no file saved to disk, just buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure Nodemailer
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// @desc    Submit Career Application
// @route   POST /api/career/apply
// @access  Public
const submitApplication = async (req, res) => {
    const { name, email, phone, coverLetter } = req.body;
    const resume = req.file;

    if (!name || !email || !resume) {
        return res.status(400).json({ message: 'Please provide name, email and resume.' });
    }

    try {
        const transporter = getTransporter();
        const adminEmail = 'mantujak82@gmail.com'; // Admin email as requested

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `New Career Application: ${name}`,
            html: `
                <h2>New Job Application</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Cover Letter:</strong></p>
                <p>${coverLetter || 'N/A'}</p>
            `,
            attachments: [
                {
                    filename: resume.originalname,
                    content: resume.buffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Career Email Error:', error);
        res.status(500).json({ message: 'Failed to submit application' });
    }
};

module.exports = {
    submitApplication,
    upload
};
