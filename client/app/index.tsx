import PopupMenu from '@/components/widgets/PopupMenu';
import ProfilePopup from '@/components/widgets/ProfilePopup';
import Toolbar from '@/components/widgets/toolbar';
import * as storage from '@/lib/storage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';


const image = {uri: "https://images.ctfassets.net/h6goo9gw1hh6/3aOPP8aNhZJm1X7iOUhMhb/143b0bacfff198cad9c7f11915cb94e5/Iwan_Nature.jpeg?w=564&h=1002&fl=progressive&q=70&fm=jpg"}


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const {water, setWater} = storage.useWater(menuOpen);

  console.log(profileOpen)

  function changeMenu() {
    setMenuOpen(!menuOpen)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full'>
        <ImageBackground className='h-full bg-contain' source={image}>
          <BlurView className={`absolute h-full w-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={60} tint='default' experimentalBlurMethod='dimezisBlurView'/>
          <ProfilePopup open={profileOpen} setOpen={setProfileOpen} />
          <View className='mt-auto left-0 right-0 items-center z-50' >
            <View className='relative items-center w-full'>
              <View className={`transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                <PopupMenu isOpen={menuOpen} water={water} setWater={setWater}></PopupMenu>
              </View>
              <Toolbar setMenuOpen={changeMenu} menuOpen={menuOpen} onProfileOpen={() => setProfileOpen(true)}></Toolbar>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
