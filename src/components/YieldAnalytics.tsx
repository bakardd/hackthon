import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plot } from '@/types/farm';
import { yieldCalculator } from '@/lib/yieldCalculator';
import { TrendingUp, TrendingDown, Award, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface YieldAnalyticsProps {
  plots: Plot[];
}

export function YieldAnalytics({ plots }: YieldAnalyticsProps) {
  // Calculate overall yield statistics
  const yieldAnalysis = yieldCalculator.analyzeYields(plots);
  
  // Get plots with yield data
  const plotsWithYield = plots.filter(p => p.actualYield && p.currentCrop);
  
  // Get plots with crops selected (for predictions)
  const plotsWithCrops = plots.filter(p => p.currentCrop);
  
  // Calculate predicted vs actual for each plot
  const yieldComparison = plotsWithYield.map(plot => {
    const prediction = yieldCalculator.predictYield(plot, plot.currentCrop!);
    const actual = plot.actualYield!;
    const totalActual = yieldCalculator.calculateTotalYield(actual, plot.size);
    const totalPredicted = yieldCalculator.calculateTotalYield(prediction.predictedYield, plot.size);
    const variance = ((actual - prediction.predictedYield) / prediction.predictedYield) * 100;
    
    return {
      name: plot.name,
      crop: plot.currentCrop!,
      predicted: prediction.predictedYield,
      actual: actual,
      totalActual: totalActual,
      totalPredicted: totalPredicted,
      variance: variance,
      size: plot.size,
      date: plot.yieldDate
    };
  });

  // Calculate total production
  const totalProduction = plotsWithYield.reduce((sum, plot) => {
    return sum + yieldCalculator.calculateTotalYield(plot.actualYield!, plot.size);
  }, 0);

  // Group by crop
  const cropYields: { [crop: string]: { total: number; plots: number; avgYield: number } } = {};
  plotsWithYield.forEach(plot => {
    const crop = plot.currentCrop!;
    const total = yieldCalculator.calculateTotalYield(plot.actualYield!, plot.size);
    
    if (!cropYields[crop]) {
      cropYields[crop] = { total: 0, plots: 0, avgYield: 0 };
    }
    cropYields[crop].total += total;
    cropYields[crop].plots += 1;
    cropYields[crop].avgYield = (cropYields[crop].avgYield * (cropYields[crop].plots - 1) + plot.actualYield!) / cropYields[crop].plots;
  });

  const cropData = Object.entries(cropYields).map(([crop, data]) => ({
    crop,
    ...data
  }));

  // Chart data for comparison
  const comparisonChartData = yieldComparison.map(item => ({
    plot: item.name,
    Predicted: item.predicted,
    Actual: item.actual,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--success))', 'hsl(var(--warning))'];

  // Show predictions if no actual yield data but crops are selected
  if (plotsWithYield.length === 0 && plotsWithCrops.length > 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Predicted Yield
            </CardTitle>
            <CardDescription>Expected harvest based on plot conditions and crop selection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plotsWithCrops.map((plot) => {
                const prediction = yieldCalculator.predictYield(plot, plot.currentCrop!);
                const totalPredicted = yieldCalculator.calculateTotalYield(prediction.predictedYield, plot.size);
                
                return (
                  <div key={plot.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{plot.name}</h4>
                        <Badge variant="outline">{plot.currentCrop}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Predicted Yield</p>
                          <p className="font-semibold text-primary">{prediction.predictedYield.toFixed(2)} tons/acre</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Plot Size</p>
                          <p className="font-semibold">{plot.size} acres</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Expected</p>
                          <p className="font-semibold text-primary">{totalPredicted.toFixed(1)} tons</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Confidence</p>
                          <p className="font-semibold">{(prediction.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                <strong>Total Expected Production:</strong> {plotsWithCrops.reduce((sum, plot) => {
                  const prediction = yieldCalculator.predictYield(plot, plot.currentCrop!);
                  return sum + yieldCalculator.calculateTotalYield(prediction.predictedYield, plot.size);
                }, 0).toFixed(1)} tons
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (plotsWithYield.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Yield Production Analytics
          </CardTitle>
          <CardDescription>No yield data recorded yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start tracking yield data for your plots to see production analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yieldAnalysis.totalYield.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">tons harvested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yieldAnalysis.averageYield.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">tons per acre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Crop</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yieldAnalysis.bestPerformingCrop || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">highest average yield</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plots Tracked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plotsWithYield.length}</div>
            <p className="text-xs text-muted-foreground">of {plots.length} total plots</p>
          </CardContent>
        </Card>
      </div>

      {/* Predicted vs Actual Chart */}
      {comparisonChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Predicted vs Actual Yield</CardTitle>
            <CardDescription>Comparison of predicted and actual yields per plot (tons/acre)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Predicted" fill="hsl(var(--primary))" />
                <Bar dataKey="Actual" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Crop Production Summary */}
      {cropData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Production by Crop</CardTitle>
            <CardDescription>Total production and average yield for each crop</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Production (tons)">
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Yield Records */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Records</CardTitle>
          <CardDescription>Detailed harvest data for all plots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {yieldComparison.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <Badge variant="outline">{item.crop}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                    <div>
                      <p className="text-muted-foreground">Actual Yield</p>
                      <p className="font-semibold">{item.actual.toFixed(2)} tons/acre</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Predicted</p>
                      <p className="font-semibold">{item.predicted.toFixed(2)} tons/acre</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Production</p>
                      <p className="font-semibold">{item.totalActual.toFixed(1)} tons</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Variance</p>
                      <div className="flex items-center gap-1">
                        {item.variance > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <p className={`font-semibold ${item.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.variance > 0 ? '+' : ''}{item.variance.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  {item.date && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Harvested: {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
