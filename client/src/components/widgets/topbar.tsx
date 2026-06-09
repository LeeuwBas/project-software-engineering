import { AppText } from '@/components/AppText';
import Weather from '@/components/widgets/Weather';
import { View } from 'react-native';
import Happiness from './Happiness';

export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View className="flex flex-row items-center">
      <View className="w-1/2 flex-row gap-2 pt-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <Happiness />
    </View>
  );
}
