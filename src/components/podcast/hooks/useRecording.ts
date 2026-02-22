import { useState, useCallback, useEffect, useRef } from 'react';

interface UseRecordingOptions {
  onStart?: () => void;
  onStop?: (duration: number, audioBlob: Blob | null) => void;
  maxDuration?: number; // in seconds
}

export const useRecording = (options: UseRecordingOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mp3' }); // Note: Webm/opus is standard, but we'll label as mp3 or webm
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        const endTime = Date.now();
        const recordDuration = startTime ? (endTime - startTime) / 1000 : 0;

        if (options.onStop) {
          options.onStop(recordDuration, blob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStartTime(Date.now());
      setDuration(0);
      
      if (options.onStart) {
        options.onStart();
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  }, [isRecording, options, startTime]);

  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setStartTime(null);
    // onStop will be called by the mediaRecorder.onstop event handler
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Update duration while recording
  useEffect(() => {
    if (!isRecording || !startTime) return;

    const interval = setInterval(() => {
      const currentDuration = (Date.now() - startTime) / 1000;
      setDuration(currentDuration);
      
      // Auto-stop if max duration reached
      if (options.maxDuration && currentDuration >= options.maxDuration) {
        stopRecording();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, startTime, options.maxDuration, stopRecording]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    duration,
    formatDuration,
    startRecording,
    stopRecording,
    toggleRecording
  };
};
