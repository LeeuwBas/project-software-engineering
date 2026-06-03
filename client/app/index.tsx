import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Hello World!</Text>
      </SafeAreaView>
      <PortalHost />
    </SafeAreaProvider>
  );
}
