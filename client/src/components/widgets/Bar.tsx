import { BarType } from '@/lib/types';
import { View } from 'react-native';

/**
 * Horizontal progress bar for a goaled statistic
 * @param icon Icon next to the bar
 * @param value The value of the statistic
 * @param goal The goal of the statistic
 * @param color The fill color of the bar
 * @param borderColor The border color of the bar
 *
 * @returns The progress bar
 */
export default function Bar({ icon: Icon, value, goal, color, borderColor }: BarType) {
  return (
    <View className="w-1/2">
      <View className="flex-row justify-center gap-1">
        <Icon />
        <View
          className="flex-1 flex-row overflow-hidden border-4"
          style={{ borderColor: borderColor }}>
          <View
            className="mt-auto h-full"
            style={{
              width: `${(Math.min(Math.max(value, 0), goal) * 100) / goal}%`,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    </View>
  );
}
