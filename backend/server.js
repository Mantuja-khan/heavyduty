const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
require("dotenv").config();

// Connect to database
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/career', require('./routes/career'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

app.get('/api/config/razorpay', (req, res) => {
    res.send(process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder');
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
