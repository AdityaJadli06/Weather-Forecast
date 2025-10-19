# First, let's create the Python backend for weather prediction using historical data
import json
import random
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict

# Create a weather prediction system using probability
class WeatherPredictor:
    def __init__(self):
        # Historical weather patterns (simplified for demo)
        self.weather_patterns = {
            'sunny': {'temp_range': (20, 30), 'humidity_range': (30, 60), 'wind_range': (5, 15)},
            'cloudy': {'temp_range': (15, 25), 'humidity_range': (50, 80), 'wind_range': (10, 20)},
            'rainy': {'temp_range': (10, 20), 'humidity_range': (70, 95), 'wind_range': (15, 30)},
            'stormy': {'temp_range': (12, 18), 'humidity_range': (80, 100), 'wind_range': (25, 45)}
        }
        
        # Seasonal probabilities (month-based)
        self.seasonal_probabilities = {
            1: {'sunny': 0.3, 'cloudy': 0.4, 'rainy': 0.2, 'stormy': 0.1},  # January
            2: {'sunny': 0.35, 'cloudy': 0.35, 'rainy': 0.2, 'stormy': 0.1},  # February
            3: {'sunny': 0.4, 'cloudy': 0.3, 'rainy': 0.25, 'stormy': 0.05},  # March
            4: {'sunny': 0.5, 'cloudy': 0.25, 'rainy': 0.2, 'stormy': 0.05},  # April
            5: {'sunny': 0.6, 'cloudy': 0.2, 'rainy': 0.15, 'stormy': 0.05},  # May
            6: {'sunny': 0.7, 'cloudy': 0.15, 'rainy': 0.1, 'stormy': 0.05},  # June
            7: {'sunny': 0.75, 'cloudy': 0.1, 'rainy': 0.1, 'stormy': 0.05},  # July
            8: {'sunny': 0.7, 'cloudy': 0.15, 'rainy': 0.1, 'stormy': 0.05},  # August
            9: {'sunny': 0.6, 'cloudy': 0.2, 'rainy': 0.15, 'stormy': 0.05},  # September
            10: {'sunny': 0.5, 'cloudy': 0.25, 'rainy': 0.2, 'stormy': 0.05},  # October
            11: {'sunny': 0.4, 'cloudy': 0.3, 'rainy': 0.25, 'stormy': 0.05},  # November
            12: {'sunny': 0.3, 'cloudy': 0.4, 'rainy': 0.2, 'stormy': 0.1}   # December
        }
    
    def predict_weather_condition(self, date):
        """Predict weather condition based on seasonal probabilities"""
        month = date.month
        probabilities = self.seasonal_probabilities[month]
        
        # Use weighted random selection
        conditions = list(probabilities.keys())
        weights = list(probabilities.values())
        
        return np.random.choice(conditions, p=weights)
    
    def generate_weather_details(self, condition):
        """Generate temperature, humidity, and wind speed based on condition"""
        pattern = self.weather_patterns[condition]
        
        temp = random.randint(*pattern['temp_range'])
        humidity = random.randint(*pattern['humidity_range'])
        wind_speed = random.randint(*pattern['wind_range'])
        
        return {
            'temperature': temp,
            'humidity': humidity,
            'wind_speed': wind_speed,
            'condition': condition
        }
    
    def predict_week_forecast(self):
        """Generate 7-day weather forecast"""
        forecast = []
        current_date = datetime.now()
        
        for i in range(7):
            date = current_date + timedelta(days=i)
            condition = self.predict_weather_condition(date)
            weather_details = self.generate_weather_details(condition)
            
            forecast.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': date.strftime('%A'),
                'condition': condition,
                'temperature': weather_details['temperature'],
                'humidity': weather_details['humidity'],
                'wind_speed': weather_details['wind_speed'],
                'probability': round(self.seasonal_probabilities[date.month][condition] * 100, 1)
            })
        
        return forecast

# Create predictor instance and generate sample forecast
predictor = WeatherPredictor()
sample_forecast = predictor.predict_week_forecast()

print("Sample 7-day weather forecast:")
for day in sample_forecast:
    print(f"{day['day']} ({day['date']}): {day['condition'].title()} - {day['temperature']}°C - {day['probability']}% probability")