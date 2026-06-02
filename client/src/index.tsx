import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

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
      <SafeAreaView className={styles.container}>
        <Button variant="outline" onPress={click}>
          <Text className={styles.text}>
            Drink
          </Text>
        </Button>
        <Text>
          {water}
        </Text>
        <Button variant='destructive' onPress={resetWater}>
          <Text>
            Reset
          </Text>
        </Button>
      </SafeAreaView>
    <PortalHost />
    </SafeAreaProvider>
  );
}



const styles = {
  container: 'items-center justify-center',
  button: 'bg-black',
  text: 'text-blue-500 font-bold',
}
