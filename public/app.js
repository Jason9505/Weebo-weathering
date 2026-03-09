// public/app.js

async function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    const weatherDisplay = document.getElementById('weatherDisplay');
    const errorMessage = document.getElementById('errorMessage');

    if (!cityInput) return;

    try {
        // Call our Node.js backend proxy
        const response = await fetch(`/api/weather?city=${cityInput}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'City not found');
        }

        // Update the DOM elements with retrieved data
        document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('condition').innerText = data.weather[0].description;

        // Change quote based on the anime theme
        updateThemeQuote(data.weather[0].main);

        // Show weather and hide errors
        weatherDisplay.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
    } catch (error) {
        // Handle errors (e.g., misspelled city)
        errorMessage.innerText = error.message;
        errorMessage.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
    }
}

function updateThemeQuote(weatherCondition) {
    const quoteEl = document.getElementById('quote');
    let quote = "";

    // Thematically matches quotes to weather conditions
    switch (weatherCondition.toLowerCase()) {
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            quote = '"I want you more than any blue sky."';
            break;
        case 'clear':
            quote = '"The sky is connected, even if it feels far away."';
            break;
        case 'clouds':
            quote = '"Human minds are tied to the weather."';
            break;
        default:
            quote = '"Who cares if we don\'t see the sunshine ever again?"';
    }
    
    quoteEl.innerText = quote;
}