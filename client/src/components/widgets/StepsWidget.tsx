import { SportShoe } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText } from '../AppText';

export default function StepsWidget() {
  return (
    <View className="flex w-full flex-row items-center justify-start gap-2 self-stretch p-2">
      <SportShoe size={30} />
      <AppText className="text-base font-bold">9999</AppText>
    </View>
  );
}
