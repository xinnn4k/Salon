const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/:salonId', async (req, res) => {
    try {
        const staffs = await Staff.find({ salonId: req.params.salonId });
        res.json(staffs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:salonId', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, specialty } = req.body;
    const salonId = req.params.salonId;

    if (!name || !email || !password || !specialty || !salonId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newStaff = new Staff({
      name,
      email,
      password,
      specialty,
      salonId,
      image: req.file ? req.file.buffer : undefined,
    });

    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ message: 'Failed to create staff' });
  }
});



module.exports = router;
