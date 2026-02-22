import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const POSTS_COLLECTION = 'posts';

export interface Post {
  id?: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin';
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'scheduled' | 'published' | 'failed';
  type: 'video' | 'short' | 'post' | 'thread';
  createdAt?: string;
}

export const publishService = {
  async getPosts() {
    try {
      // Order by date descending (newest first)
      const q = query(collection(db, POSTS_COLLECTION), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  async createPost(post: Omit<Post, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        ...post,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...post };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async updatePost(id: string, updates: Partial<Post>) {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  async deletePost(id: string) {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
};
