import React, { useState, useEffect } from "react";
import "./Weather.css"; // Import your custom CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);

  const API_KEY = "5bb9ab08e3f4c2b3fde5872d5d7c2572";

  // Define an array of the 8 most popular cities
  const popularCities = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Los Angeles",
    "Sydney",
    "Rome",
    "San Francisco",
  ];

  const fetchWeatherData = async (city) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData({ ...weatherData, [location]: data });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null); // Clear weather data on error
    }
  };

  useEffect(() => {
    // Fetch weather data for the popular cities
    const fetchWeatherForPopularCities = async () => {
      const data = {};

      for (const city of popularCities) {
        const weather = await fetchWeatherData(city);
        data[city] = weather;
      }

      setWeatherData(data);
    };

    fetchWeatherForPopularCities();
  }, []);

  const selectWeatherIcon = (temperature, weatherDescription) => {
    if (temperature > 25) {
      return <FontAwesomeIcon icon={faSun} />;
    } else if (weatherDescription && weatherDescription.includes("cloud")) {
      return <FontAwesomeIcon icon={faCloud} />;
    } else if (weatherDescription && weatherDescription.includes("rain")) {
      return <FontAwesomeIcon icon={faCloudRain} />;
    } else if (weatherDescription && weatherDescription.includes("snow")) {
      return <FontAwesomeIcon icon={faSnowflake} />;
    } else {
      return <FontAwesomeIcon icon={faCloudSun} />;
    }
  };

  const getBackgroundColor = (temperature) => {
    if (temperature >= 30) {
      return "#ff5733"; // Hot (Red)
    } else if (temperature >= 20) {
      return "#ffcc33"; // Warm (Yellow)
    } else if (temperature >= 10) {
      return "#33ccff"; // Moderate (Blue)
    } else {
      return "#66ff66"; // Cool (Green)
    }
  };

  return (
    <div className="weather">
      <div className="city-grid">
        {popularCities.map((city, index) => {
          const temperature = weatherData[city]?.main.temp;
          const weatherDescription = weatherData[city]?.weather[0]?.description;
          const backgroundColor = getBackgroundColor(temperature);

          return (
            <div
              key={index}
              className="city-card"
              style={{ backgroundColor: backgroundColor }}
            >
              <h3>
                {selectWeatherIcon(temperature, weatherDescription)} {city}
              </h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {weatherData[city] ? (
                    <div>
                      <p>Temperature: {temperature}°C</p>
                      <p>Weather: {weatherDescription || "Not available"}</p>
                    </div>
                  ) : (
                    <p>Data not available</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weather Forecast Search */}
      <div className="weather-forecast">
        <h2>Weather Forecast</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit">Get Weather</button>
        </form>
        {weatherData[location] ? (
          <div>
            <h3>
              Weather in {weatherData[location].name},{" "}
              {weatherData[location].sys.country}
            </h3>
            <p>Temperature: {weatherData[location].main.temp}°C</p>
            <p>
              Weather:{" "}
              {weatherData[location].weather[0]?.description || "Not available"}
            </p>
          </div>
        ) : (
          <p>Data not available</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
