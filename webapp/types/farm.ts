export type SoilType = 'loam' | 'clay' | 'sandy' | 'silty' | 'peaty' | 'chalky';
export type WaterSource = 'rainfall' | 'irrigation' | 'well' | 'river' | 'mixed';
export type CropStatus = 'planning' | 'planted' | 'growing' | 'harvesting' | 'completed';

export interface Plot {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  soilType: SoilType;
  sunlightHours: number;
  waterSource: WaterSource;
  waterFrequency: string;
  previousCrops: string[];
  size: number; // in acres
  createdAt: Date;
}

export interface Crop {
  id: string;
  plotId: string;
  name: string;
  variety: string;
  plantedDate: Date;
  expectedHarvestDate: Date;
  status: CropStatus;
  growthStage: number; // 0-100
  healthScore: number; // 0-100
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: {
    date: string;
    temp: number;
    condition: string;
    rainfall: number;
  }[];
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
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  date: Date;
}
