const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity history
router.get('/activity', auth, async (req, res) => {
  try {
    const activities = await ActivityLog.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    const user = await User.findById(req.user._id);
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    // Log the update action
    await ActivityLog.create({
      user: req.user._id,
      action: 'update',
      entity: 'user',
      entityId: user._id,
      details: 'Updated user profile'
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 