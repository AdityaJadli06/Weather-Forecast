# Weather Forecast System

A comprehensive weather forecast application built with Flask, HTML, CSS, and Python that provides current weather conditions, 5-day forecasts, and historical weather data.

## Features

- **Current Weather Display**: Real-time weather conditions with temperature, humidity, pressure, wind speed, and visibility
- **5-Day Weather Forecast**: Detailed daily weather predictions with high/low temperatures
- **Historical Weather Data**: Access to past weather information using free APIs
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Geolocation Support**: Get weather for your current location
- **Data Export**: Download historical weather data as CSV files
- **Modern UI**: Clean, professional interface with smooth animations

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Bootstrap 5, Custom CSS with gradients and animations
- **APIs**: 
  - OpenWeatherMap API (current weather & forecasts)
  - Open-Meteo API (historical data - completely free)
- **Icons**: Font Awesome

## Project Structure

```
Weather_Forecast_System/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Home page with search form
│   └── forecast.html     # Weather results display
├── static/
│   ├── css/
│   │   └── style.css     # Custom styles with modern design
│   └── js/
│       └── main.js       # JavaScript functionality
└── README.md             # This file
```

## Installation & Setup

### 1. Clone or Download the Project
Create a new folder for your project and save all the provided files in their respective locations.

### 2. Install Python Dependencies
```bash
# Create a virtual environment (recommended)
python -m venv weather_app
source weather_app/bin/activate  # On Windows: weather_app\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### 3. Get OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 4. Configure API Key
Open `app.py` and replace the API key:
```python
API_KEY = 'your_actual_api_key_here'
```

### 5. Run the Application
```bash
python app.py
```

### 6. Access the Application
Open your browser and visit: `http://localhost:5000`

## File Descriptions

### HTML Templates

1. **base.html** [40] - Base template with navigation, header, and footer
2. **index.html** [41] - Home page with weather search form and feature descriptions  
3. **forecast.html** [42] - Weather results page showing current conditions and 5-day forecast

### CSS & JavaScript

4. **style.css** [43] - Complete custom styling with:
   - Modern gradient backgrounds
   - Responsive design for all screen sizes
   - Smooth animations and hover effects
   - Weather-themed color scheme
   - Professional card layouts

5. **main.js** [44] - JavaScript functionality including:
   - Geolocation support for current location weather
   - Historical weather data fetching
   - Form validation and input handling
   - Data export to CSV functionality
   - Dynamic UI updates and animations

### Backend Files

6. **app.py** [45] - Main Flask application with:
   - Current weather API integration
   - 5-day forecast functionality
   - Historical weather data using free Open-Meteo API
   - Error handling and logging
   - RESTful API endpoints

7. **requirements.txt** [46] - Python package dependencies

## API Information

### For Current Weather & Forecasts
- **OpenWeatherMap API**: Reliable, industry-standard weather data
- **Free Tier**: 1,000 API calls per day
- **Data**: Current conditions, 5-day/3-hour forecasts

### For Historical Weather Data
- **Open-Meteo API**: Completely free, no API key required
- **Coverage**: Historical data from 1940 onwards
- **Resolution**: 9km spatial resolution
- **Data**: Temperature, humidity, pressure, wind speed, weather conditions

## Usage Instructions

### Getting Current Weather
1. Enter a city name in the search box
2. Click "Get Current Weather & Forecast"
3. View current conditions and 5-day forecast

### Getting Historical Data
1. Scroll to the "Historical Weather Data" section
2. Enter city name and select a past date
3. Click "Get Historical Weather Data"
4. Download data as CSV if needed

### Using Your Location
1. Click the location icon next to the search box
2. Allow location access when prompted
3. Weather data for your current location will be displayed

## Features Breakdown

### Current Weather Display
- Temperature with "feels like" value
- Weather description and icon
- Humidity, pressure, wind speed, visibility
- Sunrise and sunset times
- Professional weather card layout

### 5-Day Forecast
- Daily high and low temperatures
- Weather icons and descriptions  
- Humidity and pressure for each day
- Responsive card grid layout
- Hover animations for better UX

### Historical Weather
- Free access to past weather data
- Date range validation
- Export functionality to CSV
- Clean data presentation
- Share functionality

## Customization Options

### Styling
The CSS uses CSS custom properties (variables) for easy customization:
```css
:root {
    --primary-color: #2980b9;
    --secondary-color: #3498db;
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding More APIs
The app is designed to easily integrate additional weather APIs. Add new functions in `app.py` following the existing pattern.

### Database Integration
You can extend the app to store weather data locally by adding database models and functions.

## Troubleshooting

### Common Issues
1. **API Key Error**: Make sure you've replaced the placeholder API key with your actual OpenWeatherMap API key
2. **City Not Found**: Try using city name with country code (e.g., "London,UK")
3. **Historical Data Not Available**: Some dates may not have data available
4. **Location Access Denied**: Grant location permissions in your browser settings

### Error Handling
The application includes comprehensive error handling for:
- Invalid city names
- API timeouts and connection errors
- Missing historical data
- Invalid date selections

## Browser Support
- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing
Feel free to fork this project and submit improvements. Some areas for enhancement:
- Weather maps integration
- More detailed hourly forecasts
- Weather alerts and notifications
- Multiple location tracking
- Weather data analytics

## License
This project is open source and available under the MIT License.

## Credits
- Weather data provided by OpenWeatherMap and Open-Meteo
- Icons by Font Awesome
- UI components by Bootstrap
- Built with Flask and Python