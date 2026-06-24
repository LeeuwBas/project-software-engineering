import { useAppContext } from '@/lib/AppContext';
import { useTutorial } from '@/lib/settings';
import { useEffect } from 'react';
import { useSpotlightTour } from 'react-native-spotlight-tour';

/**
 * Starts the tutorial tour when the app is first loaded and the user has not
 * completed it yet.
 */
export default function TutorialStarter() {
  const { start } = useSpotlightTour();
  const { menuOpen, statsOpen, settingsOpen } = useAppContext();
  const { done, setTutorialDone } = useTutorial();

  useEffect(() => {
    if (done === false && !menuOpen && !statsOpen && !settingsOpen) {
      setTutorialDone();
      start();
    }
  }, [menuOpen, statsOpen, settingsOpen, start, done]);

  // Nothing to be rendered, just starts the tour because the start function
  // needs to be called in a child component.
  return null;
}
