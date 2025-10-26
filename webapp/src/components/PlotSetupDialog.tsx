import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plot } from '@/types/farm';

interface PlotSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (plot: Plot) => void;
}

export function PlotSetupDialog({ open, onOpenChange, onSubmit }: PlotSetupDialogProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: Plot = {
      id: Date.now().toString(),
      name: formData.name,
      size: parseFloat(formData.size),
      location: formData.location,
      soilType: 'Not specified', // Default value
      sunlightHours: parseInt(formData.sunlightHours),
      waterAccess: 'Not specified', // Default value
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall),
    };
    onSubmit(newPlot);
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Plot</DialogTitle>
          <DialogDescription>
            Enter your plot details and environmental data to get AI-powered crop recommendations based on our machine learning model.
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
          
          {/* ML Model Parameters for Crop Recommendations */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Environmental Data for Crop Recommendations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Avg Temperature (°C)</Label>
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
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  placeholder="75.0"
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
          </div>
          <div className="flex justify-end gap-3 pt-4">
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
