import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface AnalyticsData {
  totalPosts: number;
  platformStats: { platform: string; count: number }[];
  recentPosts: any[];
}

export const analyticsService = {
  async getDashboardStats() {
    try {
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      
      const totalPosts = snapshot.size;
      const posts = snapshot.docs.map(doc => doc.data());
      
      // Calculate platform distribution
      const platforms: Record<string, number> = {};
      posts.forEach((post: any) => {
        const p = post.platform || 'unknown';
        platforms[p] = (platforms[p] || 0) + 1;
      });

      const platformStats = Object.keys(platforms).map(key => ({
        platform: key,
        count: platforms[key]
      }));

      // Get recent posts (client-side sort for now since we fetched all)
      const recentPosts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
        .slice(0, 5);

      // Calculate last 7 days activity
      const dailyActivity = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dayName = days[d.getDay()];
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Count posts on this day
        const count = posts.filter((p: any) => (p.date || '').startsWith(dateStr)).length;
        
        dailyActivity.push({ day: dayName, value: count });
      }

      return {
        totalPosts,
        platformStats,
        recentPosts,
        dailyActivity
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }
};
