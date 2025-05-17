const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = 'public/uploads/categories';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Generate unique filename with original extension
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Get all categories for a salon
router.get('/:salonId', async (req, res) => {
    try {
        const categories = await Category.find({ 
            salonId: req.params.salonId,
            active: true 
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific category by ID
router.get('/:salonId/:categoryId', async (req, res) => {
    try {
        const category = await Category.findOne({ 
            _id: req.params.categoryId,
            salonId: req.params.salonId,
            active: true
        });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new category
router.post('/:salonId', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const categoryData = {
            name,
            description,
            salonId: req.params.salonId,
            subcategories: []
        };
        
        if (req.file) {
            // Save the relative path to be served by static middleware
            categoryData.imageUrl = `/uploads/categories/${req.file.filename}`;
        }
        
        const category = new Category(categoryData);
        await category.save();
        
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a category
router.put('/:salonId/:categoryId', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const updateData = {
            name,
            description,
            updatedAt: Date.now()
        };
        
        if (req.file) {
            // Add new image path
            updateData.imageUrl = `/uploads/categories/${req.file.filename}`;
            
            // Delete old image if exists
            const oldCategory = await Category.findById(req.params.categoryId);
            if (oldCategory && oldCategory.imageUrl) {
                const oldImagePath = path.join(__dirname, '../public', oldCategory.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        const category = await Category.findOneAndUpdate(
            { _id: req.params.categoryId, salonId: req.params.salonId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a subcategory to a category
router.post('/:salonId/:categoryId/subcategory', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const subcategory = {
            id: uuidv4(), // Generate unique ID for subcategory
            name,
            description,
        };
        
        if (req.file) {
            // Save the relative path to be served by static middleware
            subcategory.imageUrl = `/uploads/categories/${req.file.filename}`;
        }
        
        const category = await Category.findOneAndUpdate(
            { _id: req.params.categoryId, salonId: req.params.salonId },
            { $push: { subcategories: subcategory }, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a subcategory
router.put('/:salonId/:categoryId/subcategory/:subcategoryId', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Find the category
        const category = await Category.findOne({ 
            _id: req.params.categoryId, 
            salonId: req.params.salonId 
        });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Find the subcategory
        const subcategoryIndex = category.subcategories.findIndex(
            sub => sub.id === req.params.subcategoryId
        );
        
        if (subcategoryIndex === -1) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        
        // Update subcategory fields
        if (name) category.subcategories[subcategoryIndex].name = name;
        if (description) category.subcategories[subcategoryIndex].description = description;
        
        if (req.file) {
            // Delete old image if exists
            const oldImageUrl = category.subcategories[subcategoryIndex].imageUrl;
            if (oldImageUrl) {
                const oldImagePath = path.join(__dirname, '../public', oldImageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // Add new image
            category.subcategories[subcategoryIndex].imageUrl = `/uploads/categories/${req.file.filename}`;
        }
        
        category.updatedAt = Date.now();
        await category.save();
        
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a subcategory
router.delete('/:salonId/:categoryId/subcategory/:subcategoryId', async (req, res) => {
    try {
        // Find the category
        const category = await Category.findOne({ 
            _id: req.params.categoryId, 
            salonId: req.params.salonId 
        });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Find the subcategory
        const subcategory = category.subcategories.find(
            sub => sub.id === req.params.subcategoryId
        );
        
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        
        // Delete subcategory image if it exists
        if (subcategory.imageUrl) {
            const imagePath = path.join(__dirname, '../public', subcategory.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Remove subcategory from array
        category.subcategories = category.subcategories.filter(
            sub => sub.id !== req.params.subcategoryId
        );
        
        category.updatedAt = Date.now();
        await category.save();
        
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Soft delete a category (mark as inactive)
router.delete('/:salonId/:categoryId', async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.categoryId, salonId: req.params.salonId },
            { active: false, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:salonId/:categoryId/permanent', async (req, res) => {
    try {
        const category = await Category.findOne({ 
            _id: req.params.categoryId, 
            salonId: req.params.salonId 
        });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Delete main category image if it exists
        if (category.imageUrl) {
            const imagePath = path.join(__dirname, '../public', category.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Delete all subcategory images
        category.subcategories.forEach(subcategory => {
            if (subcategory.imageUrl) {
                const imagePath = path.join(__dirname, '../public', subcategory.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        });
        
        // Remove from database
        await Category.findByIdAndDelete(req.params.categoryId);
        
        res.json({ message: 'Category permanently deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;