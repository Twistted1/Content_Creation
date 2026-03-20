import { db } from '../lib/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

const POSTS_COLLECTION = 'posts';

export interface Post {
  id?: string;
  userId?: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin';
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'scheduled' | 'published' | 'failed';
  type: 'video' | 'short' | 'post' | 'thread';
  createdAt?: string;
}

const getCurrentUserId = (): string | null => {
  const auth = getAuth();
  return auth.currentUser?.uid ?? null;
};

export const publishService = {
  async getPosts(): Promise<Post[]> {
    try {
      const uid = getCurrentUserId();
      if (!uid) return [];

      // Scoped to the current user — matches Firestore security rules
      const q = query(
        collection(db, POSTS_COLLECTION),
        where('userId', '==', uid),
        orderBy('date', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const uid = getCurrentUserId();
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        ...post,
        userId: uid, // Always inject userId so security rules & queries work
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...post, userId: uid ?? undefined };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  async deletePost(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
};
