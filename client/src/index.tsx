import Toolbar from '@/components/widgets/toolbar';
import { PortalHost } from '@rn-primitives/portal';
import { ImageBackground, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import PopupMenu from '@/components/widgets/PopupMenu';
import { BlurView } from 'expo-blur';

import '../global.css';


const image = {uri: "https://images.ctfassets.net/h6goo9gw1hh6/3aOPP8aNhZJm1X7iOUhMhb/143b0bacfff198cad9c7f11915cb94e5/Iwan_Nature.jpeg?w=564&h=1002&fl=progressive&q=70&fm=jpg"}


export default function App() {
  const [menuOpen, setOpen] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full'>
      <ImageBackground className='h-full bg-contain' source={image}>
          <BlurView className={` w-full h-full ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={60} tint='default' experimentalBlurMethod='dimezisBlurView'/>

          <View className='absolute bottom-20 left-0 right-0 items-center z-50' >


            <View className='relative items-center w-full'>
              <PopupMenu isOpen={menuOpen}></PopupMenu>

              <Button className='w-1/2' onPress={() => (menuOpen ? setOpen(false) : setOpen(true))}>
                <Text className='text-white'>TEST</Text>
              </Button>
            </View>
          </View>
      </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
