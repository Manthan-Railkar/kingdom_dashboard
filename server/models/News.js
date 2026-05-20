const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ['news', 'announcement', 'alert', 'achievement'],
      default: 'news',
    },
    kingdomRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Kingdom', default: null },
    kingdomName: { type: String, default: '' },
    kingdomEmblem: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
