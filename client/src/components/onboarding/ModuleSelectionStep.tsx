import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { getActiveModules, setActiveModules } from '@/lib/settings';
import { EnabledModules } from '@/lib/storage';
import { MODULES } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  onNext?: () => void;
};

const DEFAULT_MODULES = {
  water: true,
  sleep: true,
  steps: true,
  stress: true,
  food: true,
};

export default function ModuleSelectionStep({ onNext }: Props) {
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

  function saveModules() {
    setActiveModules(activeModules);
    onNext?.();
  }

  const selectedCount = Object.values(activeModules).filter(Boolean).length;

  const stressModule = MODULES.find((module) => module.id === 'stress');
  const habitModules = MODULES.filter((module) => module.id !== 'stress');

  return (
    <View className="flex-1 justify-center px-4">
      <View className="gap-6 rounded-2xl border border-border/40 bg-card/80 p-5">
        <View className="gap-3">
          <AppText className="text-center text-xl font-bold">
            Would you like to keep track of stress?
          </AppText>

          {stressModule && (
            <Pressable
              onPress={() => toggleModule(stressModule.id)}
              className="flex-row items-center justify-center gap-3 rounded-xl border-4 p-6"
              style={{
                backgroundColor: stressModule.color,
                borderColor: stressModule.borderColor,
                opacity: isSelected(stressModule.id) ? 1 : 0.4,
              }}>
              <stressModule.icon width={32} height={32} />
              <AppText className="text-xl font-bold">{stressModule.name}</AppText>
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
                key={module.id}
                onPress={() => toggleModule(module.id)}
                className="flex-row items-center justify-center gap-3 rounded-xl border-4 p-6"
                style={{
                  backgroundColor: module.color,
                  borderColor: module.borderColor,
                  opacity: isSelected(module.id) ? 1 : 0.4,
                }}>
                <module.icon width={32} height={32} />
                <AppText className="text-xl font-bold">{module.name}</AppText>
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
