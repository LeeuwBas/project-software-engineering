import { OnboardingStep } from '@/lib/onboarding/types';
import { useState } from 'react';

const STEP_ORDER: OnboardingStep[] = [
    'pet-selection',
    'pet-naming',
    'module-selection',
    'module-config',
    'account',
];

/** 
 * Owner of helper functions to handle the inpage routing of the Onboarding
 * 
 * @return Helper functions
 */
export function useOnboarding() {
    const [step, setStep] = useState<OnboardingStep>('pet-selection');

    /**
     * Routes to the next step in the onboarding step list
     */
    function nextStep() {
        const currentIndex = STEP_ORDER.indexOf(step);

        if (currentIndex < STEP_ORDER.length - 1) {
            setStep(STEP_ORDER[currentIndex + 1]);
        }
    }

    /**
     * Routes to the previous step in the onboarding step list
     */
    function previousStep() {
        const currentIndex = STEP_ORDER.indexOf(step);

        if (currentIndex > 0) {
            setStep(STEP_ORDER[currentIndex - 1]);
        }
    }

    /**
     * Routes to a specific step in the onboarding step list
     * 
     * @param {OnboardingStep} step - 
     *  string from the OnboardingStep types to route to
     */
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
