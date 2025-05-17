const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all staff for a salon
router.get('/:salonId', async (req, res) => {
    try {
        const staffs = await Staff.find({ salonId: req.params.salonId });
        res.json(staffs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific staff member
router.get('/member/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new staff member
router.post('/:salonId', upload.single('image'), async (req, res) => {
    try {
        const staff = new Staff({
            salonId: req.body.salonId,
            name: req.body.name,
            specialty: req.body.specialty,
            image: req.file ? req.file.buffer : undefined,
        });

        await staff.save();

        res.status(200).json({ message: 'Staff created successfully', staff });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading staff', error: err.message });
    }
});

// Update a staff member
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            specialty: req.body.specialty,
        };

        // Only update image if a new one is provided
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.json({ message: 'Staff updated successfully', staff: updatedStaff });
    } catch (err) {
        res.status(500).json({ message: 'Error updating staff', error: err.message });
    }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        
        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting staff', error: err.message });
    }
});

module.exports = router;