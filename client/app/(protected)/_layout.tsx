import RequireAuth from '@/components/auth/RequireAuth';
import { AppProvider } from '@/lib/AppContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
  return (
    <RequireAuth href={'/pet-select'}>
      <AppProvider>
        <Slot />
      </AppProvider>
    </RequireAuth>
  );
}
