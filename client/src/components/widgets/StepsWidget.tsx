import { AppText } from '@/components/AppText';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function StepsWidget() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  return (
    <View className="flex w-full flex-row items-center justify-start gap-2 self-stretch p-2">
      <Shoe height={30} width={30} color={iconColor} />
      <AppText className="text-base font-bold">9999</AppText>
    </View>
  );
}
