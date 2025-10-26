export interface RetailPrice {
  id?: string;
  year: number;
  cropName: string;
  category: 'fruit' | 'vegetable';
  priceUsdPerLb: number;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface PricePrediction {
  id?: string;
  cropName: string;
  category: 'fruit' | 'vegetable';
  predictionYear: number;
  predictedPriceUsdPerLb: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  historicalDataPoints: number;
  createdAt?: any;
}

export interface PriceHistoryData {
  year: number;
  price: number;
}
