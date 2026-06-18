import React, { ReactNode, useState } from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';

interface PixelBubbleProps {
  pixelSize?: number;
  fill?: string; // interior background
  stroke?: string; // border color
  tail?: boolean; // show the speech-bubble tail
  tailSize?: number; // tail length in pixels (also its width at the mouth)
  tailOffset?: number; // x of the tail's right edge, px from the left
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const PixelBubble: React.FC<PixelBubbleProps> = ({
  pixelSize = 8,
  fill = 'white',
  stroke = 'black',
  tail = true,
  tailSize = 3,
  tailOffset,
  children,
  style,
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const b = pixelSize;
  const w = Math.round(layout.width);
  const h = Math.round(layout.height);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => setLayout(nativeEvent.layout);

  const S = tail ? Math.max(0, Math.round(tailSize)) : 0; // tail steps
  const tailDrop = S * b; // how far it hangs below the body

  // tail mouth position (snapped to the grid, kept clear of the corners)
  const rawRight = tailOffset == null ? w / 1.3 : tailOffset;
  const mRight = Math.max(2 * b + S * b, Math.min(w - 2 * b, Math.round(rawRight / b) * b));
  const mLeft = mRight - S * b;

  // stepped body interior
  const interior = [
    [2 * b, 0],
    [w - 2 * b, 0],
    [w - 2 * b, b],
    [w - b, b],
    [w - b, 2 * b],
    [w, 2 * b],
    [w, h - 2 * b],
    [w - b, h - 2 * b],
    [w - b, h - b],
    [w - 2 * b, h - b],
    [w - 2 * b, h],
    [2 * b, h],
    [2 * b, h - b],
    [b, h - b],
    [b, h - 2 * b],
    [0, h - 2 * b],
    [0, 2 * b],
    [b, 2 * b],
    [b, b],
    [2 * b, b],
  ]
    .map((p) => p.join(','))
    .join(' ');

  const barW = Math.max(0, w - 4 * b);
  const barH = Math.max(0, h - 4 * b);

  // bottom border is split around the tails mouth
  const botLeftW = S > 0 ? Math.max(0, mLeft - 2 * b) : barW;
  const botRightX = S > 0 ? mRight : w - 2 * b;
  const botRightW = S > 0 ? Math.max(0, w - 2 * b - mRight) : 0;

  return (
    <View style={style}>
      <View style={{ alignSelf: 'flex-start', paddingBottom: tailDrop }}>
        {w > 0 && h > 0 && (
          <Svg width={w} height={h + tailDrop} style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* white interior */}
            <Polygon points={interior} fill={fill} />

            {/* tail interior — one white row per step, narrowing to the tip */}
            {Array.from({ length: S }).map((_, i) => (
              <Rect
                key={`tf${i}`}
                x={mLeft}
                y={h + i * b}
                width={(S - i) * b}
                height={b}
                fill={fill}
              />
            ))}

            {/* four sides (bottom split around the mouth) */}
            <Rect x={2 * b} y={0} width={barW} height={b} fill={stroke} />
            <Rect x={2 * b} y={h - b} width={botLeftW} height={b} fill={stroke} />
            <Rect x={botRightX} y={h - b} width={botRightW} height={b} fill={stroke} />
            <Rect x={0} y={2 * b} width={b} height={barH} fill={stroke} />
            <Rect x={w - b} y={2 * b} width={b} height={barH} fill={stroke} />

            {/* four corner pixels */}
            <Rect x={b} y={b} width={b} height={b} fill={stroke} />
            <Rect x={w - 2 * b} y={b} width={b} height={b} fill={stroke} />
            <Rect x={b} y={h - 2 * b} width={b} height={b} fill={stroke} />
            <Rect x={w - 2 * b} y={h - 2 * b} width={b} height={b} fill={stroke} />

            {/* tail outline — vertical left edge + diagonal stair on the right */}
            {Array.from({ length: S }).map((_, i) => (
              <React.Fragment key={`ti${i}`}>
                <Rect x={mLeft} y={h + i * b} width={b} height={b} fill={stroke} />
                <Rect x={mRight - (i + 1) * b} y={h + i * b} width={b} height={b} fill={stroke} />
              </React.Fragment>
            ))}
          </Svg>
        )}

        <View
          onLayout={handleLayout}
          style={{ padding: 2 * b, justifyContent: 'center', alignItems: 'center' }}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default PixelBubble;
