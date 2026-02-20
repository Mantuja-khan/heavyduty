const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Trading', 'Manufacturing'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    price: {
        type: Number,
        default: null
    },
    image_url: {
        type: String,
        default: null
    },
    stock: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },

    // 🔥 ADDED FOR REVIEW SYSTEM (Nothing Removed)
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

ProductSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Product', ProductSchema);
