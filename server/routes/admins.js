const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET all admins
router.get('/', protect, async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-accessKeyHash');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new admin
router.post('/', protect, async (req, res) => {
  try {
    const { username, displayName, role, accessKey } = req.body;
    
    // Check if exists
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    // Hash key
    const salt = await bcrypt.genSalt(10);
    const accessKeyHash = await bcrypt.hash(String(accessKey), salt);

    const admin = new Admin({
      username,
      displayName,
      role: role || 'admin',
      accessKeyHash
    });

    await admin.save();
    
    // Return without hash
    const adminObj = admin.toObject();
    delete adminObj.accessKeyHash;
    res.status(201).json(adminObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE admin
router.delete('/:id', protect, async (req, res) => {
  try {
    // Prevent deleting oneself
    if (req.admin.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
