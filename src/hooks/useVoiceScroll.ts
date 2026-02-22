import { useRef, useState, useCallback } from 'react';

export const useVoiceScroll = (
  scriptWords: string[],
  onWordMatch: (matchedIndex: number) => void
) => {
  const recognitionRef = useRef<any>(null); // Use any to avoid TS errors with experimental API
  const [active, setActive] = useState(false);
  const wordIndexRef = useRef(0);

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice mode requires Chrome or Edge.');
      return;
    }

    // Don't start if already active
    if (active) return;

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
              // Simple matching logic - look ahead a few words to be forgiving
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
                    break; // Move to next spoken word
                  }
              }
            });
          }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setActive(false);
            }
        };
        
        recognition.onend = () => {
            // Auto-restart if still supposed to be active
            if (active) {
                try {
                    recognition.start();
                } catch (e) {
                    setActive(false);
                }
            } else {
                setActive(false);
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setActive(true);
    } catch (e) {
        console.error("Failed to start speech recognition", e);
        setActive(false);
    }
  }, [scriptWords, onWordMatch, active]);

  const stop = useCallback(() => {
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
