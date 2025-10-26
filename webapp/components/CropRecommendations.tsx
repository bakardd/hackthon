import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CropRecommendation } from '../types/farm';
import { Sprout, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
  soilType: string;
  sunlightHours: number;
}

export function CropRecommendations({ recommendations, soilType, sunlightHours }: CropRecommendationsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sprout className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-green-900">Personalized Recommendations</h4>
            <p className="text-green-700 text-sm mt-1">
              Based on your {soilType} soil and {sunlightHours} hours of daily sunlight
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {recommendations.map((crop, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {crop.name}
                    {crop.suitabilityScore >= 90 && (
                      <Badge className="bg-green-600">Highly Recommended</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">{crop.reason}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-green-600">{crop.suitabilityScore}%</div>
                  <div className="text-xs text-gray-500">Suitability</div>
                </div>
              </div>
              <Progress value={crop.suitabilityScore} className="mt-3" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Expected Yield</div>
                    <div className="text-sm">{crop.expectedYield}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Market Price</div>
                    <div className="text-sm">{crop.marketPrice}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="text-sm">{crop.growthDuration}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
