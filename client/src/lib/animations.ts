
export interface AnimationMetaData {
  width: number;
  height: number;
  frameCount: number;
  fps: number;
  source: any;
}

export const ANIMATIONS = {
  test: {
    width: 256,
    height: 256,
    frameCount: 8,
    fps: 10,
    source: require('../../assets/placeholders/test.png'),
  },
  test_blue: {
    width: 256,
    height: 256,
    frameCount: 8,
    fps: 20,
    source: require('../../assets/placeholders/test_blue.png'),
  },
  test_small: {
    width: 16,
    height: 16,
    frameCount: 8,
    fps: 10,
    source: require('../../assets/placeholders/test_small.png'),
  }
} satisfies Record<string, AnimationMetaData>;

export type AnimationName = keyof typeof ANIMATIONS;