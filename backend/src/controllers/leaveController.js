const { body, validationResult } = require('express-validator');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveNotificationToManager, sendEmail } = require('../utils/email');

exports.applyLeave = [
  body('type').isIn(['casual', 'privilege']),
  body('reasonType').isIn(['sick', 'vacation']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    console.log("errors ",req.body,errors);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const { type, reasonType, startDate, endDate, comments } = req.body;
      // calculate days inclusive
      const s = new Date(startDate);
      const e = new Date(endDate);
      const days = Math.round((e - s) / (24*60*60*1000)) + 1;
      if (days <= 0) return res.status(400).json({ message: 'End date must be after start date' });

      const user = req.user;
      console.log("user ",user);
      const leave = await LeaveRequest.create({
        applicant: user._id,
        applicantSnapshot: { name: user.name, email: user.email, employeeId: user.employeeId, department: user.department },
        type, reasonType, startDate: s, endDate: e, days, comments
      });
      console.log("leave ",leave)

      // Notify manager
      const managerEmail = user.managerEmail;
      console.log("managerEmail ",managerEmail);
      if (managerEmail) {
        await sendLeaveNotificationToManager({
          to: managerEmail,
          leaveId: leave._id,
          applicantName: user.name,
          days,
          type,
          reasonType
        });
      } else {
        // fallback: send to HR (admins with role hr)
        const hr = await User.findOne({ role: 'hr' });
        if (hr) {
          await sendEmail({
            to: hr.email,
            subject: `Leave request from ${user.name}`,
            html: `<p>No manager assigned. Leave request waiting for HR. Leave ID: ${leave._id}</p>`
          });
        }
      }

      return res.status(201).json({ message: 'Leave applied', leaveId: leave._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.getMyLeaves = async (req, res) => {
  const leaves = await LeaveRequest.find({ applicant: req.user._id }).sort('-requestedAt');
  res.json(leaves);
};

exports.getPendingLeaves = async (req, res) => {
  const leaves = await LeaveRequest.find({ status: 'pending' }).populate('applicant', 'name email employeeId department');
  res.json(leaves);
};

// Manager/HR endpoints to approve/reject
exports.handleAction = async (req, res) => {
  const { leaveId } = req.params;
  const { status, comment } = req.body;
  try {
    const leave = await LeaveRequest.findById(leaveId).populate('applicant');
    console.log("leave ",leave);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (status === 'approve') {
      console.log("approving ");
      leave.status = 'approved';
      // leave.managerAction = { actor: req.user.email, comment, actedAt: new Date() };
      // Deduct balance
      const applicant = leave.applicant;
      const field = leave.type === 'casual' ? 'leaveBalance.casual' : 'leaveBalance.privilege';
      const curr = applicant.leaveBalance[leave.type];
      if (curr >= leave.days) {
        applicant.leaveBalance[leave.type] = curr - leave.days;
        await applicant.save();
      } else {
        // allow manager to approve even if balance is low; optionally block
      }
    } else if (status === 'reject') {
      leave.status = 'rejected';
      // leave.managerAction = { actor: req.user.email, comment, actedAt: new Date() };
    } else if (status === 'forward') {
      leave.status = 'forwarded';
      leave.forwardedToHRAt = new Date();
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
    await leave.save();

    // notify applicant
    await sendEmail({
      to: leave.applicant.email,
      subject: `Your leave request has been ${leave.status}`,
      html: `<p>Your leave request (${leave._id}) status: ${leave.status}. Comment: ${comment || ''}</p>`
    });

    return res.json({ message: 'Action applied', status: leave.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
