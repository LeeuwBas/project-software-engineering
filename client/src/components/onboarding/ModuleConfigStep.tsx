import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getActiveModules } from '@/lib/settings';
import { GOAL_MODULES, ConfigDefinition } from '@/lib/onboarding/types';
import { useRouter } from 'expo-router';

type Props = {
  onBack?: () => void;
};

export default function ModuleConfigStep({ onBack }: Props) {
  const activeModules = getActiveModules();
  const router = useRouter();

  // NO SAFETY GUARANTEE FOR KEYS, URGENTLY REQUIRES REFORMAT
  const enabledGoalModules = GOAL_MODULES.filter(
    (module) => activeModules[module.key as keyof typeof activeModules]
  );

  const [goals, setGoals] = useState<Record<string, number>>(() =>
    Object.fromEntries(enabledGoalModules.map((module) => [module.key, module.defaultGoal]))
  );

  function incrementGoal(module: ConfigDefinition) {
    setGoals((current) => {
      const currentValue = current[module.key] ?? module.defaultGoal;
      const nextValue = Math.min(module.maxGoal, currentValue + module.stepSize);
      const update = { ...current };

      update[module.key] = nextValue;

      return update;
    });
  }

  function decrementGoal(module: ConfigDefinition) {
    setGoals((current) => {
      const currentValue = current[module.key] ?? module.defaultGoal;
      const nextValue = Math.max(module.minGoal, currentValue - module.stepSize);
      const update = { ...current };

      update[module.key] = nextValue;

      return update;
    });
  }

  function saveGoals() {
    for (const module of enabledGoalModules) {
      const bridge = module.bridge();

      bridge.setGoal(goals[module.key] ?? module.defaultGoal);
    }

    router.push('/(protected)');
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
          {enabledGoalModules.map((module) => {
            const value = goals[module.key] ?? module.defaultGoal;

            return (
              <View key={module.key} className="gap-2">
                <AppText className="text-center text-lg font-bold">{module.label}</AppText>

                <View className="flex-row items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="h-12 w-12"
                    onPress={() => decrementGoal(module)}>
                    <AppText className="text-lg font-bold">−</AppText>
                  </Button>

                  <View className="min-w-24 items-center justify-center rounded-md border border-border px-4 py-3">
                    <AppText className="text-xl font-bold">{value}</AppText>
                  </View>

                  <Button
                    variant="outline"
                    className="h-12 w-12"
                    onPress={() => incrementGoal(module)}>
                    <AppText className="text-lg font-bold">+</AppText>
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
