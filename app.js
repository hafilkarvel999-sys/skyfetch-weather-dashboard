const API_KEY = "ae99b330ae355427d7da648450283ccb";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

/* Loading */
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>
    `;
}

/* Error */
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            ⚠️ ${message}
        </div>
    `;
}

/* Display Weather */
function displayWeather(data) {
    const weatherHTML = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
                 alt="${data.weather[0].description}" 
                 class="weather-icon">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p class="description">${data.weather[0].description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;
    cityInput.focus();
}

/* Async Weather Fetch */
async function getWeather(city) {
    showLoading();
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            showError("City not found. Check spelling and try again.");
        } else {
            showError("Something went wrong. Please try later.");
        }
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

/* Search Button Click */
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name too short.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

/* Enter Key Support */
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});