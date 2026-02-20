// const express = require('express');
// const router = express.Router();
// const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, createProductReview,
//     getProductReviews,
//     deleteProductReview
// } = require('../controllers/productController');


// const { protect } = require('../middleware/authMiddleware');


// router.route('/').get(getProducts).post(protect, createProduct);
// router.route('/:id/reviews').post(createProductReview).get(getProductReviews);
// router.route('/:id/reviews/:reviewId').delete(protect, deleteProductReview);

// router.route('/:slug').get(getProduct);
// router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct);

// module.exports = router;



const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteProductReview,
    updateProductReview   // 🔥 added
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');


// ================= PRODUCTS =================

router.route('/')
    .get(getProducts)
    .post(protect, createProduct);


// ================= REVIEWS =================

// Create review + Get reviews
router.route('/:id/reviews')
    .post(protect, createProductReview)   // 🔥 made protected (secure)
    .get(getProductReviews);

// Update review + Delete review
router.route('/:id/reviews/:reviewId')
    .put(protect, updateProductReview)    // 🔥 NEW ROUTE ADDED
    .delete(protect, deleteProductReview);


// ================= SINGLE PRODUCT =================

router.route('/:slug')
    .get(getProduct);

router.route('/:id')
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
