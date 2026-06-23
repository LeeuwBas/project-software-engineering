import { OnboardingStep } from '@/lib/onboarding/types';
import { useState } from 'react';

const STEP_ORDER: OnboardingStep[] = [
    'pet-selection',
    'pet-naming',
    'module-selection',
    'module-config',
    'account',
];

/** TODO (AlexAugustijn): docstring */
export function useOnboarding() {
    const [step, setStep] = useState<OnboardingStep>('pet-selection');

    function nextStep() {
        const currentIndex = STEP_ORDER.indexOf(step);

        if (currentIndex < STEP_ORDER.length - 1) {
            setStep(STEP_ORDER[currentIndex + 1]);
        }
    }

    function previousStep() {
        const currentIndex = STEP_ORDER.indexOf(step);

        if (currentIndex > 0) {
            setStep(STEP_ORDER[currentIndex - 1]);
        }
    }

    function goToStep(step: OnboardingStep) {
        setStep(step);
    }

    return {
        step,
        nextStep,
        previousStep,
        goToStep,
    };
}
