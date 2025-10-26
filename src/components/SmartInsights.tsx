import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DollarSign,
  Loader2,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plot, YieldPrediction, SoilMoistureData } from '@/types/farm';
import { PricePredictionDashboard } from './PricePredictionDashboard';
import { useState, useEffect } from 'react';
import { priceDataService } from '@/lib/priceDataService';

interface SmartInsightsProps {
  yieldPredictions: YieldPrediction[];
  soilMoistureData: SoilMoistureData[];
  plots?: Plot[];
}

export function SmartInsights({ yieldPredictions, soilMoistureData, plots = [] }: SmartInsightsProps) {
  const [revenueEstimates, setRevenueEstimates] = useState<any[]>([]);
  const [predictedRevenueEstimates, setPredictedRevenueEstimates] = useState<any[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [totalEstimatedRevenue, setTotalEstimatedRevenue] = useState(0);
  const [totalPredictedRevenue, setTotalPredictedRevenue] = useState(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);
  const [predictedProfit, setPredictedProfit] = useState(0);
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');

  // Calculate revenue from actual plot data and predictions
  useEffect(() => {
    const calculateRevenue = async () => {
      setLoadingRevenue(true);
      
      // Filter plots that have crops and actual yield data
      const plotsWithActualYield = plots.filter(plot => plot.currentCrop && plot.actualYield);
      
      // Calculate actual revenue
      const actualEstimates = await Promise.all(
        plotsWithActualYield.map(async (plot) => {
          try {
            const priceHistory = await priceDataService.getCropPriceHistory(plot.currentCrop!);
            const latestPrice = priceHistory.length > 0 
              ? priceHistory[priceHistory.length - 1].priceUsdPerLb * 2204.62
              : 200;

            const totalYield = plot.actualYield! * plot.size;
            const estimatedRevenue = totalYield * latestPrice;
            // Estimate costs at 60% of revenue (40% profit margin)
            const estimatedCosts = estimatedRevenue * 0.6;
            const profit = estimatedRevenue - estimatedCosts;

            return {
              plotName: plot.name,
              crop: plot.currentCrop,
              yieldPerAcre: plot.actualYield,
              plotSize: plot.size,
              totalYield,
              marketPrice: latestPrice,
              estimatedRevenue,
              estimatedCosts,
              profit,
            };
          } catch (error) {
            console.error(`Error fetching price for ${plot.currentCrop}:`, error);
            const fallbackPrice = 200;
            const totalYield = plot.actualYield! * plot.size;
            const estimatedRevenue = totalYield * fallbackPrice;
            const estimatedCosts = estimatedRevenue * 0.6;
            const profit = estimatedRevenue - estimatedCosts;

            return {
              plotName: plot.name,
              crop: plot.currentCrop,
              yieldPerAcre: plot.actualYield,
              plotSize: plot.size,
              totalYield,
              marketPrice: fallbackPrice,
              estimatedRevenue,
              estimatedCosts,
              profit,
            };
          }
        })
      );

      // Calculate predicted revenue from yield predictions
      const plotsWithPredictions = plots.filter(plot => plot.currentCrop && !plot.actualYield);
      const predictedEstimates = await Promise.all(
        plotsWithPredictions.map(async (plot) => {
          try {
            // Find yield prediction for this plot's crop
            const prediction = yieldPredictions.find(p => p.crop.toLowerCase() === plot.currentCrop!.toLowerCase());
            if (!prediction) return null;

            const priceHistory = await priceDataService.getCropPriceHistory(plot.currentCrop!);
            const latestPrice = priceHistory.length > 0 
              ? priceHistory[priceHistory.length - 1].priceUsdPerLb * 2204.62
              : 200;

            const totalYield = prediction.predicted * plot.size;
            const estimatedRevenue = totalYield * latestPrice;
            const estimatedCosts = estimatedRevenue * 0.6;
            const profit = estimatedRevenue - estimatedCosts;

            return {
              plotName: plot.name,
              crop: plot.currentCrop,
              predictedYieldPerAcre: prediction.predicted,
              plotSize: plot.size,
              totalYield,
              marketPrice: latestPrice,
              estimatedRevenue,
              estimatedCosts,
              profit,
            };
          } catch (error) {
            console.error(`Error fetching price for ${plot.currentCrop}:`, error);
            return null;
          }
        })
      );

      const validPredictedEstimates = predictedEstimates.filter(e => e !== null);

      setRevenueEstimates(actualEstimates);
      setPredictedRevenueEstimates(validPredictedEstimates);
      
      const totalActualRevenue = actualEstimates.reduce((sum, item) => sum + item.estimatedRevenue, 0);
      const totalPredictedRev = validPredictedEstimates.reduce((sum, item) => sum + item.estimatedRevenue, 0);
      
      setTotalEstimatedRevenue(totalActualRevenue);
      setTotalPredictedRevenue(totalPredictedRev);
      setEstimatedProfit(actualEstimates.reduce((sum, item) => sum + item.profit, 0));
      setPredictedProfit(validPredictedEstimates.reduce((sum, item) => sum + item.profit, 0));
      
      setLoadingRevenue(false);
    };

    calculateRevenue();
  }, [plots, yieldPredictions]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered Insights</h2>
        <p className="text-muted-foreground">
          Data-driven recommendations to optimize your farming operations
        </p>
      </div>

      <Tabs defaultValue="farm-insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="farm-insights">Farm Insights</TabsTrigger>
          <TabsTrigger value="price-prediction">Market Prices</TabsTrigger>
        </TabsList>

        <TabsContent value="farm-insights" className="space-y-6">
      {/* Revenue & Profit Estimation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Revenue & Profit Analysis
              </CardTitle>
              <CardDescription>Actual and predicted sales with profit estimates</CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingRevenue ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : revenueEstimates.length === 0 && predictedRevenueEstimates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data available yet.</p>
              <p className="text-sm mt-2">Add yield tracking or crop data to your plots to see revenue estimates.</p>
            </div>
          ) : viewMode === 'compact' ? (
            /* Compact View */
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {revenueEstimates.length > 0 && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Actual Revenue</p>
                    <p className="text-2xl font-bold text-primary">${totalEstimatedRevenue.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{revenueEstimates.length} plot{revenueEstimates.length > 1 ? 's' : ''} harvested</p>
                  </div>
                )}
                {predictedRevenueEstimates.length > 0 && (
                  <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <p className="text-sm text-muted-foreground mb-1">Predicted Revenue</p>
                    <p className="text-2xl font-bold text-primary">${totalPredictedRevenue.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{predictedRevenueEstimates.length} plot{predictedRevenueEstimates.length > 1 ? 's' : ''} growing</p>
                  </div>
                )}
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Est. Profit</p>
                  <p className="text-2xl font-bold text-green-600">${(estimatedProfit + predictedProfit).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((estimatedProfit + predictedProfit) / (totalEstimatedRevenue + totalPredictedRevenue) * 100).toFixed(0)}% margin
                  </p>
                </div>
              </div>

              {/* Crop Summary List */}
              <div className="space-y-2">
                {revenueEstimates.map((item, index) => (
                  <div key={`actual-${index}`} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="shrink-0">{item.crop}</Badge>
                      <span className="text-sm text-muted-foreground">{item.plotName}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${item.estimatedRevenue.toFixed(0)}</p>
                      <p className="text-xs text-green-600">+${item.profit.toFixed(0)} profit</p>
                    </div>
                  </div>
                ))}
                {predictedRevenueEstimates.map((item, index) => (
                  <div key={`predicted-${index}`} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="shrink-0">{item.crop}</Badge>
                      <span className="text-sm text-muted-foreground">{item.plotName} (predicted)</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${item.estimatedRevenue.toFixed(0)}</p>
                      <p className="text-xs text-green-600">+${item.profit.toFixed(0)} profit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Detailed View */
            <>
              {/* Actual Revenue Section */}
              {revenueEstimates.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Actual Revenue (Harvested)</h3>
                  {revenueEstimates.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.crop}</h4>
                          <p className="text-sm text-muted-foreground">{item.plotName} • {item.plotSize} acres</p>
                        </div>
                        <Badge variant="secondary">${item.marketPrice.toFixed(0)}/ton</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Yield/Acre</p>
                          <p className="font-medium">{item.yieldPerAcre.toFixed(1)} tons</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium text-primary">${item.estimatedRevenue.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Costs</p>
                          <p className="font-medium text-orange-600">${item.estimatedCosts.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Profit</p>
                          <p className="font-medium text-green-600">${item.profit.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Predicted Revenue Section */}
              {predictedRevenueEstimates.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Predicted Revenue (Growing)</h3>
                  {predictedRevenueEstimates.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-blue-50/50 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.crop}</h4>
                          <p className="text-sm text-muted-foreground">{item.plotName} • {item.plotSize} acres</p>
                        </div>
                        <Badge variant="outline">${item.marketPrice.toFixed(0)}/ton</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Pred. Yield/Acre</p>
                          <p className="font-medium">{item.predictedYieldPerAcre.toFixed(1)} tons</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pred. Revenue</p>
                          <p className="font-medium text-primary">${item.estimatedRevenue.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Costs</p>
                          <p className="font-medium text-orange-600">${item.estimatedCosts.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pred. Profit</p>
                          <p className="font-medium text-green-600">${item.profit.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Totals */}
              <div className="pt-4 border-t space-y-3">
                {revenueEstimates.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-semibold">Total Actual Revenue</span>
                    <span className="text-xl font-bold text-primary">${totalEstimatedRevenue.toFixed(0)}</span>
                  </div>
                )}
                {predictedRevenueEstimates.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
                    <span className="font-semibold">Total Predicted Revenue</span>
                    <span className="text-xl font-bold text-primary">${totalPredictedRevenue.toFixed(0)}</span>
                  </div>
                )}
                {(revenueEstimates.length > 0 || predictedRevenueEstimates.length > 0) && (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="font-semibold">Total Estimated Profit</span>
                    <span className="text-xl font-bold text-green-600">${(estimatedProfit + predictedProfit).toFixed(0)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="price-prediction">
          <PricePredictionDashboard plots={plots} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
