import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const startStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false // We want manual control if possible, or at least raw-ish
        } 
      });
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(err as Error);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { stream, error, startStream, stopStream };
};
