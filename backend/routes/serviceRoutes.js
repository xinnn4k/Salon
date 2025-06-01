const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.get('/search', async (req, res) => {
    try {
        const { service } = req.query;

        const query = {};
        if (service) {
            query.name = { $regex: new RegExp(service, 'i') };
        }

        const services = await Service.find(query);
        const formatted = services.map(s => {
            const obj = s.toObject();
            if (obj.image) {
                obj.image = `data:image/jpeg;base64,${obj.image.toString('base64')}`;
            }
            return obj;
        });

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:salonId', async (req, res) => {
    try {
        const services = await Service.find({ salonId: req.params.salonId });

        const formattedServices = services.map(service => {
            const obj = service.toObject();
            if (obj.image) {
                obj.image = `data:image/jpeg;base64,${obj.image.toString('base64')}`;
            }
            return obj;
        });

        res.json(formattedServices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});

        const formattedServices = services.map(service => {
            const obj = service.toObject();
            if (obj.image) {
                obj.image = `data:image/jpeg;base64,${obj.image.toString('base64')}`;
            }
            return obj;
        });

        res.json(formattedServices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:salonId/:serviceId', async (req, res) => {
    try {
        const service = await Service.findOne({ 
            _id: req.params.serviceId,
            salonId: req.params.salonId 
        });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const obj = service.toObject();
        if (obj.image) {
            obj.image = `data:image/jpeg;base64,${obj.image.toString('base64')}`;
        }

        res.json(obj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/:salonId', upload.single('image'), async (req, res) => {
    try {
        const service = new Service({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            salonId: req.params.salonId,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            image: req.file?.buffer || null,
        });
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:salonId/:serviceId', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        };
        
        if (req.file) {
            updateData.image = req.file.buffer;
        }
        
        const service = await Service.findOneAndUpdate(
            { _id: req.params.serviceId, salonId: req.params.salonId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        res.json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:salonId/:serviceId', async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({
            _id: req.params.serviceId,
            salonId: req.params.salonId
        });
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;