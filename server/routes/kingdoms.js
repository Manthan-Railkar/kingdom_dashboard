const express = require('express');
const router = express.Router();
const Kingdom = require('../models/Kingdom');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderType = 'kingdoms';
    let includeKingdomId = false;

    if (req.path.includes('/upload-member')) {
      folderType = 'rosters';
      includeKingdomId = true;
    } else if (req.path.includes('/upload-asset')) {
      const field = req.query.field;
      if (field) {
        folderType = field.endsWith('s') ? field : field + 's';
      }
    }
    
    let dir = path.join(__dirname, `../uploads/${folderType}/`);
    if (includeKingdomId) {
      const kingdomId = req.params.id || 'general';
      dir = path.join(dir, kingdomId);
    }

    const fs = require('fs');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const isMember = req.path.includes('/upload-member');
    const field = req.query.field || 'kingdom';
    const prefix = isMember ? 'roster-' : `${field}-`;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// GET all kingdoms sorted by rank
router.get('/', async (req, res) => {
  try {
    const kingdoms = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    res.json(kingdoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single kingdom
router.get('/:id', async (req, res) => {
  try {
    const kingdom = await Kingdom.findById(req.params.id)
      .populate('pointsBreakdown.category', 'name icon');
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update points (super admin only)
router.patch('/:id/points', requireAdmin, requireSuperAdmin, async (req, res) => {
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
      const newPoints = pointsBreakdown.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
      if (delta === undefined && points === undefined) {
        kingdom.pointsDelta = newPoints - kingdom.previousPoints;
      }
      kingdom.points = newPoints;
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

    const updated = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
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
    
    const updated = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    req.io.emit('leaderboard:update', updated);
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create kingdom (super admin)
router.post('/', requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const kingdom = new Kingdom(req.body);
    await kingdom.save();
    const all = await Kingdom.find({ isActive: true }).sort({ points: -1 });
    await Promise.all(all.map((k, i) => Kingdom.findByIdAndUpdate(k._id, { rank: i + 1 })));
    const updated = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    req.io.emit('leaderboard:update', updated);
    res.status(201).json(kingdom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST upload asset for a kingdom (admin or superadmin)
router.post('/:id/upload-asset', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && String(req.admin.kingdomId) !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own kingdom' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { field } = req.body;
    if (!['emblem', 'flag', 'map', 'designs'].includes(field)) {
      return res.status(400).json({ message: 'Invalid field specified' });
    }

    const kingdom = await Kingdom.findById(req.params.id);
    if (!kingdom) return res.status(404).json({ message: 'Kingdom not found' });

    const folderType = field.endsWith('s') ? field : field + 's';
    const fileUrl = `/uploads/${folderType}/${req.file.filename}`;

    if (field === 'designs') {
      kingdom.designs.push(fileUrl);
    } else {
      kingdom[field] = fileUrl;
    }

    await kingdom.save();
    
    const updated = await Kingdom.find({ isActive: true })
      .sort({ rank: 1 })
      .populate('pointsBreakdown.category', 'name icon');
    req.io.emit('leaderboard:update', updated);
    
    res.json(kingdom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upload team member portrait
router.post('/:id/upload-member', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && String(req.admin.kingdomId) !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own kingdom' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileUrl = `/uploads/rosters/${req.params.id}/${req.file.filename}`;
    res.json({ filename: fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
