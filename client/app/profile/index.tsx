import { Button } from '@/components/ui/button';
import { View, Text, Dimensions, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PEEK_TOP = 80;

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(open ? 0 : SCREEN_HEIGHT);
  }, [open, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full">
        <View className="mt-auto items-center">
          <Button variant="outline" onPress={() => setOpen(true)}>
            <Text>Profile</Text>
          </Button>
        </View>
        {open && <Pressable className="absolute inset-0" onPress={() => setOpen(false)} />}

        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: PEEK_TOP,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#d1d5db',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
          ]}>
          <Text>Settings komen hier</Text>
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
