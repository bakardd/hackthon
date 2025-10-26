import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plot } from '@/types/farm';
import { MapPin, Droplet, Sun, LayoutGrid, List, GripVertical } from 'lucide-react';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlotsListProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  onSelectPlot: (plot: Plot) => void;
  onReorder: (plots: Plot[]) => void;
}

interface SortablePlotCardProps {
  plot: Plot;
  isSelected: boolean;
  onSelect: (plot: Plot) => void;
  viewMode: 'detailed' | 'compact';
}

function SortablePlotCard({ plot, isSelected, onSelect, viewMode }: SortablePlotCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (viewMode === 'compact') {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onSelect(plot)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{plot.name}</h3>
                    {plot.currentCrop && (
                      <Badge variant="secondary" className="text-xs">{plot.currentCrop}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {plot.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      {plot.sunlightHours}h
                    </span>
                    <span>{plot.size} acres</span>
                  </div>
                </div>
              </div>
              {plot.lastHarvest && plot.lastHarvest !== 'Not specified' && (
                <div className="text-xs text-muted-foreground text-right">
                  <p>Last harvest</p>
                  <p className="font-medium">{plot.lastHarvest}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(plot)}
    >
      <CardHeader className="relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-4 right-4 cursor-grab active:cursor-grabbing touch-none z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </div>
        <CardTitle className="flex items-center justify-between pr-8">
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
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <span>{plot.sunlightHours}h sun</span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{plot.size} acres</span>
          </p>
          {plot.lastHarvest && plot.lastHarvest !== 'Not specified' && (
            <p className="text-xs text-muted-foreground mt-1">
              Last harvest: {plot.lastHarvest}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlotsList({ plots, selectedPlot, onSelectPlot, onReorder }: PlotsListProps) {
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = plots.findIndex((plot) => plot.id === active.id);
      const newIndex = plots.findIndex((plot) => plot.id === over.id);
      
      const reorderedPlots = arrayMove(plots, oldIndex, newIndex);
      onReorder(reorderedPlots);
    }
  };

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
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Plots</h2>
          <p className="text-sm text-muted-foreground">{plots.length} plot{plots.length > 1 ? 's' : ''} • {plots.reduce((sum, p) => sum + p.size, 0).toFixed(1)} total acres</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
          className="gap-2"
        >
          {viewMode === 'detailed' ? (
            <>
              <LayoutGrid className="w-4 h-4" />
              Compact
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              Detailed
            </>
          )}
        </Button>
      </div>

      {/* Plots Display */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={plots.map(p => p.id)}
          strategy={viewMode === 'compact' ? verticalListSortingStrategy : rectSortingStrategy}
        >
          {viewMode === 'compact' ? (
            /* Compact View */
            <div className="space-y-2">
              {plots.map((plot) => (
                <SortablePlotCard
                  key={plot.id}
                  plot={plot}
                  isSelected={selectedPlot?.id === plot.id}
                  onSelect={onSelectPlot}
                  viewMode="compact"
                />
              ))}
            </div>
          ) : (
            /* Detailed View */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plots.map((plot) => (
                <SortablePlotCard
                  key={plot.id}
                  plot={plot}
                  isSelected={selectedPlot?.id === plot.id}
                  onSelect={onSelectPlot}
                  viewMode="detailed"
                />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
