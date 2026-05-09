import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string = import.meta.env.VITE_WS_URL || 'http://127.0.0.1:4000') => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!url) return;

    const socket = io(url, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to SAFAI Backend');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from SAFAI Backend');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return { socket: socketRef.current, isConnected };
};
