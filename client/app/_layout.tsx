import { Stack } from 'expo-router';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';

export default function RootLayout() {
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
