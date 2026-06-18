import { useOnboarding } from '@/lib/onboarding/useOnboarding';

import { AccountCreationStep } from '@/components/onboarding/AccountCreationStep';
import ModuleConfigStep from '@/components/onboarding/ModuleConfigStep';
import ModuleSelectionStep from '@/components/onboarding/ModuleSelectionStep';
import { PetSelectionStep } from '@/components/onboarding/PetSelectionStep';
import { PetNamingStep } from '@/components/onboarding/PetNamingStep';

import { ImageBackground } from 'expo-image';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function Onboarding() {
  const { step, nextStep, previousStep } = useOnboarding();

  let currentStep;

  switch (step) {
    case 'pet-selection':
      currentStep = (
        <PetSelectionStep
          onNext={nextStep}
        />
      );
      break;

    case 'pet-naming':
      currentStep = (
        <PetNamingStep
          onNext={nextStep}
          onBack={previousStep}
        />
      );
      break;

    case 'account':
      currentStep = (
        <AccountCreationStep
          onNext={nextStep}
        />
      );
      break;

    case 'module-selection':
      currentStep = (
        <ModuleSelectionStep
          onNext={nextStep}
        />
      );
      break;

    case 'module-config':
      currentStep = (
        <ModuleConfigStep
          onNext={nextStep}
          onBack={previousStep}
        />
      );
      break;

    default:
      currentStep = null;
  }

  return (
    <ImageBackground
      source={require('@assets/background_login.png')}
      contentFit="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaProvider>
        <SafeAreaView className="size-full justify-center">
          {currentStep}
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}