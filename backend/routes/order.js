const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

// Place an order (user)
router.post('/', auth, async (req, res) => {
  try {
    const { items } = req.body; // [{item, quantity, requirements}]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in order.' });
    }
    // Optionally: check inventory for each item
    const order = new Order({ user: req.user._id, items });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get own orders (user)
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dummy payment (user)
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.paymentStatus = 'paid';
    await order.save();
    res.json({ message: 'Payment successful', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: get all orders
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: accept order
router.post('/:id/accept', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'accepted';
    await order.save();
    res.json({ message: 'Order accepted', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: mark as delivered
router.post('/:id/deliver', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'delivered';
    await order.save();
    res.json({ message: 'Order delivered', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: reject order
router.post('/:id/reject', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order rejected', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 