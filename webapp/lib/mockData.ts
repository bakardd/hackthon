import { Plot, Crop, WeatherData, CropRecommendation, Alert } from '../types/farm';

export const mockPlots: Plot[] = [
  {
    id: '1',
    name: 'North Field',
    location: {
      latitude: 9.0820,
      longitude: 8.6753,
      address: 'Abuja, Nigeria',
    },
    soilType: 'loam',
    sunlightHours: 8,
    waterSource: 'mixed',
    waterFrequency: 'Twice weekly',
    previousCrops: ['Maize', 'Cassava'],
    size: 5.2,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    name: 'South Field',
    location: {
      latitude: 9.0820,
      longitude: 8.6753,
      address: 'Abuja, Nigeria',
    },
    soilType: 'clay',
    sunlightHours: 6,
    waterSource: 'rainfall',
    waterFrequency: 'Natural',
    previousCrops: ['Rice', 'Yam'],
    size: 3.8,
    createdAt: new Date('2024-04-20'),
  },
];

export const mockCrops: Crop[] = [
  {
    id: '1',
    plotId: '1',
    name: 'Maize',
    variety: 'Yellow Corn',
    plantedDate: new Date('2024-09-10'),
    expectedHarvestDate: new Date('2024-12-20'),
    status: 'growing',
    growthStage: 65,
    healthScore: 88,
  },
  {
    id: '2',
    plotId: '1',
    name: 'Peanuts',
    variety: 'Virginia',
    plantedDate: new Date('2024-09-15'),
    expectedHarvestDate: new Date('2025-01-10'),
    status: 'growing',
    growthStage: 58,
    healthScore: 92,
  },
  {
    id: '3',
    plotId: '2',
    name: 'Rice',
    variety: 'FARO 44',
    plantedDate: new Date('2024-08-20'),
    expectedHarvestDate: new Date('2024-12-05'),
    status: 'growing',
    growthStage: 75,
    healthScore: 85,
  },
];

export const mockWeatherData: WeatherData = {
  temperature: 28,
  humidity: 72,
  rainfall: 12,
  forecast: [
    { date: 'Oct 26', temp: 29, condition: 'Partly Cloudy', rainfall: 5 },
    { date: 'Oct 27', temp: 27, condition: 'Rainy', rainfall: 18 },
    { date: 'Oct 28', temp: 28, condition: 'Cloudy', rainfall: 8 },
    { date: 'Oct 29', temp: 30, condition: 'Sunny', rainfall: 0 },
    { date: 'Oct 30', temp: 31, condition: 'Sunny', rainfall: 0 },
    { date: 'Oct 31', temp: 29, condition: 'Partly Cloudy', rainfall: 3 },
    { date: 'Nov 01', temp: 28, condition: 'Rainy', rainfall: 22 },
  ],
};

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
    reason: 'Excellent crop rotation option. Enriches soil naturally.',
    expectedYield: '1.2-1.8 tons/acre',
    marketPrice: '₦200,000/ton',
    growthDuration: '90-110 days',
  },
  {
    name: 'Sweet Potato',
    suitabilityScore: 82,
    reason: 'Adaptable to various soil conditions. Good market value.',
    expectedYield: '6-10 tons/acre',
    marketPrice: '₦80,000/ton',
    growthDuration: '90-120 days',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Heavy Rainfall Expected',
    message: 'Weather forecast shows 22mm rainfall on Nov 1. Ensure proper drainage.',
    date: new Date('2024-10-25'),
  },
  {
    id: '2',
    type: 'info',
    title: 'Fertilizer Application Due',
    message: 'NPK fertilizer application scheduled for North Field - Maize crop.',
    date: new Date('2024-10-24'),
  },
  {
    id: '3',
    type: 'success',
    title: 'Optimal Growth Conditions',
    message: 'Your peanuts are showing excellent health scores above 90%.',
    date: new Date('2024-10-23'),
  },
  {
    id: '4',
    type: 'danger',
    title: 'Possible Nitrogen Deficiency',
    message: 'Rice crop showing signs of yellowing. Consider nitrogen supplement.',
    date: new Date('2024-10-22'),
  },
];

export const fertilizationSchedule = [
  {
    crop: 'Maize',
    stage: 'Week 4',
    fertilizer: 'NPK 15-15-15',
    amount: '50 kg/acre',
    status: 'completed',
  },
  {
    crop: 'Maize',
    stage: 'Week 8',
    fertilizer: 'Urea (Nitrogen)',
    amount: '40 kg/acre',
    status: 'upcoming',
  },
  {
    crop: 'Peanuts',
    stage: 'Week 3',
    fertilizer: 'Phosphorus boost',
    amount: '30 kg/acre',
    status: 'completed',
  },
  {
    crop: 'Rice',
    stage: 'Week 10',
    fertilizer: 'NPK 20-10-10',
    amount: '45 kg/acre',
    status: 'upcoming',
  },
];

export const soilMoistureData = [
  { date: 'Oct 19', moisture: 45 },
  { date: 'Oct 20', moisture: 42 },
  { date: 'Oct 21', moisture: 48 },
  { date: 'Oct 22', moisture: 55 },
  { date: 'Oct 23', moisture: 52 },
  { date: 'Oct 24', moisture: 48 },
  { date: 'Oct 25', moisture: 50 },
];

export const yieldPredictions = [
  { crop: 'Maize', predicted: 2.8, actual: 0, unit: 'tons/acre' },
  { crop: 'Peanuts', predicted: 1.3, actual: 0, unit: 'tons/acre' },
  { crop: 'Rice', predicted: 3.2, actual: 0, unit: 'tons/acre' },
];
