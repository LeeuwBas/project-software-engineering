import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/lib/onboarding/types';
import { MODULES } from '@/lib/types';
import { View } from 'react-native';
import { ModuleSelection } from '@/components/widgets/ModuleSelection';
import { useModuleManagement } from '@/lib/useModuleManagement';
import { Card } from '../ui/card';
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
    <Card className="mx-4 gap-2 rounded-2xl border border-border/40 bg-card/80 p-5">
      <ModuleSelection
        activeModules={activeModules}
        toggleModule={toggleModule}
        isSelected={isSelected}
      />

      <Button className="mt-8 w-full" disabled={selectedCount === 0} onPress={handleSave}>
        <AppText className="font-bold text-white">Choose Tracked Habits</AppText>
      </Button>
    </Card>
  );
}
