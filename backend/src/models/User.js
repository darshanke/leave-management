const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['employee', 'admin', 'hr', 'manager'], default: 'employee' },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String },
  passwordHash: { type: String, required: true },
  managerEmail: { type: String }, // used to send approval to reporting manager
  leaveBalance: {
    casual: { type: Number, default: 10 },
    privilege: { type: Number, default: 10 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
