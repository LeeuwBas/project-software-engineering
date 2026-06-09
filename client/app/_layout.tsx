import { AuthProvider } from "@/auth/AuthManager";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    'IosevkaCharon': require('@/assets/fonts/IosevkaCharon-Regular.ttf'),
    'IosevkaCharon-Bold': require('@/assets/fonts/IosevkaCharon-Bold.ttf')
  });
  if (!loaded) return null;

  return (
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

configureReanimatedLogger({
  strict: false,
});
