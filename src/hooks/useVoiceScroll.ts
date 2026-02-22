import { useRef, useState, useCallback } from 'react';
import { showToast } from '@/utils/toast';

export const useVoiceScroll = (
  scriptWords: string[],
  onWordMatch: (matchedIndex: number) => void
) => {
  const recognitionRef = useRef<any>(null);
  const [active, setActive] = useState(false);
  // Use a ref to track active state inside callbacks (avoids stale closure)
  const activeRef = useRef(false);
  const wordIndexRef = useRef(0);

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice mode requires Chrome or Edge.', 'error');
      return;
    }
    if (activeRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const spoken = transcript.toLowerCase().trim().split(/\s+/);

          spoken.forEach((word: string) => {
            const lookAhead = 5;
            const currentIdx = wordIndexRef.current;

            for (let j = 0; j < lookAhead; j++) {
              const targetIdx = currentIdx + j;
              if (targetIdx >= scriptWords.length) break;

              const target = scriptWords[targetIdx]?.toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanSpoken = word.replace(/[^a-z0-9]/g, '');

              if (target && cleanSpoken === target) {
                wordIndexRef.current = targetIdx + 1;
                onWordMatch(wordIndexRef.current);
                break;
              }
            }
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          activeRef.current = false;
          setActive(false);
        }
      };

      recognition.onend = () => {
        // Use ref (not state) to avoid stale closure — this is the key fix
        if (activeRef.current) {
          try {
            recognition.start();
          } catch (e) {
            activeRef.current = false;
            setActive(false);
          }
        } else {
          setActive(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      activeRef.current = true;
      setActive(true);
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      activeRef.current = false;
      setActive(false);
    }
  }, [scriptWords, onWordMatch]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setActive(false);
  }, []);

  const reset = useCallback(() => {
    wordIndexRef.current = 0;
  }, []);

  return { start, stop, reset, active };
};
