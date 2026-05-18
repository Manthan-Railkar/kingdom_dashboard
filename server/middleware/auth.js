const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'quantum26_secret');
    req.admin = await Admin.findById(decoded.id).select('-accessKeyHash');
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
