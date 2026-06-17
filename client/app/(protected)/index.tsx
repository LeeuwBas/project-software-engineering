import QuoteBubble from '@/components/quotes/QuoteBubble';
import PetHome from '@/components/widgets/PetHome';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { initializeApiManager } from '@/lib/api/APIBridge';
import { useAppContext } from '@/lib/AppContext';
import { syncServer } from '@/lib/StorageSync';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const { statsOpen, menuOpen, settingsOpen, popupOpen, changeMenu, changeSettings, changeStats } =
    useAppContext();
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
    await syncServer(true);
  };

  function closePopup() {
    if (menuOpen) changeMenu();
    if (settingsOpen) changeSettings();
    if (statsOpen) changeStats();
  }

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  const [petHomeLayout, setPetHomeLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [topBarLayout, setTopBarLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <View onLayout={(e) => setTopBarLayout(e.nativeEvent.layout)}>
            <Topbar />
          </View>
          <View
            className="flex-1 justify-center"
            onLayout={(e) => setPetHomeLayout(e.nativeEvent.layout)}>
            <PetHome />
          </View>
          <QuoteBubble petHomeLayout={petHomeLayout}, topBarLayout={topBarLayout} />
        </View>

        <BlurView
          pointerEvents="none"
          className={`absolute h-full w-full transition-opacity duration-300 ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
          intensity={20}
          tint="regular"
          experimentalBlurMethod="dimezisBlurView"
        />
        <Toolbar />
      </LinearGradient>
    </SafeAreaView>
  );
}
