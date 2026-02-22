import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';

export interface ScriptData {
  id?: string;
  title: string;
  content: string;
  type: string;
  date: string;
  userId?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'scripts';

export const scriptService = {
  // Create
  async createScript(script: Omit<ScriptData, 'id' | 'createdAt'>) {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...script,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding script: ", error);
      throw error;
    }
  },

  // Read All
  async getScripts() {
    try {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const scripts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScriptData[];
      
      // Client-side sort to avoid Firestore composite index requirement
      return scripts.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.error("Error getting scripts: ", error);
      throw error;
    }
  },

  // Update
  async updateScript(id: string, data: Partial<ScriptData>) {
    try {
      const scriptRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(scriptRef, data);
    } catch (error) {
      console.error("Error updating script: ", error);
      throw error;
    }
  },

  // Delete
  async deleteScript(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting script: ", error);
      throw error;
    }
  }
};
