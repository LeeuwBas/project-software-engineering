import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeApiManager } from '@/lib/api/APIBridge';
import { getActiveModules } from '@/lib/settings';
import { GoaledModule, MODULES } from '@/lib/types';
import { useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  onBack?: () => void;
};

/** TODO (AlexAugustijn): docstring */
export default function ModuleConfigStep({ onBack }: Props) {
  const router = useRouter();

  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const activeGoaledModules = MODULES.filter(
    (module): module is GoaledModule => getActiveModules()[module.id] && 'goalConfig' in module
  );

  const [goals, setGoals] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      activeGoaledModules.map((module) => [module.id, module.goalConfig.defaultGoal])
    )
  );

  function incrementGoal(module: GoaledModule) {
    setGoals((current) => {
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

  function saveGoals() {
    initializeApiManager().then(() => {
      const promises: Promise<any>[] = []
      for (const module of activeGoaledModules) {
        const bridge = module.bridge;

        promises.push(bridge.setGoal(goals[module.id] ?? module.goalConfig.defaultGoal));
      }

      Promise.all(promises).then(() => {console.log("finished the goals setting"); router.replace('/(protected)')});
    })

  }

  return (
    <View className="flex-1">
      <View style={{ flex: 0.3 }} />

      <Card className="mx-4 border-border bg-background/80 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            <AppText className="font-bold">Set Your Daily Goals</AppText>
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-5">
          {activeGoaledModules.map((module) => {
            const value = goals[module.id] ?? module.goalConfig.defaultGoal;

            return (
              <View key={module.id} className="gap-2">
                <AppText className="text-center text-lg font-bold">{module.name}</AppText>

                <View className="flex-row items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="h-12 w-12"
                    disabled={goals[module.id] <= module.goalConfig.minGoal}
                    onPress={() => decrementGoal(module)}>
                    <Minus size={20} color={iconColor} />
                  </Button>

                  <View className="min-w-24 items-center justify-center rounded-md border border-border px-4 py-3">
                    <AppText className="text-xl font-bold">{value}</AppText>
                  </View>

                  <Button
                    variant="outline"
                    className="h-12 w-12"
                    disabled={goals[module.id] >= module.goalConfig.maxGoal}
                    onPress={() => incrementGoal(module)}>
                    <Plus size={20} color={iconColor} />
                  </Button>
                </View>

                <AppText className="text-center text-sm opacity-70">{module.unit}</AppText>
              </View>
            );
          })}

          <View className="gap-2">
            <Button onPress={saveGoals}>
              <AppText className="font-bold text-white">Finish setup & Go to tutorial</AppText>
            </Button>

            <Button
              variant="outline"
              onPress={() => {
                onBack?.();
              }}>
              <AppText className="font-bold">Reselect modules</AppText>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
