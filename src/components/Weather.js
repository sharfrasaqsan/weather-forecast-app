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

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const [currentTimes, setCurrentTimes] = useState({});

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
    setError(null); // Clear any previous errors

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
      setError(error.message); // Set the error message in state
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!location) {
      window.alert("Please enter a location");
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
  
      if (!response.ok) {
        window.alert(
          "City not found. Please check the city name and try again."
        );
        return;
      }
  
      const data = await response.json();
      
      // Calculate and set the current time for the entered city
      const timezone = getTimezoneForCity(location);
      if (timezone) {
        const now = new Date().toLocaleTimeString("en-US", {
          timeZone: timezone,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
        data.currentTime = now;
      }
  
      setWeatherData({ ...weatherData, [location]: data });
    } catch (error) {
      // Show the error message in state
      setError(error.message);
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
    let color = "#007bff"; // Default color (blue)

    if (temperature > 30) {
      color = "#ff5733"; // Hot weather color (red)
    } else if (temperature > 20) {
      color = "#ffcc33"; // Warm weather color (yellow)
    } else if (temperature > 10) {
      color = "#33ccff"; // Moderate weather color (blue)
    } else {
      color = "#66ff66"; // Cool weather color (green)
    }

    return color;
  };

  // Use useEffect to update the current times for each city
  useEffect(() => {
    const intervalId = setInterval(() => {
      const times = {};
      for (const city of popularCities) {
        const timeZone = getTimezoneForCity(city);
        if (timeZone) {
          const timeOptions = {
            timeZone: timeZone,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          };
          times[city] = new Date().toLocaleString(undefined, timeOptions);
        } else {
          times[city] = "Not available";
        }
      }
      setCurrentTimes(times);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Function to get the timezone for a city (you can expand this as needed)
  const getTimezoneForCity = (city) => {
    switch (city) {
      case "New York":
        return "America/New_York";
      case "London":
        return "Europe/London";
      case "Paris":
        return "Europe/Paris";
      case "Tokyo":
        return "Asia/Tokyo";
      case "Los Angeles":
        return "America/Los_Angeles";
      case "Sydney":
        return "Australia/Sydney";
      case "Rome":
        return "Europe/Rome";
      case "San Francisco":
        return "America/Los_Angeles";
      default:
        return null; // Return null for cities with unknown timezones
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
                      <br />
                      <p>Time: {currentTimes[city]}</p>
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
        <h2>Search your city here</h2>
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
          <div
            className="weather-result"
            style={{
              backgroundColor: getBackgroundColor(
                weatherData[location]?.main.temp
              ),
            }}
          >
            <h3 id="search-head">
              Weather in {weatherData[location].name},{" "}
              {weatherData[location].sys.country}
              <div className="weather-icon">
                {selectWeatherIcon(
                  weatherData[location].main.temp,
                  weatherData[location].weather[0]?.description
                )}
              </div>
            </h3>
            <p>{weatherData[location].main.temp}°C</p>
            <p>
              Weather:{" "}
              {weatherData[location].weather[0]?.description || "Not available"}
            </p>
          </div>
        ) : (
          <p></p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Weather;
