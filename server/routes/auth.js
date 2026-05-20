const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { requireAdmin } = require('../middleware/auth');

// POST login with access key
router.post('/login', async (req, res) => {
  try {
    const { username, accessKey } = req.body;
    const admin = await Admin.findOne({ username }).populate('kingdomId', 'name color emblem');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await admin.compareKey(String(accessKey));
    if (!isMatch) return res.status(401).json({ message: 'Invalid access key' });

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'quantum26_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
        lastLogin: admin.lastLogin,
        kingdomId: admin.kingdomId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET current admin
router.get('/me', requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).populate('kingdomId', 'name color emblem');
    res.json({
      id: admin._id,
      username: admin.username,
      displayName: admin.displayName,
      role: admin.role,
      lastLogin: admin.lastLogin,
      kingdomId: admin.kingdomId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST logout (client-side, but for audit)
router.post('/logout', requireAdmin, (req, res) => res.json({ message: 'Logged out' }));

module.exports = router;
