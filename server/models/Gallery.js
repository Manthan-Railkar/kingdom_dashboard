const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  caption: { type: String, default: '' },
  mimetype: { type: String },
  size: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  uploadedByKingdom: { type: mongoose.Schema.Types.ObjectId, ref: 'Kingdom', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
