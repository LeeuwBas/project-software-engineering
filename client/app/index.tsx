import Main from '@/components/widgets/mainview';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import * as storage from '@/lib/storage';
import { PopupConfigs } from '@/lib/types';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {water, saveWater} = storage.useWater(menuOpen);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        triggerBackup();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const triggerBackup = async () => {
    //Backup logic
  };

  function changeMenu() {
    setMenuOpen(!menuOpen)
  };
  
  function changeSettings() {
    setSettingsOpen(!settingsOpen)
  };

  function closePopup() {
    if (popup.menuOpen) setMenuOpen(false)
    if (popup.settingsOpen) setSettingsOpen(false)
  }

  const popup: PopupConfigs = {
    menuOpen: menuOpen,
    changeMenu: changeMenu,
    settingsOpen: settingsOpen,
    changeSettings: changeSettings
  }

  const popupOpen = menuOpen || settingsOpen

  return (
    <SafeAreaProvider>
      <SafeAreaView className='bg-[#74c6b6]/85'>
        <View className='flex flex-col size-full bg-[#74c6b6]/30'>
          <Pressable className='absolute inset-0 size-full z-10' onPress={closePopup}/>
          
          <Topbar />

          <Main leftSideStat='water' leftSideValue={water} rightSideStat='none' rightSideValue={0}/>

          {/* The blur that appears when popup menu is opened */}
          <BlurView className={`absolute w-full h-full transition-opacity duration-300 ${ popupOpen ? 'opacity-100' : 'opacity-0' }`} intensity={40} tint='regular' experimentalBlurMethod='dimezisBlurView'/>

          <Toolbar
            popup={popup}
            water={water}
            saveWater={saveWater}
            />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
