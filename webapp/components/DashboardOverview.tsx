import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Crop, WeatherData, Alert as AlertType } from '../types/farm';
import { 
  Droplet, 
  Sun, 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Wind,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardOverviewProps {
  crops: Crop[];
  weather: WeatherData;
  alerts: AlertType[];
  soilMoistureData: any[];
  fertilizationSchedule: any[];
}

export function DashboardOverview({ 
  crops, 
  weather, 
  alerts, 
  soilMoistureData,
  fertilizationSchedule 
}: DashboardOverviewProps) {
  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain')) return <CloudRain className="w-4 h-4" />;
    if (condition.includes('Cloud')) return <Cloud className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <XCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge className="bg-red-600">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Weather Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="text-3xl">{weather.temperature}°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="text-3xl">{weather.humidity}%</p>
              </div>
              <Droplet className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rainfall (7 days)</p>
                <p className="text-3xl">{weather.rainfall}mm</p>
              </div>
              <CloudRain className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Weather Forecast</CardTitle>
          <CardDescription>Plan your irrigation and farming activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-gray-50 border">
                <div className="text-xs text-gray-500">{day.date}</div>
                <div className="my-2 flex justify-center text-gray-600">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-sm">{day.temp}°C</div>
                <div className="text-xs text-blue-600 mt-1">{day.rainfall}mm</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Crops Growth Status */}
      <Card>
        <CardHeader>
          <CardTitle>Active Crops Growth Timeline</CardTitle>
          <CardDescription>Track your crops from planting to harvest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {crops.map((crop) => (
              <div key={crop.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{crop.name}</span>
                        <span className="text-sm text-gray-500">({crop.variety})</span>
                        {getHealthBadge(crop.healthScore)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        Planted {crop.plantedDate.toLocaleDateString()} • Harvest expected {crop.expectedHarvestDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl ${getHealthColor(crop.healthScore)}`}>
                      {crop.healthScore}%
                    </div>
                    <div className="text-xs text-gray-500">Health Score</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth Progress</span>
                    <span>{crop.growthStage}%</span>
                  </div>
                  <Progress value={crop.growthStage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Soil Moisture Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Levels</CardTitle>
          <CardDescription>Monitor soil moisture to optimize irrigation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={soilMoistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Droplet className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <span>Current soil moisture at 50% is optimal.</span>
                <span className="block text-blue-700 mt-1">
                  Recommendation: Maintain current irrigation schedule. Heavy rain expected Nov 1.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fertilization Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Fertilization Schedule</CardTitle>
          <CardDescription>Stay on track with your fertilization plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fertilizationSchedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{item.crop}</span>
                      <span className="text-sm text-gray-500">• {item.stage}</span>
                    </div>
                    <div className="text-sm text-gray-600">{item.fertilizer} - {item.amount}</div>
                  </div>
                </div>
                <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                  {item.status === 'completed' ? 'Completed' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts & Insights</CardTitle>
          <CardDescription>Important notifications for your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                variant={alert.type === 'danger' ? 'destructive' : 'default'}
                className={
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' :
                  alert.type === 'info' ? 'border-blue-500 bg-blue-50' : ''
                }
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                    <div className="text-xs text-gray-500 mt-2">{alert.date.toLocaleDateString()}</div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
