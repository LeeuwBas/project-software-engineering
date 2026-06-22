import { View } from 'react-native';
import { cn } from '@/lib/utils';

// `1` in NativeWind = 4px, which matches your `border-4`.
// The corner chip is a 4x4 square left transparent at each corner.
type NotchedBorderProps = {
  fillClassName?: string;
  borderClassName?: string;
};

function NotchedBorder({ fillClassName, borderClassName }: NotchedBorderProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className={cn('absolute inset-x-0 bottom-1 top-1', fillClassName)} />
      <View className={cn('absolute inset-y-0 left-1 right-1', fillClassName)} />

      <View className={cn('absolute left-1 right-1 top-0 h-1', borderClassName)} />
      <View className={cn('absolute bottom-0 left-1 right-1 h-1', borderClassName)} />
      <View className={cn('absolute bottom-1 left-0 top-1 w-1', borderClassName)} />
      <View className={cn('absolute bottom-1 right-0 top-1 w-1', borderClassName)} />
    </View>
  );
}

export { NotchedBorder };
