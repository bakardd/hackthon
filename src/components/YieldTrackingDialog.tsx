import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plot } from '@/types/farm';
import { Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { plotsService } from '@/lib/plotsService';
import { toast } from 'sonner';
import { yieldCalculator } from '@/lib/yieldCalculator';

interface YieldTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plot: Plot;
  onUpdate: () => void;
}

export function YieldTrackingDialog({ open, onOpenChange, plot, onUpdate }: YieldTrackingDialogProps) {
  const [actualYield, setActualYield] = useState(plot.actualYield?.toString() || '');
  const [harvestDate, setHarvestDate] = useState(plot.yieldDate || new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  // Calculate predicted yield
  const prediction = plot.currentCrop 
    ? yieldCalculator.predictYield(plot, plot.currentCrop)
    : null;

  const totalActual = actualYield 
    ? yieldCalculator.calculateTotalYield(parseFloat(actualYield), plot.size)
    : 0;

  const totalPredicted = prediction
    ? yieldCalculator.calculateTotalYield(prediction.predictedYield, plot.size)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actualYield) {
      toast.error('Please enter actual yield');
      return;
    }

    setSaving(true);
    try {
      await plotsService.updatePlot(plot.id, {
        actualYield: parseFloat(actualYield),
        yieldDate: harvestDate,
      });
      
      toast.success('Yield data saved successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving yield data:', error);
      toast.error('Failed to save yield data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Track Yield - {plot.name}
          </DialogTitle>
          <DialogDescription>
            Record actual harvest yield for {plot.currentCrop || 'this plot'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prediction Info */}
          {prediction && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Predicted Yield</span>
                  <span className="font-semibold">{prediction.predictedYield} tons/acre</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Predicted</span>
                  <span className="font-semibold">{totalPredicted} tons</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actual Yield Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actualYield">Actual Yield (tons/acre)</Label>
              <Input
                id="actualYield"
                type="number"
                step="0.1"
                min="0"
                value={actualYield}
                onChange={(e) => setActualYield(e.target.value)}
                placeholder="e.g., 4.5"
                required
              />
              {actualYield && (
                <p className="text-xs text-muted-foreground">
                  Total harvest: <span className="font-semibold">{totalActual} tons</span>
                  {prediction && (
                    <span className="ml-2">
                      ({((parseFloat(actualYield) / prediction.predictedYield - 1) * 100).toFixed(1)}% vs predicted)
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="harvestDate" className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Harvest Date
              </Label>
              <Input
                id="harvestDate"
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Yield Data'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
