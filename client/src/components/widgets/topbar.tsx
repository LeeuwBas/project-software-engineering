import getMood from '@/lib/mood';
import { getWeatherStatus } from "@/lib/weather";
import { LinearGradient } from 'expo-linear-gradient';
import { Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppText } from '../AppText';

export default function Topbar() {
    const date = new Date();
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })

    // TODO: calculate happiness based on number of tasks completed.
    const happiness = 40
    const mood = getMood(happiness)

    const [weather, setWeather] = useState<{status: string; temp: number} | null>(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const data = await getWeatherStatus();
                setWeather(data);
            } catch (error) {
                console.error("Error loading weather:", error);
            }
        }

        fetchWeather();
    }, []);


    return (
        <View className="flex flex-row items-center">
            <View className='ml-5 w-1/2 flex-row gap-2'>
                {/* TODO: Add logic with weather API */}
                    <Sun size={30}/>
                    <AppText className=' text-2xl font-bold'>{day}</AppText>
                     <AppText>{weather ? weather.status + " " + weather.temp + "°K" : "Unavailable"}</AppText>
            </View>

            <View className='mx-auto w-1/3'>
                <AppText className='mx-auto'>Mood: {mood}</AppText>
                <View className='h-5 border-4 border-gray-500 bg-white'>
                    <LinearGradient
                        colors={['#397cf7', '#c5c981', '#f0f00e']}
                        start={[0, 1]}
                        end={[1, 0]}
                        className='mr-auto h-full w-full'
                        />
                    <View
                        className='absolute right-0 top-0 bottom-0 bg-white'
                        style={{width: `${100-happiness}%`}}
                        />
                </View>
            </View>
        </View>
    )
}
