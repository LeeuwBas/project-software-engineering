import { AppText } from '@/components/AppText';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { View } from 'react-native';

export default function StepsWidget() {
  const steps = 4298;
  // TODO: get goal from API
  const goal = 7000;

  return (
    <View className="flex w-full flex-row items-center gap-2 p-2">
      <Shoe height={30} width={30} />
      <AppText className="text-base font-bold">
        {steps} / {goal}
      </AppText>
    </View>
  );
}
