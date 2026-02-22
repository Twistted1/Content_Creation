import { useState, useEffect, useCallback } from 'react';

interface UseAudioMetersOptions {
  channels?: number;
  updateInterval?: number;
  simulation?: boolean;
}

export const useAudioMeters = (options: UseAudioMetersOptions = {}) => {
  const { 
    channels = 6, 
    updateInterval = 200,
    simulation = true 
  } = options;
  
  const [levels, setLevels] = useState<number[]>(Array(channels).fill(0.3));
  const [peaks, setPeaks] = useState<number[]>(Array(channels).fill(0));

  const simulateMeterActivity = useCallback(() => {
    setLevels(prev => prev.map(val => {
      const change = (Math.random() - 0.5) * 0.2;
      const newVal = Math.max(0.1, Math.min(0.9, val + change));
      
      // Update peaks
      setPeaks(prevPeaks => prevPeaks.map((peak, i) => {
        if (newVal > peak) {
          return newVal;
        }
        // Decay peaks over time
        return Math.max(0, peak - 0.01);
      }));
      
      return newVal;
    }));
  }, []);

  useEffect(() => {
    if (!simulation) return;

    const interval = setInterval(simulateMeterActivity, updateInterval);
    return () => clearInterval(interval);
  }, [simulation, updateInterval, simulateMeterActivity]);

  const resetPeaks = useCallback(() => {
    setPeaks(Array(channels).fill(0));
  }, [channels]);

  return {
    levels,
    peaks,
    resetPeaks,
    channels
  };
};
