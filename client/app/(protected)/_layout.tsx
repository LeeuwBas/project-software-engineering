import { AppProvider } from '@/lib/AppContext';
import { redirectUnlessAuth } from "@/lib/auth/AuthManager";
import { Slot } from 'expo-router';

export default function AppLayout() {
  return redirectUnlessAuth(
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
