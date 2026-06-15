import { AppText } from '@/components/AppText';
import { WeatherData, getWeather } from '@/lib/weather';
import { View } from 'react-native';

export default function Weather() {
  const weather = getWeather();
  if (!weather) return;

  function weatherIcon(weather: WeatherData) {
    if (weather.id < 299) return require('@assets/icons/weather_icons/thunder.png');
    if (weather.id < 599) return require('@assets/icons/weather_icons/rainy.png');
    if (weather.id < 699) return require('@assets/icons/weather_icons/snowy.png');
    if (weather.id < 799) return require('@assets/icons/weather_icons/misty.png');
    if (weather.id === 800) return require('@assets/icons/weather_icons/sunny.png');
    if (weather.id === 801) return require('@assets/icons/weather_icons/sunny_cloudy.png');
    return require('@assets/icons/weather_icons/cloudy.png');
  }

  return (
    <View className="items-center">
      {weatherIcon(weather)}
      <AppText>{Math.round(weather.temp) + '°C'}</AppText>
    </View>
  );
}
