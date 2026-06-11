import React from 'react';
import { Canvas, useImage, rect, Skia, Atlas, FilterMode, MipmapMode } from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, useDerivedValue } from 'react-native-reanimated';

import { ANIMATIONS, AnimationName } from '@/lib/animations';

interface SpriteAnimationProps {
  animation: AnimationName;
  scale?: number;
}

export function Animation({ animation, scale = 1 }: SpriteAnimationProps) {
  const config = ANIMATIONS[animation];
  const image = useImage(config.source);
  const frame = useSharedValue(0);

  // Driving the animation loop
  useFrameCallback((info) => {
    frame.value = Math.floor((info.timeSinceFirstFrame / 1000) * config.fps) % config.frameCount;
  });

  // Derive dynamic texture positions (rects) based on current frame
  const sprites = useDerivedValue(() => {
    const x = frame.value * config.width;
    return [rect(x, 0, config.width, config.height)];
  });

  // 3. Derive transforms scaled and positioned correctly
  const transforms = useDerivedValue(() => {
    // RSXform(scos, ssin, tx, ty) -> scale=scale, rotation=0, x=0, y=0
    return [Skia.RSXform(scale, 0, 0, 0)];
  });

  // Prevents rendering until the image asset is fully ready
  if (!image) {
    return null;
  }

  return (
    <Canvas style={{ width: config.width * scale, height: config.height * scale }}>
      <Atlas 
        image={image} 
        sprites={sprites} 
        transforms={transforms} 
        sampling={{ 
          filter: FilterMode.Nearest, 
          mipmap: MipmapMode.Nearest 
        }}
      />
    </Canvas>
  );
}
