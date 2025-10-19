from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)

API_KEY = 'your_openweathermap_api_key_here' 
BASE_URL = 'http://api.openweathermap.org/data/2.5'
GEO_URL = 'http://api.openweathermap.org/geo/1.0'

OPEN_METEO_URL = 'https://archive-api.open-meteo.com/v1/archive'
VISUAL_CROSSING_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    city = request.form.get('city', '').strip()
    
    if not city:
        return render_template('index.html', error='Please enter a city name')
    
    try:
        
        current_weather = get_current_weather(city)
        if 'error' in current_weather:
            return render_template('index.html', error=current_weather['error'])
        
      
        forecast_data = get_forecast(city)
        if 'error' in forecast_data:
            return render_template('index.html', error=forecast_data['error'])
        
       
        weather_data = {
            **current_weather,
            'forecast': forecast_data
        }
        
        return render_template('forecast.html', weather=weather_data)
        
    except Exception as e:
        app.logger.error(f"Error in get_weather: {str(e)}")
        return render_template('index.html', error=f'Error fetching weather data: {str(e)}')

def get_current_weather(city):

    try:
        url = f"{BASE_URL}/weather"
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 404:
            return {'error': 'City not found. Please check the spelling and try again.'}
        elif response.status_code == 401:
            return {'error': 'API key error. Please check the configuration.'}
        elif response.status_code != 200:
            return {'error': f'Weather service error (Code: {response.status_code})'}
        
        data = response.json()
        
       
        return {
            'city': data['name'],
            'country': data['sys']['country'],
            'temperature': round(data['main']['temp']),
            'description': data['weather'][0]['description'].title(),
            'icon': data['weather'][0]['icon'],
            'feels_like': round(data['main']['feels_like']),
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'wind_speed': round(data['wind']['speed'], 1),
            'visibility': round(data.get('visibility', 0) / 1000, 1),  # Convert to km
            'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
            'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
        }
        
    except requests.exceptions.Timeout:
        return {'error': 'Request timed out. Please try again.'}
    except requests.exceptions.ConnectionError:
        return {'error': 'Connection error. Please check your internet connection.'}
    except Exception as e:
        app.logger.error(f"Error in get_current_weather: {str(e)}")
        return {'error': 'Unable to fetch current weather data.'}

def get_forecast(city):
  
    try:
        url = f"{BASE_URL}/forecast"
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code != 200:
            return {'error': 'Unable to fetch forecast data.'}
        
        data = response.json()
        
        # Process forecast data (get daily forecasts)
        daily_forecasts = []
        seen_dates = set()
        
        for item in data['list']:
            date_str = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            
            if date_str not in seen_dates and len(daily_forecasts) < 5:
                forecast_item = {
                    'date': datetime.fromtimestamp(item['dt']).strftime('%B %d, %Y'),
                    'temp_max': round(item['main']['temp_max']),
                    'temp_min': round(item['main']['temp_min']),
                    'description': item['weather'][0]['description'].title(),
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'pressure': item['main']['pressure']
                }
                
                daily_forecasts.append(forecast_item)
                seen_dates.add(date_str)
        
        return daily_forecasts
        
    except Exception as e:
        app.logger.error(f"Error in get_forecast: {str(e)}")
        return {'error': 'Unable to fetch forecast data.'}

@app.route('/historical', methods=['POST'])
def get_historical_weather():
    """Get historical weather data using Open-Meteo API (free alternative)"""
    city = request.form.get('city', '').strip()
    date = request.form.get('date', '').strip()
    
    if not city or not date:
        return jsonify({'error': 'City and date are required'})
    
    try:
       
        coordinates = get_city_coordinates(city)
        if 'error' in coordinates:
            return jsonify(coordinates)
   
        historical_data = get_open_meteo_historical(coordinates['lat'], coordinates['lon'], date)
        
        return jsonify(historical_data)
        
    except Exception as e:
        app.logger.error(f"Error in get_historical_weather: {str(e)}")
        return jsonify({'error': f'Error fetching historical data: {str(e)}'})

def get_city_coordinates(city):
  
    try:
        url = f"{GEO_URL}/direct"
        params = {
            'q': city,
            'limit': 1,
            'appid': API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code != 200:
            return {'error': 'Unable to find city coordinates'}
        
        data = response.json()
        
        if not data:
            return {'error': 'City not found in geocoding service'}
        
        return {
            'lat': data[0]['lat'],
            'lon': data[0]['lon'],
            'name': data[0]['name'],
            'country': data[0].get('country', '')
        }
        
    except Exception as e:
        app.logger.error(f"Error in get_city_coordinates: {str(e)}")
        return {'error': 'Error getting city coordinates'}

def get_open_meteo_historical(lat, lon, date):
   
    try:
        url = OPEN_METEO_URL
        params = {
            'latitude': lat,
            'longitude': lon,
            'start_date': date,
            'end_date': date,
            'daily': 'temperature_2m_max,temperature_2m_min,relative_humidity_2m,surface_pressure,wind_speed_10m_max,weather_code',
            'timezone': 'auto'
        }
        
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code != 200:
            return {'error': 'Historical weather data not available for this date'}
        
        data = response.json()
        
        if 'daily' not in data or not data['daily']['temperature_2m_max']:
            return {'error': 'No historical data available for the selected date'}
        
        daily_data = data['daily']
       
        temp_max = daily_data['temperature_2m_max'][0] if daily_data['temperature_2m_max'][0] else 0
        temp_min = daily_data['temperature_2m_min'][0] if daily_data['temperature_2m_min'][0] else 0
        avg_temp = round((temp_max + temp_min) / 2)
    
        weather_code = daily_data.get('weather_code', [0])[0]
        description = get_weather_description_from_code(weather_code)
        
        return {
            'date': date,
            'temperature': avg_temp,
            'temp_max': round(temp_max) if temp_max else 'N/A',
            'temp_min': round(temp_min) if temp_min else 'N/A',
            'description': description,
            'humidity': round(daily_data.get('relative_humidity_2m', [0])[0]) if daily_data.get('relative_humidity_2m') else 'N/A',
            'pressure': round(daily_data.get('surface_pressure', [0])[0]) if daily_data.get('surface_pressure') else 'N/A',
            'wind_speed': round(daily_data.get('wind_speed_10m_max', [0])[0], 1) if daily_data.get('wind_speed_10m_max') else 'N/A'
        }
        
    except Exception as e:
        app.logger.error(f"Error in get_open_meteo_historical: {str(e)}")
        return {'error': 'Unable to fetch historical weather data'}

def get_weather_description_from_code(weather_code):
    weather_codes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        56: "Light Freezing Drizzle",
        57: "Dense Freezing Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        66: "Light Freezing Rain",
        67: "Heavy Freezing Rain",
        71: "Slight Snow Fall",
        73: "Moderate Snow Fall",
        75: "Heavy Snow Fall",
        77: "Snow Grains",
        80: "Slight Rain Showers",
        81: "Moderate Rain Showers",
        82: "Violent Rain Showers",
        85: "Slight Snow Showers",
        86: "Heavy Snow Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Slight Hail",
        99: "Thunderstorm with Heavy Hail"
    }
    
    return weather_codes.get(weather_code, "Unknown Weather")

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html', error='Page not found'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html', error='Internal server error. Please try again later.'), 500

def setup_app():
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    if not app.debug:
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        file_handler = RotatingFileHandler('logs/weather_app.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Weather Forecast System startup')
def validate_api_key():
    if API_KEY == 'your_openweathermap_api_key_here':
        app.logger.warning('API key not configured. Please set your OpenWeatherMap API key.')
        return False
    return True

if __name__ == '__main__':
    setup_app()
    if not validate_api_key():
        print("Warning: API key not configured. Please update the API_KEY variable in app.py")
        print("You can get a free API key from: https://openweathermap.org/api")
    app.run(debug=True, host='0.0.0.0', port=5000)