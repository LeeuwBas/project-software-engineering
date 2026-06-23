import { AuthProvider } from '@/lib/auth/AuthManager';
import { loadSettings } from '@/lib/settings';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

import '../global.css';

/**TODO (buenk): docstring, this file is already pretty well comented so explain the main purpose */
export default function RootLayout() {
  const [loaded] = useFonts({
    IosevkaCharon: require('@assets/fonts/IosevkaCharon-Regular.ttf'),
    'IosevkaCharon-Bold': require('@assets/fonts/IosevkaCharon-Bold.ttf'),
  });
  // const system = useColorScheme(); // This is the REACT NATIVE hook, but there's also a nativewind hook. nice :(
  useEffect(() => {
    colorScheme.set('light'); // Temporarily forcing light mode
  }, []);

  useEffect(() => {
    const healthConnectAvailable = Constants.executionEnvironment !== 'storeClient';
    if (!healthConnectAvailable) return;

    const setup = async () => {
      try {
        const status = await getSdkStatus();
        if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) return;

        const initialized = await initialize();
        if (!initialized) return;

        await requestPermission([{ accessType: 'read', recordType: 'Steps' }]);
      } catch (e) {
        console.error('Health Connect setup failed:', e);
      }
    };
    setup();
  }, []);

  if (!loaded) return null;

  return (
    // PetProvider provides components with pet id so pet selection and homepage are in sync.
    // Gesture handler wrapper to handle toasts using sonner library.
    // Toasts are 'pop-ups' that you can use after some action fails or succeeds.
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toaster />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

configureReanimatedLogger({ strict: false });
