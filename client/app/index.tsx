import PopupMenu from '@/components/widgets/PopupMenu';
import Toolbar from '@/components/widgets/toolbar';
import * as storage from '@/lib/storage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';

import '../global.css';
import {requireAuth} from "@/auth/AuthManager";


const image = {uri: "https://images.ctfassets.net/h6goo9gw1hh6/3aOPP8aNhZJm1X7iOUhMhb/143b0bacfff198cad9c7f11915cb94e5/Iwan_Nature.jpeg?w=564&h=1002&fl=progressive&q=70&fm=jpg"}


export default function App() {
  const [menuOpen, setOpen] = useState(false);
  const {water, setWater} = storage.useWater(menuOpen);

  function changeMenu() {
    setOpen(!menuOpen)
  }


  return requireAuth(
    <SafeAreaProvider>
      <SafeAreaView className='h-full'>
        <ImageBackground className='h-full bg-contain' source={image}>
          <BlurView className={`absolute h-full w-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={60} tint='default' experimentalBlurMethod='dimezisBlurView'/>
          <View className='mt-auto left-0 right-0 items-center z-50' >
            <View className='relative items-center w-full'>
              <View className={`transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                <PopupMenu isOpen={menuOpen} water={water} setWater={setWater}></PopupMenu>
              </View>
              <Toolbar setMenuOpen={changeMenu} menuOpen={menuOpen}></Toolbar>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
