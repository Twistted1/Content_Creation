import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export type PlanType = 'free' | 'creator' | 'agency';

export const PLAN_LIMITS: Record<string, any> = {
  free: {
    ai_ideas: 5,
    ai_scripts: 3,
    video_minutes: 2,
    storage_mb: 100,
    can_clone_voice: false,
    can_remove_watermark: false
  },
  creator: {
    ai_ideas: 1000,
    ai_scripts: 1000,
    video_minutes: 120,
    storage_mb: 50000,
    can_clone_voice: true,
    can_remove_watermark: true
  },
  agency: {
    ai_ideas: 99999,
    ai_scripts: 99999,
    video_minutes: 99999,
    storage_mb: 500000,
    can_clone_voice: true,
    can_remove_watermark: true
  }
};

export const usageService = {
  // Get current user plan and usage
  async getUserUsage() {
    const user = auth.currentUser;
    if (!user) return null;
    
    const docRef = doc(db, 'users', user.uid, 'billing', 'usage');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize if missing
      const initialData = {
        plan: 'free',
        metrics: {
          ai_ideas: 0,
          ai_scripts: 0,
          video_minutes: 0,
          storage_used: 0
        },
        period_end: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      };
      await setDoc(docRef, initialData);
      return initialData;
    }
  },

  // Check if action is allowed
  async checkLimit(metric: string): Promise<boolean> {
    const data = await this.getUserUsage();
    if (!data) return false;
    
    const plan = data.plan || 'free';
    const limit = PLAN_LIMITS[plan]?.[metric];
    
    // If limit is undefined, assume unlimited or boolean check
    if (typeof limit === 'undefined') return true;
    
    const current = data.metrics?.[metric] || 0;
    
    // If limit is boolean (feature flag), return it directly
    if (typeof limit === 'boolean') return limit;

    return current < limit;
  },

  // Track an action
  async trackUsage(metric: string, count = 1) {
    const user = auth.currentUser;
    if (!user) return;
    
    const docRef = doc(db, 'users', user.uid, 'billing', 'usage');
    
    // Use Firestore increment for atomic updates
    await setDoc(docRef, {
      metrics: {
        [metric]: increment(count)
      }
    }, { merge: true });
  },
  
  // Upgrade Plan
  async upgradePlan(planId: string) {
    const user = auth.currentUser;
    if (!user) return;
    
    const docRef = doc(db, 'users', user.uid, 'billing', 'usage');
    await setDoc(docRef, {
      plan: planId,
      period_end: Date.now() + 30 * 24 * 60 * 60 * 1000 // Reset period
    }, { merge: true });
  }
};
