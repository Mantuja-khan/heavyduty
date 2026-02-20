const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrders,
    cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/verify').post(protect, verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
