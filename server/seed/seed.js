const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Kingdom = require('../models/Kingdom');
const Round = require('../models/Round');
const News = require('../models/News');
const Admin = require('../models/Admin');

// Generate realistic sparkline history
const generateHistory = (basePoints, delta, steps = 15) => {
  const history = [];
  let pts = Math.max(0, basePoints - Math.abs(delta) * 4);
  for (let i = 0; i < steps; i++) {
    const noise = Math.floor((Math.random() - 0.3) * Math.abs(delta || 100) * 0.4);
    pts = Math.max(0, pts + noise + (delta >= 0 ? Math.abs(delta) * 0.1 : -Math.abs(delta) * 0.1));
    history.push({ points: Math.floor(pts), timestamp: new Date(Date.now() - (steps - i) * 300000) });
  }
  history.push({ points: basePoints, timestamp: new Date() });
  return history;
};

const KINGDOMS = [
  { name: 'House Phoenix', emblem: '🦅', color: '#c9a227', accentColor: '#ffd700', points: 12850, rank: 1, pointsDelta: 620, members: 12, description: 'The rising flame — fastest climbers of the competition.' },
  { name: 'House Titans', emblem: '🦁', color: '#4a9eff', accentColor: '#60b0ff', points: 10420, rank: 2, pointsDelta: 310, members: 11, description: 'Unstoppable force, strategic dominance.' },
  { name: 'House Dragons', emblem: '🐉', color: '#cc3333', accentColor: '#ff4444', points: 9210, rank: 3, pointsDelta: 120, members: 13, description: 'Ancient power, breathing fire through every round.' },
  { name: 'House Knights', emblem: '🛡', color: '#33aa66', accentColor: '#44cc77', points: 7860, rank: 4, pointsDelta: 80, members: 10, description: 'Defenders of honor, masters of strategy.' },
  { name: 'House Wolves', emblem: '🐺', color: '#9933cc', accentColor: '#aa44dd', points: 6540, rank: 5, pointsDelta: -50, members: 12, description: 'Cunning predators who strike at midnight.' },
  { name: 'House Kraken', emblem: '🐙', color: '#00bbaa', accentColor: '#00ccbb', points: 5430, rank: 6, pointsDelta: 40, members: 9, description: 'Deep intelligence, rising from the depths.' },
  { name: 'House Griffin', emblem: '🦅', color: '#dd8800', accentColor: '#ee9900', points: 4890, rank: 7, pointsDelta: -30, members: 11, description: 'Fierce and proud — legends of the sky.' },
  { name: 'House Eagles', emblem: '🦅', color: '#5599ff', accentColor: '#66aaff', points: 3760, rank: 8, pointsDelta: 20, members: 10, description: 'Swift and sharp — eyes on the prize.' },
  { name: 'House Minotaurs', emblem: '🐂', color: '#994422', accentColor: '#bb5533', points: 2950, rank: 9, pointsDelta: -10, members: 12, description: 'Raw power, unstoppable charge.' },
  { name: 'House Vipers', emblem: '🐍', color: '#339933', accentColor: '#44aa44', points: 1620, rank: 10, pointsDelta: -70, members: 8, description: 'Quiet and deadly — patience is their weapon.' },
];

const ROUNDS = [
  { roundNumber: 1, name: 'Brain Blitz', description: 'Quick-fire quiz rounds testing general knowledge', status: 'ended', durationMinutes: 60, nextRoundName: 'Code Conquest', startTime: new Date(Date.now() - 4 * 3600000), endTime: new Date(Date.now() - 2 * 3600000) },
  { roundNumber: 2, name: 'Auction Round', description: 'Kingdoms bid for power-ups and strategic advantages', status: 'ended', durationMinutes: 45, nextRoundName: 'Code Conquest', startTime: new Date(Date.now() - 2 * 3600000), endTime: new Date(Date.now() - 3600000) },
  { roundNumber: 3, name: 'Code Conquest', description: 'Kingdoms battle in programming challenges and algorithm wars', status: 'live', durationMinutes: 90, nextRoundName: 'Brain Blitz 2.0', startTime: new Date(Date.now() - 1000 * 60 * 24) },
  { roundNumber: 4, name: 'Brain Blitz 2.0', description: 'Advanced knowledge battle with surprise categories', status: 'upcoming', durationMinutes: 60, nextRoundName: 'Final Battle' },
  { roundNumber: 5, name: 'Final Battle', description: 'The ultimate showdown — winner takes the crown', status: 'upcoming', durationMinutes: 120, nextRoundName: '' },
];

const NEWS = [
  { text: 'House Titans gains 500 points in Strategy Round', type: 'achievement', kingdomName: 'House Titans', kingdomEmblem: '🦁', createdAt: new Date(Date.now() - 5 * 60000) },
  { text: 'Double points in the next round!', type: 'announcement', kingdomEmblem: '⚡', createdAt: new Date(Date.now() - 15 * 60000) },
  { text: 'House Phoenix is on fire! 🔥 Climbing fast!', type: 'news', kingdomName: 'House Phoenix', kingdomEmblem: '🦅', createdAt: new Date(Date.now() - 3600000) },
  { text: 'Auction Round was intense! All kingdoms went all in.', type: 'news', kingdomEmblem: '⚔', createdAt: new Date(Date.now() - 2 * 3600000) },
  { text: 'Welcome to QUANTUM 26! Prepare for the ultimate battle of intellect and strategy.', type: 'announcement', kingdomEmblem: '♛', isPinned: true, createdAt: new Date(Date.now() - 3 * 3600000) },
];

const autoSeed = async () => {
  try {
    const kingdomCount = await Kingdom.countDocuments();
    const adminCount = await Admin.countDocuments();

    if (kingdomCount === 0) {
      console.log('🌱 Seeding kingdoms...');
      const docs = KINGDOMS.map((k) => ({ ...k, deltaHistory: generateHistory(k.points, k.pointsDelta) }));
      await Kingdom.insertMany(docs);
      console.log(`✅ Seeded ${docs.length} kingdoms`);
    }

    const roundCount = await Round.countDocuments();
    if (roundCount === 0) {
      console.log('🌱 Seeding rounds...');
      await Round.insertMany(ROUNDS);
      console.log(`✅ Seeded ${ROUNDS.length} rounds`);
    }

    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log('🌱 Seeding news...');
      await News.insertMany(NEWS);
      console.log(`✅ Seeded ${NEWS.length} news items`);
    }

    if (adminCount === 0) {
      console.log('🌱 Seeding admin...');
      const rawKey = process.env.ADMIN_ACCESS_KEY || '2626';
      const salt = await bcrypt.genSalt(10);
      const accessKeyHash = await bcrypt.hash(rawKey, salt);
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'superadmin',
        displayName: process.env.ADMIN_DISPLAY_NAME || 'Super Admin',
        role: 'superadmin',
        accessKeyHash,
      });
      console.log(`✅ Admin seeded (key: ${rawKey})`);
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};

// Standalone seed script
if (require.main === module) {
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum26';
  mongoose.connect(MONGO_URI).then(async () => {
    console.log('Connected — running seed...');
    await autoSeed();
    console.log('Seed complete.');
    process.exit(0);
  }).catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { autoSeed };
