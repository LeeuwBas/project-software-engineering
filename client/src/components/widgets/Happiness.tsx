import { AppText } from '@/components/AppText';
import getMood from '@/lib/mood';
import { View } from 'react-native';

/** TODO (ZJWeng): delete this file i think? */
export default function Happiness() {
  // TODO: calculate happiness based on number of tasks completed.
  const happiness = 100;
  const mood = getMood(happiness);

  return (
    <View className="w-1/2">
      <View className="flex-row justify-center gap-1">
        {/*<Frown size={20} />*/}
        <View className="h-4 flex-1 flex-row overflow-hidden border-4 border-border-dark dark:border-border">
          <View className="flex-1 bg-[#f99295]" />
          <View className="flex-1 bg-[#ffb347]" />
          <View className="flex-1 bg-[#ffd568]" />
          <View className="flex-1 bg-[#a8d8a8]" />
          <View className="flex-1 bg-[#74c6b6]" />
          <View
            className="absolute bottom-0 right-0 top-0 bg-white"
            style={{ width: `${100 - happiness}%` }}
          />
        </View>
        {/*<Smile size={20} />*/}
      </View>
      <AppText className="ml-auto mt-1">Alex is feeling good!</AppText>
    </View>
  );
}
