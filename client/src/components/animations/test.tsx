import React from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';

const FRAME_WIDTH = 256;
const FRAME_HEIGHT = 256;
const FRAME_COUNT = 8;
const FPS = 10;

export function SpriteAnimation() {
  const frame = useSharedValue(0);

  useFrameCallback((info) => {
    const elapsed = info.timeSinceFirstFrame;

    frame.value =
      Math.floor((elapsed / 1000) * FPS) % FRAME_COUNT;
  });

  const spriteStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: -frame.value * FRAME_WIDTH,
        }
      ],
    };
  });

  return (
    <View
      style={{
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        overflow: 'hidden',
      }}
    >
      <Animated.Image
        source={require('./test.png')}
        style={[
          {
            width: FRAME_WIDTH * FRAME_COUNT,
            height: FRAME_HEIGHT,
          },
          spriteStyle,
        ]}
      />
    </View>
  );
}