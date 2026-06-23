import { PopupConfigs } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext<PopupConfigs>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [stressMenuOpen, setStressMenuOpen] = useState(false);
  const popupOpen = statsOpen || menuOpen || settingsOpen || stressMenuOpen;
  const [sendStress, setSendStress] = useState<() => void>(() => () => {});

  const popup: PopupConfigs = {
    popupOpen,
    menuOpen,
    changeMenu: () => setMenuOpen(!menuOpen),
    settingsOpen,
    changeSettings: () => setSettingsOpen(!settingsOpen),
    statsOpen,
    changeStats: () => setStatsOpen(!statsOpen),
    stressMenuOpen,
    changeStressMenu: () => setStressMenuOpen(!stressMenuOpen),
    sendStress,
    setSendStress,
  };

  return <AppContext.Provider value={popup}>{children}</AppContext.Provider>;
}

/** TODO (buenk, ZJWeng, hfgieter) docstring, also can we put this above the function since it's the default export?
 * This one is pretty important, also {@link PopupConfigs} in it. Make sure both docstrings for this and PopupConfigs
 * are well made, they're pretty important.
 */
export const useAppContext = () => useContext(AppContext);
