import { Animation } from '@/components/animations/renderer'
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AnimationName } from '@/lib/animations';

export default function AnimationView() {
    const [currentAnim, setCurrentAnim] = useState<AnimationName>("frog_breath_happy");

    return (
        <SafeAreaView className='flex-1'>
            <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Pressable className="w-4/5 h-3/6 self-center overflow-hidden items-center justify-center" onPress={() => {currentAnim === 'frog_breath_happy' ? setCurrentAnim('frog_drinking') : setCurrentAnim('frog_breath_happy')}}>
                    <View  pointerEvents="box-none">
                        <Animation key={currentAnim} animation={currentAnim} scale={9} />
                    </View>
                    
                </Pressable>
            </View>
        </SafeAreaView>
    );
}