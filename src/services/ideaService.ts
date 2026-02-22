import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';

export interface IdeaData {
  id?: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'blog' | 'x' | 'facebook' | 'linkedin';
  difficulty: 'easy' | 'medium' | 'hard';
  potential: number; // 0-100
  isSaved: boolean;
  userId?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'ideas';

export const ideaService = {
  // Create
  async createIdea(idea: Omit<IdeaData, 'id' | 'createdAt'>) {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...idea,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding idea: ", error);
      throw error;
    }
  },

  // Read All
  async getIdeas() {
    try {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const ideas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IdeaData[];

      // Client-side sort to avoid Firestore composite index requirement
      return ideas.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.error("Error getting ideas: ", error);
      throw error;
    }
  },

  // Update (e.g. toggle saved status)
  async updateIdea(id: string, data: Partial<IdeaData>) {
    try {
      const ideaRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(ideaRef, data);
    } catch (error) {
      console.error("Error updating idea: ", error);
      throw error;
    }
  },

  // Delete
  async deleteIdea(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting idea: ", error);
      throw error;
    }
  }
};
