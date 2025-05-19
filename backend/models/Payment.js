const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['card', 'qpay'], 
        required: true 
    },
    cardLastFour: { type: String }, // Only for card payments
    transactionId: { type: String }, // Transaction reference
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);