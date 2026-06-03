import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { Button } from '@/components/reusables/button';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import WaterWidget from './components/widgets/waterWidget';

import '../global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className={styles.container}>
        <WaterWidget startValue={50} />
      </SafeAreaView>
    <PortalHost />
    </SafeAreaProvider>
  );
}



const styles = {
  container: 'items-center justify-center',
}
