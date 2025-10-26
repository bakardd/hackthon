import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Plot } from '../types/farm';
import { PlotService } from '../lib/database';
import { CropRecommendation } from '../lib/mlService';

export interface UsePlotsReturn {
  plots: Plot[];
  loading: boolean;
  error: string | null;
  createPlot: (plotData: Omit<Plot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ plot: Plot; recommendations: CropRecommendation[] }>;
  updatePlot: (plotId: string, updates: Partial<Plot>) => Promise<void>;
  deletePlot: (plotId: string) => Promise<void>;
  refreshPlots: () => Promise<void>;
  getRecommendations: (plot: Plot) => Promise<CropRecommendation[]>;
}

export function usePlots(): UsePlotsReturn {
  const { user } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlots = async () => {
    if (!user) {
      setPlots([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userPlots = await PlotService.getUserPlots();
      setPlots(userPlots);
    } catch (err) {
      console.error('Error loading plots:', err);
      setError('Failed to load plots');
    } finally {
      setLoading(false);
    }
  };

  const createPlot = async (plotData: Omit<Plot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    
    try {
      const result = await PlotService.createPlot(plotData);
      setPlots(prev => [result.plot, ...prev]);
      return result;
    } catch (err) {
      console.error('Error creating plot:', err);
      setError('Failed to create plot');
      throw err;
    }
  };

  const updatePlot = async (plotId: string, updates: Partial<Plot>) => {
    setError(null);
    
    try {
      await PlotService.updatePlot(plotId, updates);
      setPlots(prev => prev.map(plot => 
        plot.id === plotId ? { ...plot, ...updates } : plot
      ));
    } catch (err) {
      console.error('Error updating plot:', err);
      setError('Failed to update plot');
      throw err;
    }
  };

  const deletePlot = async (plotId: string) => {
    setError(null);
    
    try {
      await PlotService.deletePlot(plotId);
      setPlots(prev => prev.filter(plot => plot.id !== plotId));
    } catch (err) {
      console.error('Error deleting plot:', err);
      setError('Failed to delete plot');
      throw err;
    }
  };

  const getRecommendations = async (plot: Plot) => {
    try {
      return await PlotService.getPlotRecommendations(plot);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      throw err;
    }
  };

  const refreshPlots = async () => {
    await loadPlots();
  };

  // Load plots when user changes
  useEffect(() => {
    loadPlots();
  }, [user]);

  return {
    plots,
    loading,
    error,
    createPlot,
    updatePlot,
    deletePlot,
    refreshPlots,
    getRecommendations,
  };
}