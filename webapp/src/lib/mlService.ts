/**
 * ML Crop Recommendation Service
 * Interfaces with the Python ML model to get crop recommendations
 */

export interface MLPredictionRequest {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface MLPredictionResponse {
  predicted_crop: string;
  confidence: number;
  top_predictions?: Array<{
    crop: string;
    probability: number;
  }>;
}

export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  reason: string;
  expectedYield: string;
  marketPrice: string;
  growthDuration: string;
}

// Crop database with additional information
const CROP_INFO: Record<string, {
  expectedYield: string;
  marketPrice: string;
  growthDuration: string;
  description: string;
}> = {
  'rice': {
    expectedYield: '4-6 tons/acre',
    marketPrice: '$450-600/ton',
    growthDuration: '120-150 days',
    description: 'Staple grain crop, requires consistent water supply'
  },
  'maize': {
    expectedYield: '8-12 tons/acre',
    marketPrice: '$200-300/ton',
    growthDuration: '90-120 days',
    description: 'Versatile crop for food and feed, drought tolerant'
  },
  'wheat': {
    expectedYield: '3-5 tons/acre',
    marketPrice: '$250-350/ton',
    growthDuration: '120-150 days',
    description: 'Cool season crop, requires moderate rainfall'
  },
  'cotton': {
    expectedYield: '800-1200 kg/acre',
    marketPrice: '$1500-2000/ton',
    growthDuration: '180-200 days',
    description: 'Cash crop, requires warm climate and irrigation'
  },
  'sugarcane': {
    expectedYield: '80-120 tons/acre',
    marketPrice: '$50-80/ton',
    growthDuration: '300-365 days',
    description: 'Long-term crop, high water and nutrient requirements'
  },
  'coffee': {
    expectedYield: '1-2 tons/acre',
    marketPrice: '$3000-5000/ton',
    growthDuration: '6-9 months',
    description: 'Perennial crop, requires specific altitude and climate'
  },
  'coconut': {
    expectedYield: '8000-12000 nuts/acre',
    marketPrice: '$0.5-1.0/nut',
    growthDuration: 'Perennial',
    description: 'Long-term investment, coastal and tropical regions'
  },
  'jute': {
    expectedYield: '2-3 tons/acre',
    marketPrice: '$800-1200/ton',
    growthDuration: '120-150 days',
    description: 'Fiber crop, requires high humidity and rainfall'
  }
};

class MLCropService {
  private pythonServerUrl: string;

  constructor() {
    // In a real implementation, this would be configurable
    this.pythonServerUrl = 'http://localhost:5000';
  }

  /**
   * Get crop recommendations using the ML model
   */
  async getCropRecommendations(plotData: MLPredictionRequest): Promise<CropRecommendation[]> {
    try {
      // For now, we'll implement a local prediction logic
      // In production, this would call the Python ML service
      const prediction = await this.localPredict(plotData);
      
      return this.formatRecommendations(prediction, plotData);
    } catch (error) {
      console.error('Error getting crop recommendations:', error);
      return this.getFallbackRecommendations(plotData);
    }
  }

  /**
   * Local prediction logic based on the ML model rules
   * This simulates the behavior of the Python ML model
   */
  private async localPredict(data: MLPredictionRequest): Promise<MLPredictionResponse> {
    const { temperature, humidity, ph, rainfall } = data;

    // Simple rule-based prediction logic based on typical crop requirements
    let predictions: Array<{ crop: string; score: number }> = [];

    // Rice: High humidity, high rainfall, neutral pH
    if (humidity > 60 && rainfall > 1000 && ph >= 6.0 && ph <= 7.5) {
      predictions.push({ crop: 'rice', score: 0.9 });
    }

    // Maize: Moderate conditions, versatile
    if (temperature >= 20 && temperature <= 30 && rainfall >= 400 && rainfall <= 1200) {
      predictions.push({ crop: 'maize', score: 0.8 });
    }

    // Wheat: Cooler temperatures, moderate rainfall
    if (temperature >= 15 && temperature <= 25 && rainfall >= 300 && rainfall <= 800) {
      predictions.push({ crop: 'wheat', score: 0.75 });
    }

    // Cotton: Warm climate, moderate rainfall
    if (temperature >= 25 && temperature <= 35 && rainfall >= 500 && rainfall <= 1000) {
      predictions.push({ crop: 'cotton', score: 0.85 });
    }

    // Sugarcane: Hot, humid, high rainfall
    if (temperature >= 25 && humidity > 70 && rainfall > 1200) {
      predictions.push({ crop: 'sugarcane', score: 0.88 });
    }

    // Coffee: Moderate temperature, high humidity
    if (temperature >= 18 && temperature <= 28 && humidity > 65 && rainfall >= 1000) {
      predictions.push({ crop: 'coffee', score: 0.82 });
    }

    // Coconut: Hot, humid coastal conditions
    if (temperature >= 27 && humidity > 75 && rainfall >= 1200) {
      predictions.push({ crop: 'coconut', score: 0.8 });
    }

    // Jute: High humidity and rainfall
    if (humidity > 80 && rainfall > 1500) {
      predictions.push({ crop: 'jute', score: 0.78 });
    }

    // Sort by score and return top prediction
    predictions.sort((a, b) => b.score - a.score);
    
    if (predictions.length === 0) {
      // Default fallback
      predictions = [{ crop: 'maize', score: 0.6 }];
    }

    return {
      predicted_crop: predictions[0].crop,
      confidence: predictions[0].score,
      top_predictions: predictions.slice(0, 3).map(p => ({
        crop: p.crop,
        probability: p.score
      }))
    };
  }

  /**
   * Format ML predictions into CropRecommendation objects
   */
  private formatRecommendations(
    prediction: MLPredictionResponse, 
    plotData: MLPredictionRequest
  ): CropRecommendation[] {
    const recommendations: CropRecommendation[] = [];
    
    if (prediction.top_predictions) {
      for (const pred of prediction.top_predictions) {
        const cropInfo = CROP_INFO[pred.crop] || CROP_INFO['maize'];
        const score = Math.round(pred.probability * 100);
        
        recommendations.push({
          name: this.capitalizeCropName(pred.crop),
          suitabilityScore: score,
          reason: this.generateReason(pred.crop, plotData, pred.probability),
          expectedYield: cropInfo.expectedYield,
          marketPrice: cropInfo.marketPrice,
          growthDuration: cropInfo.growthDuration
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate explanation for why a crop is recommended
   */
  private generateReason(crop: string, data: MLPredictionRequest, confidence: number): string {
    const { temperature, humidity, ph, rainfall } = data;
    const cropInfo = CROP_INFO[crop];
    
    if (!cropInfo) {
      return `Based on your environmental conditions, this crop shows ${Math.round(confidence * 100)}% suitability.`;
    }

    let reasons = [];
    
    // Temperature-based reasons
    if (crop === 'rice' && humidity > 60) {
      reasons.push('high humidity ideal for rice cultivation');
    }
    if (crop === 'wheat' && temperature <= 25) {
      reasons.push('cool temperatures favor wheat growth');
    }
    if (crop === 'cotton' && temperature >= 25) {
      reasons.push('warm climate supports cotton development');
    }
    
    // Rainfall-based reasons
    if (rainfall > 1000) {
      reasons.push('abundant rainfall suits water-intensive crops');
    } else if (rainfall < 600) {
      reasons.push('moderate rainfall matches drought-tolerant varieties');
    }
    
    // pH-based reasons
    if (ph >= 6.0 && ph <= 7.5) {
      reasons.push('neutral pH optimal for most crops');
    }

    const reasonText = reasons.length > 0 
      ? reasons.join(', ') 
      : cropInfo.description;

    return `${reasonText}. Confidence: ${Math.round(confidence * 100)}%`;
  }

  /**
   * Capitalize crop names for display
   */
  private capitalizeCropName(crop: string): string {
    return crop.charAt(0).toUpperCase() + crop.slice(1);
  }

  /**
   * Fallback recommendations when ML service is unavailable
   */
  private getFallbackRecommendations(data: MLPredictionRequest): CropRecommendation[] {
    return [
      {
        name: 'Maize',
        suitabilityScore: 75,
        reason: 'Versatile crop suitable for various conditions. Service temporarily unavailable.',
        expectedYield: '8-12 tons/acre',
        marketPrice: '$200-300/ton',
        growthDuration: '90-120 days'
      },
      {
        name: 'Rice',
        suitabilityScore: 65,
        reason: 'Alternative option based on regional patterns.',
        expectedYield: '4-6 tons/acre',
        marketPrice: '$450-600/ton',
        growthDuration: '120-150 days'
      }
    ];
  }
}

export const mlCropService = new MLCropService();