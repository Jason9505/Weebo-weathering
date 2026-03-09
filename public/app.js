// public/app.js

async function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    const weatherDisplay = document.getElementById('weatherDisplay');
    const errorMessage = document.getElementById('errorMessage');

    if (!cityInput) return;

    try {
        // Fetch data from our Node.js backend proxy
        const response = await fetch(`/api/weather?city=${encodeURIComponent(cityInput)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'City not found');
        }

        // 1. Update text content
        document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('condition').innerText = data.weather[0].description;

        // 2. Pass the whole weather[0] object so we get both .main and .icon
        updateTheme(data.weather[0]);

        // 3. Show the display card
        weatherDisplay.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
    } catch (error) {
        console.error('Frontend Error:', error);
        errorMessage.innerText = error.message;
        errorMessage.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
    }
}

// Receives the full weather[0] object: { main: "Rain", description: "...", icon: "10d", ... }
function updateTheme(weatherData) {
    const body = document.body;
    const iconEl = document.getElementById('weatherIcon');
    const quoteEl = document.getElementById('quote');
    
    // FIX: correctly read .main and .icon from the passed object
    const condition = weatherData.main.toLowerCase();
    const iconCode = weatherData.icon;

    let bgUrl = "";
    let quote = "";

    // FIX: use 'condition' (not 'weather') for all checks
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
        bgUrl = "https://images.alphacoders.com/852/thumb-1920-852074.png";
        quote = '"I want you more than any blue sky."';
    } 
    else if (condition.includes('clear')) {
        bgUrl = "https://girlsontopstees.com/cdn/shop/articles/weathering_with_you_cover.jpg?v=1680725259";
        quote = '"Who cares if we don\'t see the sunshine ever again?"';
    } 
    else if (condition.includes('clouds')) {
        bgUrl = "https://images7.alphacoders.com/555/thumb-1920-555562.jpg";
        quote = '"Human minds are tied to the weather."';
    } 
    else {
        // Default / Mist / Snow
        bgUrl = "https://m.wsj.net/video/20200116/011620weatheringwithyou/011620weatheringwithyou_1920x1080.jpg";
        quote = '"The sky is connected, even if it feels far away."';
    }

    // Apply the Background
    body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${bgUrl}')`;
    
    // Use OpenWeatherMap's official icon
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    iconEl.classList.remove('hidden');
    
    // Apply the Quote
    quoteEl.innerText = quote;
}