import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../lib/socket';
import type { FacilityData } from '../components/UI/FacilityCard';

interface LiveDataContextType {
  facilities: FacilityData[];
  isLive: boolean;
  lastUpdated: Date;
  fetchInitial: () => Promise<void>;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [isLive, setIsLive] = useState(socket.connected);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchInitial = useCallback(async () => {
    try {
      const hostname = window.location.hostname;
      const API_URL = import.meta.env.VITE_API_URL || `http://${hostname}:4000`;
      const res = await fetch(`${API_URL}/api/facilities`);
      const data = await res.json();
      setFacilities(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to fetch initial facilities:', e);
    }
  }, []);

  useEffect(() => {
    fetchInitial();

    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));

    socket.on('sensor_update', (update: any) => {
      setFacilities(prev => prev.map(f => 
        f.id === update.facility_id ? { 
          ...f, 
          health: { 
            ...f.health, 
            ammonia: update.ammonia, 
            humidity: update.humidity,
            last_reading: new Date().toISOString()
          } 
        } : f
      ));
      setLastUpdated(new Date());
    });

    socket.on('status_change', (update: any) => {
      setFacilities(prev => prev.map(f => 
        f.id === update.facility_id ? { ...f, current_status: update.new_status } : f
      ));
      setLastUpdated(new Date());
    });

    socket.on('queue_update', (update: any) => {
      setFacilities(prev => prev.map(f => 
        f.id === update.facility_id ? { ...f, occupancy: update.current_users, wait_time: update.wait_time } : f
      ));
      setLastUpdated(new Date());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('sensor_update');
      socket.off('status_change');
      socket.off('queue_update');
    };
  }, [fetchInitial]);

  return (
    <LiveDataContext.Provider value={{ facilities, isLive, lastUpdated, fetchInitial }}>
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = () => {
  const context = useContext(LiveDataContext);
  if (!context) throw new Error('useLiveData must be used within LiveDataProvider');
  return context;
};
