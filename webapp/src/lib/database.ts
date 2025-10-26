import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Plot, Crop } from '../types/farm';
import { mlCropService } from './mlService';

/**
 * Service for managing plot data with ML integration
 */
export class PlotService {
  private static collection = 'plots';

  /**
   * Create a new plot and get ML-based crop recommendations
   */
  static async createPlot(plotData: Omit<Plot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ plot: Plot; recommendations: any[] }> {
    console.log('PlotService.createPlot called with:', plotData);
    console.log('Current user:', auth.currentUser);
    
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create plots');
    }

    const plotWithMetadata: Omit<Plot, 'id'> = {
      ...plotData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Plot data with metadata:', plotWithMetadata);

    try {
      // Save plot to Firestore
      console.log('Attempting to save to Firestore...');
      const docRef = await addDoc(collection(db, this.collection), plotWithMetadata);
      console.log('Plot saved to Firestore with ID:', docRef.id);
      
      const newPlot: Plot = { ...plotWithMetadata, id: docRef.id };

      // Get ML-based crop recommendations
      console.log('Getting ML recommendations...');
      const recommendations = await mlCropService.getCropRecommendations({
        temperature: plotData.temperature,
        humidity: plotData.humidity,
        ph: plotData.ph,
        rainfall: plotData.rainfall,
      });

      console.log('Generated ML recommendations:', recommendations);

      return { plot: newPlot, recommendations };
    } catch (error) {
      console.error('Error creating plot:', error);
      throw error;
    }
  }

  /**
   * Get all plots for the current user
   */
  static async getUserPlots(): Promise<Plot[]> {
    if (!auth.currentUser) {
      return [];
    }

    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const plots: Plot[] = [];
      
      querySnapshot.forEach((doc) => {
        plots.push({ id: doc.id, ...doc.data() } as Plot);
      });
      
      return plots;
    } catch (error) {
      console.error('Error fetching user plots:', error);
      return [];
    }
  }

  /**
   * Update an existing plot
   */
  static async updatePlot(plotId: string, updates: Partial<Plot>): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update plots');
    }

    try {
      const plotRef = doc(db, this.collection, plotId);
      await updateDoc(plotRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating plot:', error);
      throw error;
    }
  }

  /**
   * Delete a plot
   */
  static async deletePlot(plotId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to delete plots');
    }

    try {
      await deleteDoc(doc(db, this.collection, plotId));
    } catch (error) {
      console.error('Error deleting plot:', error);
      throw error;
    }
  }

  /**
   * Get crop recommendations for an existing plot
   */
  static async getPlotRecommendations(plot: Plot) {
    return await mlCropService.getCropRecommendations({
      temperature: plot.temperature,
      humidity: plot.humidity,
      ph: plot.ph,
      rainfall: plot.rainfall,
    });
  }
}

/**
 * Service for managing crop data
 */
export class CropService {
  private static collection = 'crops';

  /**
   * Get crops for a specific plot
   */
  static async getCropsForPlot(plotId: string): Promise<Crop[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('plotId', '==', plotId),
        orderBy('plantedDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const crops: Crop[] = [];
      
      querySnapshot.forEach((doc) => {
        crops.push({ id: doc.id, ...doc.data() } as Crop);
      });
      
      return crops;
    } catch (error) {
      console.error('Error fetching crops for plot:', error);
      return [];
    }
  }

  /**
   * Add a new crop to a plot
   */
  static async addCrop(cropData: Omit<Crop, 'id'>): Promise<Crop> {
    try {
      const docRef = await addDoc(collection(db, this.collection), cropData);
      return { id: docRef.id, ...cropData };
    } catch (error) {
      console.error('Error adding crop:', error);
      throw error;
    }
  }

  /**
   * Update crop status
   */
  static async updateCrop(cropId: string, updates: Partial<Crop>): Promise<void> {
    try {
      const cropRef = doc(db, this.collection, cropId);
      await updateDoc(cropRef, updates);
    } catch (error) {
      console.error('Error updating crop:', error);
      throw error;
    }
  }
}