import { Plot, Crop, WeatherData, CropRecommendation, Alert, FertilizationSchedule, SoilMoistureData, YieldPrediction } from '@/types/farm';

export const mockPlots: Plot[] = [
  {
    id: '1',
    name: 'North Field',
    size: 5.2,
    location: 'Northern Section',
    soilType: 'Loam',
    currentCrop: 'Maize',
    lastHarvest: '2024-08-15',
    sunlightHours: 8,
    waterAccess: 'Irrigation System',
  },
  {
    id: '2',
    name: 'South Field',
    size: 3.8,
    location: 'Southern Section',
    soilType: 'Clay',
    currentCrop: 'Cassava',
    sunlightHours: 7,
    waterAccess: 'Rainfall + Well',
  },
  {
    id: '3',
    name: 'East Plot',
    size: 2.5,
    location: 'Eastern Section',
    soilType: 'Sandy Loam',
    sunlightHours: 9,
    waterAccess: 'Drip Irrigation',
  },
];

export const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Maize',
    plotId: '1',
    plantedDate: '2024-06-01',
    expectedHarvestDate: '2024-09-15',
    status: 'growing',
    healthScore: 92,
  },
  {
    id: '2',
    name: 'Cassava',
    plotId: '2',
    plantedDate: '2024-01-15',
    expectedHarvestDate: '2025-01-15',
    status: 'growing',
    healthScore: 88,
  },
];

export const mockWeatherData: WeatherData[] = [
  { date: 'Mon', temperature: 28, rainfall: 15, humidity: 65 },
  { date: 'Tue', temperature: 30, rainfall: 0, humidity: 58 },
  { date: 'Wed', temperature: 29, rainfall: 8, humidity: 62 },
  { date: 'Thu', temperature: 27, rainfall: 22, humidity: 72 },
  { date: 'Fri', temperature: 31, rainfall: 0, humidity: 55 },
  { date: 'Sat', temperature: 30, rainfall: 5, humidity: 60 },
  { date: 'Sun', temperature: 28, rainfall: 12, humidity: 68 },
];

export const mockCropRecommendations: CropRecommendation[] = [
  {
    name: 'Maize',
    suitabilityScore: 95,
    reason: 'Excellent match for loam soil with 8+ hours sunlight. High market demand.',
    expectedYield: '2.5-3 tons/acre',
    marketPrice: '₦180,000/ton',
    growthDuration: '90-120 days',
  },
  {
    name: 'Cassava',
    suitabilityScore: 92,
    reason: 'Thrives in your soil type with minimal water requirements. Drought resistant.',
    expectedYield: '8-12 tons/acre',
    marketPrice: '₦60,000/ton',
    growthDuration: '9-12 months',
  },
  {
    name: 'Peanuts',
    suitabilityScore: 88,
    reason: 'Good nitrogen fixation for soil health. Suitable for current season.',
    expectedYield: '1-1.5 tons/acre',
    marketPrice: '₦250,000/ton',
    growthDuration: '100-130 days',
  },
  {
    name: 'Soybeans',
    suitabilityScore: 85,
    reason: 'Beneficial for crop rotation. Good protein content and market value.',
    expectedYield: '1.2-1.8 tons/acre',
    marketPrice: '₦220,000/ton',
    growthDuration: '90-150 days',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'North Field: Soil moisture levels dropping. Consider irrigation.',
    date: '2 hours ago',
  },
  {
    id: '2',
    type: 'info',
    message: 'Weather forecast: Light rain expected in 3 days.',
    date: '5 hours ago',
  },
  {
    id: '3',
    type: 'success',
    message: 'South Field cassava showing excellent growth progress!',
    date: '1 day ago',
  },
];

export const fertilizationSchedule: FertilizationSchedule[] = [
  { crop: 'Maize', week: 'Week 1', action: 'NPK 15-15-15 application', status: 'completed' },
  { crop: 'Maize', week: 'Week 4', action: 'Urea top dressing', status: 'completed' },
  { crop: 'Maize', week: 'Week 8', action: 'Foliar spray', status: 'pending' },
  { crop: 'Cassava', week: 'Month 2', action: 'Organic compost', status: 'completed' },
  { crop: 'Cassava', week: 'Month 6', action: 'NPK application', status: 'upcoming' },
];

export const soilMoistureData: SoilMoistureData[] = [
  { date: 'Jan', moisture: 65 },
  { date: 'Feb', moisture: 55 },
  { date: 'Mar', moisture: 70 },
  { date: 'Apr', moisture: 80 },
  { date: 'May', moisture: 75 },
  { date: 'Jun', moisture: 60 },
];

export const yieldPredictions: YieldPrediction[] = [
  { crop: 'Maize', predicted: 2.8, actual: 2.6 },
  { crop: 'Cassava', predicted: 10, actual: 9.5 },
  { crop: 'Peanuts', predicted: 1.3 },
  { crop: 'Soybeans', predicted: 1.5 },
];
