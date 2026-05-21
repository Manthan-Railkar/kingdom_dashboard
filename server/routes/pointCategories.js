const express = require('express');
const router = express.Router();
const PointCategory = require('../models/PointCategory');
const Kingdom = require('../models/Kingdom');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

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
router.post('/', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const category = new PointCategory(req.body);
    await category.save();

    // Initialize this category for all kingdoms with 0 points
    await Kingdom.updateMany(
      {},
      { $push: { pointsBreakdown: { category: category._id, value: 0 } } }
    );

    const updatedKingdoms = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    req.io.emit('leaderboard:update', updatedKingdoms);

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category
router.delete('/:id', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await PointCategory.findByIdAndDelete(req.params.id);
    
    // Remove this category from all kingdoms
    await Kingdom.updateMany(
      {},
      { $pull: { pointsBreakdown: { category: req.params.id } } }
    );

    const updatedKingdoms = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    req.io.emit('leaderboard:update', updatedKingdoms);

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
