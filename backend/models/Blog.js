const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String
    },
    author: {
        type: String,
        default: 'Admin'
    },
    image_url: {
        type: String,
        default: null
    },
    published: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

BlogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Blog', BlogSchema);
