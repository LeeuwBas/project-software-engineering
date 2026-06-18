import { AppText } from '@/components/AppText';
import Bar from '@/components/widgets/Bar';
import Weather from '@/components/widgets/Weather';
import { stepsBridge, waterBridge } from '@/lib/api/APIBridge';
import { useSteps } from '@/lib/api/StepBridge';
import { useWater } from '@/lib/api/WaterBridge';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { View } from 'react-native';

export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const water = useWater() ?? 0;
  const waterGoal = waterBridge.useGoal() ?? 0;
  const steps = useSteps() ?? 0;
  const stepsGoal = stepsBridge.useGoal() ?? 0;

  const bars = [
    {
      id: 'water',
      icon: Glass,
      value: water,
      goal: waterGoal,
    },
    {
      id: 'steps',
      icon: Shoe,
      value: steps,
      goal: stepsGoal,
    },
  ];

  return (
    <View className="flex-row content-start">
      <View className="w-1/2 flex-row gap-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <View className="w-full flex-col gap-2">
        {bars.map((bar) => (
          <Bar icon={bar.icon} value={bar.value} goal={bar.goal} key={bar.id} />
        ))}
      </View>
    </View>
  );
}
