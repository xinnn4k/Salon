const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const Service = require('../models/Service');
const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

 
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

router.get('/by-subcategory/:subcategoryId', async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({ message: 'Invalid subcategory ID' });
        }
        
        const services = await Service.find({ subcategoryId });
        
        const salonIds = [...new Set(services.map(service => service.salonId))];
        
        const salons = await Salon.find({ _id: { $in: salonIds } });
        
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
        console.error('Error fetching salons by subcategory:', err);
        res.status(500).json({ error: err.message });
    }
});

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



router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, location, phone, email, password } = req.body;

    if (!name || !location || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salon = new Salon({
      name,
      location,
      phone,
      email,
      password,
      image: req.file ? req.file.buffer : undefined,
    });

    await salon.save();

    res.status(201).json({ message: 'Salon created successfully', salon });
  } catch (err) {
    console.error('Salon creation error:', err);
    res.status(500).json({ message: 'Error uploading salon', error: err.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid salon ID' });
    }

    const salon = await Salon.findById(id);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const { name, location, phone, email, password } = req.body;

    if (name) salon.name = name;
    if (location) salon.location = location;
    if (phone) salon.phone = phone;
    if (email && email !== salon.email) {

        const existingSalon = await Salon.findOne({ email });
      if (existingSalon && existingSalon._id.toString() !== id) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      salon.email = email;
    }
    if(!email) salon.email = salon.email;


    if (password) {
      salon.password = password;
    }

    if (req.file) {
      salon.image = req.file.buffer;
    }

    await salon.save();

    res.status(200).json({ message: 'Salon updated successfully', salon });
  } catch (err) {
    console.error('Error updating salon:', err);
    res.status(500).json({ message: 'Error updating salon', error: err.message });
  }
});


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