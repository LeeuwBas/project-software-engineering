import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text className="font-bold">Bold</Text>
        <Text className="text-white bg-black">White</Text>
        <Text className="text-red-500">Red</Text>
      </SafeAreaView>
    <PortalHost />
    </SafeAreaProvider>
  );
}
