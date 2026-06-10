import Main from '@/components/widgets/mainview';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import { useAppContext } from '@/lib/AppContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {initializeApiManager} from "@/lib/api/APIBridge";
import {useWater} from "@/lib/api/WaterBridge";

export default function App() {
  const { popup, popupOpen } = useAppContext();
  const appState = useRef(AppState.currentState);
  const water = useWater() ?? 0

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') triggerBackup();
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    initializeApiManager().then()
  }, []);

  const triggerBackup = async () => {
    //Backup logic
  };

  function closePopup() {
    if (popup.menuOpen) popup.changeMenu();
    if (popup.settingsOpen) popup.changeSettings();
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#e9f1ec', '#e9f1ec', '#c7d0bd', '#c7d0bd']}
        locations={[0, 0.5, 0.5, 1]}
        className="flex flex-1 flex-col">
        <Pressable className="absolute inset-0 z-10 size-full" onPress={closePopup} />

        <View className="flex-1 p-4">
          <Topbar />

          <Main leftSideStat="water" leftSideValue={water} rightSideStat="none" rightSideValue={0} />
        </View>

        <BlurView
          className={`absolute h-full w-full transition-opacity duration-300 ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
          intensity={40}
          tint="regular"
          experimentalBlurMethod="dimezisBlurView"
        />
        <Toolbar popup={popup} />
      </LinearGradient>
    </SafeAreaView>
  );
}
