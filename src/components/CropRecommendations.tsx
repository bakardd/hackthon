import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Sprout, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { CropRecommendation } from '@/types/farm';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
}

export function CropRecommendations({ recommendations }: CropRecommendationsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Recommended Crops for Your Plot</h2>
        <p className="text-muted-foreground">
          Based on your soil type, sunlight, and current market conditions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((crop, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sprout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{crop.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Suitability Score
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={crop.suitabilityScore >= 90 ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {crop.suitabilityScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={crop.suitabilityScore} className="h-2" />
              
              <p className="text-sm text-muted-foreground">{crop.reason}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Expected Yield</span>
                  </div>
                  <p className="text-sm font-medium">{crop.expectedYield}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Market Price</span>
                  </div>
                  <p className="text-sm font-medium">{crop.marketPrice}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Growth Duration</span>
                </div>
                <p className="text-sm font-medium">{crop.growthDuration}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
