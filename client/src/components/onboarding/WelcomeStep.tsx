import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';

export function WelcomeStep() {
  return (
    <View className="flex-1 items-center justify-center gap-4">

      <Button onPress={null}>
        <AppText>Go to Tutorial</AppText>
      </Button>

      <Button onPress={null}>
        <AppText>Skip Tutorial</AppText>
      </Button>

    </View>
  );
}