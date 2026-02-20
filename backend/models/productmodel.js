const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number },
        image_url: { type: String },
        description: { type: String },
        stock: { type: Number, default: 0 },
        category: { type: String },

        reviews: [reviewSchema],

        numReviews: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.export
