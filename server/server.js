const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const kingdomRoutes = require('./routes/kingdoms');
const roundRoutes = require('./routes/rounds');
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const { initializeSocketHandlers } = require('./socket/handlers');
const { autoSeed } = require('./seed/seed');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/kingdoms', kingdomRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  );
}

// Socket.io
initializeSocketHandlers(io);

// MongoDB + Start
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum26';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await autoSeed();
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 QUANTUM 26 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = { io };
