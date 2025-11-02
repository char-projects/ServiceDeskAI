const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ name, email, password: hashed, role });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password ) return res.status(400).json({ error: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;