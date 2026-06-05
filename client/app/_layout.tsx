import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { Toaster } from 'sonner-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    IosevkaCharon: require('../assets/fonts/IosevkaCharon-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    // Gesture handler wrapper to handle toasts using sonner library.
    // Toasts are 'pop-ups' that you can use after some action fails or succeeds.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toaster />
    </GestureHandlerRootView>
  );
}

configureReanimatedLogger({
  strict: false,
});
