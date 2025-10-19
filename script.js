
class WeatherApp {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCurrentWeather();
        this.loadForecast();
    }

    bindEvents() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAll());
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorElement && errorText) {
            errorText.textContent = message;
            errorElement.classList.add('show');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                this.hideError();
            }, 5000);
        }
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    async fetchWithTimeout(url, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async loadCurrentWeather() {
        try {
            const currentWeather = this.generateCurrentWeather();
            this.displayCurrentWeather(currentWeather);
        } catch (error) {
            console.error('Error loading current weather:', error);
            this.showError('Failed to load current weather data');
            this.displayCurrentWeatherFallback();
        }
    }

    generateCurrentWeather() {
        const conditions = ['sunny', 'cloudy', 'rainy', 'stormy'];
        const icons = {'sunny': '☀️', 'cloudy': '☁️', 'rainy': '🌧️', 'stormy': '⛈️'};
        const descriptions = {
            'sunny': 'Clear and bright',
            'cloudy': 'Overcast skies',
            'rainy': 'Light showers',
            'stormy': 'Thunderstorms likely'
        };

        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const now = new Date();
        
        return {
            success: true,
            current_weather: {
                condition: condition,
                temperature: Math.floor(Math.random() * 20) + 15,
                humidity: Math.floor(Math.random() * 40) + 40,
                wind_speed: Math.floor(Math.random() * 20) + 5,
                icon: icons[condition],
                description: descriptions[condition],
                probability: Math.floor(Math.random() * 40) + 50,
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().split(' ')[0].slice(0, 5)
            }
        };
    }

    displayCurrentWeather(data) {
        if (data.success && data.current_weather) {
            const weather = data.current_weather;
            
            document.getElementById('currentIcon').textContent = weather.icon;
            document.getElementById('currentTemp').textContent = `${weather.temperature}°C`;
            document.getElementById('currentCondition').textContent = weather.description;
            document.getElementById('currentDate').textContent = `${weather.date} at ${weather.time}`;
            document.getElementById('currentHumidity').textContent = `${weather.humidity}%`;
            document.getElementById('currentWind').textContent = `${weather.wind_speed} km/h`;
            document.getElementById('currentProbability').textContent = `${weather.probability}%`;
        } else {
            this.displayCurrentWeatherFallback();
        }
    }

    displayCurrentWeatherFallback() {
        document.getElementById('currentIcon').textContent = '🌤️';
        document.getElementById('currentTemp').textContent = '22°C';
        document.getElementById('currentCondition').textContent = 'Partly cloudy';
        document.getElementById('currentDate').textContent = new Date().toISOString().split('T')[0];
        document.getElementById('currentHumidity').textContent = '65%';
        document.getElementById('currentWind').textContent = '12 km/h';
        document.getElementById('currentProbability').textContent = '75%';
    }

    async loadForecast() {
        try {
            // For demo purposes, we'll simulate the forecast data
            const forecast = this.generateForecast();
            this.displayForecast(forecast);
        } catch (error) {
            console.error('Error loading forecast:', error);
            this.showError('Failed to load weather forecast');
            this.displayForecastFallback();
        }
    }

    generateForecast() {
        const conditions = ['sunny', 'cloudy', 'rainy', 'stormy'];
        const icons = {'sunny': '☀️', 'cloudy': '☁️', 'rainy': '🌧️', 'stormy': '⛈️'};
        const descriptions = {
            'sunny': 'Clear skies',
            'cloudy': 'Overcast',
            'rainy': 'Light rain',
            'stormy': 'Thunderstorms'
        };

        const forecast = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            
            forecast.push({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'long' }),
                condition: condition,
                temperature: Math.floor(Math.random() * 20) + 10,
                humidity: Math.floor(Math.random() * 40) + 40,
                wind_speed: Math.floor(Math.random() * 20) + 5,
                icon: icons[condition],
                description: descriptions[condition],
                probability: Math.floor(Math.random() * 60) + 30
            });
        }

        return {
            success: true,
            forecast: forecast
        };
    }

    displayForecast(data) {
        const container = document.getElementById('forecastContainer');
        if (!container) return;

        if (data.success && data.forecast) {
            container.innerHTML = '';
            
            data.forecast.forEach(day => {
                const card = this.createForecastCard(day);
                container.appendChild(card);
            });
        } else {
            this.displayForecastFallback();
        }
    }

    createForecastCard(dayData) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        card.innerHTML = `
            <div class="day">${dayData.day}</div>
            <div class="weather-icon">${dayData.icon}</div>
            <div class="temperature">${dayData.temperature}°C</div>
            <div class="condition">${dayData.condition}</div>
            <div class="probability">${dayData.probability}%</div>
        `;
        
        return card;
    }

    displayForecastFallback() {
        const container = document.getElementById('forecastContainer');
        if (!container) return;

        const fallbackData = [
            { day: 'Today', icon: '☀️', temperature: 22, condition: 'sunny', probability: 85 },
            { day: 'Tomorrow', icon: '☁️', temperature: 19, condition: 'cloudy', probability: 70 },
            { day: 'Friday', icon: '🌧️', temperature: 16, condition: 'rainy', probability: 90 },
            { day: 'Saturday', icon: '☁️', temperature: 18, condition: 'cloudy', probability: 65 },
            { day: 'Sunday', icon: '☀️', temperature: 24, condition: 'sunny', probability: 80 },
            { day: 'Monday', icon: '🌧️', temperature: 15, condition: 'rainy', probability: 85 },
            { day: 'Tuesday', icon: '☀️', temperature: 21, condition: 'sunny', probability: 75 }
        ];

        container.innerHTML = '';
        fallbackData.forEach(day => {
            const card = this.createForecastCard(day);
            container.appendChild(card);
        });
    }

    async refreshAll() {
        this.showLoading();
        
        try {
            await Promise.all([
                this.loadCurrentWeather(),
                this.loadForecast()
            ]);
            
            setTimeout(() => {
                this.hideLoading();
            }, 1000);
            
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.hideLoading();
            this.showError('Failed to refresh weather data');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getWeatherEmoji(condition) {
        const emojiMap = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'stormy': '⛈️',
            'clear': '🌤️',
            'partly-cloudy': '⛅',
            'snow': '❄️',
            'fog': '🌫️'
        };
        
        return emojiMap[condition.toLowerCase()] || '🌤️';
    }
}

window.hideError = function() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

window.addEventListener('online', () => {
    console.log('Back online! Refreshing data...');
    if (window.weatherApp) {
        window.weatherApp.refreshAll();
    }
});

window.addEventListener('offline', () => {
    console.log('Gone offline. Using cached data...');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}