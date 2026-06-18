import React, { useEffect, useRef } from 'react';
import {
  Atlas,
  Canvas,
  FilterMode,
  MipmapMode,
  rect,
  Skia,
  SkImage,
  useImage,
} from '@shopify/react-native-skia';
import { useDerivedValue, useFrameCallback, useSharedValue } from 'react-native-reanimated';

import { AnimationName, ANIMATIONS } from '@/lib/animations/library';

interface AnimationProps {
  animation: AnimationName;
  iteration_count?: number;
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
export function Animation({ animation, scale = 1, iteration_count=0 }: AnimationProps) {
  const config = ANIMATIONS[animation] ? ANIMATIONS[animation] : ANIMATIONS['placeholder'];
  const image = useImage(config.source);
  const frame = useSharedValue(0);
  const startTime = useSharedValue(0);
  const iteration = useSharedValue(0)

  useEffect(() => {
    startTime.value = performance.now();
    frame.value = 0;
  }, [animation]);

  // Calculates frame index in asset
  useFrameCallback(() => {
  // const elapsed = performance.now() - startTime.value;
  // const totalFramesElapsed = Math.floor((elapsed / 1000) * config.fps);

  // const currentIteration = Math.floor(totalFramesElapsed / config.frameCount);
  // iteration.value = currentIteration;

  // // // Check if we have completed the requested non-zero iterations
  // // if (iteration_count > 0 && currentIteration >= iteration_count) {
  // //   // Lock strictly to the final frame of the final loop sequence
  // //   frame.value = config.frameCount - 1;
  // // } else {
  // //   // Normal cycling logic for infinite (0) loops or uncompleted iterations
  // //   frame.value = totalFramesElapsed % config.frameCount;
  
  // }

  const elapsed = performance.now() - startTime.value;
  frame.value = Math.round((elapsed / 1000) * config.fps) % config.frameCount;
  });

  // Samples frame based on index and frame size from asset
  const sprites = useDerivedValue(() => {
    const x = frame.value * config.width;
    return [rect(x, 0, config.width, config.height)];
  });

  // Scales sampled frame according to function input
  const transforms = useDerivedValue(() => {
    return [Skia.RSXform(scale, 0, 0, 0)];
  });

  // keep old image while switching
  const lastImage = useRef<SkImage | null>(null);

  if (image) {
    lastImage.current = image;
  }

  const displayImage = image ?? lastImage.current;

  return (
    <Canvas style={{ width: config.width * scale, height: config.height * scale }}>
      <Atlas
        image={displayImage}
        sprites={sprites}
        transforms={transforms}
        sampling={{
          filter: FilterMode.Nearest,
          mipmap: MipmapMode.Linear,
        }}
      />
    </Canvas>
  );
}
