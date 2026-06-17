import PetHome from '@/components/widgets/PetHome';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { initializeApiManager, waterBridge } from '@/lib/api/APIBridge';
import { useWater } from '@/lib/api/WaterBridge';
import { useAppContext } from '@/lib/AppContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useMemo, type ReactNode } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AttachStep,
  SpotlightTourProvider,
  TourStep,
  useSpotlightTour,
} from 'react-native-spotlight-tour';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/lib/settings';
import { createTutorialSteps } from '@/components/tutorial/tutorial-steps';
import { syncServer } from '@/lib/StorageSync';
import { flushCache, nextTimer, scheduleCacheFlush } from '@/lib/timers';

export default function App() {
  const water = useWater() ?? 0;
  const {
    statsOpen,
    menuOpen,
    settingsOpen,
    popupOpen,
    changeMenu,
    changeSettings,
    changeStats,
    stressMenuOpen,
    changeStressMenu
  } = useAppContext();

  
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') triggerBackup();
      if (nextAppState === 'active') {
        if (nextTimer.getDay() == (new Date()).getDay()) {
          flushCache();
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    initializeApiManager().then();
    scheduleCacheFlush();
  }, []);

  const triggerBackup = async () => {
    await syncServer(true);
  };

  const { done, setTutorialDone } = useTutorial();

  function closePopup() {
    setTutorialDone();
    if (menuOpen) changeMenu();
    if (settingsOpen) changeSettings();
    if (statsOpen) changeStats();
    if (stressMenuOpen) changeStressMenu();
  }

  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  const mySteps = useMemo(
    () =>
      createTutorialSteps({
        menuOpen,
        statsOpen,
        changeMenu,
        changeStats,
        water,
      }),
    [menuOpen, statsOpen, changeMenu, changeStats, water]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SpotlightTourProvider
        steps={mySteps}
        overlayColor="black"
        overlayOpacity={0.6}
        onBackdropPress="continue"
        onStop={closePopup}
        motion="fade"
        placement="bottom"
        offset={8}
        flip
        shift
        shape="rectangle">
        <TutorialStarter />
        <LinearGradient
          colors={
            dark
              ? ['#34504f', '#34504f', '#26403f', '#26403f'] // dark mode
              : ['#e9f1ec', '#e9f1ec', '#c7d0bd', '#c7d0bd'] // light mode
          }
          locations={[0, 0.5, 0.5, 1]}
          className="flex flex-col"
          style={{ flex: 1 }}>
          {popupOpen && <Pressable className="absolute inset-0 z-10" onPress={closePopup} />}

          <View className="flex-1 p-4">
            <Topbar />

            <View className="flex-1 justify-center">
              <AttachStep index={0} fill>
                <AttachStep index={9} fill>
                  <PetHome />
                </AttachStep>
              </AttachStep>
            </View>
          </View>

          {done && (
            <BlurView
              pointerEvents="none"
              className={`absolute h-full w-full transition-opacity duration-300 ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
              intensity={20}
              tint="regular"
              experimentalBlurMethod="dimezisBlurView"
            />
          )}
          <Toolbar />
        </LinearGradient>
      </SpotlightTourProvider>
    </SafeAreaView>
  );
}

function TutorialStarter() {
  const { start } = useSpotlightTour();
  const { menuOpen, statsOpen, settingsOpen } = useAppContext();
  const { done } = useTutorial();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // only ever start the tour once
    if (!done && !menuOpen && !statsOpen && !settingsOpen) {
      startedRef.current = true;
      start();
    }
  }, [menuOpen, statsOpen, settingsOpen, start, done]);

  return null; // Nothing to be rendered, just starts the tour because the start function needs to be called in a child component.
}
