import { Animation } from '@/components/animations/renderer';
import { usePet } from '@/components/contexts/PetContext';
import { AnimationName, ANIMATIONS } from '@/lib/animations/library';
import { quoteBridge } from '@/lib/api/APIBridge';
import { useFood } from '@/lib/api/FoodBridge';
import { useQuote } from '@/lib/api/QuoteBridge';
import { useSleep } from '@/lib/api/SleepBridge';
import { useWater } from '@/lib/api/WaterBridge';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { scheduleNotification } from '@/lib/notificationScheduler';

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
  const quote = useQuote();

  const source = selection(pet); // derived, never stale
  const idleAnim = `${source}_breath_happy` as AnimationName;
  const blinkAnim = `${source}_blink` as AnimationName;
  const waterAnim = `${source}_drinking` as AnimationName;
  const foodAnim = `${source}_eating` as AnimationName;
  const sleepAnim = `${source}_sleeping` as AnimationName;

  const [currentAnim, setCurrentAnim] = useState<AnimationName>(idleAnim);
  const [animIteration, setAnimIteration] = useState(1);

  const waterValue = useWater() ?? null;
  const foodValue = useFood() ?? null;
  const sleepValue = useSleep() ?? null;

  const prevValues = useRef<{ water: number | null; food: number | null; sleep: number | null }>({
    water: null,
    food: null,
    sleep: null,
  });

  // Sync animation when the pet or base idle animation changes
  useEffect(() => {
    setCurrentAnim(idleAnim);
    setAnimIteration(0);
  }, [idleAnim, pet]);

  // Checks which module values have changed and plays animation accordingly.
  // If more than one value has changed, random animation will be picked.
  useEffect(() => {
    let changed_anim: AnimationName[] = [];
    const prev = prevValues.current;

    if (
      prev.water !== null &&
      waterValue !== null &&
      waterValue !== prev.water &&
      waterValue > prev.water
    ) {
      changed_anim.push(waterAnim);
    }

    if (
      prev.food !== null &&
      foodValue !== null &&
      foodValue !== prev.food &&
      foodValue > prev.food
    ) {
      changed_anim.push(foodAnim);
    }

    if (prev.sleep !== null && sleepValue !== null && sleepValue !== prev.sleep) {
      changed_anim.push(sleepAnim);
    }

    if (changed_anim.length > 0) {
      let random_anim = changed_anim[Math.floor(Math.random() * changed_anim.length)];
      setAnimIteration(1);
      setCurrentAnim(random_anim);
    } else {
      setAnimIteration(1);
      setCurrentAnim(idleAnim);
    }

    prevValues.current = { water: waterValue, food: foodValue, sleep: sleepValue };
  }, [waterValue, foodValue, sleepValue]);

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
  }, [currentAnim, idleAnim, animIteration]);

  function sendNoti() {
    const today = new Date();
    today.setSeconds(today.getSeconds() + 3);
    scheduleNotification(today, "Touch", "Hey! You touched me!");

  }

  return (
    <View className={className} {...props}>
      <Pressable
        className="max-h-72 items-center justify-center self-center"
        onPress={() => {
          sendNoti();
          currentAnim === idleAnim ? setCurrentAnim(blinkAnim) : setCurrentAnim(idleAnim);
          setAnimIteration(1);
          quote ? quoteBridge.removeQuote() : quoteBridge.requestQuote();
        }}>
        <View pointerEvents="box-none">
          <Animation animation={currentAnim} scale={9} iteration_count={animIteration} />
        </View>
      </Pressable>
    </View>
  );
}
