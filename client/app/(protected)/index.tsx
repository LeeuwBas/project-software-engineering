import { renderFinalStep, renderPetStep } from '@/components/tutorial/tutorial-steps';
import PetHome from '@/components/widgets/PetHome';
import Quotes from '@/components/widgets/Quotes';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { initializeApiManager } from '@/lib/api/APIBridge';
import { useAppContext } from '@/lib/AppContext';
import { loadSettings, useTutorial } from '@/lib/settings';
import { syncServer } from '@/lib/StorageSync';
import { flushCache, nextTimer, scheduleCacheFlush } from '@/lib/timers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TourProvider, TourZone, useTour } from 'react-native-lumen';

export default function App() {
  const {
    statsOpen,
    menuOpen,
    settingsOpen,
    popupOpen,
    changeMenu,
    changeSettings,
    changeStats,
    stressMenuOpen,
    changeStressMenu,
  } = useAppContext();

  // TODO (buenk): comment
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Adds event listeners for changing of app state.
    // Back up all data when the app goes to the background.
    // Check if caches need to be flushed when reopening the app.
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') triggerBackup();
      if (nextAppState === 'active') {
        if (nextTimer.getDay() == new Date().getDay()) {
          flushCache();
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // Initialize api manager, settings, and make sure caches get invalidated after midnight.
  useEffect(() => {
    initializeApiManager().then();
    loadSettings().then();
    scheduleCacheFlush();
  }, []);

  const triggerBackup = async () => {
    await syncServer(true);
  };

  // Close any open popups
  function closePopup() {
    if (menuOpen) changeMenu();
    if (settingsOpen) changeSettings();
    if (statsOpen) changeStats();
    if (stressMenuOpen) changeStressMenu();
  }

  // Hook for dark mode boolean
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  // Used with onFormat to detect where and how large the pet renders to determine the safe area to render quotes
  const [petHomeLayout, setPetHomeLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [topBarLayout, setTopBarLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  /* TODO (buenk): summary of the structure, like what the SafeAreaView, TourProvider, and LinearGradient
  are for/ what they contain.*/
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TourProvider
        stepsOrder={['pet', 'menu-button', 'stats-button', 'settings-button', 'final']}
        backdropOpacity={0.6}
        config={{ tooltipStyles: { backgroundColor: 'transparent' } }}>
        <TutorialStarter />
        {/** Homepage component container: {@link Topbar}, {@link PetHome}, {@link Quotes}, {@link Toolbar} */}
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
            <View
              onLayout={
                /* Used to determine where the bottom of the Topbar is */
                (e) => setTopBarLayout(e.nativeEvent.layout)
              }>
              <Topbar />
            </View>
            <View className="flex-1 items-center justify-center">
              <View
                className="flex-grow-0"
                onLayout={
                  /* Used to determine where the top of the PetHome is, since flex-grow-0 shrinks to fit */
                  (e) => setPetHomeLayout(e.nativeEvent.layout)
                }>
                {/* TODO (buenk): what are these? */}
                <TourZone stepKey="pet" description="Welcome to VirtuoPet! This is your new virtual pet!" renderCustomCard={renderPetStep}>
                  <TourZone stepKey="final" description="Thank you for following the tutorial!" renderCustomCard={renderFinalStep}>
                    <PetHome />
                  </TourZone>
                </TourZone>
              </View>
            </View>
            <Quotes petHomeLayout={petHomeLayout} topBarLayout={topBarLayout} />
          </View>

          <BlurView
            pointerEvents="none"
            className={`absolute h-full w-full transition-opacity duration-300 ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: 9 }}
            intensity={20}
            tint="regular"
            experimentalBlurMethod="dimezisBlurView"
          />

          <Toolbar />
        </LinearGradient>
      </TourProvider>
    </SafeAreaView>
  );
}

// TODO (buenk): comment, but also this component really should be moved to a new component file alongside mySteps
// and the SpotlightTourProvider
function TutorialStarter() {
  const { start, currentStep } = useTour();
  const { menuOpen, statsOpen, settingsOpen, changeMenu, changeSettings, changeStats, stressMenuOpen, changeStressMenu } = useAppContext();
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
