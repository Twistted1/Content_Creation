import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const WORKFLOWS_COLLECTION = 'workflows';

export interface WorkflowStep {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Workflow {
  id?: string;
  name: string;
  schedule: string;
  isActive: boolean;
  steps: WorkflowStep[];
  lastRun?: string;
  createdAt?: string;
}

export const automationService = {
  async getWorkflows() {
    try {
      const q = query(collection(db, WORKFLOWS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workflow));
    } catch (error) {
      console.error("Error fetching workflows:", error);
      throw error;
    }
  },

  async createWorkflow(workflow: Omit<Workflow, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, WORKFLOWS_COLLECTION), {
        ...workflow,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...workflow };
    } catch (error) {
      console.error("Error creating workflow:", error);
      throw error;
    }
  },

  async updateWorkflow(id: string, updates: Partial<Workflow>) {
    try {
      const docRef = doc(db, WORKFLOWS_COLLECTION, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating workflow:", error);
      throw error;
    }
  },

  async deleteWorkflow(id: string) {
    try {
      await deleteDoc(doc(db, WORKFLOWS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting workflow:", error);
      throw error;
    }
  }
};
