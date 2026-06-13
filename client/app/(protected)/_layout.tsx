import RequireAuth from "@/components/auth/RequireAuth";
import { AppProvider } from '@/lib/AppContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
  return (
    <RequireAuth>
      <AppProvider>
        <Slot />
      </AppProvider>
    </RequireAuth>
  );
}
