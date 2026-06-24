import { GoaledModule } from '@/lib/types';
import { View } from 'react-native';
import { NotchedBox } from '../ui/notched-box';

/**
 * Horizontal progress bar for a goaled statistic
 * @param module Goaled module of which the progress bar is shown.
 *
 * @returns The progress bar
 */
export default function Bar({ module }: { module: GoaledModule }) {
  const value = module.useValue() ?? 0;
  const goal = module.bridge.useGoal() ?? 0;

  return (
    <View className="w-1/2">
      <View className="flex-row justify-center gap-1">
        <module.icon />
        <NotchedBox
          fillClassName="bg-background"
          borderStyle={{ backgroundColor: module.borderColor }}
          className="flex-1">
          <View className="absolute inset-1 flex-row overflow-hidden">
            <View
              className="mt-auto h-full"
              style={{
                width: `${(Math.min(Math.max(value, 0), goal) * 100) / goal}%`,
                backgroundColor: module.color,
              }}
            />
          </View>
        </NotchedBox>
      </View>
    </View>
  );
}
