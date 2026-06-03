import { PortalHost } from '@rn-primitives/portal';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';

import '../global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Hello World!</Text>
        <div className="flex gap-2">
          <Button variant="outline" onPress={() => router.push('/login')}>
            Log In
          </Button>
          <Button variant="outline" onPress={() => router.push('/signup')}>
            Sign Up
          </Button>
        </div>
      </SafeAreaView>
      <PortalHost />
    </SafeAreaProvider>
  );
}
