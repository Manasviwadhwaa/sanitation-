import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_WS_URL || 'http://127.0.0.1:4000';

export const socket: Socket = io(URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Debug logs
socket.on('connect', () => {
  console.log('📡 [Socket] Connected to SAAF Neural Link');
});

socket.on('disconnect', () => {
  console.log('📡 [Socket] Disconnected from SAAF Neural Link');
});
