const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });




router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/subcategory/:subcategoryId', async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    
    const categories = await Category.find({});
    
    let foundSubcategory = null;
    let parentCategory = null;
    
    for (const category of categories) {
      const subcategory = category.subcategories.id(subcategoryId);
      if (subcategory) {
        foundSubcategory = subcategory;
        parentCategory = category;
        break;
      }
    }
    
    if (!foundSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    const formattedSubcategory = foundSubcategory.toObject();
    
    // Format image if it exists
    if (foundSubcategory.image && foundSubcategory.image.data) {
      const base64Image = Buffer.from(foundSubcategory.image.data).toString('base64');
      formattedSubcategory.image = `data:${foundSubcategory.image.contentType};base64,${base64Image}`;
    }
    
    // Add parent category info if needed
    formattedSubcategory.categoryId = parentCategory._id;
    formattedSubcategory.categoryName = parentCategory.name;
    
    res.json(formattedSubcategory);
  } catch (err) {
    console.error('Error fetching subcategory:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid subcategory ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!category.subcategories || category.subcategories.length === 0) {
      return res.status(200).json([]); // Return empty array if no subcategories
    }

    const formattedCategories = category.subcategories.map(sub => {
      const catObj = sub.toObject();
      if (sub.image && sub.image.data) {
        const base64Image = Buffer.from(sub.image.data).toString('base64');
        catObj.image = `data:${sub.image.contentType};base64,${base64Image}`;
      }
      return catObj;
    });


    res.json(formattedCategories);
  } catch (err) {
    console.error('Error fetching category:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid category ID' });
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




router.post('/:categoryId/subcategories', upload.single('image'), async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: 'Subcategory name is required' });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const newSubcategory = {
      name,
      description,
    };

    if (req.file) {
      newSubcategory.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    category.subcategories.push(newSubcategory);
    await category.save();

    res.status(201).json(category.subcategories[category.subcategories.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:categoryId/subcategories/:subcategoryId', upload.single('image'), async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

    if (name) subcategory.name = name;
    if (description) subcategory.description = description;

    if (req.file) {
      subcategory.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await category.save();

    res.json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const subcategoryIndex = category.subcategories.findIndex(
      sub => sub._id.toString() === req.params.subcategoryId
    );
    
    if (subcategoryIndex === -1) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    category.subcategories.splice(subcategoryIndex, 1);

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