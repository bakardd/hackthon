import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plot } from '@/types/farm';
import { MapPin, Thermometer, Droplets, FlaskConical, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { getCurrentWeather } from '@/lib/weatherService';
import { toast } from 'sonner';

interface PlotSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (plot: Omit<Plot, 'id'>) => void;
}

export function PlotSetupDialog({ open, onOpenChange, onSubmit }: PlotSetupDialogProps) {
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    location: '',
    sunlightHours: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    latitude: '',
    longitude: '',
  });

  const handleZipCodeFetch = async () => {
    if (!zipCode || zipCode.length < 5) {
      toast.error('Please enter a valid zip code');
      return;
    }

    setLoadingWeather(true);
    try {
      const weatherData = await getCurrentWeather(zipCode);
      setFormData(prev => ({
        ...prev,
        location: weatherData.location,
        latitude: weatherData.latitude.toString(),
        longitude: weatherData.longitude.toString(),
        temperature: weatherData.temperature.toString(),
        humidity: weatherData.humidity.toString(),
      }));
      toast.success(`Weather data loaded for ${weatherData.location}`);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      toast.error('Could not fetch location data. Please check zip code.');
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: Omit<Plot, 'id'> = {
      name: formData.name,
      size: parseFloat(formData.size),
      location: formData.location,
      soilType: 'Not specified',
      sunlightHours: parseInt(formData.sunlightHours),
      waterAccess: 'Not specified',
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };
    onSubmit(newPlot as Plot);
    onOpenChange(false);
    setFormData({
      name: '',
      size: '',
      location: '',
      sunlightHours: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
      latitude: '',
      longitude: '',
    });
    setZipCode('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Plot</DialogTitle>
          <DialogDescription>
            Set up your plot with location and environmental data for AI crop recommendations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Plot Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Plot Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Plot Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., North Field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (acres)</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.1"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="5.2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sunlight">Sunlight (hrs/day)</Label>
                  <Input
                    id="sunlight"
                    type="number"
                    min="0"
                    max="24"
                    value={formData.sunlightHours}
                    onChange={(e) => setFormData({ ...formData, sunlightHours: e.target.value })}
                    placeholder="8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipcode">Zip Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="zipcode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter zip code"
                    maxLength={10}
                  />
                  <Button 
                    type="button" 
                    onClick={handleZipCodeFetch}
                    disabled={loadingWeather || !zipCode}
                    className="whitespace-nowrap"
                  >
                    {loadingWeather ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Fetch Data'
                    )}
                  </Button>
                </div>
              </div>

              {formData.location && (
                <div className="space-y-2">
                  <Label>Detected Location</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {formData.location}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Environmental Data
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3" />
                    Temperature (°C)
                    {loadingWeather && <Loader2 className="w-3 h-3 animate-spin" />}
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    placeholder="Auto-filled from location"
                    disabled
                    className="bg-muted"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Auto-filled based on location</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity" className="flex items-center gap-2">
                    <Droplets className="w-3 h-3" />
                    Humidity (%)
                    {loadingWeather && <Loader2 className="w-3 h-3 animate-spin" />}
                  </Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    placeholder="Enter humidity or fetch from zip"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">Soil pH</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    placeholder="6.5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm/year)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    step="0.1"
                    value={formData.rainfall}
                    onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                    placeholder="800.0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Plot</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
