import { SportShoe } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText } from '../AppText';
import { useColorScheme } from 'nativewind';

export default function StepsWidget() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  return (
    <View className="flex w-full flex-row items-center justify-start gap-2 self-stretch p-2">
      <SportShoe size={30} color={iconColor} />
      <AppText className="text-base font-bold">9999</AppText>
    </View>
  );
}
