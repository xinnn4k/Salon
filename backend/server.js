const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const salonRoutes = require('./routes/salonRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const staffRoutes = require('./routes/staffRoutes');
const orderRoutes = require('./routes/orderRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staffs', staffRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Salon Booking Backend is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));
