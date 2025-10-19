// Weather Forecast System - JavaScript Functions

// Global Variables
let currentLocationData = null;
let historicalChart = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Set date restrictions for historical data
    setDateRestrictions();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Add event listeners
    addEventListeners();
    
    // Check for geolocation support
    checkGeolocationSupport();
}

// Set Date Restrictions for Historical Weather
function setDateRestrictions() {
    const historicalDateInput = document.getElementById('historical-date');
    if (historicalDateInput) {
        // Set max date to yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const maxDate = yesterday.toISOString().split('T')[0];
        historicalDateInput.max = maxDate;
        
        // Set min date to 5 years ago (for free API limits)
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 5);
        historicalDateInput.min = minDate.toISOString().split('T')[0];
    }
}

// Initialize Bootstrap Tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Add Event Listeners
function addEventListeners() {
    // City input autocomplete
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.addEventListener('input', debounce(handleCityInput, 300));
    }
    
    // Historical city input
    const historicalCityInput = document.getElementById('historical-city');
    if (historicalCityInput) {
        historicalCityInput.addEventListener('input', debounce(handleHistoricalCityInput, 300));
    }
    
    // Form submission
    const weatherForm = document.querySelector('.weather-form');
    if (weatherForm) {
        weatherForm.addEventListener('submit', handleWeatherFormSubmit);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Check Geolocation Support
function checkGeolocationSupport() {
    if ('geolocation' in navigator) {
        addGeolocationButton();
    }
}

// Add Geolocation Button
function addGeolocationButton() {
    const cityInputGroup = document.querySelector('.weather-form .input-group');
    if (cityInputGroup) {
        const geoButton = document.createElement('button');
        geoButton.type = 'button';
        geoButton.className = 'btn btn-outline-secondary';
        geoButton.innerHTML = '<i class="fas fa-location-dot"></i>';
        geoButton.title = 'Use my location';
        geoButton.onclick = getCurrentLocationWeather;
        cityInputGroup.appendChild(geoButton);
    }
}

// Get Current Location Weather
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showAlert('Geolocation is not supported by this browser.', 'warning');
        return;
    }
    
    const geoButton = document.querySelector('.input-group .btn-outline-secondary');
    if (geoButton) {
        geoButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        geoButton.disabled = true;
    }
    
    navigator.geolocation.getCurrentPosition(
        async function(position) {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Get city name from coordinates using reverse geocoding
                const cityName = await getCityFromCoordinates(lat, lon);
                
                // Fill the city input
                const cityInput = document.getElementById('city');
                if (cityInput) {
                    cityInput.value = cityName;
                }
                
                // Submit the form
                const weatherForm = document.querySelector('.weather-form');
                if (weatherForm) {
                    weatherForm.submit();
                }
            } catch (error) {
                showAlert('Error getting location weather: ' + error.message, 'danger');
            } finally {
                if (geoButton) {
                    geoButton.innerHTML = '<i class="fas fa-location-dot"></i>';
                    geoButton.disabled = false;
                }
            }
        },
        function(error) {
            let message = 'Unable to retrieve your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message += 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    message += 'Location request timed out.';
                    break;
            }
            showAlert(message, 'warning');
            
            if (geoButton) {
                geoButton.innerHTML = '<i class="fas fa-location-dot"></i>';
                geoButton.disabled = false;
            }
        }
    );
}

// Get City Name from Coordinates
async function getCityFromCoordinates(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=your_api_key`);
    const data = await response.json();
    
    if (data && data.length > 0) {
        return data[0].name + (data[0].country ? `, ${data[0].country}` : '');
    } else {
        throw new Error('Unable to determine city name');
    }
}

// Handle City Input (for autocomplete)
function handleCityInput(event) {
    const query = event.target.value.trim();
    if (query.length >= 3) {
        // You can implement city autocomplete here
        // For now, just basic validation
        validateCityInput(query);
    }
}

// Handle Historical City Input
function handleHistoricalCityInput(event) {
    const query = event.target.value.trim();
    if (query.length >= 3) {
        validateCityInput(query);
    }
}

// Validate City Input
function validateCityInput(cityName) {
    const cityPattern = /^[a-zA-Z\s,.-]+$/;
    if (!cityPattern.test(cityName)) {
        return false;
    }
    return true;
}

// Handle Weather Form Submit
function handleWeatherFormSubmit(event) {
    const cityInput = event.target.querySelector('#city');
    if (cityInput && !validateCityInput(cityInput.value.trim())) {
        event.preventDefault();
        showAlert('Please enter a valid city name (letters, spaces, commas, dots, and hyphens only).', 'warning');
        return false;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        submitButton.disabled = true;
    }
}

// Handle Keyboard Shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const cityInput = document.getElementById('city');
        if (cityInput) {
            cityInput.focus();
        }
    }
    
    // Escape to close alerts
    if (event.key === 'Escape') {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            const closeButton = alert.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            }
        });
    }
}

// Get Historical Weather Data
async function getHistoricalData() {
    const city = document.getElementById('historical-city').value.trim();
    const date = document.getElementById('historical-date').value;
    const resultDiv = document.getElementById('historical-result');
    
    // Validation
    if (!city || !date) {
        showAlert('Please enter both city name and date', 'warning');
        return;
    }
    
    if (!validateCityInput(city)) {
        showAlert('Please enter a valid city name', 'warning');
        return;
    }
    
    // Check if date is not in future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate >= today) {
        showAlert('Please select a date from the past', 'warning');
        return;
    }
    
    // Show loading
    resultDiv.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Fetching historical weather data...</p>
        </div>
    `;
    resultDiv.style.display = 'block';
    
    try {
        // Make AJAX request
        const response = await fetch('/historical', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`
        });
        
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> ${data.error}
                </div>
            `;
        } else {
            displayHistoricalData(data, city, date);
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i> Error: ${error.message}
            </div>
        `;
    }
}

// Display Historical Data
function displayHistoricalData(data, city, date) {
    const resultDiv = document.getElementById('historical-result');
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    resultDiv.innerHTML = `
        <div class="historical-data fade-in-up">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">
                    <i class="fas fa-history"></i> Historical Weather for ${city}
                </h6>
                <small class="text-muted">${formattedDate}</small>
            </div>
            
            <div class="row g-3">
                <div class="col-md-3">
                    <div class="historical-detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-thermometer-half text-danger"></i>
                        </div>
                        <div class="detail-info">
                            <strong>Temperature</strong>
                            <span class="detail-value">${data.temperature}°C</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="historical-detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-tint text-primary"></i>
                        </div>
                        <div class="detail-info">
                            <strong>Humidity</strong>
                            <span class="detail-value">${data.humidity}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="historical-detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-gauge text-success"></i>
                        </div>
                        <div class="detail-info">
                            <strong>Pressure</strong>
                            <span class="detail-value">${data.pressure} hPa</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="historical-detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-wind text-info"></i>
                        </div>
                        <div class="detail-info">
                            <strong>Wind Speed</strong>
                            <span class="detail-value">${data.wind_speed} m/s</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-3 p-3 bg-light rounded">
                <strong><i class="fas fa-cloud"></i> Weather Description:</strong> 
                <span class="text-capitalize">${data.description}</span>
            </div>
            
            <div class="mt-3 text-center">
                <button class="btn btn-outline-primary btn-sm" onclick="downloadHistoricalData('${city}', '${date}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i> Download Data
                </button>
                <button class="btn btn-outline-secondary btn-sm ms-2" onclick="shareHistoricalData('${city}', '${date}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
}

// Download Historical Data
function downloadHistoricalData(city, date, data) {
    const csvContent = `City,Date,Temperature (°C),Humidity (%),Pressure (hPa),Wind Speed (m/s),Description\n` +
                      `${city},${date},${data.temperature},${data.humidity},${data.pressure},${data.wind_speed},"${data.description}"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `weather_${city}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Weather data downloaded successfully!', 'success');
}

// Share Historical Data
function shareHistoricalData(city, date) {
    if (navigator.share) {
        navigator.share({
            title: `Weather Data for ${city}`,
            text: `Historical weather data for ${city} on ${date}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to copying to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showAlert('Link copied to clipboard!', 'info');
        }).catch(() => {
            showAlert('Unable to share or copy link', 'warning');
        });
    }
}

// Show Alert Messages
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1050';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Utility Functions

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format Temperature
function formatTemperature(temp, unit = 'C') {
    return `${Math.round(temp)}°${unit}`;
}

// Format Date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

// Convert Wind Speed
function convertWindSpeed(speed, fromUnit = 'mps', toUnit = 'kmh') {
    if (fromUnit === 'mps' && toUnit === 'kmh') {
        return (speed * 3.6).toFixed(1);
    }
    return speed;
}

// Get Weather Icon URL
function getWeatherIconUrl(iconCode, size = '2x') {
    return `http://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

// Update Current Time (for forecast page)
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize current time update
if (document.getElementById('current-time')) {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Animate Cards on Page Load
function animateCards() {
    const cards = document.querySelectorAll('.forecast-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Animate cards if they exist
    if (document.querySelectorAll('.forecast-card').length > 0) {
        setTimeout(animateCards, 500);
    }
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add custom styles for historical detail cards
const customStyles = `
.historical-detail-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.historical-detail-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.historical-detail-card .detail-icon {
    font-size: 1.5rem;
}

.historical-detail-card .detail-info {
    display: flex;
    flex-direction: column;
}

.historical-detail-card .detail-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
}

.custom-alert {
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
`;

// Add custom styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);