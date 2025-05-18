const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: Buffer },
}, { timestamps: true });


staffSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.image) {
        obj.image = obj.image.toString('base64');
    }
    return obj;
};

module.exports = mongoose.model('Staff', staffSchema);