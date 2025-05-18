// models/Salon.js
const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: String,
  location: String,
  phone: String,
  email: { type: String, unique: true },
  password: { type: String },
  image: { type: Buffer }
});

salonSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.image) {
    obj.image = obj.image.toString('base64');
  }
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Salon', salonSchema);
