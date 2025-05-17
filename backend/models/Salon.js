const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: String,
    location: String,
    phone: String,
    image: { type: Buffer }
});

module.exports = mongoose.model('Salon', salonSchema);
