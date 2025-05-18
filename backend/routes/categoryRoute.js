const express = require('express');
const router = express.Router();
const Category = require('../models/Category');




router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});




router.post('/', async (req, res) => {
  const { name, description } = req.body;
  
  try {

    const existing = await Category.findOne({ name });
    
    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const newCategory = new Category({
      name,
      description,
      subcategories: []
    });
    
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});





router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  
  try {

    if (name) {
      const existing = await Category.findOne({ name, _id: { $ne: req.params.id } });
      
      if (existing) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});




router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});





router.post('/:id/subcategories', async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory with this name already exists in this category' });
    }
    
    const newSubcategory = {
      name,
      description
    };
    
    category.subcategories.push(newSubcategory);
    await category.save();
    
    const addedSubcategory = category.subcategories[category.subcategories.length - 1];
    res.status(201).json(addedSubcategory);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});




router.put('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const subcategory = category.subcategories.id(req.params.subcategoryId);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    if (name) {
      const existingSubcategory = category.subcategories.find(
        sub => sub.name.toLowerCase() === name.toLowerCase() && 
              sub._id.toString() !== req.params.subcategoryId
      );
      
      if (existingSubcategory) {
        return res.status(400).json({ message: 'Subcategory with this name already exists in this category' });
      }
    }
    
    if (name) subcategory.name = name;
    if (description !== undefined) subcategory.description = description;
    
    await category.save();
    res.json(subcategory);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category or subcategory not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});




router.delete('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const subcategory = category.subcategories.id(req.params.subcategoryId);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    await subcategory.findByIdAndDelete(req.params.id);

    await category.save();
    
    res.json({ message: 'Subcategory removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category or subcategory not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;