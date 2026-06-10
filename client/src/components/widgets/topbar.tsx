import { AppText } from '@/components/AppText';
import Weather from '@/components/widgets/Weather';
import { View } from 'react-native';
import Happiness from './Happiness';

export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View className="flex-row content-start">
      <View className="flex-row w-1/2 gap-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <Happiness />
    </View>
  );
}
