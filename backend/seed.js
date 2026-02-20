const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const username = 'mantujak82@gmail.com';
        const password = 'mantuja@2002';

        // Check if admin exists
        const adminExists = await User.findOne({ username });

        if (adminExists) {
            console.log('Admin user already exists');
            // Optional: Update password if it exists but mismatch? 
            // For safety, let's just log.
        } else {
            // Create admin user
            await User.create({
                username,
                password,
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
