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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Round', roundSchema);
