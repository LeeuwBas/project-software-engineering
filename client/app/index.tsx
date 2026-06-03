import Main from '@/components/widgets/mainview';
import ProfilePopup from '@/components/widgets/ProfilePopup';
import Toolbar from '@/components/widgets/toolbar';
<<<<<<< HEAD
import Topbar from '@/components/widgets/topbar';
import * as storage from '@/lib/storage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
=======
import { useState, useEffect } from 'react'
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Tamagotchi from '@/components/widgets/Tamagotchi';
import { BlurView } from 'expo-blur'
import { Heart } from 'lucide-react-native';
>>>>>>> 5422130 (homepage additions: happiness hearts and day of the week)

import '../global.css';

export default function App() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })

  const [menuOpen, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false);
  const {water, setWater} = storage.useWater(menuOpen);

  // Show or hide menu depending on if menu is already open
  function changeMenu() {
    setOpen(!menuOpen)
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex flex-col size-full'>
        <Topbar />

        <Main leftSideStat='water' leftSideValue={water} rightSideStat='none' rightSideValue={0}/>

        {/* The blur that appears when popup menu is opened */}
        <BlurView className={`absolute w-full h-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={40} tint='regular' experimentalBlurMethod='dimezisBlurView'/>

        <Toolbar menuOpen={menuOpen} changeMenu={changeMenu} onProfileOpen={() => setProfileOpen(true)} water={water} setWater={setWater}/>
      <ProfilePopup open={profileOpen} setOpen={setProfileOpen} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}


