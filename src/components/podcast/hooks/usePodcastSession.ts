import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from '@/services/authService';

export interface Segment {
  id: number;
  title: string;
}

interface PodcastSessionData {
  segments: Segment[];
  teleprompterText: string;
  updatedAt: number;
}

export const usePodcastSession = () => {
  const [segments, setSegments] = useState<Segment[]>([
    { id: 1, title: 'Intro & Welcome' },
    { id: 2, title: 'Main Topic Discussion' },
    { id: 3, title: 'Q&A Segment' }
  ]);
  const [teleprompterText, setTeleprompterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const user = authService.getCurrentUser();

  // Load initial data and subscribe to changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, `users/${user.uid}/podcast_drafts/current`);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PodcastSessionData;
        // Only update if we aren't currently saving (to avoid loops/overwrites during typing)
        // Actually, for a single user, it's safer to just load on mount. 
        // Real-time collaboration would require more complex logic.
        // For now, let's just use onSnapshot for the initial load and remote updates.
        
        // We'll trust the local state over remote if the user is actively typing, 
        // but for this simple implementation, we'll just update.
        if (data.segments) setSegments(data.segments);
        if (data.teleprompterText) setTeleprompterText(data.teleprompterText);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to podcast draft:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Debounced Save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveData = (newSegments: Segment[], newScript: string) => {
    if (!user) return;
    setIsSaving(true);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, `users/${user.uid}/podcast_drafts/current`), {
          segments: newSegments,
          teleprompterText: newScript,
          updatedAt: Date.now()
        }, { merge: true });
        setIsSaving(false);
      } catch (error) {
        console.error("Error saving podcast draft:", error);
        setIsSaving(false);
      }
    }, 2000); // Auto-save every 2 seconds of inactivity
  };

  const updateSegments = (newSegments: Segment[]) => {
    setSegments(newSegments);
    saveData(newSegments, teleprompterText);
  };

  const updateTeleprompter = (newText: string) => {
    setTeleprompterText(newText);
    saveData(segments, newText);
  };

  return {
    segments,
    teleprompterText,
    updateSegments,
    updateTeleprompter,
    loading,
    isSaving
  };
};
