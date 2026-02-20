const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const products = await mongoose.connection.db.collection('products').countDocuments();
        console.log("Product Count:", products);

        const blogs = await mongoose.connection.db.collection('blogs').countDocuments();
        console.log("Blog Count:", blogs);

        process.exit();
    } catch (err) {
        console.error("DB Error:", err);
        process.exit(1);
    }
};

checkDB();
