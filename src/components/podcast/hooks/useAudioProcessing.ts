import { useState, useEffect, useRef } from 'react';

interface UseAudioProcessingOptions {
  sourceStream: MediaStream | null;
  gain: number; // 0 to 200 (percent)
}

export const useAudioProcessing = ({ sourceStream, gain }: UseAudioProcessingOptions) => {
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);

  useEffect(() => {
    if (!sourceStream) {
      setProcessedStream(null);
      return;
    }

    // Initialize Audio Context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    
    // Create Nodes
    const source = audioCtx.createMediaStreamSource(sourceStream);
    const gainNode = audioCtx.createGain();
    const destination = audioCtx.createMediaStreamDestination();

    // Connect Graph: Source -> Gain -> Destination
    source.connect(gainNode);
    gainNode.connect(destination);

    // Initial Gain
    gainNode.gain.value = gain / 100;

    // Store refs
    audioContextRef.current = audioCtx;
    sourceNodeRef.current = source;
    gainNodeRef.current = gainNode;
    destinationRef.current = destination;

    setProcessedStream(destination.stream);

    return () => {
      audioCtx.close();
    };
  }, [sourceStream]); // Re-create if source changes (but not if gain changes)

  // Update Gain without re-creating graph
  useEffect(() => {
    if (gainNodeRef.current) {
      // Smooth transition
      const currentTime = audioContextRef.current?.currentTime || 0;
      gainNodeRef.current.gain.setTargetAtTime(gain / 100, currentTime, 0.1);
    }
  }, [gain]);

  return { processedStream };
};
