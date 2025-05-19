const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
    name: String,
    price: Number,
    description: String,
    image: Buffer,
    type: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('Service', serviceSchema);