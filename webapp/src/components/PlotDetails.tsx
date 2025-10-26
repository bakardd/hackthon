import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plot, WeatherData, Alert, FertilizationSchedule } from '@/types/farm';
import { 
  MapPin, 
  Droplet, 
  Sun, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PlotDetailsProps {
  plot: Plot;
  weatherData: WeatherData[];
  alerts: Alert[];
  fertilizationSchedule: FertilizationSchedule[];
  onBack: () => void;
}

export function PlotDetails({ 
  plot, 
  weatherData, 
  alerts, 
  fertilizationSchedule,
  onBack 
}: PlotDetailsProps) {
  const alertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Plots
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{plot.name}</h2>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {plot.location}
          </p>
        </div>
      </div>

      {/* Plot Details Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plot Size</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plot.size}</div>
            <p className="text-xs text-muted-foreground">acres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Crop</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plot.currentCrop || 'None'}</div>
            <p className="text-xs text-muted-foreground">
              {plot.lastHarvest ? `Last: ${plot.lastHarvest}` : 'No harvest yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Type</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plot.soilType}</div>
            <p className="text-xs text-muted-foreground">{plot.waterAccess}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sunlight</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plot.sunlightHours}h</div>
            <p className="text-xs text-muted-foreground">Average daily hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Temperature and rainfall for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="temperature" fill="hsl(var(--primary))" name="Temperature (°C)" />
              <Bar yAxisId="right" dataKey="rainfall" fill="hsl(var(--accent))" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important updates for this plot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`
                  ${alert.type === 'warning' ? 'text-yellow-600' : ''}
                  ${alert.type === 'success' ? 'text-green-600' : ''}
                  ${alert.type === 'info' ? 'text-blue-600' : ''}
                `}>
                  {alertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fertilization Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Fertilization Schedule</CardTitle>
            <CardDescription>Upcoming and completed tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fertilizationSchedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.crop}</p>
                  <p className="text-xs text-muted-foreground">{item.week}: {item.action}</p>
                </div>
                <Badge variant={
                  item.status === 'completed' ? 'default' : 
                  item.status === 'pending' ? 'secondary' : 
                  'outline'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
