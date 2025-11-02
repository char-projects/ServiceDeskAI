const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (e) {
    console.error('GET /api/users/me error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const allowed = ['name', 'email', 'location', 'favoriteOffice'];
    const updates = {};
    allowed.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    });

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

    const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (e) {
    console.error('PUT /api/users/me error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
