const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema(
  {
    roundNumber: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'paused', 'ended'],
      default: 'upcoming',
    },
    durationMinutes: { type: Number, default: 90 },
    startTime: { type: Date },
    endTime: { type: Date },
    nextRoundName: { type: String, default: '' },
    isDoublePoints: { type: Boolean, default: false },
    dayNumber: { type: Number },
    dayTitle: { type: String, default: '' },
    timeLabel: { type: String, default: '' },
    location: { type: String, default: '' },
    theme: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Round', roundSchema);
