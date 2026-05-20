const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const { protect } = require('../middleware/auth');

// GET current live/paused round
router.get('/current', async (req, res) => {
  try {
    let round = await Round.findOne({ status: { $in: ['live', 'paused'] } }).sort({ roundNumber: -1 });
    if (!round) round = await Round.findOne({ status: 'upcoming' }).sort({ roundNumber: 1 });
    res.json(round || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ roundNumber: 1 });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create round (admin)
router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.roundNumber === undefined) {
      const lastRound = await Round.findOne().sort({ roundNumber: -1 });
      data.roundNumber = lastRound ? lastRound.roundNumber + 1 : 1;
    }
    const round = new Round(data);
    await round.save();
    req.io.emit('round:update', round);
    res.status(201).json(round);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update round status (admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const round = await Round.findById(req.params.id);
    if (!round) return res.status(404).json({ message: 'Round not found' });

    round.status = status;
    if (status === 'live' && !round.startTime) round.startTime = new Date();
    if (status === 'ended') round.endTime = new Date();
    await round.save();
    req.io.emit('round:update', round);
    res.json(round);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update round details (admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const updateData = { ...req.body };
    const oldRound = await Round.findById(req.params.id);
    
    if (!oldRound) return res.status(404).json({ message: 'Round not found' });

    if (updateData.status && updateData.status !== oldRound.status) {
      if (updateData.status === 'live' && !oldRound.startTime) updateData.startTime = new Date();
      if (updateData.status === 'ended') updateData.endTime = new Date();
    }

    const round = await Round.findByIdAndUpdate(req.params.id, updateData, { new: true });
    req.io.emit('round:update', round);
    res.json(round);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE round (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const round = await Round.findByIdAndDelete(req.params.id);
    if (!round) return res.status(404).json({ message: 'Round not found' });
    req.io.emit('round:deleted', req.params.id);
    res.json({ message: 'Round deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
