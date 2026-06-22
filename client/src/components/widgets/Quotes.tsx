import { AppText } from '@/components/AppText';
import PixelBubble from '@/components/quotes/PixelBubble';
import { useQuote } from '@/lib/api/QuoteBridge';
import { useColorScheme } from 'nativewind';
import { ReactNode } from 'react';
import { LayoutRectangle, View } from 'react-native';

/** TODO (Keane te Velde): docstring */
export default function Quotes({
  className = '',
  petHomeLayout,
  topBarLayout,
}: {
  children?: ReactNode;
  className?: string;
  petHomeLayout: LayoutRectangle;
  topBarLayout: LayoutRectangle;
}) {
  const quote = useQuote();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  if (quote == null) return null;
  return (
    <View
      className={`absolute left-4 right-4 items-center justify-end overflow-hidden ${className}`}
      style={{
        top: topBarLayout.y + topBarLayout.height,
        height:
          petHomeLayout.width * 0.15 + petHomeLayout.y - (topBarLayout.y + topBarLayout.height),
        zIndex: 5,
      }}
      pointerEvents="none">
      <PixelBubble
        pixelSize={8}
        fill={dark ? 'hsl(183.871 27.43% 22.16%)' : 'hsl(142.5 22.22% 98%)'}
        stroke={dark ? 'hsl(94.29 17.95% 92.35%)' : 'hsl(0 0% 25%)'}>
        <AppText className="text-center font-bold text-black">{quote}</AppText>
      </PixelBubble>
    </View>
  );
}
