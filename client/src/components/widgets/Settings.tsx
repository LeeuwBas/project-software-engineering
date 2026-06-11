import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthManager';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function Settings({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) {
    return;
  }

  const router = useRouter();
  const auth = useAuth();

  type SettingItem = {
    label: string;
    effect: Function | null;
  };

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: () => router.push('/pet-select') },
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
      className={`-top-6 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
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
