import { RetailPrice } from '@/types/price';
import { priceDataService } from '@/lib/priceDataService';

interface USDACSVRow {
  name: string;
  form: string;
  retailPrice: number;
  retailPriceUnit: string;
}

export const usdaDataImporter = {
  // Parse USDA CSV format and convert to RetailPrice format
  parseUSDACSV(csvText: string, category: 'fruit' | 'vegetable', year: number): Omit<RetailPrice, 'id'>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const data: Omit<RetailPrice, 'id'>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle quoted fields properly
      const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 4) continue;

      const values = matches.map(v => v.replace(/^"|"$/g, '').trim());
      
      const name = values[0]; // Fruit or Vegetable name
      const form = values[1]; // Form (Fresh, Canned, etc.)
      const retailPrice = parseFloat(values[2]);
      const retailPriceUnit = values[3];

      if (isNaN(retailPrice)) continue;

      // Create a base crop name (remove variety descriptions)
      let cropName = name.toLowerCase().trim();
      
      // Remove descriptors in parentheses or after commas
      cropName = cropName.split(',')[0].trim();
      cropName = cropName.split('(')[0].trim();

      // For juice forms, extract the base fruit/vegetable name
      if (form === 'Juice') {
        cropName = cropName.replace(/\s+(ready-to-drink|frozen concentrate)/g, '').trim();
      }

      // Skip if price unit is not per pound (we'll note it)
      const notes = form !== 'Fresh' 
        ? `${form}${retailPriceUnit !== 'per pound' ? ` - ${retailPriceUnit}` : ''}`
        : undefined;

      data.push({
        year,
        cropName,
        category,
        priceUsdPerLb: retailPrice,
        notes,
      });
    }

    return data;
  },

  // Import both fruit and vegetable files
  async importUSDAData(
    vegetableCsv: string,
    fruitCsv: string,
    year: number
  ): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const vegetables = this.parseUSDACSV(vegetableCsv, 'vegetable', year);
      const fruits = this.parseUSDACSV(fruitCsv, 'fruit', year);

      const allData = [...vegetables, ...fruits];
      
      if (allData.length === 0) {
        return { success: false, count: 0, error: 'No valid data found in CSV files' };
      }

      await priceDataService.addPriceData(allData);
      
      return { success: true, count: allData.length };
    } catch (error) {
      console.error('Error importing USDA data:', error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
