const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    displayName: { type: String, default: 'Super Admin' },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'superadmin' },
    accessKeyHash: { type: String, required: true },
    kingdomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kingdom' }, // Null for superadmin
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

adminSchema.methods.compareKey = async function (key) {
  return bcrypt.compare(String(key), this.accessKeyHash);
};

module.exports = mongoose.model('Admin', adminSchema);
