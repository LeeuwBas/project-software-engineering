import { Animation } from '@/components/animations/renderer'
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnimationView() {
    return (
        <SafeAreaView>
            <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Animation animation='test' />
            </View>
            <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Animation animation='test_small' scale={16}/>
            </View>
        </SafeAreaView>
    );
}