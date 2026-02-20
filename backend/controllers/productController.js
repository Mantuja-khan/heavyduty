const Product = require('../models/Product');
const Review = require('../models/Review');


// ================= PRODUCTS =================

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 🔥 Add rating summary dynamically
        const reviews = await Review.find({ product: product._id });
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
                : 0;

        res.status(200).json({
            ...product.toObject(),
            rating: avgRating,
            numReviews: reviews.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, category, description, specifications, price, image_url, stock, featured } = req.body;

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        const product = await Product.create({
            name,
            slug,
            category,
            description,
            specifications,
            price,
            image_url,
            stock,
            featured
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();

        // 🔥 Also delete related reviews
        await Review.deleteMany({ product: req.params.id });

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ================= REVIEWS =================

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Public (Private recommended)
const createProductReview = async (req, res) => {
    const { rating, comment, name, user } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 🔥 Prevent duplicate review by same user
        if (req.user) {
            const alreadyReviewed = await Review.findOne({
                product: product._id,
                user: req.user._id
            });

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'You already reviewed this product' });
            }
        }

        const review = await Review.create({
            name,
            rating: Number(rating),
            comment,
            product: product._id,
            user: req.user ? req.user._id : (user || null)
        });

        res.status(201).json(review);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update review  🔥 NEW
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;

        const updated = await review.save();

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user && (review.user.toString() === req.user._id.toString() || req.user.role === 'admin')) {
            await review.deleteOne();
            res.status(200).json({ message: 'Review removed' });
        } else {
            res.status(401).json({ message: 'User not authorized to delete this review' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    updateProductReview,   // 🔥 added
    deleteProductReview
};
