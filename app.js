// OpenWeatherMap API Key
const API_KEY = "ae99b330ae355427d7da648450283ccb";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetch weather function
function getWeather(city) {

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)
        .then(function(response) {
            displayWeather(response.data);
        })
        .catch(function(error) {
            document.getElementById("weather-display").innerHTML =
                '<p class="loading">City not found. Try again.</p>';
        });
}

// Display weather data
function displayWeather(data) {

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    document.getElementById("weather-display").innerHTML = weatherHTML;
}

// Search button click
document.getElementById("search-btn").addEventListener("click", function() {
    const city = document.getElementById("city-input").value.trim();
    if (city !== "") {
        getWeather(city);
    }
});

// Default city
getWeather("Paris");