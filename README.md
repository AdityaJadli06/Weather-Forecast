# Weather Forecast Website - Setup Guide

## Project Overview
This weather forecast website uses probability-based algorithms to predict weather patterns by analyzing historical data and applying statistical models including Markov chains and seasonal probability distributions.

## Features
- **Probability-based Predictions**: Uses historical weather patterns and seasonal probabilities
- **Markov Chain Weather Transitions**: Models weather state transitions for improved accuracy
- **7-Day Forecast**: Provides detailed weekly weather predictions with confidence levels
- **Real-time Current Weather**: Shows current conditions with probability analysis
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Interactive UI**: Modern, glassmorphism-styled interface with smooth animations

## File Structure
```
weather-forecast-app/
├── weather-backend.py      # Python Flask backend with prediction algorithms
├── index.html             # Main HTML structure
├── style.css             # CSS styling with responsive design
├── script.js             # JavaScript frontend functionality
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Setup Instructions

### 1. Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Installation
1. Create a new directory for the project:
```bash
mkdir weather-forecast-app
cd weather-forecast-app
```

2. Save all the provided files in this directory

3. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install required packages:
```bash
pip install -r requirements.txt
```

### 3. Running the Application
1. Start the Python backend:
```bash
python weather-backend.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## How the Probability System Works

### 1. Historical Weather Patterns
The system uses predefined weather patterns based on typical meteorological data:
- **Sunny**: Temperature 20-30°C, Humidity 30-60%, Wind 5-15 km/h
- **Cloudy**: Temperature 15-25°C, Humidity 50-80%, Wind 10-20 km/h  
- **Rainy**: Temperature 10-20°C, Humidity 70-95%, Wind 15-30 km/h
- **Stormy**: Temperature 12-18°C, Humidity 80-100%, Wind 25-45 km/h

### 2. Seasonal Probability Distribution
Weather conditions are weighted by month to reflect seasonal patterns:
- **Summer months**: Higher probability of sunny weather
- **Winter months**: Higher probability of cloudy/rainy weather
- **Transition months**: Balanced probability distribution

### 3. Markov Chain Weather Transitions
The system models how weather conditions transition from day to day:
- Sunny weather has a 60% chance of remaining sunny
- Rainy weather has a 50% chance of becoming cloudy
- Weather persistence and natural transition patterns

### 4. Prediction Algorithm
The final prediction combines:
- 30% seasonal probability (long-term patterns)
- 70% transition probability (short-term patterns)
- Random variation within realistic parameters

## API Endpoints

### `/api/current`
Returns current weather conditions with probability analysis.

**Response:**
```json
{
  "success": true,
  "current_weather": {
    "condition": "sunny",
    "temperature": 24,
    "humidity": 55,
    "wind_speed": 12,
    "probability": 75.0
  }
}
```

### `/api/forecast`
Returns 7-day weather forecast with detailed predictions.

**Response:**
```json
{
  "success": true,
  "forecast": [
    {
      "date": "2025-10-15",
      "day": "Wednesday",
      "condition": "sunny",
      "temperature": 24,
      "probability": 75.0
    }
    // ... 6 more days
  ]
}
```

## Customization Options

### 1. Weather Patterns
Modify `weather_patterns` in `weather-backend.py` to adjust:
- Temperature ranges
- Humidity ranges  
- Wind speed ranges
- Weather icons

### 2. Seasonal Probabilities
Update `seasonal_probabilities` to reflect your local climate:
```python
self.seasonal_probabilities = {
    1: {'sunny': 0.3, 'cloudy': 0.4, 'rainy': 0.2, 'stormy': 0.1},
    # Adjust probabilities for each month
}
```

### 3. Styling
Modify `style.css` to customize:
- Color schemes
- Layout components
- Animations
- Responsive breakpoints

### 4. Real Weather Data Integration
To integrate real weather APIs (OpenWeatherMap, WeatherAPI, etc.):
1. Replace the prediction algorithms with API calls
2. Update the data processing functions
3. Maintain the probability analysis for forecasting

## Technical Details

### Backend Architecture
- **Flask**: Web framework for API endpoints
- **NumPy**: Numerical computations for probability calculations
- **CORS**: Cross-origin resource sharing for frontend-backend communication

### Frontend Architecture  
- **Vanilla JavaScript**: No external frameworks for maximum compatibility
- **CSS Grid/Flexbox**: Modern layout techniques
- **Progressive Enhancement**: Graceful fallbacks for offline functionality

### Probability Mathematics
- **Weighted Random Selection**: `numpy.random.choice()` with probability weights
- **Markov Chains**: First-order weather state transitions
- **Bayesian Inference**: Combining prior (seasonal) and likelihood (transition) probabilities

## Future Enhancements
- Integration with real weather APIs
- Machine learning model training on historical data
- User location detection and customization
- Weather alerts and notifications
- Progressive Web App (PWA) features
- Historical weather data visualization

## Troubleshooting

### Common Issues:
1. **Port 5000 already in use**: Change the port in `weather-backend.py`
2. **CORS errors**: Ensure Flask-CORS is installed and configured
3. **JavaScript errors**: Check browser console for detailed error messages
4. **Styling issues**: Verify CSS file is properly linked

### Browser Compatibility:
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## License
This project is open source and available under the MIT License.