const mongoose = require('mongoose');

const pointSnapshotSchema = new mongoose.Schema(
  { points: Number, timestamp: { type: Date, default: Date.now } },
  { _id: false }
);

const kingdomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    emblem: { type: String, default: '🏰' },
    color: { type: String, default: '#c9a227' },
    accentColor: { type: String, default: '#ffd700' },
    points: { type: Number, default: 0 },
    previousPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    pointsDelta: { type: Number, default: 0 },
    deltaHistory: { type: [pointSnapshotSchema], default: [] },
    isActive: { type: Boolean, default: true },
    members: { type: Number, default: 0 },
    teamMembers: { type: [{ name: String, role: String }], default: [] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kingdom', kingdomSchema);
