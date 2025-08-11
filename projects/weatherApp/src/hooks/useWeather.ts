import { useEffect, useState } from 'react';
import { groupForecastByDay, getDailySummaries, codeToDescription } from '../utils/forecastHelpers';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeather = (city: string) => {
  const [weekData, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        const grouped = groupForecastByDay(json.list);
        const summaries = getDailySummaries(grouped);
        setData(summaries);
      } catch (e: any) {
        setError(e.message);
      }
    };

    fetchWeather();
  }, [city]);

  return { weekData, error };
};

export const todayWeather = async (city: string) => {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    if (!weatherRes.ok) throw new Error(weatherData.message);

    const { coord } = weatherData;
    const { lat, lon } = coord;

    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const airData = await airRes.json();
    if (!airRes.ok) throw new Error(airData.message);

    const result = {
      temp: Math.round(weatherData.main.temp*10)/10,
      weather: weatherData.weather[0].main,
      description: codeToDescription(weatherData.weather[0].id),
      icon: weatherData.weather[0].icon,
      pm10: airData.list[0].components.pm10,
      pm25: airData.list[0].components.pm2_5,
      aqi: airData.list[0].main.aqi,
    };

    return result;
  } catch (e: any) {
    console.error(e.message);
    return null;
  }
};