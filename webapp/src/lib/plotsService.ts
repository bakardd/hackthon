import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Plot } from '@/types/farm';

export const plotsService = {
  // Get all plots for a user
  async getUserPlots(userId: string): Promise<Plot[]> {
    try {
      const plotsQuery = query(
        collection(db, 'plots'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(plotsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Plot));
    } catch (error) {
      console.error('Error fetching plots:', error);
      throw error;
    }
  },

  // Create a new plot
  async createPlot(userId: string, plotData: Omit<Plot, 'id'>): Promise<Plot> {
    try {
      const newPlot = {
        ...plotData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'plots'), newPlot);
      
      return {
        ...plotData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Error creating plot:', error);
      throw error;
    }
  },

  // Update an existing plot
  async updatePlot(plotId: string, plotData: Partial<Plot>): Promise<void> {
    try {
      const plotRef = doc(db, 'plots', plotId);
      await updateDoc(plotRef, {
        ...plotData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating plot:', error);
      throw error;
    }
  },

  // Delete a plot
  async deletePlot(plotId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'plots', plotId));
    } catch (error) {
      console.error('Error deleting plot:', error);
      throw error;
    }
  }
};