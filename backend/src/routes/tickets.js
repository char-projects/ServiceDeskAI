const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
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

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        const okExt = allowed.test(ext);
        const okMime = allowed.test(file.mimetype);
        if (okExt && okMime) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    }
});

router.post('/', auth, upload.array('media', 5), async (req, res) => {
    try {
        const { title, description, office, location } = req.body;
        const files = req.files || [];
        const media = files.map(f => '/uploads/' + f.filename);

        const parsedLocation = location ? JSON.parse(location) : undefined;

        const ticket = await Ticket.create({
            title,
            description,
            office,
            location: parsedLocation,
            reporter: req.user.userId,
            media,
        });

        (async () => {
            try {
                if (!files || files.length === 0) return;
                const first = files[0];
                const form = new FormData();
                form.append('image', fs.createReadStream(path.join(uploadsDir, first.filename)), { filename: first.originalname });
                const url = `http://localhost:${process.env.PORT || 4000}/api/interrogate/analyze`;
                const headers = Object.assign({}, form.getHeaders());
                if (process.env.INTERROGATOR_API_KEY) headers['x-api-key'] = process.env.INTERROGATOR_API_KEY;

                const resp = await axios.post(url, form, { headers, maxBodyLength: Infinity, timeout: 20000 });
                const aiMetadata = resp.data;
                if (aiMetadata) {
                    await Ticket.findByIdAndUpdate(ticket._id, { aiMetadata }, { new: true }).catch(() => {});
                }
            } catch (aiErr) {
                console.warn('Background vision analysis failed (ticket created):', aiErr?.response?.data || aiErr.message || aiErr);
            }
    })();
    res.json(ticket);
    } catch (e) {
        res.status(500).json({ error: 'Could not create ticket', details: e.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const role = req.user.role;
        let tickets;
        if (role === 'admin' || role === 'service') {
            tickets = await Ticket.find().populate('reporter', 'name email').sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ reporter: req.user.userId }).populate('reporter', 'name email').sort({ createdAt: -1 });
        }
        res.json(tickets);
    } catch (e) {
        res.status(500).json({ error: 'Could not fetch tickets' });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        if (!['service', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { status } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(ticket);
    } catch (e) {
        res.status(500).json({ error: 'Could not update status' });
    }
});

module.exports = router;