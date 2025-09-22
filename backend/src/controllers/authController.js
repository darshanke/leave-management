const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signJwt } = require('../utils/tokens');

exports.register = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('employeeId').notEmpty(),
  body('name').notEmpty(),
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password, employeeId, name, department, role, managerEmail } = req.body;
    try {
      const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
      if (exists) return res.status(409).json({ message: 'User already exists' });

      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        role: role || 'employee',
        email,
        employeeId,
        name,
        department,
        passwordHash,
        managerEmail
      });
      return res.status(201).json({ message: 'Registered', userId: user._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.login = [
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signJwt({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '1d');
      const refreshToken = signJwt({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_REFRESH_EXPIRES_IN || '7d');
      return res.json({ token, refreshToken,user: { id: user._id, email: user.email, role: user.role, name: user.name } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
];
