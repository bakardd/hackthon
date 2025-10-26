import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plot } from '@/types/farm';
import { MapPin, Droplet, Sun } from 'lucide-react';

interface PlotsListProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  onSelectPlot: (plot: Plot) => void;
}

export function PlotsList({ plots, selectedPlot, onSelectPlot }: PlotsListProps) {
  if (plots.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Plots Yet</h3>
        <p className="text-muted-foreground">Create your first plot to get started with smart farming.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plots.map((plot) => (
        <Card 
          key={plot.id} 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedPlot?.id === plot.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectPlot(plot)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{plot.name}</span>
              {plot.currentCrop && (
                <Badge variant="default">{plot.currentCrop}</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {plot.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-muted-foreground" />
                <span>{plot.soilType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <span>{plot.sunlightHours}h sun</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{plot.size} acres</span> • {plot.waterAccess}
              </p>
              {plot.lastHarvest && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last harvest: {plot.lastHarvest}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
