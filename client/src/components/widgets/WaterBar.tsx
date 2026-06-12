import { useWater } from '@/lib/api/WaterBridge';
import { View, Image } from 'react-native';

export default function WaterBar() {
  const water = useWater() ?? 0;
  return (
    <View className="w-1/2">
      <View className="flex-row justify-center gap-1">
        <View className="h-4"></View>
        <Image source={require('@assets/icons/glass.png')} className="h-full" />
        <View className="flex-1 flex-row overflow-hidden border-4 border-border-dark">
          <View
            className="mt-auto h-full"
            style={{
              width: `${Math.min(Math.max(water, 0), 8) * 12.5}%`,
              backgroundColor: '#74ccf4aa',
            }}
          />
        </View>
      </View>
    </View>
  );
}
