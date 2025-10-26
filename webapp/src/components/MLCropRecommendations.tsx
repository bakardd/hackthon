import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Sprout, Brain, RefreshCw } from 'lucide-react';
import { Plot } from '@/types/farm';
import { getCropRecommendations, MLParameters, CropPrediction } from '@/lib/cropRecommendation';
import { useState, useEffect } from 'react';

interface MLCropRecommendationsProps {
  plot: Plot;
}

export function MLCropRecommendations({ plot }: MLCropRecommendationsProps) {
  const [predictions, setPredictions] = useState<CropPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mlParams: MLParameters = {
        temperature: plot.temperature,
        humidity: plot.humidity,
        ph: plot.ph,
        rainfall: plot.rainfall
      };
      
      const recommendations = getCropRecommendations(mlParams);
      setPredictions(recommendations);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateRecommendations();
  }, [plot]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Crop Recommendations
          </h2>
          <p className="text-muted-foreground">
            ML-powered suggestions based on your plot's environmental data
          </p>
        </div>
        <Button 
          onClick={generateRecommendations} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Environmental Parameters Display */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Environmental Parameters</CardTitle>
          <CardDescription>Data used for ML predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-lg font-medium">{plot.temperature}°C</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-medium">{plot.humidity}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Soil pH</p>
              <p className="text-lg font-medium">{plot.ph}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rainfall</p>
              <p className="text-lg font-medium">{plot.rainfall}mm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {predictions.map((prediction, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all ${index === 0 ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sprout className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl capitalize">{prediction.crop}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <span>Confidence:</span>
                        <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={prediction.suitabilityScore >= 80 ? 'default' : 
                               prediction.suitabilityScore >= 60 ? 'secondary' : 'outline'}
                      className="text-sm"
                    >
                      {prediction.suitabilityScore}%
                    </Badge>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Best Match
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={prediction.suitabilityScore} className="h-2" />
                <p className="text-sm text-muted-foreground">{prediction.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {predictions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Sprout className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No recommendations available</p>
            <p className="text-sm text-muted-foreground text-center">
              Click "Refresh" to generate crop recommendations based on your plot data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}