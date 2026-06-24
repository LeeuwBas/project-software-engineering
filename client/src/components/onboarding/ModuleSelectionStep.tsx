import CheckIcon from '@/assets/icons/toolbar_icons/check.svg';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/lib/onboarding/types';
import { getActiveModules, setActiveModules } from '@/lib/settings';
import { EnabledModules } from '@/lib/storage';
import { MODULES } from '@/lib/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

const DEFAULT_MODULES: EnabledModules = {
  water: true,
  sleep: true,
  steps: true,
  stress: true,
  food: true,
};

/**
 * Module selection widget for the onboarding process.
 * Serves as an interface for a user to save their enabled modules.
 *
 * @param {Props} onNext -
 *  Function to handle in-page routing to the next step of onboarding
 * @param {Props} goToStep -
 *  Function to handle in-page routing to a specific step of onboarding
 * @return {React.JSX.Element} Module selection widget
 */
export default function ModuleSelectionStep({
  onNext,
  goToStep,
}: {
  onNext: () => void;
  goToStep: (step: OnboardingStep) => void;
}) {
  const router = useRouter();

  const [activeModules, setModuleState] = useState<EnabledModules>(DEFAULT_MODULES);

  useEffect(() => {
    setModuleState(getActiveModules());
  }, []);

  function toggleModule(moduleId: keyof EnabledModules) {
    setModuleState((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  }

  function isSelected(moduleId: keyof EnabledModules) {
    return activeModules[moduleId] ?? false;
  }

  const requiresGoalSetup = MODULES.some(
    (module) => activeModules[module.id] && 'goalConfig' in module
  );

  function saveModules() {
    setActiveModules(activeModules);

    if (requiresGoalSetup) {
      onNext();
    } else {
      goToStep('account');
    }
  }

  const selectedCount = Object.values(activeModules).filter(Boolean).length;

  const stressModule = MODULES.find((module) => module.id === 'stress');
  const habitModules = MODULES.filter((module) => module.id !== 'stress');

  return (
    <View className="flex-1 justify-center px-4">
      <View className="gap-2 rounded-2xl border border-border/40 bg-card/80 p-5">
        <View className="gap-2">
          <AppText className="text-center text-xl font-bold">
            Would you like to keep track of stress?
          </AppText>

          {stressModule && (
            <Pressable
              onPress={() => toggleModule(stressModule.id)}
              className="flex-row items-center justify-between rounded-xl border-4 p-4"
              style={{
                backgroundColor: stressModule.color,
                borderColor: stressModule.borderColor,
                opacity: isSelected(stressModule.id) ? 1 : 0.4,
              }}>
              <View className="w-8" />

              <View className="flex-1 flex-row items-center justify-center gap-3">
                <stressModule.icon width={32} height={32} />
                <AppText className="text-xl font-bold">{stressModule.name}</AppText>
              </View>

              <View className="w-8 items-center justify-center">
                {isSelected(stressModule.id) ? (
                  <CheckIcon
                    width={32}
                    height={32}
                    color={stressModule.selectColor ?? stressModule.borderColor}
                  />
                ) : null}
              </View>
            </Pressable>
          )}
        </View>

        <View className="gap-2">
          <AppText className="text-center text-xl font-bold">
            Which habits would you like to track?
          </AppText>

          <View className="gap-2">
            {habitModules.map((module) => (
              <Pressable
                key={module.id}
                onPress={() => toggleModule(module.id)}
                className="flex-row items-center justify-between gap-3 rounded-xl border-4 p-4"
                style={{
                  backgroundColor: module.color,
                  borderColor: module.borderColor,
                  opacity: isSelected(module.id) ? 1 : 0.4,
                }}>
                <View className="w-8" />

                <View className="flex-1 flex-row items-center justify-center gap-3">
                  <module.icon width={32} height={32} />
                  <AppText className="text-xl font-bold">{module.name}</AppText>
                </View>

                <View className="w-8 items-center justify-center">
                  {isSelected(module.id) ? (
                    <CheckIcon
                      width={32}
                      height={32}
                      color={module.selectColor ?? module.borderColor}
                    />
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="pt-8">
          <Button className="w-full" disabled={selectedCount === 0} onPress={saveModules}>
            <AppText className="font-bold text-white">Choose Habit Modules</AppText>
          </Button>
        </View>
      </View>
    </View>
  );
}
