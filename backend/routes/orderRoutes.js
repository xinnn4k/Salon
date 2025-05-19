const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.get('/pay/:salonId', async (req, res) => {
    try {
        const orders = await Order.find({ salonId: req.params.salonId })
            .populate('serviceId')
            .populate('staffId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.orderId,
        })
        .populate('salonId')
        .populate('serviceId')
        .populate('staffId');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/:salonId', async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            salonId: req.params.salonId
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.put('/:salonId/:orderId', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { 
                _id: req.params.orderId,
                salonId: req.params.salonId
            },
            req.body,
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.delete('/:salonId/:orderId', async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ 
            _id: req.params.orderId,
            salonId: req.params.salonId 
        });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;