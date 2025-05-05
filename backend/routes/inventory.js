const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');

// Get all inventory items (accessible to all authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await Inventory.find(query)
      .populate('addedBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 });

    // Log the view action
    await ActivityLog.create({
      user: req.user._id,
      action: 'view',
      entity: 'inventory',
      details: 'Viewed inventory list'
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single inventory item
router.get('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await Inventory.findById(req.params.id)
      .populate('addedBy', 'username')
      .populate('updatedBy', 'username');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Log the view action
    await ActivityLog.create({
      user: req.user._id,
      action: 'view',
      entity: 'inventory',
      entityId: item._id,
      details: 'Viewed inventory item details'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new inventory item (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = new Inventory({
      ...req.body,
      addedBy: req.user._id
    });

    await item.save();

    // Log the create action
    await ActivityLog.create({
      user: req.user._id,
      action: 'create',
      entity: 'inventory',
      entityId: item._id,
      details: 'Created new inventory item'
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update inventory item (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updates = {
      ...req.body,
      updatedBy: req.user._id
    };

    Object.assign(item, updates);
    await item.save();

    // Log the update action
    await ActivityLog.create({
      user: req.user._id,
      action: 'update',
      entity: 'inventory',
      entityId: item._id,
      details: 'Updated inventory item'
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete inventory item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.deleteOne();

    // Log the delete action
    await ActivityLog.create({
      user: req.user._id,
      action: 'delete',
      entity: 'inventory',
      entityId: item._id,
      details: 'Deleted inventory item'
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 