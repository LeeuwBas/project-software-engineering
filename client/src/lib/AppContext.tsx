import * as storage from '@/lib/storage';
import { PopupConfigs } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type AppContextType = {
  popup: PopupConfigs;
  water: number;
  saveWater: (val: number) => void;
  popupOpen: boolean;
};

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const { water, saveWater } = storage.useWater(menuOpen);

  const popup: PopupConfigs = {
    menuOpen,
    changeMenu: () => setMenuOpen(!menuOpen),
    settingsOpen,
    changeSettings: () => setSettingsOpen(!settingsOpen),
    statsOpen,
    changeStats: () => setStatsOpen(!statsOpen),
  };

  return (
    <AppContext.Provider value={{ popup, water, saveWater, popupOpen: menuOpen || settingsOpen || statsOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
