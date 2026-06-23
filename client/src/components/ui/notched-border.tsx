import { cn } from '@/lib/utils';
import { View, ViewStyle } from 'react-native';

// `1` in NativeWind is 4 pixels, which matches `border-4`.
type NotchedBorderProps = {
  fillClassName?: string;
  borderClassName?: string;
  fillStyle?: ViewStyle;
  borderStyle?: ViewStyle;
};

/*
  Draws a pixel-art notched botder as an absolute overlay.

  It stretches to the start of it's nearest parent, so the parent must be
  `relative`. To prevent confusion, NotchedBox is advice to use in most cases.
*/
function NotchedBorder({
  fillClassName,
  borderClassName,
  fillStyle,
  borderStyle,
}: NotchedBorderProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className={cn('absolute inset-x-0 bottom-1 top-1', fillClassName)} style={fillStyle} />
      <View className={cn('absolute inset-y-0 left-1 right-1', fillClassName)} style={fillStyle} />

      <View
        className={cn('absolute left-1 right-1 top-0 h-1', borderClassName)}
        style={borderStyle}
      />
      <View
        className={cn('absolute bottom-0 left-1 right-1 h-1', borderClassName)}
        style={borderStyle}
      />
      <View
        className={cn('absolute bottom-1 left-0 top-1 w-1', borderClassName)}
        style={borderStyle}
      />
      <View
        className={cn('absolute bottom-1 right-0 top-1 w-1', borderClassName)}
        style={borderStyle}
      />
    </View>
  );
}

export { NotchedBorder };
