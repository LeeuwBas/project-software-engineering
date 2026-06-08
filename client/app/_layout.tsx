import { Stack } from 'expo-router';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import {AuthProvider} from "@/auth/AuthManager";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [loaded] = useFonts({
    'IosevkaCharon': require('../assets/fonts/IosevkaCharon-Regular.ttf'),
    'IosevkaCharon-Bold': require('../assets/fonts/IosevkaCharon-Bold.ttf')
  });
  if (!loaded) return null;

  return (
    // Gesture handler wrapper to handle toasts using sonner library.
    // Toasts are 'pop-ups' that you can use after some action fails or succeeds.
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toaster />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

configureReanimatedLogger({
  strict: false,
});
