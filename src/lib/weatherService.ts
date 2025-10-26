/**
 * WeatherAPI.com Integration
 * Free tier: 1M calls/month, current weather + forecast
 */

export interface WeatherForecast {
  date: string;
  temperature: number; // Celsius
  rainfall: number; // mm
  humidity: number; // percentage
  forecast: string;
}

// WeatherAPI.com API key
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'dbe28fcf7a2b4cf9aff112130252610';

/**
 * Get current weather and forecast for a location
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number
): Promise<WeatherForecast[]> {
  try {
    // Get 7 day forecast
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=7`;

    const response = await fetch(forecastUrl);

    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();
    const forecasts: WeatherForecast[] = [];
    
    // Parse forecast days
    data.forecast.forecastday.forEach((day: any) => {
      const date = new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      forecasts.push({
        date,
        temperature: Math.round(day.day.avgtemp_c * 10) / 10,
        rainfall: Math.round(day.day.totalprecip_mm * 10) / 10,
        humidity: Math.round(day.day.avghumidity),
        forecast: day.day.condition.text
      });
    });

    return forecasts;
  } catch (error) {
    console.error('Error fetching WeatherAPI data:', error);
    throw error;
  }
}

/**
 * Get current weather conditions by zip code or coordinates
 */
export async function getCurrentWeather(
  zipCodeOrLat: string | number,
  longitude?: number
): Promise<{ temperature: number; humidity: number; location: string; latitude: number; longitude: number }> {
  try {
    let query: string;
    
    // If longitude is provided, it's coordinates
    if (longitude !== undefined) {
      query = `${zipCodeOrLat},${longitude}`;
    } else {
      // Otherwise it's a zip code
      query = zipCodeOrLat.toString();
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.current.temp_c * 10) / 10,
      humidity: Math.round(data.current.humidity),
      location: `${data.location.name}, ${data.location.region}`,
      latitude: data.location.lat,
      longitude: data.location.lon
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}
