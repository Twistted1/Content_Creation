import { useState, useRef, useCallback } from 'react';

interface TimelineItem {
  id: string;
  src: string;
  duration: number; // seconds
  start: number; // seconds
  type: 'image' | 'video' | 'voice' | 'music';
}

interface RenderOptions {
  width?: number;
  height?: number;
  fps?: number;
}

export const useVideoRenderer = (options: RenderOptions = {}) => {
  const { width = 1280, height = 720, fps = 30 } = options;
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const renderTimeline = useCallback(async (
    videoTrack: TimelineItem[], 
    audioTrack: TimelineItem[],
    onComplete: (blob: Blob) => void
  ) => {
    if (isRendering) return;
    setIsRendering(true);
    setProgress(0);
    chunksRef.current = [];

    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsRendering(false);
      throw new Error("Could not create canvas context");
    }
    
    // Fill background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Setup Audio
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();
    audioContextRef.current = audioCtx;

    // Load all audio buffers ahead of time (simple approach)
    // For a large app, we'd stream them.
    const audioBuffers: Record<string, AudioBuffer> = {};
    
    try {
      await Promise.all(audioTrack.map(async (item) => {
        try {
          const response = await fetch(item.src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          audioBuffers[item.id] = audioBuffer;
        } catch (e) {
          console.error(`Failed to load audio ${item.id}`, e);
        }
      }));

      // Load all images
      const imageElements: Record<string, HTMLImageElement> = {};
      await Promise.all(videoTrack.map(async (item) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            imageElements[item.id] = img;
            resolve(null);
          };
          img.onerror = () => {
             console.warn(`Failed to load image ${item.src}`);
             // Resolve anyway to continue rendering
             resolve(null);
          };
          img.src = item.src;
        });
      }));

      // 3. Setup Recorder
      const canvasStream = canvas.captureStream(fps);
      const audioStream = dest.stream;
      
      // Combine tracks
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setIsRendering(false);
        audioCtx.close();
        onComplete(blob);
      };

      mediaRecorder.start();

      // 4. Playback / Rendering Loop
      const totalDuration = Math.max(
        ...videoTrack.map(v => v.start + v.duration),
        ...audioTrack.map(a => a.start + a.duration),
        0
      );
      
      const startTime = Date.now();
      
      // Schedule Audio Sources
      audioTrack.forEach(item => {
        const buffer = audioBuffers[item.id];
        if (buffer) {
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(dest);
          // start(when, offset, duration)
          // "when" is in audioCtx time. 
          // We need to sync audioCtx start with our recording start.
          // But we are recording *live* execution. 
          // So we schedule them relative to "now".
          source.start(audioCtx.currentTime + item.start);
        }
      });

      // Animation Loop for Video
      const drawFrame = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

        const now = Date.now();
        const currentTime = (now - startTime) / 1000;

        if (currentTime >= totalDuration) {
          mediaRecorderRef.current.stop();
          return;
        }

        setProgress(currentTime / totalDuration);

        // Clear
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Find current video item
        // Handle layering? For now just top one.
        const currentItem = videoTrack.find(v => currentTime >= v.start && currentTime < v.start + v.duration);

        if (currentItem && imageElements[currentItem.id]) {
          const img = imageElements[currentItem.id];
          
          // "Contain" fit
          const scale = Math.min(width / img.width, height / img.height);
          const x = (width / 2) - (img.width / 2) * scale;
          const y = (height / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          // Add text overlay? (Future)
        } else {
           // Show "Black" or "Loading"
        }

        requestAnimationFrame(drawFrame);
      };

      drawFrame();

    } catch (err) {
      console.error("Rendering failed", err);
      setIsRendering(false);
      audioCtx.close();
    }

  }, [width, height, fps]);

  return { renderTimeline, isRendering, progress };
};
