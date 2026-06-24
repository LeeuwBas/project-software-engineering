import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { getActiveModules } from '@/lib/settings';
import { GoaledModule, MODULES } from '@/lib/types';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

/**
 * View for changing the goals of goaled modules
 *
 * @param goals Draft goals to be displayed
 * @param setGoals Set function to change draft goals
 */
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

  // Add the step amount to goal
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

  // Subtract the step amount from goal
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
      {/* List of goal modules */}
      {activeGoaledModules.map((module) => (
        <View className="flex-row items-center gap-2" key={module.id}>
          <module.icon height={30} width={30} />
          <View className="w-[85%] flex-row items-center justify-between gap-4">
            {/* Minus button */}
            <Button
              variant={'outline'}
              disabled={goals[module.id] === module.goalConfig.minGoal}
              onPress={() => decrementGoal(module)}>
              <Minus size={20} />
            </Button>

            <AppText className="text-right text-base font-bold">{goals[module.id]}</AppText>

            {/* Plus button */}
            <Button
              variant="outline"
              disabled={goals[module.id] === module.goalConfig.maxGoal}
              onPress={() => incrementGoal(module)}>
              <Plus size={20} />
            </Button>
          </View>
        </View>
      ))}
    </View>
  );
}
