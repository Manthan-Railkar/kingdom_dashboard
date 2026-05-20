const express = require('express');
const router = express.Router();
const Kingdom = require('../models/Kingdom');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// GET all kingdoms sorted by rank
router.get('/', async (req, res) => {
  try {
    // Populate point categories if we were to support deep population, but standard is fine
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

// PATCH update points (super admin only)
router.patch('/:id/points', requireSuperAdmin, async (req, res) => {
  try {
    const { points, delta, clearDelta, pointsBreakdown } = req.body;
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
    
    if (pointsBreakdown !== undefined) {
      kingdom.pointsBreakdown = pointsBreakdown;
      // Option: Auto-sum pointsBreakdown to update points
      kingdom.points = pointsBreakdown.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
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

// PATCH update kingdom details (admin or superadmin)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    // Only superadmin can edit ANY kingdom. KingdomAdmin can only edit THEIR kingdom.
    if (req.admin.role !== 'superadmin' && String(req.admin.kingdomId) !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own kingdom' });
    }

    const kingdom = await Kingdom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });
    
    const updated = await Kingdom.find({ isActive: true }).sort({ rank: 1 });
    req.io.emit('leaderboard:update', updated);
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create kingdom (super admin)
router.post('/', requireSuperAdmin, async (req, res) => {
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
