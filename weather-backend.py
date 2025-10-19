# Weather Forecast Backend with Probability-based Predictions
from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import random
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)
CORS(app)

class WeatherPredictor:
    def __init__(self):
        # Historical weather patterns (based on typical weather data)
        self.weather_patterns = {
            'sunny': {
                'temp_range': (20, 30), 
                'humidity_range': (30, 60), 
                'wind_range': (5, 15),
                'icon': '☀️'
            },
            'cloudy': {
                'temp_range': (15, 25), 
                'humidity_range': (50, 80), 
                'wind_range': (10, 20),
                'icon': '☁️'
            },
            'rainy': {
                'temp_range': (10, 20), 
                'humidity_range': (70, 95), 
                'wind_range': (15, 30),
                'icon': '🌧️'
            },
            'stormy': {
                'temp_range': (12, 18), 
                'humidity_range': (80, 100), 
                'wind_range': (25, 45),
                'icon': '⛈️'
            }
        }
        
        # Seasonal probabilities based on historical data analysis
        self.seasonal_probabilities = {
            1: {'sunny': 0.3, 'cloudy': 0.4, 'rainy': 0.2, 'stormy': 0.1},
            2: {'sunny': 0.35, 'cloudy': 0.35, 'rainy': 0.2, 'stormy': 0.1},
            3: {'sunny': 0.4, 'cloudy': 0.3, 'rainy': 0.25, 'stormy': 0.05},
            4: {'sunny': 0.5, 'cloudy': 0.25, 'rainy': 0.2, 'stormy': 0.05},
            5: {'sunny': 0.6, 'cloudy': 0.2, 'rainy': 0.15, 'stormy': 0.05},
            6: {'sunny': 0.7, 'cloudy': 0.15, 'rainy': 0.1, 'stormy': 0.05},
            7: {'sunny': 0.75, 'cloudy': 0.1, 'rainy': 0.1, 'stormy': 0.05},
            8: {'sunny': 0.7, 'cloudy': 0.15, 'rainy': 0.1, 'stormy': 0.05},
            9: {'sunny': 0.6, 'cloudy': 0.2, 'rainy': 0.15, 'stormy': 0.05},
            10: {'sunny': 0.5, 'cloudy': 0.25, 'rainy': 0.2, 'stormy': 0.05},
            11: {'sunny': 0.4, 'cloudy': 0.3, 'rainy': 0.25, 'stormy': 0.05},
            12: {'sunny': 0.3, 'cloudy': 0.4, 'rainy': 0.2, 'stormy': 0.1}
        }
        
        # Weather transition probabilities (Markov chain concept)
        self.transition_probabilities = {
            'sunny': {'sunny': 0.6, 'cloudy': 0.3, 'rainy': 0.08, 'stormy': 0.02},
            'cloudy': {'sunny': 0.4, 'cloudy': 0.4, 'rainy': 0.15, 'stormy': 0.05},
            'rainy': {'sunny': 0.2, 'cloudy': 0.5, 'rainy': 0.25, 'stormy': 0.05},
            'stormy': {'sunny': 0.1, 'cloudy': 0.3, 'rainy': 0.4, 'stormy': 0.2}
        }
    
    def predict_weather_condition(self, date, previous_condition=None):
        """Predict weather condition using both seasonal and transition probabilities"""
        month = date.month
        seasonal_probs = self.seasonal_probabilities[month]
        
        if previous_condition and previous_condition in self.transition_probabilities:
            # Combine seasonal and transition probabilities
            transition_probs = self.transition_probabilities[previous_condition]
            
            # Weighted average of seasonal and transition probabilities
            combined_probs = {}
            for condition in seasonal_probs.keys():
                combined_probs[condition] = (
                    0.3 * seasonal_probs[condition] + 
                    0.7 * transition_probs[condition]
                )
        else:
            combined_probs = seasonal_probs
        
        # Normalize probabilities
        total = sum(combined_probs.values())
        normalized_probs = {k: v/total for k, v in combined_probs.items()}

        conditions = list(normalized_probs.keys())
        weights = list(normalized_probs.values())

        # Choose a single condition according to the combined probabilities
        chosen = np.random.choice(conditions, p=weights)
        return chosen, normalized_probs[chosen]
    
    def generate_weather_details(self, condition):
        """Generate realistic weather parameters based on condition"""
        pattern = self.weather_patterns[condition]
        
        # Add some randomness within realistic ranges
        temp = random.randint(*pattern['temp_range'])
        humidity = random.randint(*pattern['humidity_range'])
        wind_speed = random.randint(*pattern['wind_range'])
        
        # Add weather description
        descriptions = {
            'sunny': ['Clear skies', 'Bright and sunny', 'Perfect weather'],
            'cloudy': ['Overcast', 'Partly cloudy', 'Gray skies'],
            'rainy': ['Light rain', 'Showers expected', 'Rainy day'],
            'stormy': ['Thunderstorms', 'Severe weather', 'Storm warning']
        }
        
        return {
            'temperature': temp,
            'humidity': humidity,
            'wind_speed': wind_speed,
            'condition': condition,
            'icon': pattern['icon'],
            'description': random.choice(descriptions[condition])
        }
    
    def predict_week_forecast(self):
        """Generate probability-based 7-day weather forecast"""
        forecast = []
        current_date = datetime.now()
        previous_condition = None
        
        for i in range(7):
            date = current_date + timedelta(days=i)
            condition, probability = self.predict_weather_condition(date, previous_condition)
            weather_details = self.generate_weather_details(condition)
            
            forecast.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': date.strftime('%A'),
                'condition': condition,
                'temperature': weather_details['temperature'],
                'humidity': weather_details['humidity'],
                'wind_speed': weather_details['wind_speed'],
                'icon': weather_details['icon'],
                'description': weather_details['description'],
                'probability': round(probability * 100, 1)
            })
            
            previous_condition = condition
        
        return forecast

# Initialize predictor
predictor = WeatherPredictor()

@app.route('/')
def index():
    # Serve the static index.html located in the project root
    return send_from_directory('.', 'index.html')

@app.route('/api/forecast')
def get_forecast():
    """API endpoint to get weather forecast"""
    try:
        forecast = predictor.predict_week_forecast()
        return jsonify({
            'success': True,
            'forecast': forecast,
            'generated_at': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/current')
def get_current_weather():
    """API endpoint to get current weather"""
    try:
        current_date = datetime.now()
        condition, probability = predictor.predict_weather_condition(current_date)
        weather_details = predictor.generate_weather_details(condition)
        
        current_weather = {
            'date': current_date.strftime('%Y-%m-%d'),
            'time': current_date.strftime('%H:%M'),
            'condition': condition,
            'temperature': weather_details['temperature'],
            'humidity': weather_details['humidity'],
            'wind_speed': weather_details['wind_speed'],
            'icon': weather_details['icon'],
            'description': weather_details['description'],
            'probability': round(probability * 100, 1)
        }
        
        return jsonify({
            'success': True,
            'current_weather': current_weather
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)