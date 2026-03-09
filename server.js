// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public')); // Serves the HTML, CSS, and JS from the 'public' folder

// Weather API Endpoint
app.get('/api/weather', async (req, res) => {
    const {city} = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    // Input validation
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        // Fetching data from OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);
        
        // Send the weather data back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data. Please check the city name.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});