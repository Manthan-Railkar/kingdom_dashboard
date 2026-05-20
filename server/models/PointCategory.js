const mongoose = require('mongoose');

const pointCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '⭐' }
}, { timestamps: true });

module.exports = mongoose.model('PointCategory', pointCategorySchema);
