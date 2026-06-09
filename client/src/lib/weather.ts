import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface WeatherData {
    status: string
    id: number
    temp: number
}

// Request location perms and return weather data
async function getWeatherStatus(): Promise<WeatherData | null> {
    const api_key = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'denied') return null

    let location = await Location.getCurrentPositionAsync({});

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location["coords"]["latitude"]}&lon=${location["coords"]["longitude"]}&appid=${api_key}&units=metric`)

    const data = await response.json();

    const weather: WeatherData = {
        status: data.weather[0].main,
        id: data.weather[0].id,
        temp: data.main.temp
    }
    return weather
}

// Return weather data (to be used in a component)
export function getWeather(): WeatherData | null {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        async function fetchWeather() {
            const data = await getWeatherStatus();
            setWeather(data);
        }

        fetchWeather()
    }, [])

    return weather
}
