import { AppText } from '@/components/AppText';
import PixelBubble from '@/components/quotes/PixelBubble';
import { useAppContext } from '@/lib/AppContext';
import { QuoteBridge, useQuote } from '@/lib/quotes/QuoteBridge';
import { useColorScheme } from 'nativewind';
import { ReactNode } from 'react';
import { LayoutRectangle, View } from 'react-native';

/** Component that renders quote bubbles in the space above the PetHome to suggest an activity to make progress toward
 * today's goals if there are any that still need to be met, or if there aren't, display a congratulations for a
 * specific met goal.
 * @peram petHomeLayout should be the layout of the PetHome
 * @peram topBarLayout should be the layout of the Topbar
 * @returns either null or an absolute component that also does not effect the layout of the page. It displays whatever
 * quote is currently set in {@link QuoteBridge}.  */
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
  useAppContext();
  /**{@link QuoteBridge}*/
  const quote = useQuote();

  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  // if there is no quote, render nothing.
  if (quote == null) return null;
  return (
    <View
      className={`absolute left-4 right-4 items-center justify-end overflow-hidden ${className}`}
      style={{
        /* The PetHome component is approx. square, width fitted to the size of the screen, but the pet doesn't start
        until about 15% below the top of the component. Width is used in place of height because the animation can
        cause the height to change, resulting in a bouncing quote bubble.*/
        top: topBarLayout.y + topBarLayout.height, // the bottom of the Topbar
        // (the top of the pet to the top of the screen) - (the size of the Topbar)
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
