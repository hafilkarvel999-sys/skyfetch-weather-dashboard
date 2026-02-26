function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    this.init();
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

    this.cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌍 Weather Explorer</h2>
            <p>Search for a city to get current weather and 5-day forecast.</p>
        </div>
    `;
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        this.showError('City name too short.');
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = 'Searching...';

    const currentWeatherUrl =
        `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentWeather, forecastData] = await Promise.all([
            axios.get(currentWeatherUrl),
            this.getForecast(city)
        ]);

        this.displayWeather(currentWeather.data);
        this.displayForecast(forecastData);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            this.showError('City not found. Check spelling.');
        } else {
            this.showError('Something went wrong.');
        }
    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = '🔍 Search';
    }
};

WeatherApp.prototype.getForecast = async function (city) {
    const url =
        `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    const response = await axios.get(url);
    return response.data;
};

WeatherApp.prototype.processForecastData = function (data) {
    return data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);
};

WeatherApp.prototype.displayWeather = function (data) {
    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="weather-icon">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p class="description">${data.weather[0].description}</p>
        </div>
    `;
};

WeatherApp.prototype.displayForecast = function (data) {
    const dailyForecasts = this.processForecastData(data);

    const forecastHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    }).join('');

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;
};

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>
    `;
};

WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            ❌ <strong>Error</strong>
            <p>${message}</p>
        </div>
    `;
};

const app = new WeatherApp('ae99b330ae355427d7da648450283ccb');