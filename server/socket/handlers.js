let connectedClients = 0;

const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    connectedClients++;
    io.emit('clients:count', connectedClients);
    console.log(`🔌 Client connected: ${socket.id} (Total: ${connectedClients})`);

    socket.on('disconnect', () => {
      connectedClients--;
      io.emit('clients:count', connectedClients);
      console.log(`🔌 Client disconnected: ${socket.id} (Total: ${connectedClients})`);
    });

    // Admin joins private room
    socket.on('admin:join', () => {
      socket.join('admin');
      socket.emit('admin:joined', { message: 'Admin room joined' });
    });

    // Client requests current state sync
    socket.on('state:request', async () => {
      try {
        const Kingdom = require('../models/Kingdom');
        const Round = require('../models/Round');
        const News = require('../models/News');
        const kingdoms = await Kingdom.find({ isActive: true })
          .sort({ rank: 1 })
          .populate('pointsBreakdown.category', 'name icon');
        const round = await Round.findOne({ status: { $in: ['live', 'paused'] } });
        const news = await News.find({ isVisible: true }).sort({ createdAt: -1 }).limit(10);
        socket.emit('state:sync', { kingdoms, round, news });
      } catch (err) {
        console.error('State sync error:', err.message);
      }
    });
  });
};

module.exports = { initializeSocketHandlers };
