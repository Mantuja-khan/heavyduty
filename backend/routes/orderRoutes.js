const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrders,
    cancelOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/verify').post(protect, verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
