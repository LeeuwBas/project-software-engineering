import * as storage from '@/lib/storage';
import { PopupConfigs } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type AppContextType = {
  popup: PopupConfigs;
  popupOpen: boolean;
};

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const popup: PopupConfigs = {
    menuOpen,
    changeMenu: () => setMenuOpen(!menuOpen),
    settingsOpen,
    changeSettings: () => setSettingsOpen(!settingsOpen),
  };

  return (
    <AppContext.Provider value={{ popup, popupOpen: menuOpen || settingsOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
