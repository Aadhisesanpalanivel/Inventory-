const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// Get all activity logs (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { action, entity, startDate, endDate } = req.query;
    let query = {};

    if (action) {
      query.action = action;
    }

    if (entity) {
      query.entity = entity;
    }

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const activities = await ActivityLog.find(query)
      .populate('user', 'username email')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 