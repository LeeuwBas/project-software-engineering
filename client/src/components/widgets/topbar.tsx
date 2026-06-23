import { AppText } from '@/components/AppText';
import Bar from '@/components/widgets/Bar';
import Weather from '@/components/widgets/Weather';
import { getActiveModules } from '@/lib/settings';
import { GoaledModule, MODULES } from '@/lib/types';
import { View } from 'react-native';

/**
 * The view on top of the homepage. Contains the weather, day of the week, and bars for active goaled modules.
 * @returns the top view
 */
export default function Topbar() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  const activeGoaledModules = MODULES.filter(
    (module): module is GoaledModule => getActiveModules()[module.id] && 'goalConfig' in module
  );

  return (
    <View className="flex-row content-start">
      <View className="w-1/2 flex-row gap-2">
        <Weather />
        <AppText className=" text-2xl font-bold">{day}</AppText>
      </View>

      <View className="w-full flex-col gap-2">
        {activeGoaledModules.map((module) => (
          <Bar module={module} key={module.id} />
        ))}
      </View>
    </View>
  );
}
