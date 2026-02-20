const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        company: {
            type: String,
        },
        product: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Closed'],
            default: 'New',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
