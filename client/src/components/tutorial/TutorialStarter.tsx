import { useAppContext } from '@/lib/AppContext';
import { useTutorial } from '@/lib/settings';
import { useEffect, useRef } from 'react';
import { useTour } from 'react-native-lumen';

/**
 * Starts the tutorial tour when the app is first loaded and the user has not
 * completed it yet.
 */
export default function TutorialStarter() {
  const { start, currentStep } = useTour();
  const {
    menuOpen,
    statsOpen,
    settingsOpen,
    changeMenu,
    changeSettings,
    changeStats,
    stressMenuOpen,
    changeStressMenu,
  } = useAppContext();
  const { done, setTutorialDone } = useTutorial();
  const prevStep = useRef<string | null>(null);

  useEffect(() => {
    if (prevStep.current !== null && currentStep === null) {
      if (menuOpen) changeMenu();
      if (settingsOpen) changeSettings();
      if (statsOpen) changeStats();
      if (stressMenuOpen) changeStressMenu();
    }
    prevStep.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (done === false && !menuOpen && !statsOpen && !settingsOpen) {
      setTutorialDone();
      start();
    }
  }, [menuOpen, statsOpen, settingsOpen, start, done]);

  return null; // Nothing to be rendered, just starts the tour because the start function needs to be called in a child component.
}
