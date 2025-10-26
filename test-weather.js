// Test the OpenWeatherMap API key
import * as dotenv from 'dotenv';

// Load environment variables from .env file for Node.js testing
dotenv.config();

const API_KEY = '21eb5cef733b15e440c7dd74e3e21f77';

async function testWeatherAPI() {
  try {
    // Test with London coordinates
    const lat = 51.5074;
    const lon = -0.1278;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    console.log('Testing OpenWeatherMap API...');
    console.log('URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API key is working!');
    console.log('Weather data:', {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testWeatherAPI();