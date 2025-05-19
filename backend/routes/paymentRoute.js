const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// Get payment details by order ID
router.get('/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Process a card payment
router.post('/card/:orderId', async (req, res) => {
    try {
        const { cardNumber, cardHolder, expiryDate, cvv } = req.body;
        
        // Validate card details (simple validation for this example)
        const cardNumberDigits = cardNumber.replace(/\s/g, '');
        
        if (cardNumberDigits.length !== 16) {
            return res.status(400).json({ error: "Картын дугаар 16 оронтой байх ёстой" });
        }
        
        if (!cardHolder.trim()) {
            return res.status(400).json({ error: "Картын эзэмшигчийн нэрийг оруулна уу" });
        }
        
        const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryPattern.test(expiryDate)) {
            return res.status(400).json({ error: "Дуусах хугацааг MM/YY форматаар оруулна уу" });
        }
        
        // Check if card is expired
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || 
           (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            return res.status(400).json({ error: "Картын хугацаа дууссан байна" });
        }
        
        if (cvv.length < 3) {
            return res.status(400).json({ error: "CVV/CVC код буруу байна" });
        }

        // Find the order
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Create a new payment record
        const payment = new Payment({
            orderId: req.params.orderId,
            amount: req.body.amount,
            paymentMethod: 'card',
            cardLastFour: cardNumberDigits.slice(-4),
            status: 'completed',
            paymentDate: new Date()
        });
        
        await payment.save();
        
        // Update order status
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        await order.save();
        
        res.status(201).json({ 
            success: true, 
            payment: payment,
            message: 'Payment processed successfully'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Process QPay payment
router.post('/qpay/:orderId', async (req, res) => {
    try {
        // Find the order
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // In a real implementation, this would generate a QR code and return it
        // For this example, we'll create a pending payment
        const payment = new Payment({
            orderId: req.params.orderId,
            amount: req.body.amount,
            paymentMethod: 'qpay',
            status: 'pending',
            paymentDate: new Date()
        });
        
        await payment.save();
        
        // Generate a fake QR URL - in reality, this would come from QPay API
        const qrCodeData = {
            qrImage: 'https://api.qpay.mn/q/' + Math.random().toString(36).substring(2, 15),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
        };
        
        res.status(201).json({ 
            success: true, 
            payment: payment,
            qrData: qrCodeData,
            message: 'QPay QR code generated'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Confirm QPay payment (this would normally be called by webhook from QPay)
router.post('/qpay/confirm/:orderId', async (req, res) => {
    try {
        // Find the pending payment
        const payment = await Payment.findOne({ 
            orderId: req.params.orderId,
            paymentMethod: 'qpay',
            status: 'pending'
        });
        
        if (!payment) {
            return res.status(404).json({ error: 'Pending payment not found' });
        }
        
        // Update payment status
        payment.status = 'completed';
        payment.transactionId = req.body.transactionId || Math.random().toString(36).substring(2, 15);
        await payment.save();
        
        // Update order status
        const order = await Order.findById(req.params.orderId);
        if (order) {
            order.status = 'confirmed';
            order.paymentStatus = 'paid';
            await order.save();
        }
        
        res.json({ 
            success: true, 
            payment: payment,
            message: 'Payment confirmed successfully'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;