require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin:"https://inventory-tau-one.vercel.app/"
  ));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://aadhiaadhi5435:Aadhipriyanka@2131@cluster0.xw5k4vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/stockify";
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set default JWT secret for development
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_jwt_secret_key_here';
  console.log('Using default JWT secret for development');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/order', require('./routes/order'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
