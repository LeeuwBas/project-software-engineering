import { SpriteAnimation } from '@/components/animations/test'
import { View } from 'react-native';

export default function AnimationView() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <SpriteAnimation />
        </View>
    );
}