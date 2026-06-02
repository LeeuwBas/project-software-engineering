import Toolbar from '@/components/widgets/toolbar';
import { PortalHost } from '@rn-primitives/portal';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  const [water, setWater] = useState(10)

  function click() {
    if (water < 100) {
      setWater(water+10);
    }
  }

  function resetWater() {
    setWater(0);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className='bg-yellow-200 h-full'>
        {/* <WaterWidget startValue={50} /> */}
        <Toolbar />
      </SafeAreaView>
    <PortalHost />
    </SafeAreaProvider>
  );
}

