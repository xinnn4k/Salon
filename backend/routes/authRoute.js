const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const Staff = require('../models/Staff');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    if (email === 'admin@example.com' && password === '123'){
        return res.json({
            message: 'Login successful',
            user: {
                role: 'super_admin',
                email: 'admin@example.com'
            }
        })
    }

    const salon = await Salon.findOne({ email });
    if (salon && salon.password === password) {
      return res.json({
        message: 'Login successful',
        user: {
          role: 'salon_admin',
          salonId: salon._id,
          salonName: salon.name,
          email: salon.email
        }
      });
    }

    const staff = await Staff.findOne({ email }).populate('salonId');
    if (staff && staff.password === password) {
      return res.json({
        message: 'Login successful',
        user: {
          role: 'talent',
          staffId: staff._id,
          salonId: staff.salonId?._id,
          salonName: staff.salonId?.name,
          email: staff.email
        }
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
