import { CloudLightningIcon } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { Button } from '../ui/button';

export default function StressWidget() {
  return (
    <View className="flex w-full flex-row items-center justify-between gap-2 p-2">
      <CloudLightningIcon size={30} />
      <Button variant="outline"><Text>Log Stress</Text></Button>
    </View>
  );
}
