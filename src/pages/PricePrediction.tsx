import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceDataUpload } from '@/components/PriceDataUpload';
import { PricePredictionDashboard } from '@/components/PricePredictionDashboard';
import { BarChart3 } from 'lucide-react';

const PricePrediction = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Produce Price Prediction
          </h1>
          <p className="text-muted-foreground">
            Upload USDA ERS data and predict future fruit and vegetable prices
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">Data Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PricePredictionDashboard />
          </TabsContent>

          <TabsContent value="upload">
            <PriceDataUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PricePrediction;
