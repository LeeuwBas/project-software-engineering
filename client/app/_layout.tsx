import { AuthProvider } from "@/auth/AuthManager";
import { PetProvider } from "@/components/contexts/PetContext";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    'IosevkaCharon': require('@/assets/fonts/IosevkaCharon-Regular.ttf'),
    'IosevkaCharon-Bold': require('@/assets/fonts/IosevkaCharon-Bold.ttf')
  });
  if (!loaded) return null;

  return (
    // PetProvider provides components with pet id so pet selection and homepage are in sync.
    // Gesture handler wrapper to handle toasts using sonner library.
    // Toasts are 'pop-ups' that you can use after some action fails or succeeds.
    <PetProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toaster />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </PetProvider>
  );
}

configureReanimatedLogger({
  strict: false,
});
