"use strict";
const weatherForm = document.querySelector("form");
// Get the input field
const locationInput = document.getElementById("location");

// Get the submit button
const submitButton = document.getElementById("submit");

// Get the information display div
const infoDisplay = document.querySelector(".informations");

// Get the elements within the info display
const locationNameDisplay = infoDisplay.querySelector("h1");
const weatherInfoDisplay = infoDisplay.querySelector("h2"); // Temperature would go here
const humidityDisplay = infoDisplay.querySelector("h3");
const noteDisplay = infoDisplay.querySelector("h2:nth-of-type(2)"); // Selects the second h2
const weatherIconDisplay = infoDisplay.querySelector(".logo img");
const apiKey = "65b26a7cdaa9232eecfdeb187ba3d4eb";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;
  if (location) {
    try {
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

async function getWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("could not fetch that location's data");
  }
  return await response.json();
}

function displayData(data) {
  console.log(data);
  const celsius = Number(data.main.temp) - 273.15;
  infoDisplay.innerHTML = `<h1>${data.name}</h1>
        <h2>${celsius.toFixed(2)} °C</h2>
        <h3>Humidity: ${data.main.humidity}%</h3>
        <h2>${data.weather[0].description}</h2>
        <h2>${displayEmoji(data.weather[0].id)}</h2>`;
  infoDisplay.style.display = "block";
  infoDisplay.classList.remove('loading');
}

function displayEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈";
    case weatherId >= 300 && weatherId < 400:
      return "🌧";
    case weatherId >= 500 && weatherId < 600:
      return "🌧";
    case weatherId >= 600 && weatherId < 700:
      return "❄";
    case weatherId >= 700 && weatherId < 800:
      return "🌫";
    case weatherId === 800:
      return "☀";
    case weatherId >= 801 && weatherId < 810:
      return "☁";
    default:
      return "❓";
  }
}

function displayError(error) {
  const errorDisplay = document.createElement("h2");
  errorDisplay.textContent = error;
  infoDisplay.textContent = "";
  infoDisplay.style.display = "block";
  infoDisplay.appendChild(errorDisplay);
}
