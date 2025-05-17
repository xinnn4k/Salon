const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all salons
router.get('/', async (req, res) => {
    try {
        const salons = await Salon.find();

        const formattedSalons = salons.map(salon => {
            const salonObj = salon.toObject();
            if (salon.image) {
                const base64Image = salon.image.toString('base64');
                salonObj.image = `data:image/jpeg;base64,${base64Image}`;
            }
            return salonObj;
        });

        res.json(formattedSalons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single salon by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid salon ID' });
        }

        const salon = await Salon.findById(req.params.id);

        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        const salonObj = salon.toObject();
        if (salon.image) {
            const base64Image = salon.image.toString('base64');
            salonObj.image = `data:image/jpeg;base64,${base64Image}`;
        }

        res.json(salonObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Create a new salon
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const salon = new Salon({
            name: req.body.name,
            location: req.body.location,
            phone: req.body.phone,
            image: req.file ? req.file.buffer : undefined,
        });

        await salon.save();

        res.status(200).json({ message: 'Salon created successfully', salon });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading salon', error: err.message });
    }
});

// Update an existing salon
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid salon ID' });
        }

        const salon = await Salon.findById(req.params.id);
        
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        
        // Update fields
        salon.name = req.body.name || salon.name;
        salon.location = req.body.location || salon.location;
        salon.phone = req.body.phone || salon.phone;
        
        // Only update image if a new one is provided
        if (req.file) {
            salon.image = req.file.buffer;
        }
        
        await salon.save();
        
        res.status(200).json({ message: 'Salon updated successfully', salon });
    } catch (err) {
        res.status(500).json({ message: 'Error updating salon', error: err.message });
    }
});

// Delete a salon
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid salon ID' });
        }
        
        const salon = await Salon.findById(req.params.id);
        
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        
        await Salon.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Salon deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting salon', error: err.message });
    }
});

module.exports = router;