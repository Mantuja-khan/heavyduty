const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Career = require('./models/Career'); // Assuming model name

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const productCount = await Product.countDocuments();
        console.log(`Products: ${productCount}`);

        const blogCount = await Blog.countDocuments();
        console.log(`Blogs: ${blogCount}`);

        // Check if Career model exists or just check collection directly if user meant applications
        // consistently. Assuming Career model for now.
        try {
            const applicationCount = await mongoose.connection.db.collection('careers').countDocuments();
            console.log(`Applications (careers collection): ${applicationCount}`);
        } catch (e) {
            console.log("Could not count careers:", e.message);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
