import { db, storage, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface PodcastData {
  id?: string;
  title: string;
  topic: string;
  hosts: string[];
  guests: string[];
  duration: string;
  status: 'planning' | 'recording' | 'editing' | 'published';
  script?: string;
  audioUrl?: string;
  userId?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'podcasts';

export const podcastService = {
  // Upload Audio
  async uploadEpisode(file: Blob, title: string) {
    try {
      const fileName = `podcasts/${Date.now()}_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading podcast audio: ", error);
      throw error;
    }
  },

  // Create
  async createPodcast(podcast: Omit<PodcastData, 'id' | 'createdAt'>) {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...podcast,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding podcast: ", error);
      throw error;
    }
  },

  // Read All
  async getPodcasts() {
    try {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const podcasts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PodcastData[];

      // Client-side sort to avoid Firestore composite index requirement
      return podcasts.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.error("Error getting podcasts: ", error);
      throw error;
    }
  },

  // Update
  async updatePodcast(id: string, data: Partial<PodcastData>) {
    try {
      const podcastRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(podcastRef, data);
    } catch (error) {
      console.error("Error updating podcast: ", error);
      throw error;
    }
  },

  // Delete
  async deletePodcast(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting podcast: ", error);
      throw error;
    }
  }
};
