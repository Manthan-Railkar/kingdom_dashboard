import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getKingdoms } from '../api';
import { getRounds, getCurrentRound } from '../api';
import { getNews } from '../api';
import { useSocket } from '../hooks/useSocket';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [kingdoms, setKingdoms] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [allRounds, setAllRounds] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedClients, setConnectedClients] = useState(0);

  const socket = useSocket();

  // Initial data fetch
  const fetchAll = useCallback(async () => {
    try {
      const [k, r, n, rounds] = await Promise.all([
        getKingdoms(),
        getCurrentRound(),
        getNews(),
        getRounds(),
      ]);
      setKingdoms(k);
      setCurrentRound(r);
      setNews(n);
      setAllRounds(rounds);
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('leaderboard:update', (updatedKingdoms) => {
      setKingdoms(updatedKingdoms);
    });

    socket.on('round:update', async (updatedRound) => {
      try {
        const r = await getCurrentRound();
        setCurrentRound(r);
      } catch (err) {
        console.error('Failed to sync current round', err);
      }
      setAllRounds((prev) => {
        const exists = prev.some((r) => r._id === updatedRound._id);
        if (exists) {
          return prev.map((r) => (r._id === updatedRound._id ? updatedRound : r));
        }
        return [...prev, updatedRound];
      });
    });

    socket.on('round:deleted', async (deletedId) => {
      try {
        const r = await getCurrentRound();
        setCurrentRound(r);
      } catch (err) {
        console.error('Failed to sync current round', err);
      }
      setAllRounds((prev) => prev.filter((r) => r._id !== deletedId));
    });

    socket.on('news:new', (item) => {
      setNews((prev) => [item, ...prev].slice(0, 20));
    });

    socket.on('news:delete', (id) => {
      setNews((prev) => prev.filter((n) => n._id !== id));
    });

    socket.on('clients:count', (count) => {
      setConnectedClients(count);
    });

    // Request current state on connect
    socket.emit('state:request');

    socket.on('state:sync', ({ kingdoms: k, round, news: n }) => {
      if (k) setKingdoms(k);
      if (round) setCurrentRound(round);
      if (n) setNews(n);
    });

    return () => {
      socket.off('leaderboard:update');
      socket.off('round:update');
      socket.off('round:deleted');
      socket.off('news:new');
      socket.off('news:delete');
      socket.off('clients:count');
      socket.off('state:sync');
    };
  }, [socket]);

  return (
    <AppContext.Provider value={{
      kingdoms, setKingdoms,
      currentRound, setCurrentRound,
      allRounds, setAllRounds,
      news, setNews,
      loading,
      connectedClients,
      socket,
      refresh: fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
