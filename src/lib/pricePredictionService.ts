import { RetailPrice, PricePrediction, PriceHistoryData } from '@/types/price';

export const pricePredictionService = {
  // Simple linear regression prediction
  predictPrice(
    historicalData: RetailPrice[],
    yearsAhead: number = 1
  ): PricePrediction | null {
    if (historicalData.length < 2) {
      return null;
    }

    // Sort by year
    const sortedData = [...historicalData].sort((a, b) => a.year - b.year);
    
    // Prepare data for linear regression
    const n = sortedData.length;
    const years = sortedData.map(d => d.year);
    const prices = sortedData.map(d => d.priceUsdPerLb);

    // Calculate means
    const meanYear = years.reduce((a, b) => a + b, 0) / n;
    const meanPrice = prices.reduce((a, b) => a + b, 0) / n;

    // Calculate slope (b1) and intercept (b0)
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (years[i] - meanYear) * (prices[i] - meanPrice);
      denominator += Math.pow(years[i] - meanYear, 2);
    }

    const slope = numerator / denominator;
    const intercept = meanPrice - slope * meanYear;

    // Predict future price
    const lastYear = years[years.length - 1];
    const predictionYear = lastYear + yearsAhead;
    const predictedPrice = slope * predictionYear + intercept;

    // Calculate R-squared for confidence
    let ssRes = 0;
    let ssTot = 0;
    
    for (let i = 0; i < n; i++) {
      const predicted = slope * years[i] + intercept;
      ssRes += Math.pow(prices[i] - predicted, 2);
      ssTot += Math.pow(prices[i] - meanPrice, 2);
    }

    const rSquared = 1 - (ssRes / ssTot);
    const confidence = Math.max(0, Math.min(1, rSquared));

    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    const percentChange = ((predictedPrice - prices[prices.length - 1]) / prices[prices.length - 1]) * 100;
    
    if (percentChange > 2) trend = 'increasing';
    else if (percentChange < -2) trend = 'decreasing';

    return {
      cropName: sortedData[0].cropName,
      category: sortedData[0].category,
      predictionYear,
      predictedPriceUsdPerLb: Math.round(predictedPrice * 100) / 100,
      trend,
      confidence: Math.round(confidence * 100) / 100,
      historicalDataPoints: n,
    };
  },

  // Parse CSV data
  parseCSV(csvText: string): Omit<RetailPrice, 'id'>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const data: Omit<RetailPrice, 'id'>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      const yearIdx = headers.findIndex(h => h.includes('year'));
      const nameIdx = headers.findIndex(h => h.includes('item') || h.includes('name'));
      const priceIdx = headers.findIndex(h => h.includes('price'));
      const categoryIdx = headers.findIndex(h => h.includes('category'));
      const notesIdx = headers.findIndex(h => h.includes('note'));

      if (yearIdx === -1 || nameIdx === -1 || priceIdx === -1) continue;

      const year = parseInt(values[yearIdx]);
      const price = parseFloat(values[priceIdx]);
      
      if (isNaN(year) || isNaN(price)) continue;

      data.push({
        year,
        cropName: values[nameIdx].toLowerCase().trim(),
        priceUsdPerLb: price,
        category: categoryIdx !== -1 && values[categoryIdx].toLowerCase().includes('fruit') ? 'fruit' : 'vegetable',
        notes: notesIdx !== -1 ? values[notesIdx] : undefined,
      });
    }

    return data;
  }
};
