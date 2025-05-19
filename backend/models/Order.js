
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    customerName: String,
    customerPhone: String,
    date: String, // or Date
    time: String,
    status: { 
        type: String, 
        enum: ['booked', 'confirmed', 'completed', 'cancelled'],
        default: 'booked' 
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);