import * as Location from 'expo-location';
import { useEffect } from 'react';

export async function getWeatherStatus() {
    const api_key = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    let { status } = await Location.requestForegroundPermissionsAsync();

    let location = await Location.getCurrentPositionAsync({});

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location["coords"]["latitude"]}&lon=${location["coords"]["longitude"]}&appid=${api_key}`)

    const json = await response.json();

    return { status: json.weather[0].main, temp: json.main.temp}

}