import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { PlotSetupDialog } from './components/PlotSetupDialog';
import { CropRecommendations } from './components/CropRecommendations';
import { DashboardOverview } from './components/DashboardOverview';
import { SmartInsights } from './components/SmartInsights';
import { CommunityHub } from './components/CommunityHub';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { 
  mockPlots, 
  mockCrops, 
  mockWeatherData, 
  mockCropRecommendations,
  mockAlerts,
  fertilizationSchedule,
  soilMoistureData,
  yieldPredictions
} from './lib/mockData';
import { Plot } from './types/farm';
import { 
  LayoutDashboard, 
  MapPin, 
  Lightbulb, 
  Users, 
  Plus,
  Sprout,
  Tractor
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [plots, setPlots] = useState<Plot[]>(mockPlots);
  const [selectedPlot, setSelectedPlot] = useState<Plot>(mockPlots[0]);
  const [showPlotDialog, setShowPlotDialog] = useState(false);

  const handleCreatePlot = (plotData: Plot) => {
    setPlots([...plots, plotData]);
    setSelectedPlot(plotData);
    toast.success('Plot created successfully!', {
      description: 'You can now view crop recommendations for this plot.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-green-900">FarmWise</h1>
                <p className="text-sm text-gray-600">Smart Agriculture Management System</p>
              </div>
            </div>
            <Button onClick={() => setShowPlotDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Plot
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1573668965168-793065caf341?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwY3JvcHMlMjBmaWVsZHxlbnwxfHx8fDE3NjEzMzgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Farm field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h2 className="text-4xl mb-3">Grow Smarter, Harvest Better</h2>
              <p className="text-lg text-green-50">
                Data-driven insights for modern farming. Track your crops, optimize resources, and maximize yields with AI-powered recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Plot Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <label className="text-sm text-gray-600">Selected Plot:</label>
                  <select 
                    className="ml-3 border rounded-lg px-3 py-2"
                    value={selectedPlot.id}
                    onChange={(e) => {
                      const plot = plots.find(p => p.id === e.target.value);
                      if (plot) setSelectedPlot(plot);
                    }}
                  >
                    {plots.map(plot => (
                      <option key={plot.id} value={plot.id}>
                        {plot.name} - {plot.location.address} ({plot.size} acres)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Soil:</span>
                  <span className="ml-2 capitalize">{selectedPlot.soilType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sunlight:</span>
                  <span className="ml-2">{selectedPlot.sunlightHours}h/day</span>
                </div>
                <div>
                  <span className="text-gray-600">Water:</span>
                  <span className="ml-2 capitalize">{selectedPlot.waterSource}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Sprout className="w-4 h-4" />
              Crop Recommendations
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Smart Insights
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview 
              crops={mockCrops}
              weather={mockWeatherData}
              alerts={mockAlerts}
              soilMoistureData={soilMoistureData}
              fertilizationSchedule={fertilizationSchedule}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Crop Recommendations for {selectedPlot.name}</CardTitle>
                <CardDescription>
                  AI-powered recommendations based on your soil, climate, and local market conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CropRecommendations 
                  recommendations={mockCropRecommendations}
                  soilType={selectedPlot.soilType}
                  sunlightHours={selectedPlot.sunlightHours}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <SmartInsights yieldPredictions={yieldPredictions} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityHub />
          </TabsContent>
        </Tabs>
      </div>

      {/* Plot Setup Dialog */}
      <PlotSetupDialog 
        open={showPlotDialog}
        onOpenChange={setShowPlotDialog}
        onCreatePlot={handleCreatePlot}
      />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tractor className="w-5 h-5 text-green-600" />
                <span>FarmWise</span>
              </div>
              <p className="text-sm text-gray-600">
                Empowering farmers with data-driven insights and AI-powered recommendations for sustainable agriculture.
              </p>
            </div>
            <div>
              <h3 className="mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Smart Crop Recommendations</li>
                <li>Weather & Climate Insights</li>
                <li>Pest & Disease Management</li>
                <li>Yield Predictions</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">Data Sources</h3>
              <p className="text-sm text-gray-600">
                This prototype uses mock data. In production, it would integrate with:
              </p>
              <ul className="space-y-1 text-sm text-gray-600 mt-2">
                <li>• OpenWeather API</li>
                <li>• SoilGrids Database</li>
                <li>• Local Agricultural Data</li>
                <li>• Market Price APIs</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>FarmWise - Smart Agriculture Management System • Prototype Version</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
