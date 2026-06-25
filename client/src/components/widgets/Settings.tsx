import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { useAuth } from '@/lib/auth/AuthManager';
import { useTutorial } from '@/lib/settings';
import Moon from '@assets/icons/weather_icons/moon.svg';
import Sunny from '@assets/icons/weather_icons/sunny.svg';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

/**
 * Popup settings panel anchored above the opening trigger.
 *
 * Renders a card of action buttons that can expand.
 * Visibility and pointer events are driven by `settingsOpen` from
 * useAppContext. The panel fades in/out via NativeWind opacity
 * transitions.
 *
 * @returns An absolute-positioned <View> containing the settings card.
 */
export default function Settings() {
  const { resetTutorial } = useTutorial();
  const { settingsOpen, changeSettings } = useAppContext();
  const auth = useAuth();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  type SettingItem = {
    label: string;
    effect: Function | null;
    icon?: React.FC<SvgProps>;
  };

  const dark = colorScheme === 'dark';

  const [showMore, setShowMore] = useState(false);

  const BASE_ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: () => router.push('/pet-select') },
    { label: 'Change Habits', effect: () => router.push('/change-modules') },
    {
      label: auth.isGuest ? 'Sign in' : 'Sign out',
      effect: () => {
        auth.signOut();
      },
    },
  ];

  const MORE_ITEMS: SettingItem[] = [
    { label: 'Change Names', effect: () => router.push('/change-names') },
    {
      label: dark ? 'Light' : 'Dark',
      effect: toggleColorScheme,
      icon: dark ? Sunny : Moon,
    },
    {
      label: 'Restart tutorial',
      effect: () => {
        changeSettings();
        resetTutorial();
      },
    },
  ];

  const ITEMS = showMore ? [...BASE_ITEMS, ...MORE_ITEMS] : BASE_ITEMS;

  return (
    <View
      pointerEvents={settingsOpen ? 'auto' : 'none'}
      className={`-top-6 transition-opacity duration-200 ${settingsOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full mb-2 w-full items-center">
        <Card className="w-3/4">
          <CardContent>
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  className="my-2 flex h-12"
                  key={item.label}
                  variant="secondary"
                  onPress={() => {
                    item.effect?.();
                  }}>
                  {Icon && <Icon width={24} height={24} className="text-white" />}
                  <AppText className="font-bold text-white">{item.label}</AppText>
                </Button>
              );
            })}
            <Button
              className="my-2 flex h-12"
              variant="secondary"
              onPress={() => setShowMore((prev) => !prev)}>
              <AppText className="font-bold text-white">{showMore ? 'Less' : 'More'}</AppText>
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
