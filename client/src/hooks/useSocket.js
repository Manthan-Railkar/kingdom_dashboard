import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(window.location.origin, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
    }
    setSocket(socketInstance);
    return () => {};
  }, []);

  return socket;
}
