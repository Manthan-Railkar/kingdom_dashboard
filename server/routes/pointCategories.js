const express = require('express');
const router = express.Router();
const PointCategory = require('../models/PointCategory');
const { requireSuperAdmin } = require('../middleware/auth');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await PointCategory.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category
router.post('/', requireSuperAdmin, async (req, res) => {
  try {
    const category = new PointCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category
router.delete('/:id', requireSuperAdmin, async (req, res) => {
  try {
    await PointCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
