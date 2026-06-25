import { renderFinalStep, renderPetStep } from '@/components/tutorial/tutorial-steps';
import PetHome from '@/components/widgets/PetHome';
import Quotes from '@/components/widgets/Quotes';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { initializeApiManager } from '@/lib/api/APIBridge';
import { useAppContext } from '@/lib/AppContext';
import { loadSettings } from '@/lib/settings';
import { syncServer } from '@/lib/StorageSync';
import { flushCache, nextTimer, scheduleCacheFlush } from '@/lib/timers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TourProvider, TourZone, useTour } from 'react-native-lumen';

/**
 * Home screen of the app. This component combines the main layout components
 * It manages two distinct functionalities: Initializing business logic and
 * the initial spotlight tutorial.
 */
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
        config={{ preventInteraction: true, tooltipStyles: { backgroundColor: 'transparent' } }}>
        <TutorialStarter />
        {/** Homepage component container: {@link Topbar}, {@link PetHome}, {@link Quotes}, {@link Toolbar} */}

        {/* This linear gradient is a hacky-way to cover the background with
            a split-color fill. */}
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
                {/* These <TourZone> components represent steps within the
                    spotlight tutorial. */}
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
