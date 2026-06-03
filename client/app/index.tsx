import Toolbar from '@/components/widgets/toolbar';
import { useState, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Tamagotchi from '@/components/widgets/Tamagotchi';
import { BlurView } from 'expo-blur'

import '../global.css';

export default function App() {


  const [menuOpen, setOpen] = useState(false)

  // Show or hide menu depending on if menu is already open
  function changeMenu() {
    setOpen(!menuOpen)
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full w-full'>
        <Tamagotchi />

        {/* The blur that appears when popup menu is opened */}
        <BlurView className={`absolute w-full h-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={60} tint='default' experimentalBlurMethod='dimezisBlurView'/>
        <Toolbar menuOpen={menuOpen} changeMenu={changeMenu} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


