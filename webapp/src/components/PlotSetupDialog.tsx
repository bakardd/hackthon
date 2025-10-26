import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plot } from '@/types/farm';
import { CropRecommendation } from '@/lib/mlService';
import { Sparkles, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface PlotSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (plot: Plot) => void;
  onPlotCreated?: (plot: Plot, recommendations: CropRecommendation[]) => void;
}

export function PlotSetupDialog({ open, onOpenChange, onSubmit, onPlotCreated }: PlotSetupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    location: '',
    sunlightHours: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [step, setStep] = useState<'form' | 'recommendations'>('form');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newPlot: Plot = {
        id: Date.now().toString(),
        name: formData.name,
        size: parseFloat(formData.size),
        location: formData.location,
        sunlightHours: parseInt(formData.sunlightHours),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      };
      
      onSubmit(newPlot);
      
      // If we have a callback for ML recommendations, trigger it
      if (onPlotCreated) {
        // This would typically come from the ML service
        const mockRecommendations: CropRecommendation[] = [
          {
            name: 'Rice',
            suitabilityScore: 92,
            reason: 'High humidity and rainfall ideal for rice cultivation',
            expectedYield: '4-6 tons/acre',
            marketPrice: '$450-600/ton',
            growthDuration: '120-150 days'
          }
        ];
        setRecommendations(mockRecommendations);
        setStep('recommendations');
        onPlotCreated(newPlot, mockRecommendations);
      } else {
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating plot:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      size: '',
      location: '',
      sunlightHours: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
    });
    setStep('form');
    setRecommendations([]);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Add New Plot</DialogTitle>
              <DialogDescription>
                Enter your plot details including environmental conditions to get AI-powered crop recommendations.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="sunlight">Sunlight (hours/day)</Label>
                  <Input
                    id="sunlight"
                    type="number"
                    value={formData.sunlightHours}
                    onChange={(e) => setFormData({ ...formData, sunlightHours: e.target.value })}
                    placeholder="8"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Northern Section"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Average Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="25.5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Average Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    placeholder="65.0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ph">Soil pH Level</Label>
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
                  <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
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
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Plot & Get Recommendations'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Crop Recommendations
              </DialogTitle>
              <DialogDescription>
                Based on your plot conditions, here are the best crop recommendations:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {recommendations.map((crop, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{crop.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {crop.reason}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={crop.suitabilityScore >= 90 ? 'default' : 'secondary'}
                        className="text-sm"
                      >
                        {crop.suitabilityScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          <span>Yield</span>
                        </div>
                        <p className="font-medium">{crop.expectedYield}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span>Price</span>
                        </div>
                        <p className="font-medium">{crop.marketPrice}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Duration</span>
                        </div>
                        <p className="font-medium">{crop.growthDuration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep('form')}>
                  Create Another Plot
                </Button>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
