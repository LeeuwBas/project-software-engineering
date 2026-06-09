import { requireAuth } from '@/auth/AuthManager';
import { AppProvider, useAppContext } from '@/lib/AppContext';
import Toolbar from '@/components/widgets/toolbar';
import { Slot } from 'expo-router';
import { View } from 'react-native';

function Layout() {
  const { popup, water, saveWater } = useAppContext();
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <Toolbar popup={popup} water={water} saveWater={saveWater} />
    </View>
  );
}

export default function AppLayout() {
  return requireAuth(
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
