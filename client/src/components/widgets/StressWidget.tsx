import { CloudLightningIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { AppText } from '../AppText';
import { Button } from '../ui/button';

/** TODO (hfgieter, buenk): docstring */
export default function StressWidget({ onPress }: { onPress: () => void }) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  return (
    <View className="flex w-full flex-row items-center justify-between gap-2 p-2">
      <CloudLightningIcon size={30} color={iconColor} />
      <Button variant="outline" onPress={onPress}>
        <AppText>Log Stress</AppText>
      </Button>
    </View>
  );
}
