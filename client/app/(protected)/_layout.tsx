import RequireAuth from '@/components/auth/RequireAuth';
import { AppProvider } from '@/lib/AppContext';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { setMorningNotification, setSleepNotification, setWaterNotifaction } from '@/lib/notificationSetter';
import { getActiveModules } from '@/lib/settings';
import Module from '@/components/widgets/Module';
import { ModuleId, MODULES } from '@/lib/types';

export default function AppLayout() {
  

  const activeModules = getActiveModules()
  console.log(activeModules)

  useEffect(() => {
    if (activeModules['water']) {
      setWaterNotifaction();
    }
    if (activeModules['sleep']) {
      setSleepNotification();
    }
    setMorningNotification();
  }, [])

  return (
    <RequireAuth>
      <AppProvider>
        <Slot />
      </AppProvider>
    </RequireAuth>
  );
}
