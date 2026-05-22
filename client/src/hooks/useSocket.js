import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socketInstance) {
      const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
      socketInstance = io(API_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
    }
    setSocket(socketInstance);
    return () => {};
  }, []);

  return socket;
}
