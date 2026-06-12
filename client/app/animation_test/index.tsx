import { Animation } from '@/components/animations/renderer'
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AnimationName } from '@/lib/animations/library';

export default function AnimationView() {
    const [currentAnim, setCurrentAnim] = useState<AnimationName>("onigiri_breath_happy");

    return (
        <SafeAreaView className='flex-1'>
            <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Pressable className="w-4/5 h-3/6 self-center overflow-hidden items-center justify-center" onPress={() => {currentAnim === 'onigiri_breath_neutral' ? setCurrentAnim('onigiri_drinking') : setCurrentAnim('onigiri_breath_neutral')}}>
                    <View  pointerEvents="box-none">
                        <Animation key={currentAnim} animation={currentAnim} scale={9} />
                    </View>
                    
                </Pressable>
            </View>
        </SafeAreaView>
    );
}