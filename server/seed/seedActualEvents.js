const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Round = require('../models/Round');

const ROUNDS = [
  // Day 1: The First Crown
  { roundNumber: 1, name: 'Rise of the Realm', description: 'The grand opening and introduction of the kingdoms.', status: 'ended', durationMinutes: 90, dayNumber: 1, dayTitle: 'The First Crown', timeLabel: '08:30 AM' },
  { roundNumber: 2, name: 'Cricket', description: 'Kingdom sports clash on the pitch.', status: 'ended', durationMinutes: 180, dayNumber: 1, dayTitle: 'The First Crown', timeLabel: '04:00 PM' },
  
  // Day 2: The Unveiling
  { roundNumber: 3, name: 'The Conspiracy', description: 'Intrigue and puzzle solving challenges.', status: 'ended', durationMinutes: 60, dayNumber: 2, dayTitle: 'The Unveiling', timeLabel: '08:30 AM' },
  { roundNumber: 4, name: 'Revelation', description: 'Uncovering secret scrolls and paths.', status: 'ended', durationMinutes: 90, dayNumber: 2, dayTitle: 'The Unveiling', timeLabel: '10:00 AM' },
  { roundNumber: 5, name: 'Attack', description: 'A tactical battle round between opposing sides.', status: 'ended', durationMinutes: 90, dayNumber: 2, dayTitle: 'The Unveiling', timeLabel: '12:30 PM' },
  { roundNumber: 6, name: 'Pickle Ball', description: 'Fast-paced paddle matches in the arena.', status: 'ended', durationMinutes: 120, dayNumber: 2, dayTitle: 'The Unveiling', timeLabel: '04:00 PM' },
  
  // Day 3: Royal Opulence
  { roundNumber: 7, name: 'The Royal Vogue', description: 'A showcase of royal style and banner presentation.', status: 'ended', durationMinutes: 60, dayNumber: 3, dayTitle: 'Royal Opulence', timeLabel: '08:30 AM' },
  { roundNumber: 8, name: 'The Royal Feast', description: 'A gourmet challenge of survival and speed.', status: 'ended', durationMinutes: 120, dayNumber: 3, dayTitle: 'Royal Opulence', timeLabel: '10:00 AM' },
  { roundNumber: 9, name: 'Football', description: 'The classic gridiron/association clash of kingdoms.', status: 'ended', durationMinutes: 120, dayNumber: 3, dayTitle: 'Royal Opulence', timeLabel: '04:00 PM' },
  
  // Day 4: Valor & Victory
  { roundNumber: 10, name: 'The Great Garba Battle', description: 'A clash of rhythm, movement, and endurance.', status: 'live', durationMinutes: 120, dayNumber: 4, dayTitle: 'Valor & Victory', timeLabel: '08:30 AM' },
  { roundNumber: 11, name: 'Trade Wars', description: 'A high-stakes economic simulation and negotiation battle.', status: 'upcoming', durationMinutes: 180, dayNumber: 4, dayTitle: 'Valor & Victory', timeLabel: '12:00 Noon' },
  
  // Day 5: Royal Ensemble
  { roundNumber: 12, name: 'Royal Ensemble', description: 'A formal gathering and banquet of the high houses.', status: 'upcoming', durationMinutes: 240, dayNumber: 5, dayTitle: 'Royal Ensemble', timeLabel: '06:30 PM Entry', location: 'Sahitya Sangh, Girgaon' },
  
  // Day 6: The Afterparty
  { roundNumber: 13, name: 'The Afterparty', description: 'The final celebration and award banquet of the realm.', status: 'upcoming', durationMinutes: 300, dayNumber: 6, dayTitle: 'The Afterparty', timeLabel: '06:00 PM onwards', theme: 'Dress up as any character from DC or Marvel', location: 'Brijmandal Banquet, Besides Wilson College Opp. Starbucks' }
];

const seedActualEvents = async () => {
  try {
    console.log('Clearing old rounds...');
    await Round.deleteMany({});
    
    console.log('Inserting actual events...');
    await Round.insertMany(ROUNDS);
    
    console.log('✅ Actual events successfully seeded into database!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding actual events:', err.message);
    process.exit(1);
  }
};

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum26';
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB for actual events seed...');
  seedActualEvents();
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
