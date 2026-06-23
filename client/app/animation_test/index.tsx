import { Animation } from '@/components/animations/renderer';
import { AnimationName } from '@/lib/animations/library';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO (AlexAugustijn): AnimationView is used nowhere, delete this file and the animation_test directory
export default function AnimationView() {
  const [currentAnim, setCurrentAnim] = useState<AnimationName>('onigiri_breath_happy');

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          className="h-3/6 w-4/5 items-center justify-center self-center overflow-hidden"
          onPress={() => {
            currentAnim === 'onigiri_breath_happy'
              ? setCurrentAnim('onigiri_drinking')
              : setCurrentAnim('onigiri_breath_happy');
          }}>
          <View pointerEvents="box-none">
            <Animation animation={currentAnim} scale={9} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
