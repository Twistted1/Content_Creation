import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from '@/services/authService';

export interface TimelineItem {
  id: string;
  type: 'image' | 'video' | 'voice' | 'music';
  src: string;
  duration: number;
  start: number;
}

export interface ProductionSessionData {
  voiceText: string;
  imagePrompt: string;
  videoPrompt: string;
  generatedImages: string[];
  generatedVideos: any[];
  timeline: {
    video: TimelineItem[];
    audio: TimelineItem[];
  };
  targetLang: string;
  speechRate: number;
  speechPitch: number;
  activeTab: string;
  originalVoiceText: string;
  updatedAt: number;
}

const DEFAULT_STATE: ProductionSessionData = {
  voiceText: '',
  imagePrompt: '',
  videoPrompt: '',
  generatedImages: [
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop"
  ],
  generatedVideos: [
    { id: 1, title: 'Demo Video 1', thumbnail: 'https://picsum.photos/300/200', duration: '0:15' },
    { id: 2, title: 'Demo Video 2', thumbnail: 'https://picsum.photos/301/200', duration: '0:30' }
  ],
  timeline: {
    video: [],
    audio: []
  },
  targetLang: 'en',
  speechRate: 1.0,
  speechPitch: 1.0,
  activeTab: 'voiceover',
  originalVoiceText: '',
  updatedAt: Date.now()
};

export const useProductionSession = () => {
  const [data, setData] = useState<ProductionSessionData>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const user = authService.getCurrentUser();

  // Load initial data and subscribe to changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, `users/${user.uid}/production_drafts/current`);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data() as ProductionSessionData;
        // Merge with defaults to ensure new fields are present
        setData(prev => ({ ...prev, ...remoteData }));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to production draft:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Debounced Save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveToFirestore = (newData: ProductionSessionData) => {
    if (!user) return;
    setIsSaving(true);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, `users/${user.uid}/production_drafts/current`), {
          ...newData,
          updatedAt: Date.now()
        }, { merge: true });
        setIsSaving(false);
      } catch (error) {
        console.error("Error saving production draft:", error);
        setIsSaving(false);
      }
    }, 2000); // Auto-save every 2 seconds of inactivity
  };

  // Generic updater
  const updateState = (updates: Partial<ProductionSessionData>) => {
    setData(prev => {
      const newState = { ...prev, ...updates };
      saveToFirestore(newState);
      return newState;
    });
  };

  return {
    data,
    updateState,
    loading,
    isSaving
  };
};
