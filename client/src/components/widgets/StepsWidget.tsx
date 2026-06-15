import { Button } from '@/components/ui/button';
import { SportShoe } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { AppText } from '../AppText';
export default function StepsWidget() {
  return (
    <View className="flex w-full flex-row items-center gap-2 p-2">
      <SportShoe size={30} />
      <AppText className="text-base font-bold">9999</AppText>
    </View>
  );
}
