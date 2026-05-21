const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// GET recent news
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ isVisible: true }).sort({ createdAt: -1 }).limit(20);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST news (admin)
router.post('/', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const item = new News(req.body);
    await item.save();
    req.io.emit('news:new', item);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE news (admin)
router.delete('/:id', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    req.io.emit('news:delete', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
