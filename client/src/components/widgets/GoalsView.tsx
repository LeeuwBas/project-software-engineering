import { AppText } from '@/components/AppText';
import { getActiveModules } from '@/lib/settings';
import { GoaledModule, MODULES } from '@/lib/types';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { Button } from '../ui/button';

/** TODO (ZJWeng): docstring */
export default function GoalsView({
  goals,
  setGoals,
}: {
  goals: Record<string, number>;
  setGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const activeGoaledModules = MODULES.filter(
    (module): module is GoaledModule => getActiveModules()[module.id] && 'goalConfig' in module
  );

  function incrementGoal(module: GoaledModule) {
    setGoals((current: Record<string, number>) => {
      const currentValue = current[module.id] ?? module.goalConfig.defaultGoal;
      const nextValue = Math.min(
        module.goalConfig.maxGoal,
        currentValue + module.goalConfig.stepSize
      );
      return {
        ...current,
        [module.id]: nextValue,
      };
    });
  }

  function decrementGoal(module: GoaledModule) {
    setGoals((current) => {
      const currentValue = current[module.id] ?? module.goalConfig.defaultGoal;
      const nextValue = Math.max(
        module.goalConfig.minGoal,
        currentValue - module.goalConfig.stepSize
      );
      return {
        ...current,
        [module.id]: nextValue,
      };
    });
  }

  return (
    <View className="flex-col gap-2">
      <AppText className="text-lg font-bold">Goals:</AppText>
      {activeGoaledModules.map((module) => (
        <View className="max-w-full flex-row items-center justify-between gap-3" key={module.id}>
          <module.icon height={30} width={30} />
          <Button
            variant="outline"
            className="h-12 flex-grow"
            disabled={goals[module.id] === module.goalConfig.minGoal}
            onPress={() => decrementGoal(module)}>
            <Minus size={20} />
          </Button>

          <View className="flex min-w-16 flex-grow flex-row items-center justify-center gap-0 rounded-md border border-border px-2 py-3">
            <AppText className="text-base font-bold">{goals[module.id]}</AppText>
          </View>

          <Button
            variant="outline"
            className="h-12 flex-grow"
            onPress={() => incrementGoal(module)}>
            <Plus size={20} />
          </Button>
        </View>
      ))}
    </View>
  );
}
