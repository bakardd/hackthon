export interface Plot {
  id: string;
  name: string;
  size: number;
  location: string;
  soilType: string;
  currentCrop?: string;
  lastHarvest?: string;
  sunlightHours: number;
  waterAccess: string;
  // ML Model Parameters for crop recommendations
  temperature: number; // Average temperature in Celsius
  humidity: number; // Humidity percentage
  ph: number; // Soil pH level
  rainfall: number; // Annual rainfall in mm
  // Location coordinates for weather data
  latitude?: number;
  longitude?: number;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
  // Yield tracking
  actualYield?: number; // tons per acre
  yieldDate?: string;
}

export interface Crop {
  id: string;
  name: string;
  plotId: string;
  plantedDate: string;
  expectedHarvestDate: string;
  status: 'growing' | 'harvested' | 'ready';
  healthScore: number;
}

export interface WeatherData {
  date: string;
  temperature: number;
  rainfall: number;
  humidity: number;
}

export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  reason: string;
  expectedYield: string;
  marketPrice: string;
  growthDuration: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  date: string;
}

export interface FertilizationSchedule {
  crop: string;
  week: string;
  action: string;
  status: 'completed' | 'pending' | 'upcoming';
}

export interface SoilMoistureData {
  date: string;
  moisture: number;
}

export interface YieldPrediction {
  crop: string;
  predicted: number;
  actual?: number;
}
