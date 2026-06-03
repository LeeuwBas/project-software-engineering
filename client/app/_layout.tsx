import { Stack } from 'expo-router';
import { configureReanimatedLogger } from 'react-native-reanimated';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

configureReanimatedLogger({
  strict: false,
});
