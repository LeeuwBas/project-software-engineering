import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MODULES } from '@/lib/onboarding/types';
import { getActiveModules, setActiveModules } from '@/lib/settings';

type Props = {
  onNext?: () => void;
};

type ActiveModules = Record<string, boolean>;

/** TODO (hfgieter): docstring */
export default function ModuleSelectionStep({ onNext }: Props) {
  const [activeModules, setModuleState] = useState<ActiveModules>({});

  useEffect(() => {
    setModuleState(getActiveModules());
  }, []);

  function toggleModule(moduleKey: string) {
    setModuleState((current) => ({
      ...current,
      [moduleKey]: !current[moduleKey],
    }));
  }

  function isSelected(moduleKey: string) {
    return activeModules[moduleKey] ?? false;
  }

  function saveModules() {
    setActiveModules(activeModules);
    onNext?.();
  }

  const selectedCount = Object.values(activeModules).filter(Boolean).length;

  const stressModule = MODULES.find((module) => module.key === 'stress');
  const habitModules = MODULES.filter((module) => module.key !== 'stress');

  return (
    <View className="flex-1 justify-center px-4">
      <View className="gap-6 rounded-2xl border border-border/40 bg-card/80 p-5">
        <View className="gap-3">
          <AppText className="text-center text-xl font-bold">
            Would you like to keep track of stress?
          </AppText>

          {stressModule && (
            <Pressable
              onPress={() => toggleModule(stressModule.key)}
              className="flex-row items-center justify-center gap-3 rounded-xl border-4 p-6"
              style={{
                backgroundColor: stressModule.color,
                borderColor: stressModule.borderColor,
                opacity: isSelected(stressModule.key) ? 1 : 0.4,
              }}>
              <stressModule.icon width={32} height={32} />
              <AppText className="text-xl font-bold">{stressModule.id}</AppText>
            </Pressable>
          )}
        </View>

        <View className="gap-3">
          <AppText className="text-center text-xl font-bold">
            Which habits would you like to track?
          </AppText>

          <View className="gap-4">
            {habitModules.map((module) => (
              <Pressable
                key={module.key}
                onPress={() => toggleModule(module.key)}
                className="flex-row items-center justify-center gap-3 rounded-xl border-4 p-6"
                style={{
                  backgroundColor: module.color,
                  borderColor: module.borderColor,
                  opacity: isSelected(module.key) ? 1 : 0.4,
                }}>
                <module.icon width={32} height={32} />
                <AppText className="text-xl font-bold">{module.id}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2 pt-2">
          <Button className="w-full" disabled={selectedCount === 0} onPress={saveModules}>
            <AppText className="font-bold text-white">Continue</AppText>
          </Button>
        </View>
      </View>
    </View>
  );
}
