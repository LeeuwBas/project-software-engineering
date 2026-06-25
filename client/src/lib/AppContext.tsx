import { PopupConfigs } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext<PopupConfigs>(null!);

/**
 * Function for using the app context, which contain popup state functions
 * for opening and closing popups {@link PopupConfigs}
 * Also contains state of sendStress function that is called when stress is submitted.
 *
 * @returns popup and sendStress state functions
 */
export const useAppContext = () => useContext(AppContext);

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

/**
 * Hook for accessing the global popup state provided by {@link AppProvider}.
 *
 * Returns a {@link PopupConfigs} object with open/close state and toggle
 * callback funcs for every overlay in the app.
 * Must be called as a child of {@link AppProvider}.
 *
 * @returns The current {@link PopupConfigs} context value.
 *
 * @example
 * const { settingsOpen, changeSettings } = useAppContext();
 */
export const useAppContext = () => useContext(AppContext);
