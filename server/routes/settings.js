const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { requireSuperAdmin } = require('../middleware/auth');

// GET settings (public, so sidebar can fetch)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      settings = await Settings.create({ key: 'global' });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH settings (super admin only)
router.patch('/', requireSuperAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: 'global' },
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
