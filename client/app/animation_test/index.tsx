import { Animation } from '@/components/animations/renderer'
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnimationView() {
    return (
        <SafeAreaView className='flex-1'>
            <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Animation animation='blob_breath_happy' scale={12}/>
            </View>
        </SafeAreaView>
    );
}