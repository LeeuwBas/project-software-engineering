import { AppText } from '@/components/AppText'
import { WeatherData, getWeather } from '@/lib/weather'
import { Cloud, CloudFog, CloudLightning, CloudRain, Snowflake, Sun } from 'lucide-react-native'
import { View } from "react-native"

export default function Weather() {
    const weather = getWeather()

    function weatherIcon(weather: WeatherData | null) {
        if (!weather) return
        if (weather.id < 299) return <CloudLightning size={30}/>
        if (weather.id < 599) return <CloudRain size={30}/>
        if (weather.id < 699) return <Snowflake size={30}/>
        if (weather.id < 799) return <CloudFog size={30}/>
        if (weather.id === 800) return <Sun size={30}/>
        return <Cloud size={30}/>
    }

    return (
        <View className='items-center'>
            {weatherIcon(weather)}
            <AppText>{weather ? Math.round(weather.temp) + "°C" : "Unavailable"}</AppText>
        </View>
    )
}
