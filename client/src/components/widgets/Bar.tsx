import { BarType } from '@/lib/types';
import { View } from 'react-native';
import { NotchedBox } from '../ui/notched-box';

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
        <NotchedBox
          fillClassName="bg-background"
          borderStyle={{ backgroundColor: borderColor }}
          className="flex-1">
          <View className="absolute inset-1 flex-row overflow-hidden">
            <View
              className="mt-auto h-full"
              style={{
                width: `${(Math.min(Math.max(value, 0), goal) * 100) / goal}%`,
                backgroundColor: color,
              }}
            />
          </View>
        </NotchedBox>
      </View>
    </View>
  );
}
