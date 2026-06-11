import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { useAuth } from '@/lib/auth/AuthManager';
import { View } from 'react-native';

export default function Settings({}: {}) {
  const { settingsOpen } = useAppContext();
  const auth = useAuth();

  if (!settingsOpen) {
    return;
  }

  type SettingItem = {
    label: string;
    effect: Function | null;
  };

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: null },
    { label: 'Change Username', effect: null },
    { label: 'More', effect: null },
    { label: 'Sign out', effect: () => auth?.signOut() },
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
            {ITEMS.map((item) => (
              <Button
                className="my-2 flex h-12"
                key={item.label}
                variant="secondary"
                onPress={() => executeEffect(item)}>
                <AppText className="font-bold text-white">{item.label}</AppText>
              </Button>
            ))}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
