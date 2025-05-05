const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'view', 'login', 'register']
  },
  entity: {
    type: String,
    required: true,
    enum: ['inventory', 'user', 'auth']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'entity'
  },
  details: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema); 