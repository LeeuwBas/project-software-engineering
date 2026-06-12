import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { useAuth } from '@/lib/auth/AuthManager';
import Moon from '@assets/icons/weather_icons/moon.svg';
import Sunny from '@assets/icons/weather_icons/sunny.svg';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

export default function Settings() {
  const { settingsOpen } = useAppContext();
  const auth = useAuth();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  if (!settingsOpen) {
    return;
  }

  type SettingItem = {
    label: string;
    effect: Function | null;
    icon?: React.FC<SvgProps>;
  };

  const dark = colorScheme === 'dark';

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: () => router.push('/pet-select') },
    { label: 'Change Username', effect: null },
    { label: 'More', effect: null },
    { label: 'Sign out', effect: () => auth?.signOut() },
    {
      label: dark ? 'Light' : 'Dark',
      effect: toggleColorScheme,
      icon: dark ? Sunny : Moon,
    },
  ];

  function executeEffect(item: SettingItem) {
    if (item && item.effect) {
      item.effect();
    }
  }

  return (
    <View
      className={`-top-6 transition-opacity duration-200 ${settingsOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full mb-2 w-full items-center">
        <Card>
          <CardContent>
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  className="my-2 flex h-12"
                  key={item.label}
                  variant="secondary"
                  onPress={() => executeEffect(item)}>
                  {Icon && <Icon width={24} height={24} className="text-white" />}
                  <AppText className="font-bold text-white">{item.label}</AppText>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
