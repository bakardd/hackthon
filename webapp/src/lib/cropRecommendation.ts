/**
 * Crop Recommendation Service
 * Simulates ML model predictions based on environmental data
 */

export interface MLParameters {
  temperature: number; // Celsius
  humidity: number; // Percentage
  ph: number; // Soil pH
  rainfall: number; // mm annually
}

export interface CropPrediction {
  crop: string;
  confidence: number;
  suitabilityScore: number;
  reason: string;
}

// Based on the training data patterns from Crop_recommendation.csv
const CROP_RULES = [
  {
    crop: "rice",
    conditions: {
      temperature: { min: 20, max: 27, optimal: 23.5 },
      humidity: { min: 80, max: 84, optimal: 82 },
      ph: { min: 5.0, max: 7.5, optimal: 6.5 },
      rainfall: { min: 180, max: 300, optimal: 240 }
    },
    description: "High humidity and moderate temperature crop"
  },
  {
    crop: "maize",
    conditions: {
      temperature: { min: 18, max: 27, optimal: 22 },
      humidity: { min: 55, max: 75, optimal: 65 },
      ph: { min: 5.5, max: 7.0, optimal: 6.2 },
      rainfall: { min: 50, max: 120, optimal: 85 }
    },
    description: "Moderate climate versatile crop"
  },
  {
    crop: "chickpea",
    conditions: {
      temperature: { min: 20, max: 30, optimal: 25 },
      humidity: { min: 10, max: 30, optimal: 20 },
      ph: { min: 6.0, max: 7.5, optimal: 6.8 },
      rainfall: { min: 20, max: 50, optimal: 35 }
    },
    description: "Drought-resistant legume for arid climates"
  },
  {
    crop: "kidneybeans",
    conditions: {
      temperature: { min: 15, max: 25, optimal: 20 },
      humidity: { min: 18, max: 25, optimal: 21 },
      ph: { min: 5.5, max: 7.0, optimal: 6.0 },
      rainfall: { min: 60, max: 90, optimal: 75 }
    },
    description: "Cool climate legume with moderate water needs"
  },
  {
    crop: "pigeonpeas",
    conditions: {
      temperature: { min: 18, max: 30, optimal: 24 },
      humidity: { min: 30, max: 50, optimal: 40 },
      ph: { min: 4.5, max: 8.5, optimal: 6.5 },
      rainfall: { min: 50, max: 100, optimal: 75 }
    },
    description: "Hardy legume tolerant to various conditions"
  },
  {
    crop: "cotton",
    conditions: {
      temperature: { min: 21, max: 30, optimal: 25 },
      humidity: { min: 50, max: 80, optimal: 65 },
      ph: { min: 5.8, max: 8.0, optimal: 6.5 },
      rainfall: { min: 50, max: 100, optimal: 75 }
    },
    description: "Warm climate fiber crop"
  },
  {
    crop: "papaya",
    conditions: {
      temperature: { min: 22, max: 26, optimal: 24 },
      humidity: { min: 60, max: 70, optimal: 65 },
      ph: { min: 4.5, max: 6.7, optimal: 5.5 },
      rainfall: { min: 100, max: 200, optimal: 150 }
    },
    description: "Tropical fruit requiring consistent moisture"
  },
  {
    crop: "coconut",
    conditions: {
      temperature: { min: 23, max: 28, optimal: 25.5 },
      humidity: { min: 70, max: 80, optimal: 75 },
      ph: { min: 5.2, max: 8.0, optimal: 6.0 },
      rainfall: { min: 150, max: 250, optimal: 200 }
    },
    description: "Tropical palm requiring high humidity"
  }
];

function calculateSuitability(params: MLParameters, cropRule: typeof CROP_RULES[0]): number {
  const { conditions } = cropRule;
  
  // Calculate score for each parameter (0-1 scale)
  const tempScore = calculateParameterScore(params.temperature, conditions.temperature);
  const humidityScore = calculateParameterScore(params.humidity, conditions.humidity);
  const phScore = calculateParameterScore(params.ph, conditions.ph);
  const rainfallScore = calculateParameterScore(params.rainfall, conditions.rainfall);
  
  // Weighted average (you can adjust weights based on importance)
  return (tempScore * 0.3 + humidityScore * 0.3 + phScore * 0.2 + rainfallScore * 0.2);
}

function calculateParameterScore(value: number, range: { min: number; max: number; optimal: number }): number {
  if (value >= range.min && value <= range.max) {
    // Within acceptable range, calculate distance from optimal
    const distanceFromOptimal = Math.abs(value - range.optimal);
    const maxDistance = Math.max(range.optimal - range.min, range.max - range.optimal);
    return Math.max(0.5, 1 - (distanceFromOptimal / maxDistance) * 0.5);
  } else {
    // Outside acceptable range, penalize based on distance
    const penalty = Math.min(value < range.min ? range.min - value : value - range.max, 10);
    return Math.max(0, 0.3 - (penalty * 0.03));
  }
}

export function getCropRecommendations(params: MLParameters): CropPrediction[] {
  const predictions = CROP_RULES.map(rule => {
    const suitabilityScore = calculateSuitability(params, rule);
    const confidence = Math.min(0.95, suitabilityScore + 0.1); // Add slight confidence boost
    
    return {
      crop: rule.crop,
      confidence: Math.round(confidence * 100) / 100,
      suitabilityScore: Math.round(suitabilityScore * 100),
      reason: `${rule.description}. Best match for your climate conditions.`
    };
  });
  
  // Sort by suitability score (descending) and return top 5
  return predictions
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5);
}

// Helper function to validate ML parameters
export function validateMLParameters(params: Partial<MLParameters>): string[] {
  const errors: string[] = [];
  
  if (params.temperature === undefined || params.temperature < -10 || params.temperature > 50) {
    errors.push("Temperature must be between -10°C and 50°C");
  }
  
  if (params.humidity === undefined || params.humidity < 0 || params.humidity > 100) {
    errors.push("Humidity must be between 0% and 100%");
  }
  
  if (params.ph === undefined || params.ph < 0 || params.ph > 14) {
    errors.push("pH must be between 0 and 14");
  }
  
  if (params.rainfall === undefined || params.rainfall < 0 || params.rainfall > 5000) {
    errors.push("Rainfall must be between 0mm and 5000mm annually");
  }
  
  return errors;
}