import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PEEK_TOP = 320;
const SUB_PEEK_TOP = PEEK_TOP + 160;

export default function ProfilePopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: { (value: boolean): void };
}) {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  type SettingItem = {
    label: string;
  };

  const ITEMS: SettingItem[] = [
    { label: 'Verander Pet' },
    { label: 'Verander Gebruikersnaam' },
    { label: 'Meer' },
  ];

  const translateYSub = useSharedValue(SCREEN_HEIGHT);
  const animatedStyleSub = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYSub.value }],
  }));

  const [activeItem, setActiveItem] = useState<SettingItem | null>(null);

  useEffect(() => {
    translateY.value = withSpring(open ? 0 : SCREEN_HEIGHT);
  }, [open, translateY]);

  useEffect(() => {
    translateYSub.value = withSpring(
      activeItem?.label === 'Verander Gebruikersnaam' ? 0 : SCREEN_HEIGHT
    );
  }, [activeItem, translateYSub]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className="flex-1">
      {open && <Pressable className="absolute inset-0" onPress={() => setOpen(false)} />}

      <Animated.View
        className="p-10"
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
        <View className="flex-1 gap-8">
          {ITEMS.map((item) => (
            <Button
              key={item.label}
              variant="default"
              onPress={() => setActiveItem(item)}>
              <Text>{item.label}</Text>
            </Button>
          ))}
        </View>
      </Animated.View>

      {activeItem && (
        <Pressable style={{ position: 'absolute', inset: 0 }} onPress={() => setActiveItem(null)} />
      )}
      <Animated.View
        style={[
          animatedStyleSub,
          {
            position: 'absolute',
            top: SUB_PEEK_TOP,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#b0b7c3',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        ]}>
        <View style={{ flex: 1, padding: 16, gap: 16 }}>
          <Text className="font-normal">Verander Gebruikersnaam</Text>
          <Input
            placeholder="Naam"
            autoComplete="name"
            textContentType="name"
            returnKeyType="done"
          />
        </View>
      </Animated.View>
    </View>
  );
}
