import { AppText } from '@/components/AppText';
import Weather from '@/components/widgets/Weather';
import { View } from 'react-native';
import WaterBar from './WaterBar';

export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View className="flex-row content-start">
      <View className="w-1/2 flex-row gap-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <WaterBar />
    </View>
  );
}
