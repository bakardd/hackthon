import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SoilType, WaterSource } from '../types/farm';

interface PlotSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlot: (plotData: any) => void;
}

export function PlotSetupDialog({ open, onOpenChange, onCreatePlot }: PlotSetupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    soilType: '' as SoilType | '',
    sunlightHours: '',
    waterSource: '' as WaterSource | '',
    waterFrequency: '',
    size: '',
    previousCrops: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plotData = {
      id: Date.now().toString(),
      name: formData.name,
      location: {
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        address: formData.address,
      },
      soilType: formData.soilType as SoilType,
      sunlightHours: parseInt(formData.sunlightHours) || 0,
      waterSource: formData.waterSource as WaterSource,
      waterFrequency: formData.waterFrequency,
      previousCrops: formData.previousCrops.split(',').map(c => c.trim()).filter(Boolean),
      size: parseFloat(formData.size) || 0,
      createdAt: new Date(),
    };

    onCreatePlot(plotData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      soilType: '',
      sunlightHours: '',
      waterSource: '',
      waterFrequency: '',
      size: '',
      previousCrops: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Plot</DialogTitle>
          <DialogDescription>
            Enter your plot details to receive personalized crop recommendations and insights.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
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
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="9.0820"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="8.6753"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., Abuja, Nigeria"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={formData.soilType} onValueChange={(value) => setFormData({ ...formData, soilType: value as SoilType })}>
                  <SelectTrigger id="soilType">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loam">Loam</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sunlightHours">Average Sunlight (hours/day)</Label>
                <Input
                  id="sunlightHours"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterSource">Water Source</Label>
                <Select value={formData.waterSource} onValueChange={(value) => setFormData({ ...formData, waterSource: value as WaterSource })}>
                  <SelectTrigger id="waterSource">
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rainfall">Rainfall</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="well">Well</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="waterFrequency">Water Frequency</Label>
                <Input
                  id="waterFrequency"
                  value={formData.waterFrequency}
                  onChange={(e) => setFormData({ ...formData, waterFrequency: e.target.value })}
                  placeholder="e.g., Twice weekly"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="size">Plot Size (acres)</Label>
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

            <div>
              <Label htmlFor="previousCrops">Previous Crops (optional, comma-separated)</Label>
              <Input
                id="previousCrops"
                value={formData.previousCrops}
                onChange={(e) => setFormData({ ...formData, previousCrops: e.target.value })}
                placeholder="e.g., Maize, Cassava, Yam"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
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
