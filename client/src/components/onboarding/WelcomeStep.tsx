import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';

import { useTutorial } from '@/lib/settings';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

export function WelcomeStep() {
  const router = useRouter();
  const { setTutorialDone } = useTutorial();

  function routeWithTutorial(tutorial: Boolean) {
    if (!tutorial) {
      setTutorialDone();
    }
    router.push('/');
  }

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <AppText className="text-4xl font-bold">Welcome To</AppText>
      <Image source={require('@assets/icons/module_icons/shoe.png')} />

      <Button
        className="py-0"
        variant="default"
        onPress={() => {
          routeWithTutorial(true);
        }}>
        <AppText className="font-bold text-white">Go to Tutorial</AppText>
      </Button>

      <Button
        className="py-0"
        variant="secondary"
        onPress={() => {
          routeWithTutorial(false);
        }}>
        <AppText className="font-bold text-white">Skip Tutorial</AppText>
      </Button>
    </View>
  );
}
