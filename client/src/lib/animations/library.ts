export interface AnimationMetaData {
  width: number;
  height: number;
  frameCount: number;
  fps: number;
  source: any;
}

/**
  Library structure for all animation assets.
  Provides all metadata for formatting of and pathing to the
  asset files through keys, and exports the keys as
  valid inputs for the animation rendering component in
  '@/components/animations/renderer.tsx'.

  All entry keys are formatted as '@assets/<filepath>'.

  All entry values are formatted as follows:
  - width: width of a single frame
  - height: height of a single frame
  - frameCount: total amount of frames in the animation
  - fps: frames played per second
  - source: pathing to the assets folder as formatted in a
    TSX Image element source
 */
export const ANIMATIONS = {
  // placeholder asset
  placeholder: {
    width: 16,
    height: 16,
    frameCount: 8,
    fps: 10,
    source: require('@assets/placeholders/animation.png'),
  },

  // Blob pet assets
  blob_blink: {
    width: 32,
    height: 32,
    frameCount: 4,
    fps: 8,
    source: require('@assets/pets/blob/blob_blink.png'),
  },
  blob_breath_happy: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/blob/blob_breath_happy.png'),
  },
  blob_breath_neutral: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/blob/blob_breath_neutral.png'),
  },
  blob_sleeping: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/blob/blob_sleeping.png'),
  },

  // frog pet assets
  frog_blink: {
    width: 32,
    height: 32,
    frameCount: 4,
    fps: 8,
    source: require('@assets/pets/frog/frog_blink.png'),
  },
  frog_breath_happy: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/frog/frog_breath_happy.png'),
  },
  frog_breath_neutral: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/frog/frog_breath_neutral.png'),
  },
  frog_sleeping: {
    width: 32,
    height: 32,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/frog/frog_sleeping.png'),
  },
  frog_drinking: {
    width: 64,
    height: 64,
    frameCount: 61,
    fps: 8,
    source: require('@assets/pets/frog/frog_drinking.png'),
  },

  // onigiri pet assets
  onigiri_blink: {
    width: 64,
    height: 64,
    frameCount: 4,
    fps: 8,
    source: require('@assets/pets/onigiri/onigiri_blink.png'),
  },
  onigiri_breath_happy: {
    width: 64,
    height: 64,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/onigiri/onigiri_breath_happy.png'),
  },
  onigiri_breath_neutral: {
    width: 64,
    height: 64,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/onigiri/onigiri_breath_neutral.png'),
  },
  onigiri_sleeping: {
    width: 64,
    height: 64,
    frameCount: 40,
    fps: 8,
    source: require('@assets/pets/onigiri/onigiri_sleeping.png'),
  },
  onigiri_drinking: {
    width: 64,
    height: 64,
    frameCount: 57,
    fps: 8,
    source: require('@assets/pets/onigiri/onigiri_drinking.png'),
  },
} satisfies Record<string, AnimationMetaData>;

export type AnimationName = keyof typeof ANIMATIONS;
