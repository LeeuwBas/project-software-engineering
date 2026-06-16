import PetHome from '@/components/widgets/PetHome';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { initializeApiManager, waterBridge } from '@/lib/api/APIBridge';
import { useWater } from '@/lib/api/WaterBridge';
import { useAppContext } from '@/lib/AppContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, type ReactNode } from 'react';
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

export default function App() {
  const { statsOpen, menuOpen, settingsOpen, popupOpen, changeMenu, changeSettings, changeStats } =
    useAppContext();
  const water = useWater() ?? 0;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') triggerBackup();
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    initializeApiManager().then();
  }, []);

  const triggerBackup = async () => {
    //Backup logic
  };

  function closePopup() {
    if (menuOpen) changeMenu();
    if (settingsOpen) changeSettings();
    if (statsOpen) changeStats();
  }

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  const mySteps: TourStep[] = [
    // 0. The pet
    {
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom">
          <AppText>Welcome to VirtuoPet! This is your new virtual pet!</AppText>
        </StepCard>
      ),
    },
    // 1. Center button.
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>This is where you log all your habits. Give it a try!</AppText>
        </StepCard>
      ),
    },
    // 2. Opened menu card.
    {
      placement: 'top',
      before: () =>
        new Promise<void>((resolve) => {
          if (!menuOpen) changeMenu();
          setTimeout(resolve, 80);
        }),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Here you see all the habits you can log.</AppText>
        </StepCard>
      ),
    },
    // 3. Log water button.
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        waterBridge.set(water + 1);
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Click here to log a glass of water.</AppText>
        </StepCard>
      ),
    },
    // 4. Tap center button again to close.
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        if (menuOpen) changeMenu();
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Nice! Now tap here again to close the menu.</AppText>
        </StepCard>
      ),
    },
    // 5. Stats button
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>This is where you can see your stats. Go and try it!</AppText>
        </StepCard>
      ),
    },
    // 6. Calendar view
    {
      placement: 'top',
      before: () =>
        new Promise<void>((resolve) => {
          if (!statsOpen) changeStats();
          setTimeout(resolve, 120);
        }),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>
            This is the calendar view, each block shows the goals you reached that day.
          </AppText>
        </StepCard>
      ),
    },
    // 7. Tap stats button again to close it
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        if (statsOpen) changeStats();
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Tap here again to close your stats.</AppText>
        </StepCard>
      ),
    },
    // 8. Profile settings
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>And here you'll find all of your settings.</AppText>
        </StepCard>
      ),
    },
    // 9. Final message.
    {
      onBackdropPress: ({ stop }) => stop(),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom">
          <AppText>Thank you for following the tutorial!</AppText>
        </StepCard>
      ),
    },
  ];

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

          {/*<BlurView
            pointerEvents="none"
            className={`absolute h-full w-full transition-opacity duration-300 ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
            intensity={20}
            tint="regular"
            experimentalBlurMethod="dimezisBlurView"
          />*/}
          <Toolbar />
        </LinearGradient>
      </SpotlightTourProvider>
    </SafeAreaView>
  );
}

function TutorialStarter() {
  const { start } = useSpotlightTour();
  const { menuOpen, statsOpen, settingsOpen } = useAppContext();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // only ever start the tour once
    const done = false; // TODO: replace with async storage func
    if (!done && !menuOpen && !statsOpen && !settingsOpen) {
      startedRef.current = true;
      start();
    }
  }, [menuOpen, statsOpen, settingsOpen, start]);

  return null; // Nothing to be rendered, just starts the tour because the start function needs to be called in a child component.
}

function StepCard({
  children,
  stop,
  stop_position,
}: {
  children: ReactNode;
  stop: () => void;
  stop_position?: 'top' | 'bottom';
}) {
  return (
    <>
      {stop_position === 'top' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">Skip Tutorial</AppText>
          </Button>
        </View>
      )}
      <Card className="flex max-w-[80vw] flex-col p-4">{children}</Card>
      {stop_position === 'bottom' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">Skip Tutorial</AppText>
          </Button>
        </View>
      )}
    </>
  );
}
