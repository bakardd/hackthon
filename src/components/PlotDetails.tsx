import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Plot, WeatherData, Alert } from '@/types/farm';
import { 
  MapPin, 
  Droplet, 
  Sun, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft,
  Trash2,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MLCropRecommendations } from './MLCropRecommendations';
import { YieldTrackingDialog } from './YieldTrackingDialog';
import { plotsService } from '@/lib/plotsService';
import { toast } from '@/hooks/use-toast';
import { getWeatherForecast } from '@/lib/weatherService';
import { yieldCalculator } from '@/lib/yieldCalculator';

interface PlotDetailsProps {
  plot: Plot;
  weatherData?: WeatherData[];
  alerts: Alert[];
  onBack: () => void;
  onDelete?: (plotId: string) => void;
  onPlotUpdate?: () => void;
}

export function PlotDetails({ 
  plot, 
  weatherData: initialWeatherData, 
  alerts, 
  onBack,
  onDelete,
  onPlotUpdate
}: PlotDetailsProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>(initialWeatherData || []);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [showYieldDialog, setShowYieldDialog] = useState(false);

  // Calculate yield prediction
  const yieldPrediction = useMemo(() => {
    if (!plot.currentCrop) return null;
    return yieldCalculator.predictYield(plot, plot.currentCrop);
  }, [plot]);

  const alertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const handleCropSelect = async (crop: string) => {
    try {
      await plotsService.updatePlot(plot.id, { currentCrop: crop });
      if (onPlotUpdate) {
        onPlotUpdate();
      }
    } catch (error) {
      console.error('Error updating crop:', error);
      throw error;
    }
  };

  const fetchWeatherData = async () => {
    if (!plot.latitude || !plot.longitude) {
      toast({
        title: "Location Not Set",
        description: "Please add coordinates to your plot to fetch weather data.",
        variant: "destructive",
      });
      return;
    }

    setLoadingWeather(true);
    try {
      const forecast = await getWeatherForecast(plot.latitude, plot.longitude);
      setWeatherData(forecast);
      toast({
        title: "Weather Updated",
        description: "Successfully fetched the latest weather forecast.",
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Weather Fetch Failed",
        description: "Unable to fetch weather data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (plot.latitude && plot.longitude) {
      fetchWeatherData();
    }
  }, [plot.id, plot.latitude, plot.longitude]);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
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
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Plot
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{plot.name}" and all associated data. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(plot.id)}>
                  Delete Plot
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Plot Details Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Yield</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {plot.actualYield ? (
              <>
                <div className="text-2xl font-bold">{plot.actualYield}</div>
                <p className="text-xs text-muted-foreground">
                  tons/acre • Total: {yieldCalculator.calculateTotalYield(plot.actualYield, plot.size)} tons
                </p>
              </>
            ) : yieldPrediction ? (
              <>
                <div className="text-2xl font-bold text-muted-foreground">{yieldPrediction.predictedYield}</div>
                <p className="text-xs text-muted-foreground">
                  Predicted tons/acre
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <p className="text-xs text-muted-foreground">No data</p>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowYieldDialog(true)}
              className="mt-2 w-full"
              disabled={!plot.currentCrop}
            >
              {plot.actualYield ? 'Update' : 'Track'} Yield
            </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weather Forecast</CardTitle>
              <CardDescription>
                {plot.latitude && plot.longitude 
                  ? 'Live data from National Weather Service' 
                  : 'Add coordinates to fetch real weather data'}
              </CardDescription>
            </div>
            {plot.latitude && plot.longitude && (
              <Button
                onClick={fetchWeatherData}
                disabled={loadingWeather}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loadingWeather ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {weatherData && weatherData.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">No weather data available</p>
                <p className="text-sm">
                  {plot.latitude && plot.longitude 
                    ? 'Click refresh to fetch weather data' 
                    : 'Add latitude and longitude to your plot'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      {/* ML Crop Recommendations */}
      <MLCropRecommendations plot={plot} onCropSelect={handleCropSelect} />

      {/* Yield Tracking Dialog */}
      <YieldTrackingDialog
        open={showYieldDialog}
        onOpenChange={setShowYieldDialog}
        plot={plot}
        onUpdate={() => onPlotUpdate && onPlotUpdate()}
      />

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
    </div>
  );
}
