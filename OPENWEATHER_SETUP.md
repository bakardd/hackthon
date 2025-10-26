# OpenWeatherMap API Key

To use weather features, you need to add your OpenWeatherMap API key:

1. Get a free API key from https://openweathermap.org/api
2. Create a `.env` file in the project root
3. Add this line:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

**Note:** The free tier allows 1000 API calls per day, which is sufficient for most farming applications.

## Alternative: Use Mock Data

If you don't want to use the OpenWeatherMap API, you can modify the weather service to return mock data for development.
