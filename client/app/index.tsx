import Sidebar from '@/components/widgets/Sidebar';
import Tamagotchi from '@/components/widgets/Tamagotchi';
import Toolbar from '@/components/widgets/toolbar';
import { BlurView } from 'expo-blur';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })

  const [menuOpen, setOpen] = useState(false)

  // Show or hide menu depending on if menu is already open
  function changeMenu() {
    setOpen(!menuOpen)
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex flex-col size-full'>

        <View className="flex flex-row items-center">
          <View className='ml-5'>
            <Text className=' text-2xl font-bold'>{day}</Text>
          </View>

          <View className='ml-auto flex-row gap-2 mr-10'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Heart key={index} fill={"#FF0000"} />
            ))}
          </View>
        </View>

        <View className="flex-row flex-1">
          <View className="w-5">
            <Sidebar value={30}/>
          </View>

          <View className="flex-1 justify-center">
            <Tamagotchi />
          </View>

          <View className="w-5">
            <Sidebar value={50}/>
          </View>
        </View>

        {/* The blur that appears when popup menu is opened */}
        <BlurView className={`absolute w-full h-full transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' }`} intensity={40} tint='regular' experimentalBlurMethod='dimezisBlurView'/>
        <View className="w-full mt-auto z-20">
          <Toolbar menuOpen={menuOpen} changeMenu={changeMenu} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


