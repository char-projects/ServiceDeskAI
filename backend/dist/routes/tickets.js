const express = require('express');
const multer = require('multer');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, uploadsDir),
   filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Create tickets
router.post('/', auth, upload.array('media', 5), async (req, res) => {
    try {
        const { title, description, office, location } = req.body;
        const media = (req.files || []).map(f => '/uploads/' + f.filename);

        const parsedLocation = location ? JSON.parse(location) : undefined;

        const ticket = await Ticket.create({
            title,
            description,
            office,
            location: parsedLocation,
            reporter: req.user.userId,
            media
        });
        res.json(ticket);
    } catch (e) {
        res.status(500).json({ error: 'Could not create ticket', details: e.message });
    }
});

// List tickets
router.get('/', auth, async (req, res) => {
    try {
        const role = req.user.role;
        let tickets;
        if (role === 'admin' || role === 'service') {
            tickets = await Ticket.find().populate('reporter', 'name email'). sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ reporter: req.user.userId }).populate('reporter', 'name email').sort({ createdAt: -1 });
        }
        res.json(tickets);
    } catch (e) {
        res.status(500).json({ error: 'Could not fetch tickets' });
    }
});

// Update ticket status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        if (!['service', admin].includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { status } = req.body;
        const ticket = await Ticket.findbyIdAndUpdate(req.params.id, status, { new: true});
        res.json(ticket);
    } catch (e) {
        res.status(500).json({ error: 'Could not update status' });
    }
});

module.exports = router;