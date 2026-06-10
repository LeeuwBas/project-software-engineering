import { AuthProvider } from '@/lib/auth/AuthManager';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    'IosevkaCharon': require('../assets/fonts/IosevkaCharon-Regular.ttf'),
    'IosevkaCharon-Bold': require('../assets/fonts/IosevkaCharon-Bold.ttf'),
  });
  if (!loaded) return null;

  return (
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
