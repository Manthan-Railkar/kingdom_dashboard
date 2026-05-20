const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'global' },
  showLeaderboard: { type: Boolean, default: true },
  showTrends: { type: Boolean, default: true },
  showNews: { type: Boolean, default: true },
  showTeams: { type: Boolean, default: true },
  showEvents: { type: Boolean, default: true },
  showGallery: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
