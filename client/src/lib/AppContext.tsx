import { PopupConfigs } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext<PopupConfigs>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const popupOpen = statsOpen || menuOpen || settingsOpen;

  const popup: PopupConfigs = {
    popupOpen,
    menuOpen,
    changeMenu: () => setMenuOpen(!menuOpen),
    settingsOpen,
    changeSettings: () => setSettingsOpen(!settingsOpen),
    statsOpen,
    changeStats: () => setStatsOpen(!statsOpen),
  };

  return <AppContext.Provider value={popup}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
