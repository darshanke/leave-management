const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantSnapshot: { type: Object }, // keep small snapshot: {name, email, employeeId, department}
  type: { type: String, enum: ['casual', 'privilege'], required: true },
  reasonType: { type: String, enum: ['sick', 'vacation'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'forwarded'], default: 'pending' },
  comments: { type: String },
  requestedAt: { type: Date, default: Date.now },
  managerAction: {
    actor: { type: String },
    comment: { type: String },
    actedAt: { type: Date }
  },
  forwardedToHRAt: { type: Date },
  hrAction: {
    actor: { type: String },
    comment: { type: String },
    actedAt: { type: Date }
  }
});

module.exports = mongoose.model('LeaveRequest', leaveSchema);
