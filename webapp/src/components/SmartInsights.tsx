import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Droplet, 
  Leaf, 
  Bug, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { YieldPrediction, SoilMoistureData } from '@/types/farm';

interface SmartInsightsProps {
  yieldPredictions: YieldPrediction[];
  soilMoistureData: SoilMoistureData[];
}

export function SmartInsights({ yieldPredictions, soilMoistureData }: SmartInsightsProps) {
  const irrigationRecommendations = [
    {
      crop: 'Maize',
      currentMoisture: 58,
      optimalMoisture: 70,
      recommendation: 'Increase irrigation by 20%',
      priority: 'high',
    },
    {
      crop: 'Cassava',
      currentMoisture: 72,
      optimalMoisture: 65,
      recommendation: 'Reduce irrigation slightly',
      priority: 'low',
    },
  ];

  const pestRiskAssessment = [
    {
      pest: 'Fall Armyworm',
      risk: 'Medium',
      riskLevel: 60,
      action: 'Monitor closely, apply preventive measures',
    },
    {
      pest: 'Aphids',
      risk: 'Low',
      riskLevel: 25,
      action: 'Continue regular monitoring',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered Insights</h2>
        <p className="text-muted-foreground">
          Data-driven recommendations to optimize your farming operations
        </p>
      </div>

      {/* Yield Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Yield Predictions
          </CardTitle>
          <CardDescription>Predicted vs actual yields (tons/acre)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldPredictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="predicted" fill="hsl(var(--primary))" name="Predicted" />
              <Bar dataKey="actual" fill="hsl(var(--accent))" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Soil Moisture Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            Soil Moisture Trends
          </CardTitle>
          <CardDescription>Monthly soil moisture levels (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={soilMoistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="moisture" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Irrigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            Irrigation Recommendations
          </CardTitle>
          <CardDescription>Optimize water usage for each crop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {irrigationRecommendations.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{item.crop}</h4>
                <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                  {item.priority} priority
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Moisture</span>
                  <span className="font-medium">{item.currentMoisture}%</span>
                </div>
                <Progress value={item.currentMoisture} className="h-2" />
              </div>
              <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded">
                <Lightbulb className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p>{item.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pest Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-primary" />
            Pest Risk Assessment
          </CardTitle>
          <CardDescription>Current pest threats and recommended actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pestRiskAssessment.map((item, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{item.pest}</h4>
                <Badge variant={
                  item.riskLevel > 60 ? 'destructive' : 
                  item.riskLevel > 30 ? 'secondary' : 
                  'outline'
                }>
                  {item.risk} Risk
                </Badge>
              </div>
              <Progress value={item.riskLevel} className="h-2" />
              <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded">
                <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p>{item.action}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
