const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Development JWT secret
const JWT_SECRET = 'your_jwt_secret_key_here';
// Admin registration code (in production, this should be in .env)
const ADMIN_CODE = 'admin123';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Determine user role
    const role = adminCode === ADMIN_CODE ? 'admin' : 'user';

    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    // Create activity log
    await ActivityLog.create({
      user: user._id,
      action: 'register',
      entity: 'auth',
      details: `User registered successfully as ${role}`
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create activity log
    await ActivityLog.create({
      user: user._id,
      action: 'login',
      entity: 'auth',
      details: 'User logged in successfully'
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    console.log('Login successful for user:', email);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 