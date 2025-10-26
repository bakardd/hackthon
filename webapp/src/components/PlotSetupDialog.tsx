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
    soilType: '',
    sunlightHours: '',
    waterAccess: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: Plot = {
      id: Date.now().toString(),
      name: formData.name,
      size: parseFloat(formData.size),
      location: formData.location,
      soilType: formData.soilType,
      sunlightHours: parseInt(formData.sunlightHours),
      waterAccess: formData.waterAccess,
    };
    onSubmit(newPlot);
    onOpenChange(false);
    setFormData({
      name: '',
      size: '',
      location: '',
      soilType: '',
      sunlightHours: '',
      waterAccess: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Plot</DialogTitle>
          <DialogDescription>
            Enter the details of your new farming plot to get personalized recommendations.
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
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Select
              value={formData.soilType}
              onValueChange={(value) => setFormData({ ...formData, soilType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Loam">Loam</SelectItem>
                <SelectItem value="Clay">Clay</SelectItem>
                <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                <SelectItem value="Sandy">Sandy</SelectItem>
                <SelectItem value="Silt">Silt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waterAccess">Water Access</Label>
            <Select
              value={formData.waterAccess}
              onValueChange={(value) => setFormData({ ...formData, waterAccess: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select water access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Irrigation System">Irrigation System</SelectItem>
                <SelectItem value="Drip Irrigation">Drip Irrigation</SelectItem>
                <SelectItem value="Rainfall + Well">Rainfall + Well</SelectItem>
                <SelectItem value="Rainfall Only">Rainfall Only</SelectItem>
              </SelectContent>
            </Select>
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
