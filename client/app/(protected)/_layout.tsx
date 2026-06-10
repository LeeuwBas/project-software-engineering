import {requireAuth} from "@/lib/auth/AuthManager";
import { AppProvider } from '@/lib/AppContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
  return requireAuth(
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
