import { PetProvider } from '@/components/contexts/PetContext';
import { AuthProvider } from '@/lib/auth/AuthManager';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { loadSettings } from '@/lib/settings';
import '../global.css';

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
    loadSettings();
  }, []);

  if (!loaded) return null;

  return (
    // PetProvider provides components with pet id so pet selection and homepage are in sync.
    // Gesture handler wrapper to handle toasts using sonner library.
    // Toasts are 'pop-ups' that you can use after some action fails or succeeds.
    <AuthProvider>
      <PetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toaster />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PetProvider>
    </AuthProvider>
  );
}

configureReanimatedLogger({ strict: false });
