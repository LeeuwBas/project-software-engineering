import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import WaterWidget from '@/components/widgets/waterWidget';
import Toolbar from '@/components/widgets/toolbar';

import '../global.css';

export default function App() {
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

