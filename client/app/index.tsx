import Main from '@/components/widgets/mainview';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import * as storage from '@/lib/storage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })

  const [menuOpen, setOpen] = useState(false)
  const {water, setWater} = storage.useWater(menuOpen);

  // Show or hide menu depending on if menu is already open
  function changeMenu() {
    setOpen(!menuOpen)
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex flex-col size-full'>

        <Topbar />

        <Main />

        {/* The blur that appears when popup menu is opened */}
        <BlurView className={`absolute w-full h-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={40} tint='regular' experimentalBlurMethod='dimezisBlurView'/>

        <Toolbar menuOpen={menuOpen} changeMenu={changeMenu} water={water} setWater={setWater}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


