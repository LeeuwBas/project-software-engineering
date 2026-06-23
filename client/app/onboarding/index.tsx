import { useOnboarding } from '@/lib/onboarding/useOnboarding';

import { AccountCreationStep } from '@/components/onboarding/AccountCreationStep';
import ModuleConfigStep from '@/components/onboarding/ModuleConfigStep';
import ModuleSelectionStep from '@/components/onboarding/ModuleSelectionStep';
import { PetNamingStep } from '@/components/onboarding/PetNamingStep';
import { PetSelectionStep } from '@/components/onboarding/PetSelectionStep';

import { ImageBackground } from 'expo-image';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/**
 * Owns the onboarding page,
 * loads in widgets based on what step of the onboarding process the user is on.
 * Background of the onboarding page is owned by this function too.
 * @return {React.JSX.Element} Onboarding widget
 */
export default function Onboarding() {
  const { step, nextStep, previousStep } = useOnboarding();

  let currentStep;

  switch (step) {
    case 'pet-selection':
      currentStep = <PetSelectionStep onNext={nextStep} />;
      break;

    case 'pet-naming':
      currentStep = <PetNamingStep onNext={nextStep} onBack={previousStep} />;
      break;

    case 'account':
      currentStep = <AccountCreationStep onNext={nextStep} />;
      break;

    case 'module-selection':
      currentStep = <ModuleSelectionStep onNext={nextStep} />;
      break;

    case 'module-config':
      currentStep = <ModuleConfigStep onBack={previousStep} />;
      break;

    default:
      currentStep = null;
  }

  return (
    <ImageBackground
      source={require('@assets/background_login.png')}
      contentFit="cover"
      style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView className="size-full justify-center">{currentStep}</SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
