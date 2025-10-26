import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Database, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { priceDataService } from '@/lib/priceDataService';
import { pricePredictionService } from '@/lib/pricePredictionService';

export const PriceDataUpload = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await file.text();
      const priceData = pricePredictionService.parseCSV(text);

      if (priceData.length === 0) {
        toast.error('No valid data found in CSV file');
        return;
      }

      await priceDataService.addPriceData(priceData);
      toast.success(`Successfully imported ${priceData.length} price records`);
      setFileName('');
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload price data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to delete all price data? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await priceDataService.clearAllPriceData();
      toast.success('All price data cleared');
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear price data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Price Data Management
        </CardTitle>
        <CardDescription>
          Upload USDA ERS retail fruit and vegetable price data (CSV format)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <Upload className="h-5 w-5" />
              <span className="text-sm">
                {fileName || 'Click to upload CSV file or drag and drop'}
              </span>
            </div>
          </label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Expected CSV format:</strong></p>
          <p>year, item_name, price_per_lb_usd, category, notes</p>
          <p className="mt-2">
            <strong>Data source:</strong> USDA ERS - Fruit and Vegetable Prices
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
