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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SmartInsightsProps {
  yieldPredictions: any[];
}

export function SmartInsights({ yieldPredictions }: SmartInsightsProps) {
  const irrigationRecommendations = [
    {
      crop: 'Maize',
      currentLevel: 'Optimal',
      recommendation: 'Maintain current schedule',
      waterNeeded: '25mm/week',
      nextIrrigation: 'Oct 28',
      status: 'good',
    },
    {
      crop: 'Peanuts',
      currentLevel: 'Slightly Low',
      recommendation: 'Increase watering by 15%',
      waterNeeded: '20mm/week',
      nextIrrigation: 'Oct 26',
      status: 'warning',
    },
    {
      crop: 'Rice',
      currentLevel: 'Good',
      recommendation: 'Heavy rain expected, skip next irrigation',
      waterNeeded: '30mm/week',
      nextIrrigation: 'Skip Nov 1',
      status: 'info',
    },
  ];

  const fertilizerInsights = [
    {
      nutrient: 'Nitrogen (N)',
      level: 'Medium',
      recommendation: 'Apply Urea 40kg/acre within 2 weeks for Maize',
      priority: 'high',
    },
    {
      nutrient: 'Phosphorus (P)',
      level: 'Good',
      recommendation: 'Levels adequate for current crops',
      priority: 'low',
    },
    {
      nutrient: 'Potassium (K)',
      level: 'Medium-Low',
      recommendation: 'Consider Muriate of Potash for Rice field',
      priority: 'medium',
    },
  ];

  const pestAlerts = [
    {
      threat: 'Fall Armyworm',
      riskLevel: 'Medium',
      affectedCrops: ['Maize'],
      action: 'Monitor regularly. Apply neem-based pesticide if damage exceeds 20%',
      preventive: 'Install pheromone traps around field perimeter',
    },
    {
      threat: 'Leaf Spot',
      riskLevel: 'Low',
      affectedCrops: ['Peanuts'],
      action: 'Good crop health. Continue current practices',
      preventive: 'Ensure adequate spacing for air circulation',
    },
    {
      threat: 'Rice Blast',
      riskLevel: 'High',
      affectedCrops: ['Rice'],
      action: 'High humidity creating favorable conditions. Consider preventive fungicide',
      preventive: 'Improve drainage, avoid excessive nitrogen',
    },
  ];

  const getRiskBadge = (level: string) => {
    if (level === 'High') return <Badge className="bg-red-600">High Risk</Badge>;
    if (level === 'Medium') return <Badge className="bg-yellow-600">Medium Risk</Badge>;
    return <Badge className="bg-green-600">Low Risk</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-l-red-500';
    if (priority === 'medium') return 'border-l-yellow-500';
    return 'border-l-green-500';
  };

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'bg-green-50 border-green-200';
    if (status === 'warning') return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Yield Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Predictions</CardTitle>
          <CardDescription>AI-powered predictions based on current growth patterns and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldPredictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis label={{ value: 'Tons/Acre', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="predicted" fill="#10b981" name="Predicted Yield" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid gap-3">
            {yieldPredictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <div>{prediction.crop}</div>
                    <div className="text-sm text-gray-600">
                      Predicted: {prediction.predicted} {prediction.unit}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">
                  {Math.round((prediction.predicted / 4) * 100)}% of optimal
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Irrigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            Smart Irrigation Recommendations
          </CardTitle>
          <CardDescription>Optimized watering schedule based on weather and soil conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {irrigationRecommendations.map((item, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getStatusColor(item.status)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{item.crop}</span>
                      <Badge variant="outline">{item.currentLevel}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{item.recommendation}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Water Needed:</span>
                    <span className="ml-2">{item.waterNeeded}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Irrigation:</span>
                    <span className="ml-2">{item.nextIrrigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Fertilizer & Nutrient Insights
          </CardTitle>
          <CardDescription>Soil nutrient analysis and fertilization recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fertilizerInsights.map((insight, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg border bg-white ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{insight.nutrient}</span>
                      <Badge variant="outline">{insight.level}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{insight.recommendation}</div>
                  </div>
                  <Lightbulb className={`w-5 h-5 ${
                    insight.priority === 'high' ? 'text-red-500' :
                    insight.priority === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pest & Disease Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-600" />
            Pest & Disease Alert Zone
          </CardTitle>
          <CardDescription>Real-time risk assessment based on local conditions and crop health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pestAlerts.map((alert, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{alert.threat}</span>
                      {getRiskBadge(alert.riskLevel)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Affects: {alert.affectedCrops.join(', ')}
                    </div>
                  </div>
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.riskLevel === 'High' ? 'text-red-500' :
                    alert.riskLevel === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`} />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-700 mb-1">Recommended Action:</div>
                    <div className="text-gray-900">{alert.action}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="text-blue-700 mb-1">Preventive Measure:</div>
                    <div className="text-blue-900">{alert.preventive}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            Quick Farming Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-green-900">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Heavy rainfall expected Nov 1 - ensure proper field drainage to prevent waterlogging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Your peanut crop is performing exceptionally well (92% health) - current practices are optimal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Consider intercropping legumes with your next maize planting to improve soil nitrogen naturally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Market prices for peanuts are trending upward - good timing for your current crop</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
