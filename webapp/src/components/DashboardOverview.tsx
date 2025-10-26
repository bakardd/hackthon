import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Droplet, 
  Sun, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Plot, WeatherData, Alert, FertilizationSchedule } from '@/types/farm';

interface DashboardOverviewProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  weatherData: WeatherData[];
  alerts: Alert[];
  fertilizationSchedule: FertilizationSchedule[];
}

export function DashboardOverview({ 
  plots, 
  selectedPlot, 
  weatherData, 
  alerts, 
  fertilizationSchedule 
}: DashboardOverviewProps) {
  const totalAcres = plots.reduce((sum, plot) => sum + plot.size, 0);
  const activePlots = plots.filter(p => p.currentCrop).length;

  const alertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (!selectedPlot) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Plot Selected</h3>
        <p className="text-muted-foreground">Create a plot to get started with your farm management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plots.length}</div>
            <p className="text-xs text-muted-foreground">
              {totalAcres.toFixed(1)} acres total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlots}</div>
            <p className="text-xs text-muted-foreground">
              Currently growing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Type</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPlot.soilType}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPlot.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sunlight</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPlot.sunlightHours}h</div>
            <p className="text-xs text-muted-foreground">
              Average daily hours
            </p>
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
            <CardDescription>Important updates for your farm</CardDescription>
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
