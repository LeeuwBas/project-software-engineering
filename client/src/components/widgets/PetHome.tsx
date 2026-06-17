import { Animation } from '@/components/animations/renderer';
import { usePet } from '@/components/contexts/PetContext';
import { AnimationName, ANIMATIONS } from '@/lib/animations/library';
import { useWater } from '@/lib/api/WaterBridge';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

/**
 * This component represents the pet with its associated animations for the homescreen.
 * Can be used as reference for other pet displays in different locations.
 * Interactions with the pet can be represented by a function here which calls the setCurrentAnim
 * function with the corresponding animation from the animations file
 *
 * @returns a pet for the homescreen
 */
export default function PetHome({ className = '', ...props }: { className?: string }) {
  function selection(id: number) {
    switch (id) {
      case 0:
        return 'onigiri';
      case 1:
        return 'frog';
      case 2:
        return 'blob';
      default:
        console.error('Unknown pet id');
    }
  }

  const { pet } = usePet();

  const source = selection(pet); // derived, never stale
  const idleAnim = `${source}_breath_happy` as AnimationName;
  const blinkAnim = `${source}_blink` as AnimationName;
  const waterAnim = `${source}_drinking` as AnimationName;

  const [currentAnim, setCurrentAnim] = useState<AnimationName>(idleAnim);
  const [animIteration, setAnimIteration] = useState(1);

  const waterValue = useWater() ?? null;
  const [prevWater, setPrevWater] = useState<number | null>(null);

  // Sync animation when the pet or base idle animation changes
  useEffect(() => {
    setCurrentAnim(idleAnim);
    setAnimIteration(0);
  }, [idleAnim, pet]);

  // When water value changes play water animation once
  // Has exception for when watervalue is loaded at render and when water value is lower than previous value
  useEffect(() => {
    if (
      prevWater !== null &&
      waterValue != null &&
      waterValue !== prevWater &&
      waterValue >= prevWater
    ) {
      setAnimIteration(1);
      setCurrentAnim(waterAnim);
    } else {
      setCurrentAnim(idleAnim);
      setAnimIteration(1);
    }
    setPrevWater(waterValue);
  }, [waterValue]);

  // Goes back to idle after specified interation counts in animIteration
  // Starts new animation when either current animation, idle animation or watervalue changes
  // This triggers rerender of animation component
  useEffect(() => {
    if (currentAnim === idleAnim) return;

    const meta = ANIMATIONS[currentAnim];
    if (!meta) return;

    const oneIterationMs = (meta.frameCount / meta.fps) * 1000;
    const totalDurationMs = oneIterationMs * animIteration;

    const timer = setTimeout(() => {
      setCurrentAnim(idleAnim);
    }, totalDurationMs);

    return () => clearTimeout(timer);
  }, [currentAnim, idleAnim, animIteration, waterValue]);

  return (
    <View className={className} {...props}>
      <Pressable
        className="max-h-72 items-center justify-center self-center"
        onPress={() => {
          currentAnim === idleAnim ? setCurrentAnim(blinkAnim) : setCurrentAnim(idleAnim);
          setAnimIteration(2);
        }}>
        <View pointerEvents="box-none">
          <Animation animation={currentAnim} scale={9} iteration_count={animIteration} />
        </View>
      </Pressable>
    </View>
  );
}
