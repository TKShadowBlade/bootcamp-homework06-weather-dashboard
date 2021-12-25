// Global variables
var searchHistory = [];
var searchButton = document.querySelector("#search-button");
var cityInput = document.querySelector("#city-input");
var historyContainer = document.querySelector("#search-history");
var temperature = document.querySelector("#temp");
var humidity = document.querySelector("#humid");
var windSpeed = document.querySelector("#wind");
var uvInd = document.querySelector("#uv");


var today = moment().format("dddd, MMMM D, YYYY")


// API variables
var weatherApiRootUrl = "https://api.openweathermap.org"
var weatherApiKey = "98c3f241443d3fbc1d57941dfa09a89e"
var apiWeather = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
var apiUvi = ""
var apiForecast = "https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}"

function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
        // appendToHistory('Austin');
        console.log(data)
          getWeather(data[0]) // {lat: x, lon: y});
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }


function getWeather(location) {
    let lat = location.lat;
    let lon = location.lon;
    let city = location.name;
    let apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => renderWeather(city, data));
};

//fetchCoords('Columbus');

function renderWeather(city, data) {
    console.log(data);
    temperature.textContent = data.current.temp;
    humidity.textContent = data.current.humidity;
    windSpeed.textContent = data.current.wind_speed;
    uvInd.textContent = data.current.uvi;

    for (let i=0; i<5; i++) {
        document.querySelector(`#temp-${i+1}`).textContent = data.daily[i].temp.day
        document.querySelector(`#humid-${i+1}`).textContent = data.daily[i].humidity
        document.querySelector(`#wind-${i+1}`).textContent = data.daily[i].wind_speed
        document.querySelector(`#uv-${i+1}`).textContent = data.daily[i].uvi
    }

}

function handleSearchFormSubmit(evt) {
    if (!cityInput.value) {
        return;
    }

    evt.preventDefault();
    var search = cityInput.value.trim();
    fetchCoords(search);
    cityInput.value = "";
}

function renderHistory() {
    historyContainer.innerHTML = "";
}

cityInput.addEventListener('submit', handleSearchFormSubmit);
searchButton.addEventListener('click', handleSearchHistoryClick);