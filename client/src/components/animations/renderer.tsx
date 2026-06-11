import React from 'react';
import { Canvas, useImage, rect, Skia, Atlas, FilterMode, MipmapMode } from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, useDerivedValue } from 'react-native-reanimated';

import { ANIMATIONS, AnimationName } from '@/lib/animations';

interface AnimationProps {
  animation: AnimationName;
  scale?: number;
}

/**
 * Builds an element that renders an animation from the assets based on an input key defined
 * in '@/lib/animations.ts' using the react native Skia library.
 * 
 * @param {AnimationName} animation key of animation in library
 * @param {number} scale scales the animation by this amount, defaults to 1
 * @returns A TSX element that renders the specified animation at the specified scale
 */
export function Animation({ animation, scale = 1 }: AnimationProps) {
  const config = ANIMATIONS[animation]
    ? ANIMATIONS[animation]
    : ANIMATIONS['placeholder'];
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
