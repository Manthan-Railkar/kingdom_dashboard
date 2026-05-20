const mongoose = require('mongoose');

const pointSnapshotSchema = new mongoose.Schema(
  { points: Number, timestamp: { type: Date, default: Date.now } },
  { _id: false }
);

const kingdomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    emblem: { type: String, default: '🏰' },
    color: { type: String, default: '#B87333' },
    accentColor: { type: String, default: '#D4956A' },
    points: { type: Number, default: 0 },
    pointsBreakdown: { 
      type: [{ category: { type: mongoose.Schema.Types.ObjectId, ref: 'PointCategory' }, value: Number }], 
      default: [] 
    },
    previousPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    pointsDelta: { type: Number, default: 0 },
    deltaHistory: { type: [pointSnapshotSchema], default: [] },
    isActive: { type: Boolean, default: true },
    members: { type: Number, default: 0 },
    teamMembers: { type: [{ name: String, role: String, image: String }], default: [] },
    description: { type: String, default: '' },
    flag: { type: String, default: '' },
    map: { type: String, default: '' },
    designs: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kingdom', kingdomSchema);
