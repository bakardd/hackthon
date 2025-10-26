import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { RetailPrice, PricePrediction } from '@/types/price';

export const priceDataService = {
  // Get all historical prices for a specific crop
  async getCropPriceHistory(cropName: string): Promise<RetailPrice[]> {
    try {
      const pricesQuery = query(
        collection(db, 'retail_prices'),
        where('cropName', '==', cropName.toLowerCase()),
        orderBy('year', 'asc')
      );
      const querySnapshot = await getDocs(pricesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RetailPrice));
    } catch (error) {
      console.error('Error fetching crop price history:', error);
      throw error;
    }
  },

  // Get all available crops
  async getAllCrops(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'retail_prices'));
      const crops = new Set<string>();
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.cropName) {
          crops.add(data.cropName);
        }
      });
      return Array.from(crops).sort();
    } catch (error) {
      console.error('Error fetching all crops:', error);
      throw error;
    }
  },

  // Add price data (bulk import)
  async addPriceData(priceData: Omit<RetailPrice, 'id'>[]): Promise<void> {
    try {
      const promises = priceData.map(price => 
        addDoc(collection(db, 'retail_prices'), {
          ...price,
          cropName: price.cropName.toLowerCase(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error adding price data:', error);
      throw error;
    }
  },

  // Save prediction
  async savePrediction(prediction: Omit<PricePrediction, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'price_predictions'), {
        ...prediction,
        cropName: prediction.cropName.toLowerCase(),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving prediction:', error);
      throw error;
    }
  },

  // Get prediction for a crop
  async getPrediction(cropName: string, year: number): Promise<PricePrediction | null> {
    try {
      const predictionsQuery = query(
        collection(db, 'price_predictions'),
        where('cropName', '==', cropName.toLowerCase()),
        where('predictionYear', '==', year)
      );
      const querySnapshot = await getDocs(predictionsQuery);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as PricePrediction;
    } catch (error) {
      console.error('Error fetching prediction:', error);
      throw error;
    }
  },

  // Delete all price data (for testing)
  async clearAllPriceData(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, 'retail_prices'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing price data:', error);
      throw error;
    }
  }
};
