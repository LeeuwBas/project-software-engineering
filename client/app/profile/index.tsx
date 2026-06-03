import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PEEK_TOP = 80;

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  type SettingItem = {
    label: string;
  };

  const ITEMS: SettingItem[] = [
    { label: 'Notificaties' },
    { label: 'Weergave' },
    { label: 'Privacy' },
  ];

  const [activeItem, setActiveItem] = useState<SettingItem | null>(null);

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
            {ITEMS.map((item) => (
                <Pressable
                key={item.label}
                onPress={() => setActiveItem(item)}
                style={({ pressed }) => ({
                    backgroundColor: pressed ? '#b0b7c3' : 'transparent',
                    padding: 20,
                    alignItems: 'center',
                })}>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>{item.label}</Text>
                </Pressable>
            ))}
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
