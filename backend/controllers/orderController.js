const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// @desc    Create new order (Razorpay)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalPrice * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save initial order to DB (Pending payment)
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentResult: {
                id: razorpayOrder.id,
                status: 'pending'
            },
            taxPrice: 0, // Calculate if needed
            shippingPrice: 0, // Calculate if needed
            totalPrice
        });

        const createdOrder = await order.save();

        res.status(201).json({
            order: createdOrder,
            razorpayOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment successful
            const order = await Order.findById(order_id).populate('user', 'email username');

            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'completed',
                    update_time: Date.now(),
                    email_address: order.user.email
                };

                const updatedOrder = await order.save();

                // Send Email to User
                try {
                    await sendEmail({
                        email: order.user.email,
                        subject: 'Order Confirmation - Machinery Hub',
                        message: `<h1>Thank you for your order!</h1><p>Your order ${order._id} has been placed successfully.</p>`
                    });

                    // Send Email to Admin (Mock Admin Email)
                    await sendEmail({
                        email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                        subject: 'New Order Received',
                        message: `<h1>New Order</h1><p>Order ${order._id} received from ${order.user.username}.</p>`
                    });
                } catch (emailError) {
                    console.error("Email sending failed:", emailError);
                }

                res.json({ message: "Payment verified successfully", order: updatedOrder });
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email');

        if (order) {
            if (order.status === 'Delivered') {
                return res.status(400).json({ message: "Cannot cancel delivered order" });
            }

            order.status = 'Cancelled';
            const updatedOrder = await order.save();

            // Send Email
            try {
                await sendEmail({
                    email: order.user.email,
                    subject: 'Order Cancelled - Machinery Hub',
                    message: `<h1>Order Cancelled</h1><p>Your order ${order._id} has been cancelled.</p>`
                });
            } catch (error) {
                console.error("Email failed", error);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getMyOrders,
    getOrders,
    cancelOrder
};
