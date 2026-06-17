import { AppText } from '@/components/AppText';
import { quoteBridge } from '@/lib/api/APIBridge';
import { ReactNode, useEffect } from 'react';
import { LayoutRectangle, View } from 'react-native';

export default function QuoteBubble({
  className = '',
  petHomeLayout,
  topBarLayout,
}: {
  children?: ReactNode;
  className?: string;
  petHomeLayout: LayoutRectangle;
  topBarLayout: LayoutRectangle;
}) {
  //const node = null;
  quoteBridge.removeQuote(); // cleanup
  useEffect(() => {
    // code here runs once on page load, and once whenever quoteBridge.quote updates
  }, [quoteBridge.quote]);
  //if (quoteBridge.quote == null) return null;
  return (
    <View
      className={`absolute left-4 right-4 items-center justify-end overflow-hidden ${className}`}
      style={{
        top: topBarLayout.y + topBarLayout.height,
        height: 1.35 * petHomeLayout.y - (topBarLayout.y + topBarLayout.height),
        zIndex: 5,
      }}
      pointerEvents="none">
      <View>
        <AppText className="text-center font-bold text-white">
          This is a quote to test avalible quote space! test test test test test test test test test
          test test test test test test test test test test test test test test test test test test
          test test test test test test test test test test test test test test test test test test
          test test test test test test test test test test test test test test test test test test
          test test test test test test test test test test test test test test test test test test
          test test test test test test test test test test test test test test test test test test
          test test test test test test test test test
        </AppText>
      </View>
    </View>
  );
}
