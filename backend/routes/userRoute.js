// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: 'User already exists' });

  const newUser = new User({ email, password });
  await newUser.save();
  res.status(201).json({ id: newUser._id, email: newUser.email });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password }); // No hashing check
  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ id: user._id, email: user.email });
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password, name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { email, password, name, phone },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
