import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlotSetupDialog } from '@/components/PlotSetupDialog';
import { CropRecommendations } from '@/components/CropRecommendations';
import { PlotsList } from '@/components/PlotsList';
import { PlotDetails } from '@/components/PlotDetails';
import { SmartInsights } from '@/components/SmartInsights';
import { CommunityHub } from '@/components/CommunityHub';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ThemeToggle } from '@/components/ThemeToggle';
import { db } from '@/lib/firebase';
import { plotsService } from '@/lib/plotsService';
import { 
  mockCrops, 
  mockWeatherData, 
  mockCropRecommendations,
  mockAlerts,
  fertilizationSchedule,
  soilMoistureData,
  yieldPredictions
} from '@/lib/mockData';
import { Plot } from '@/types/farm';
import { 
  LayoutDashboard, 
  MapPin, 
  Lightbulb, 
  Users, 
  Plus,
  Sprout,
  Tractor,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [showPlotDialog, setShowPlotDialog] = useState(false);
  const [loadingPlots, setLoadingPlots] = useState(true);
  const [showPlotDetails, setShowPlotDetails] = useState(false);

  // Load user's plots from Firestore
  useEffect(() => {
    const loadPlots = async () => {
      if (!user) {
        // Clear plots when not logged in
        setPlots([]);
        setSelectedPlot(null);
        setLoadingPlots(false);
        return;
      }
      
      try {
        const loadedPlots = await plotsService.getUserPlots(user.uid);
        setPlots(loadedPlots);
        setSelectedPlot(loadedPlots.length > 0 ? loadedPlots[0] : null);
      } catch (error) {
        console.error('Error loading plots:', error);
        toast.error('Failed to load plots');
        setPlots([]);
        setSelectedPlot(null);
      } finally {
        setLoadingPlots(false);
      }
    };

    loadPlots();
  }, [user]);

  const handleCreatePlot = async (plotData: Plot) => {
    if (!user) {
      toast.error('Please log in to create plots');
      return;
    }

    try {
      const newPlot = await plotsService.createPlot(user.uid, plotData);
      setPlots([...plots, newPlot]);
      setSelectedPlot(newPlot);
      toast.success('Plot created successfully!', {
        description: 'You can now view crop recommendations for this plot.',
      });
    } catch (error) {
      console.error('Error creating plot:', error);
      toast.error('Failed to create plot');
    }
  };

  const handleDeletePlot = async (plotId: string) => {
    if (!user) {
      toast.error('Please log in to delete plots');
      return;
    }

    try {
      await plotsService.deletePlot(plotId);
      const updatedPlots = plots.filter(plot => plot.id !== plotId);
      setPlots(updatedPlots);
      setSelectedPlot(updatedPlots.length > 0 ? updatedPlots[0] : null);
      setShowPlotDetails(false);
      toast.success('Plot deleted successfully');
    } catch (error) {
      console.error('Error deleting plot:', error);
      toast.error('Failed to delete plot');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading || loadingPlots) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Tractor className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Tractor className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FarmForward</h1>
                <p className="text-sm text-muted-foreground">Smart Agriculture Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <>
                  <Button onClick={() => setShowPlotDialog(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Plot
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate('/auth')} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop"
          alt="Farm field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Grow Smarter, Not Harder
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                AI-powered insights and recommendations to maximize your farm's potential
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Sprout className="w-5 h-5" />
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-1">
            <TabsTrigger value="dashboard" className="gap-2 py-3">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="plots" className="gap-2 py-3">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Plots</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2 py-3">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {showPlotDetails && selectedPlot ? (
              <PlotDetails
                plot={selectedPlot}
                weatherData={mockWeatherData}
                alerts={mockAlerts}
                fertilizationSchedule={fertilizationSchedule}
                onBack={() => setShowPlotDetails(false)}
                onDelete={handleDeletePlot}
              />
            ) : (
              <PlotsList
                plots={plots}
                selectedPlot={selectedPlot}
                onSelectPlot={(plot) => {
                  setSelectedPlot(plot);
                  setShowPlotDetails(true);
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="plots" className="space-y-6">
            <CropRecommendations recommendations={mockCropRecommendations} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SmartInsights
              yieldPredictions={yieldPredictions}
              soilMoistureData={soilMoistureData}
            />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityHub />
          </TabsContent>
        </Tabs>
      </div>

      <PlotSetupDialog
        open={showPlotDialog}
        onOpenChange={setShowPlotDialog}
        onSubmit={handleCreatePlot}
      />
    </div>
  );
};

export default Index;
