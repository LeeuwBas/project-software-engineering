import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { ModuleSelection } from '@/components/widgets/ModuleSelection';
import { OnboardingStep } from '@/lib/onboarding/types';
import { MODULES } from '@/lib/types';
import { useModuleManagement } from '@/lib/useModuleManagement';
import { Card } from '../ui/card';

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
    <Card className="mx-4 gap-2 p-5 shadow-none">
      <ModuleSelection
        toggleModule={toggleModule}
        isSelected={isSelected}
      />

      <Button className="mt-8 w-full" disabled={selectedCount === 0} onPress={handleSave}>
        <AppText className="font-bold text-white">Choose Tracked Habits</AppText>
      </Button>
    </Card>
  );
}
