const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const generateOrderEmailHTML = (order, isForAdmin = false) => {
    const itemsHTML = order.orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; vertical-align: middle; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; padding: 2px;">
                <span style="font-weight: 500; font-size: 14px;">${item.name}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">₹${item.price.toLocaleString("en-IN")}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; font-size: 14px;">₹${(item.qty * item.price).toLocaleString("en-IN")}</td>
        </tr>
    `).join('');

    const subTitle = isForAdmin ? `A new order has been placed on Machinery Hub.` : `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed successfully.`;
    const headerTitle = isForAdmin ? 'New Order Internal Notification' : `Thank you for your order, ${order.customerName || (order.user && order.user.username) || 'Customer'}!`;

    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
            <div style="background-color: #F97316; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">MACHINERY HUB</h1>
                <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">${subTitle}</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
                <h2 style="color: #111; font-size: 20px; margin-top: 0; border-bottom: 2px solid #F97316; padding-bottom: 10px; display: inline-block;">${headerTitle}</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 12px 10px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">Product</th>
                            <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase;">Qty</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Price</th>
                            <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 20px 10px 10px; text-align: right; font-weight: 600; font-size: 16px;">Grand Total:</td>
                            <td style="padding: 20px 10px 10px; text-align: right; font-weight: 700; font-size: 20px; color: #F97316;">₹${order.totalPrice.toLocaleString("en-IN")}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 40px; display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 250px; background-color: #fdfdfd; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px; color: #F97316; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Shipping Address</h4>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                            <strong>${order.customerName || 'Customer'}</strong><br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city} - ${order.shippingAddress.postalCode}<br>
                            ${order.shippingAddress.country}
                        </p>
                    </div>
                    <div style="flex: 1; min-width: 250px; background-color: #fdfdfd; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px; color: #F97316; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Contact Info</h4>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                            Email: ${order.customerEmail || (order.user && order.user.username) || 'N/A'}<br>
                            Phone: ${order.customerPhone || 'N/A'}<br>
                            Order ID: <span style="font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 3px;">#${order._id}</span>
                        </p>
                    </div>
                </div>

                ${isForAdmin ? `
                <div style="margin-top: 30px; padding: 20px; background-color: #fff7ed; border-left: 4px solid #F97316; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #9a3412;">
                        <strong>Admin Tip:</strong> You can manage this order by logging into the admin dashboard and going to the "Orders" section.
                    </p>
                </div>
                ` : `
                <div style="margin-top: 40px; text-align: center;">
                    <p style="font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
                    <a href="#" style="display: inline-block; padding: 12px 25px; background-color: #1a1a1b; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 10px;">TRACK ORDER</a>
                </div>
                `}
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Machinery Hub. All rights reserved.</p>
                <p style="margin: 5px 0 0;">This is an automated email. Please do not reply.</p>
            </div>
        </div>
    `;
};

const generateCancellationEmailHTML = (order) => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
            <div style="background-color: #EF4444; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">ORDER CANCELLED</h1>
                <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Order #${order._id.toString().slice(-6).toUpperCase()}</p>
            </div>
            <div style="padding: 30px; background-color: #ffffff; text-align: center;">
                <h2 style="color: #111; font-size: 20px; margin-top: 0;">Order #${order._id} was cancelled</h2>
                <p style="color: #666; line-height: 1.6; font-size: 16px;">We're sorry to see your order was cancelled. If you didn't mean to cancel, you can always place a new order on our website.</p>
                <div style="margin-top: 30px; padding: 20px; background-color: #fdf2f2; border: 1px solid #fee2e2; border-radius: 8px;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px;">If you have already paid, any refund will be processed according to our policy within 5-7 working days.</p>
                </div>
                <a href="#" style="display: inline-block; padding: 12px 25px; background-color: #1a1a1b; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 30px;">CONTINUE SHOPPING</a>
            </div>
        </div>
    `;
};

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
        const { orderItems, shippingAddress, totalPrice, customerName, customerEmail, customerPhone } = req.body;

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
            customerName,
            customerEmail,
            customerPhone,
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
                    const emailToUse = order.customerEmail || (order.user && order.user.username) || 'N/A';
                    const nameToUse = order.customerName || (order.user && order.user.username) || 'Customer';

                    if (emailToUse === 'N/A' || !validateEmail(emailToUse)) {
                        console.warn("No valid recipient email found for order:", order._id, "Email:", emailToUse);
                    } else {
                        await sendEmail({
                            email: emailToUse,
                            subject: 'Order Confirmation - Machinery Hub',
                            message: generateOrderEmailHTML(order, false)
                        });
                    }

                    // Send Email to Admin
                    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
                    if (adminEmail) {
                        await sendEmail({
                            email: adminEmail,
                            subject: `New Order from ${nameToUse}`,
                            message: generateOrderEmailHTML(order, true)
                        });
                    }
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
                const emailToUse = order.customerEmail || (order.user && order.user.username);
                if (emailToUse && validateEmail(emailToUse)) {
                    await sendEmail({
                        email: emailToUse,
                        subject: 'Order Cancelled - Machinery Hub',
                        message: generateCancellationEmailHTML(order)
                    });
                }
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
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
    cancelOrder,
    updateOrderStatus
};
