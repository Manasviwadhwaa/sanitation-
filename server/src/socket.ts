import { Server } from 'socket.io';
import { httpServer } from './app.js';

export const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  }
});

io.on('connection', (socket) => {
  console.log(`📡 [Socket] Connected: ${socket.id}`);
});
