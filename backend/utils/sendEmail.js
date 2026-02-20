const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use explicit SMTP host
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `Machinery Hub <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
