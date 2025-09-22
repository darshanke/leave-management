const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = null) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
      }
      const token = authHeader.split(' ')[1];
      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (verifyError) {
        if (verifyError.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token', error: verifyError.message });
      }
      if (!payload.id) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return res.status(401).json({ message: 'User not found' });
      if (roles && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
};

module.exports = auth;
