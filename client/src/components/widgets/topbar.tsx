import { AppText } from '@/components/AppText';
import Bar from '@/components/widgets/Bar';
import Weather from '@/components/widgets/Weather';
import { getActiveModules } from '@/lib/settings';
import { ModuleId, MODULES } from '@/lib/types';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface BarType {
  id: ModuleId;
  icon: React.FC<SvgProps>;
  value: number;
  goal: number;
}

export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  const goaledModules = MODULES.filter((module) => 'goalConfig' in module);
  const bars: BarType[] = goaledModules.map((module) => ({
    id: module.id,
    icon: module.icon,
    value: module.useValue() ?? 0,
    goal: module.bridge.useGoal() ?? 0,
  }));

  const activeBars = bars.filter((bar) => getActiveModules()[bar.id]);

  return (
    <View className="flex-row content-start">
      <View className="w-1/2 flex-row gap-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <View className="w-full flex-col gap-2">
        {activeBars.map((bar) => (
          <Bar icon={bar.icon} value={bar.value} goal={bar.goal} key={bar.id} />
        ))}
      </View>
    </View>
  );
}
