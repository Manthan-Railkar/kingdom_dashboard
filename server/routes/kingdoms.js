const express = require('express');
const router = express.Router();
const Kingdom = require('../models/Kingdom');
const { protect } = require('../middleware/auth');

// GET all kingdoms sorted by rank
router.get('/', async (req, res) => {
  try {
    const kingdoms = await Kingdom.find({ isActive: true }).sort({ rank: 1 });
    res.json(kingdoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single kingdom
router.get('/:id', async (req, res) => {
  try {
    const kingdom = await Kingdom.findById(req.params.id);
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update points (admin only)
router.patch('/:id/points', protect, async (req, res) => {
  try {
    const { points, delta, clearDelta } = req.body;
    const kingdom = await Kingdom.findById(req.params.id);
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });

    kingdom.previousPoints = kingdom.points;
    if (delta !== undefined) {
      kingdom.points = Math.max(0, kingdom.points + Number(delta));
      kingdom.pointsDelta = Number(delta);
    } else if (points !== undefined) {
      kingdom.pointsDelta = clearDelta ? 0 : (Number(points) - kingdom.points);
      kingdom.points = Math.max(0, Number(points));
    }

    // Add snapshot to history
    kingdom.deltaHistory.push({ points: kingdom.points });
    while (kingdom.deltaHistory.length > 20) {
      kingdom.deltaHistory.shift();
    }
    kingdom.markModified('deltaHistory');
    await kingdom.save();

    // Re-rank all kingdoms
    const all = await Kingdom.find({ isActive: true }).sort({ points: -1 });
    await Promise.all(all.map((k, i) => Kingdom.findByIdAndUpdate(k._id, { rank: i + 1 })));

    const updated = await Kingdom.find({ isActive: true }).sort({ rank: 1 });
    req.io.emit('leaderboard:update', updated);
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update kingdom details (admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const kingdom = await Kingdom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });
    
    const updated = await Kingdom.find({ isActive: true }).sort({ rank: 1 });
    req.io.emit('leaderboard:update', updated);
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create kingdom (admin)
router.post('/', protect, async (req, res) => {
  try {
    const kingdom = new Kingdom(req.body);
    await kingdom.save();
    const all = await Kingdom.find({ isActive: true }).sort({ points: -1 });
    await Promise.all(all.map((k, i) => Kingdom.findByIdAndUpdate(k._id, { rank: i + 1 })));
    const updated = await Kingdom.find({ isActive: true }).sort({ rank: 1 });
    req.io.emit('leaderboard:update', updated);
    res.status(201).json(kingdom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
