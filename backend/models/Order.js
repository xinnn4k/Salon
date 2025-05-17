const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    customerName: String,
    customerPhone: String,
    date: String, // or Date
    time: String,
    status: { type: String, default: 'booked' },
});

module.exports = mongoose.model('Order', orderSchema);
