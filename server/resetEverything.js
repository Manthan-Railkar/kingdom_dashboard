const mongoose = require('mongoose');
require('dotenv').config();

const Kingdom = require('./models/Kingdom');

async function resetEverything() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quantum26');
    console.log('Connected to MongoDB.');

    const kingdoms = await Kingdom.find();
    for (const k of kingdoms) {
      k.points = 0;
      k.previousPoints = 0;
      k.pointsDelta = 0;
      k.pointsBreakdown = [];
      k.deltaHistory = [];
      await k.save();
    }
    console.log(`Reset ${kingdoms.length} kingdoms successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting kingdoms:', err);
    process.exit(1);
  }
}

resetEverything();
