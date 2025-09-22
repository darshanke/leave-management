const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash');
  res.json(user);
};

exports.getEmployeeDetails = async (req, res) => {
  // Admin route
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

exports.updateLeaveBalance = async (req, res) => {
  const { employeeId, casual, privilege } = req.body;
  const user = await User.findOne({ employeeId });
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  if (typeof casual === 'number') user.leaveBalance.casual = casual;
  if (typeof privilege === 'number') user.leaveBalance.privilege = privilege;
  await user.save();
  res.json({ message: 'Updated', user });
};
