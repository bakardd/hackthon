import { Plot } from '@/types/farm';

export interface YieldData {
  plotId: string;
  crop: string;
  actualYield: number; // tons per acre
  harvestDate: string;
  plotSize: number; // acres
  totalYield: number; // tons
}

export interface YieldPrediction {
  crop: string;
  predictedYield: number; // tons per acre
  confidence: number; // 0-1
  basedOnHistoricalData: boolean;
}

/**
 * Calculate predicted yield based on environmental factors
 * This is a simplified model - in production you'd use ML models
 */
export const yieldCalculator = {
  /**
   * Predict yield for a crop based on plot conditions
   */
  predictYield(plot: Plot, crop: string): YieldPrediction {
    // Base yields (tons/acre) for optimal conditions
    const baseYields: { [key: string]: number } = {
      'rice': 4.5,
      'maize': 6.0,
      'wheat': 3.5,
      'cotton': 2.8,
      'soybean': 3.2,
      'chickpea': 2.5,
      'pigeonpeas': 2.0,
      'mothbeans': 1.8,
      'mungbean': 1.5,
      'blackgram': 1.5,
      'lentil': 2.0,
      'pomegranate': 8.0,
      'banana': 25.0,
      'mango': 7.0,
      'grapes': 10.0,
      'watermelon': 15.0,
      'muskmelon': 12.0,
      'apple': 18.0,
      'orange': 20.0,
      'papaya': 30.0,
      'coconut': 4.0,
      'jute': 3.5,
      'coffee': 2.5,
    };

    const baseYield = baseYields[crop.toLowerCase()] || 3.0;
    let yieldFactor = 1.0;

    // Temperature factor (optimal range varies by crop)
    const tempOptimal = 25; // Average optimal temp in Celsius
    const tempDiff = Math.abs(plot.temperature - tempOptimal);
    if (tempDiff > 5) {
      yieldFactor *= Math.max(0.6, 1 - (tempDiff / 50));
    }

    // Humidity factor (50-80% is generally good)
    if (plot.humidity < 40 || plot.humidity > 90) {
      yieldFactor *= 0.85;
    }

    // pH factor (6-7 is optimal for most crops)
    const phDiff = Math.abs(plot.ph - 6.5);
    if (phDiff > 1) {
      yieldFactor *= Math.max(0.7, 1 - (phDiff / 10));
    }

    // Rainfall factor (depends on crop)
    if (plot.rainfall < 500) {
      yieldFactor *= 0.8;
    } else if (plot.rainfall > 2000) {
      yieldFactor *= 0.9;
    }

    const predictedYield = baseYield * yieldFactor;
    const confidence = yieldFactor; // Simple confidence based on conditions

    return {
      crop,
      predictedYield: Math.round(predictedYield * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      basedOnHistoricalData: false
    };
  },

  /**
   * Calculate total yield for a plot
   */
  calculateTotalYield(yieldPerAcre: number, plotSize: number): number {
    return Math.round(yieldPerAcre * plotSize * 100) / 100;
  },

  /**
   * Analyze yield data from multiple plots
   */
  analyzeYields(plots: Plot[]): {
    averageYield: number;
    totalYield: number;
    bestPerformingCrop: string | null;
  } {
    const plotsWithYield = plots.filter(p => p.actualYield && p.currentCrop);
    
    if (plotsWithYield.length === 0) {
      return {
        averageYield: 0,
        totalYield: 0,
        bestPerformingCrop: null
      };
    }

    const totalYield = plotsWithYield.reduce((sum, plot) => {
      return sum + this.calculateTotalYield(plot.actualYield!, plot.size);
    }, 0);

    const averageYield = totalYield / plotsWithYield.reduce((sum, p) => sum + p.size, 0);

    // Find best performing crop
    const cropYields: { [crop: string]: number[] } = {};
    plotsWithYield.forEach(plot => {
      const crop = plot.currentCrop!;
      if (!cropYields[crop]) cropYields[crop] = [];
      cropYields[crop].push(plot.actualYield!);
    });

    let bestCrop = null;
    let bestAvg = 0;
    Object.entries(cropYields).forEach(([crop, yields]) => {
      const avg = yields.reduce((a, b) => a + b, 0) / yields.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestCrop = crop;
      }
    });

    return {
      averageYield: Math.round(averageYield * 100) / 100,
      totalYield: Math.round(totalYield * 100) / 100,
      bestPerformingCrop: bestCrop
    };
  }
};
