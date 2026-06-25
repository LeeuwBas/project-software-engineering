import RequireAuth from '@/components/auth/RequireAuth';
import { AppProvider } from '@/lib/AppContext';
import {
  setMorningNotification,
  setSleepNotification,
  setWaterNotifaction,
} from '@/lib/notificationSetter';
import { getActiveModules } from '@/lib/settings';
import { Slot } from 'expo-router';
import { useEffect } from 'react';

// TODO (buenk) docstring
export default function AppLayout() {
  const activeModules = getActiveModules();
  console.log(activeModules);

  useEffect(() => {
    if (activeModules['water']) {
      setWaterNotifaction();
    }
    if (activeModules['sleep']) {
      setSleepNotification();
    }
    setMorningNotification();
  }, []);

  return (
    <RequireAuth>
      <AppProvider>
        <Slot />
      </AppProvider>
    </RequireAuth>
  );
}
