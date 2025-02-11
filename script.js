const apiKey = "d0a24d844425bd6a221040055f9d09ba"; 

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    if (city) {
        fetchWeather(city);
    }
});

document.getElementById("currentLocationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => alert("Geolocation not available.")
        );
    }
});

// Fetch Weather
async function fetchWeather(city) {
    try {
        document.getElementById("loading").classList.remove("hidden");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch {
        alert("Error fetching weather.");
    }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        document.getElementById("loading").classList.remove("hidden");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
        fetchForecast(lat, lon);
    } catch {
        alert("Error fetching weather data.");
    }
}

// Display Current Weather
function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Temperature 🌡: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `Condition 🌨: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Humidity ❄: ${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `Wind flow 🌫: ${data.wind.speed} m/s`;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weatherResult").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
}

// Fetch Forecast (Hourly & Weekly)
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayHourlyForecast(data.list);
        displayWeeklyForecast(data.list);
    } catch {
        alert("Unable to fetch forecast.");
    }
}

// Display Hourly Forecast
function displayHourlyForecast(forecastData) {
    const hourlyContainer = document.getElementById("hourlyCards");
    hourlyContainer.innerHTML = "";

    forecastData.slice(0, 6).forEach(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
        const temp = `${hour.main.temp}°C`;

        hourlyContainer.innerHTML += `
            <div class="forecast-card slide-in">
                <h3>${time}</h3>
                <img src="${icon}" alt="Weather Icon">
                <p>${temp}</p>
            </div>
        `;
    });

    document.getElementById("hourlyForecast").classList.remove("hidden");
}

// Display Weekly Forecast
function displayWeeklyForecast(forecastData) {
    const weeklyContainer = document.getElementById("weeklyCards");
    weeklyContainer.innerHTML = "";

    const dailyData = {};
    forecastData.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyData[date]) dailyData[date] = entry;
    });

    Object.values(dailyData).forEach(day => {
        const date = new Date(day.dt * 1000).toDateString();
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const temp = `${day.main.temp}°C`;

        weeklyContainer.innerHTML += `
            <div class="forecast-card fade-in">
                <h3>${date}</h3>
                <img src="${icon}" alt="Weather Icon">
                <p>${temp}</p>
            </div>
        `;
    });

    document.getElementById("weeklyForecast").classList.remove("hidden");
}