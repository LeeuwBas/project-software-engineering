// renderer.tsx

import React from 'react';
import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from 'react-native-reanimated';

import {
  ANIMATIONS,
  AnimationName,
} from '@/lib/animations';

interface SpriteAnimationProps {
  animation: AnimationName;
  scale?: number;
}

export function SpriteAnimation({
  animation,
  scale = 1,
}: SpriteAnimationProps) {
  const config = ANIMATIONS[animation];

  const image = useImage(config.source);

  const frame = useSharedValue(0);

  useFrameCallback((info) => {
    frame.value =
      Math.floor(
        (info.timeSinceFirstFrame / 1000) *
          config.fps
      ) % config.frameCount;
  });

  const srcX = useDerivedValue(
    () => frame.value * config.width
  );

  if (!image) {
    return null;
  }

  return (
    <Canvas
      style={{
        width: config.width * scale,
        height: config.height * scale,
      }}
    >
      <SkiaImage
        image={image}
        x={0}
        y={0}
        width={config.width * scale}
        height={config.height * scale}
        fit="fill"

        // Crop to the current frame
        rect={{
          x: srcX,
          y: 0,
          width: config.width,
          height: config.height,
        }}
      />
    </Canvas>
  );
}