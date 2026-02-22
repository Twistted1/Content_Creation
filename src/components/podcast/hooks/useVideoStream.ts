import { useState, useCallback, useEffect } from 'react';

type VideoMode = 'camera' | 'screen' | null;

export const useVideoStream = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mode, setMode] = useState<VideoMode>(null);

  const startVideo = useCallback(async () => {
    // If already running, stop first
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: 16/9
        },
        audio: false 
      });
      setVideoStream(stream);
      setMode('camera');
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(err as Error);
      setMode(null);
    }
  }, [videoStream]);

  const startScreenShare = useCallback(async () => {
    // If already running, stop first
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false // Audio handled separately
      });
      
      // Handle user clicking "Stop Sharing" in browser UI
      stream.getVideoTracks()[0].onended = () => {
        setVideoStream(null);
        setMode(null);
      };

      setVideoStream(stream);
      setMode('screen');
      setError(null);
    } catch (err) {
      console.error("Error accessing screen share:", err);
      setError(err as Error);
      setMode(null);
    }
  }, [videoStream]);

  const stopVideo = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setMode(null);
    }
  }, [videoStream]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { 
    videoStream, 
    videoMode: mode, // 'camera', 'screen', or null
    isVideoEnabled: !!mode, 
    startVideo, 
    startScreenShare, 
    stopVideo, 
    videoError: error 
  };
};
