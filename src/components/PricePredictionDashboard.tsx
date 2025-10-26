import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { priceDataService } from '@/lib/priceDataService';
import { pricePredictionService } from '@/lib/pricePredictionService';
import { RetailPrice, PricePrediction } from '@/types/price';
import { Plot } from '@/types/farm';

interface PricePredictionDashboardProps {
  plots?: Plot[];
}

export const PricePredictionDashboard = ({ plots = [] }: PricePredictionDashboardProps) => {
  const [crops, setCrops] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<RetailPrice[]>([]);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(false);

  // Get unique crops from user's plots
  const plotCrops = plots
    .map(p => p.currentCrop?.toLowerCase())
    .filter((crop): crop is string => Boolean(crop));

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      const allCrops = await priceDataService.getAllCrops();
      
      // Filter to only show crops that exist in both database and user's plots
      const filteredCrops = allCrops.filter(crop => 
        plotCrops.includes(crop.toLowerCase())
      );
      
      setCrops(filteredCrops);
      if (filteredCrops.length > 0) {
        setSelectedCrop(filteredCrops[0]);
      } else if (plotCrops.length > 0 && allCrops.length > 0) {
        // Show message if user has plots but no price data
        toast.info('Upload price data for your crops to see predictions');
      }
    } catch (error) {
      console.error('Error loading crops:', error);
      toast.error('Failed to load crop list');
    }
  };

  const loadCropData = async (cropName: string) => {
    setLoading(true);
    try {
      const history = await priceDataService.getCropPriceHistory(cropName);
      setHistoricalData(history);

      if (history.length >= 2) {
        const pred = pricePredictionService.predictPrice(history, 1);
        setPrediction(pred);
        
        if (pred) {
          await priceDataService.savePrediction(pred);
        }
      } else {
        setPrediction(null);
        toast.info('Need at least 2 years of data for prediction');
      }
    } catch (error) {
      console.error('Error loading crop data:', error);
      toast.error('Failed to load crop data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCrop) {
      loadCropData(selectedCrop);
    }
  }, [selectedCrop]);

  const chartData = [
    ...historicalData.map(d => ({
      year: d.year,
      actual: d.priceUsdPerLb,
      predicted: null,
    })),
    ...(prediction ? [{
      year: prediction.predictionYear,
      actual: null,
      predicted: prediction.predictedPriceUsdPerLb,
    }] : [])
  ];

  const getTrendIcon = () => {
    if (!prediction) return null;
    if (prediction.trend === 'increasing') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (prediction.trend === 'decreasing') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Price Prediction Dashboard
          </CardTitle>
          <CardDescription>
            View historical prices and future predictions for crops in your plots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Select Crop</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                  {crops.length === 0 && plotCrops.length > 0 
                    ? 'No price data available for your crops. Upload data first.' 
                    : crops.length === 0 
                    ? 'Add crops to your plots first' 
                    : 'Choose a crop...'
                  }
              </SelectTrigger>
              <SelectContent>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTrendIcon()}
              Price Forecast - {prediction.predictionYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Predicted Price</p>
                <p className="text-2xl font-bold">${prediction.predictedPriceUsdPerLb}/lb</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className="text-lg font-semibold capitalize">{prediction.trend}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold">{(prediction.confidence * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Points</p>
                <p className="text-lg font-semibold">{prediction.historicalDataPoints} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {historicalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price History Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Price (USD/lb)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Historical Price"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Price"
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {!loading && historicalData.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {crops.length === 0 && plotCrops.length > 0 ? (
              <>
                <p className="mb-2">No price data available for your crops yet.</p>
                <p className="text-sm">Upload USDA ERS data for: {plotCrops.join(', ')}</p>
              </>
            ) : crops.length === 0 ? (
              <p>Add crops to your plots to see price predictions</p>
            ) : (
              <p>No data available for the selected crop</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
