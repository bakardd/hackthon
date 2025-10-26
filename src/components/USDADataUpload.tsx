import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usdaDataImporter } from '@/lib/usdaDataImporter';

export const USDADataUpload = () => {
  const [loading, setLoading] = useState(false);
  const [vegetableFile, setVegetableFile] = useState<File | null>(null);
  const [fruitFile, setFruitFile] = useState<File | null>(null);

  const handleVegetableUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setVegetableFile(file);
  };

  const handleFruitUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFruitFile(file);
  };

  const handleImport = async () => {
    if (!vegetableFile || !fruitFile) {
      toast.error('Please upload both vegetable and fruit CSV files');
      return;
    }

    setLoading(true);
    try {
      const vegetableCsv = await vegetableFile.text();
      const fruitCsv = await fruitFile.text();

      // Extract year from filename (e.g., "Vegetable-Prices-2022.csv")
      const yearMatch = vegetableFile.name.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

      const result = await usdaDataImporter.importUSDAData(vegetableCsv, fruitCsv, year);

      if (result.success) {
        toast.success(`Successfully imported ${result.count} price records from ${year}`);
        setVegetableFile(null);
        setFruitFile(null);
      } else {
        toast.error(result.error || 'Failed to import data');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import USDA data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          USDA ERS Data Import
        </CardTitle>
        <CardDescription>
          Upload vegetable and fruit price CSV files from USDA ERS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vegetable Prices CSV</label>
            <div className="flex items-center gap-2">
              <label htmlFor="vegetable-upload" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    {vegetableFile ? vegetableFile.name : 'Choose vegetable CSV file'}
                  </span>
                </div>
              </label>
              <input
                id="vegetable-upload"
                type="file"
                accept=".csv"
                onChange={handleVegetableUpload}
                disabled={loading}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fruit Prices CSV</label>
            <div className="flex items-center gap-2">
              <label htmlFor="fruit-upload" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    {fruitFile ? fruitFile.name : 'Choose fruit CSV file'}
                  </span>
                </div>
              </label>
              <input
                id="fruit-upload"
                type="file"
                accept=".csv"
                onChange={handleFruitUpload}
                disabled={loading}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleImport}
          disabled={loading || !vegetableFile || !fruitFile}
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Import to Firebase
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>Expected files:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Vegetable-Prices-[YEAR].csv</li>
            <li>Fruit-Prices-[YEAR].csv</li>
          </ul>
          <p className="mt-2">
            <strong>Data source:</strong> USDA ERS - Fruit and Vegetable Prices
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
