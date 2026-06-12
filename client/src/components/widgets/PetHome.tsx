import { AnimationName } from '@/lib/animations/library';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Animation } from '../animations/renderer';

export default function PetHome({
  className = '',
  id,
  ...props
}: {
  className?: string;
  id: number;
}) {
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

  const source = selection(id); // derived, never stale
  const happyAnim = `${source}_breath_happy` as AnimationName;
  const blinkAnim = `${source}_blink` as AnimationName;

  const [currentAnim, setCurrentAnim] = useState<AnimationName>(happyAnim);

  useEffect(() => {
    setCurrentAnim(happyAnim);
  }, [happyAnim, id]);

  return (
    <View className={className} {...props}>
      <Pressable
        className="items-center justify-center self-center overflow-hidden"
        onPress={() => {
          currentAnim === happyAnim ? setCurrentAnim(blinkAnim) : setCurrentAnim(happyAnim);
        }}>
        <View pointerEvents="box-none">
          <Animation animation={currentAnim} scale={9} />
        </View>
      </Pressable>
    </View>
  );
}
