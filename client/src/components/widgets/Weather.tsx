import { AppText } from '@/components/AppText';
import { getWeather, WeatherData } from '@/lib/weather';
import Cloudy from '@assets/icons/weather_icons/cloudy.svg';
import Misty from '@assets/icons/weather_icons/misty.svg';
import Rainy from '@assets/icons/weather_icons/rainy.svg';
import Snowy from '@assets/icons/weather_icons/snowy.svg';
import Sunny from '@assets/icons/weather_icons/sunny.svg';
import SunnyCloud from '@assets/icons/weather_icons/sunny_cloudy.svg';
import MoonyCloud from '@assets/icons/weather_icons/moon_cloudy.svg';
import Moony from '@assets/icons/weather_icons/moon.svg';
import Thunder from '@assets/icons/weather_icons/thunder.svg';
import { View } from 'react-native';

export default function Weather() {
  const weather = getWeather();
  if (!weather) return;

  function weatherIcon(weather: WeatherData) {
    if (weather.id <= 299) return <Thunder width={30} height={30} />;
    if (weather.id <= 599) return <Rainy width={30} height={30} />;
    if (weather.id <= 699) return <Snowy width={30} height={30} />;
    if (weather.id <= 799) return <Misty width={30} height={30} />;
    if (weather.id === 800) {
      if (Date.now() > (weather.sunset * 1000)) return <Moony width={30} height={30} />;
      return <Sunny width={30} height={30} />;
    }
    if (weather.id <= 802) {
      if (Date.now() > (weather.sunset * 1000)) return <MoonyCloud width={30} height={30} />;
      return <SunnyCloud width={30} height={30} />;
    }
    return <Cloudy width={30} height={30} />;
  }

  return (
    <View className="items-center">
      {weatherIcon(weather)}
      <AppText>{Math.round(weather.temp) + '°C'}</AppText>
    </View>
  );
}
