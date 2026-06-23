import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/lib/onboarding/types';
import { MODULES } from '@/lib/types';
import { View } from 'react-native';
import { ModuleSelection } from '@/components/widgets/ModuleSelection';
import { useModuleManagement } from '@/lib/useModuleManagement';
export default function ModuleSelectionStep({
  onNext,
  goToStep,
}: {
  onNext: () => void;
  goToStep: (step: OnboardingStep) => void;
}) {
  const { activeModules, toggleModule, isSelected, saveModules } = useModuleManagement();

  const selectedCount = Object.values(activeModules).filter(Boolean).length;

  const requiresGoalSetup = MODULES.some(
    (module) => activeModules[module.id] && 'goalConfig' in module
  );

  function handleSave() {
    saveModules();

    if (requiresGoalSetup) {
      onNext();
    } else {
      goToStep('account');
    }
  }

  return (
    <View className="flex-1 justify-center px-4">
      <ModuleSelection
        activeModules={activeModules}
        toggleModule={toggleModule}
        isSelected={isSelected}
      />

      <View className="pt-8">
        <Button className="w-full" disabled={selectedCount === 0} onPress={handleSave}>
          <AppText className="font-bold text-white">Choose Tracked Habits</AppText>
        </Button>
      </View>
    </View>
  );
}