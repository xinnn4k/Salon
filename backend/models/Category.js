const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Subcategory name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  subcategories: [SubcategorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);