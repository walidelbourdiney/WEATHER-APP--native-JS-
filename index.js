"use strict";

// DOM Element Selections
const weatherForm = document.querySelector("form");
const locationInput = document.getElementById("location");
const submitButton = document.getElementById("submit");
const infoDisplay = document.querySelector(".informations");

// Get nested elements within the info display
const locationNameDisplay = infoDisplay.querySelector("h1");
const weatherInfoDisplay = infoDisplay.querySelector("h2");
const humidityDisplay = infoDisplay.querySelector("h3");
const noteDisplay = infoDisplay.querySelector("h2:nth-of-type(2)");
const weatherIconDisplay = infoDisplay.querySelector(".logo img");

// OpenWeather API Key
const apiKey = "65b26a7cdaa9232eecfdeb187ba3d4eb";

// Event listener for form submission
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;
  if (location) {
    try {
      // Add loading animation
      infoDisplay.classList.add('loading');
      const weatherData = await getWeather(location);
      displayData(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("please enter a city!");
  }
});

// Fetch weather data from OpenWeather API
async function getWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("could not fetch that location's data");
  }
  return await response.json();
}

// Display weather data in the UI
function displayData(data) {
  console.log(data);
  // Convert Kelvin to Celsius
  const celsius = Number(data.main.temp) - 273.15;
  // Update UI with weather information
  infoDisplay.innerHTML = `<h1>${data.name}</h1>
        <h2>${celsius.toFixed(2)} °C</h2>
        <h3>Humidity: ${data.main.humidity}%</h3>
        <h2>${data.weather[0].description}</h2>
        <p class="weather-emoji">${displayEmoji(data.weather[0].id)}</p>`;
  infoDisplay.style.display = "block";
  // Remove loading animation
  infoDisplay.classList.remove('loading');
}

// Convert weather ID to appropriate emoji
function displayEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈";  // Thunderstorm
    case weatherId >= 300 && weatherId < 400:
      return "🌧";  // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧";  // Rain
    case weatherId >= 600 && weatherId < 700:
      return "❄";   // Snow
    case weatherId >= 700 && weatherId < 800:
      return "🌫";  // Atmosphere (fog, mist, etc.)
    case weatherId === 800:
      return "☀";   // Clear sky
    case weatherId >= 801 && weatherId < 810:
      return "☁";   // Clouds
    default:
      return "❓";   // Unknown
  }
}

// Display error messages
function displayError(error) {
  const errorDisplay = document.createElement("h2");
  errorDisplay.textContent = error;
  infoDisplay.textContent = "";
  infoDisplay.style.display = "block";
  infoDisplay.appendChild(errorDisplay);
}
