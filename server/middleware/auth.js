const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const requireAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'quantum26_secret');
    req.admin = await Admin.findById(decoded.id).select('-accessKeyHash');
    if (!req.admin) return res.status(401).json({ message: 'Admin not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Super Admin access required' });
  }
};

module.exports = { requireAdmin, requireSuperAdmin };
