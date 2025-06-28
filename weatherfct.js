// Elements
const searchBox = document.querySelector('.searchbox');
const searchBtn = document.querySelector('.searchbtn');

const apiKey = 'd77b6588affed9842c8a5cebbf11589c'; // Your API key

const cityElem = document.querySelector('.city');
const tempElem = document.querySelector('.temperature');
const humidityElem = document.querySelector('.humperc');
const degreesElem = document.querySelector('.degrees');

const temp1Elem = document.querySelector('.temp1');
const temp2Elem = document.querySelector('.temp2');
const temp3Elem = document.querySelector('.temp3');

searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function fetchWeather(city) {
    try {
        // Step 1: Get city coordinates
        const currentResp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        );
        if (!currentResp.ok) throw new Error('City not found');

        const currentData = await currentResp.json();
        const { lat, lon } = currentData.coord;

        // Show current weather
        cityElem.innerText = currentData.name;
        tempElem.innerText = `${Math.round(currentData.main.temp)}°C`;
        humidityElem.innerText = `${currentData.main.humidity}%`;
        degreesElem.innerText = currentData.weather[0].main;

        // Step 2: Get 5-day / 3-hour forecast (this one is free)
        const forecastResp = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!forecastResp.ok) throw new Error('Forecast not found');

        const forecastData = await forecastResp.json();

        // Forecast list (3-hour intervals)
        const forecastList = forecastData.list;

        // Show now and next two forecasted hours
        temp1Elem.innerText = `${Math.round(forecastList[0].main.temp)}°C`; // Now
        temp2Elem.innerText = `${Math.round(forecastList[1].main.temp)}°C`; // +3 hours
        temp3Elem.innerText = `${Math.round(forecastList[2].main.temp)}°C`; // +6 hours

    } catch (error) {
        console.error(error.message);
        cityElem.innerText = 'Error';
        tempElem.innerText = '';
        humidityElem.innerText = '';
        degreesElem.innerText = error.message;

        temp1Elem.innerText = '';
        temp2Elem.innerText = '';
        temp3Elem.innerText = '';
    }
}
