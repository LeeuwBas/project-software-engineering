import { AppText } from '@/components/AppText';
import PixelBubble from '@/components/quotes/PixelBubble';
import { quoteBridge } from '@/lib/api/APIBridge';
import { ReactNode } from 'react';
import { LayoutRectangle, View } from 'react-native';

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
  if (quoteBridge.quote == null) return null;
  return (
    <View
      className={`absolute left-4 right-4 items-center justify-end overflow-hidden ${className}`}
      style={{
        top: topBarLayout.y + topBarLayout.height,
        height:
          petHomeLayout.width * 0.28 + petHomeLayout.y - (topBarLayout.y + topBarLayout.height),
        zIndex: 5,
      }}
      pointerEvents="none">
      <PixelBubble pixelSize={8} fill="#fff" stroke="#000">
        <AppText className="text-center font-bold text-black">{quoteBridge.quote}</AppText>
      </PixelBubble>
    </View>
  );
}
