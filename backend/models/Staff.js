const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    image: { type: Buffer },
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

// Converting the buffer to base64 string when sending to the client
staffSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.image) {
        obj.image = obj.image.toString('base64');
    }
    return obj;
};

module.exports = mongoose.model('Staff', staffSchema);