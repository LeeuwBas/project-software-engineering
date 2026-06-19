import { create } from 'zustand';
import { getSettings, setSettings, Settings, createSettings } from '@/lib/storage';

type SettingsStore = {
    settings: Settings;
    setStore: (settings: Settings) => void;
};

const useSettingsStore = create<SettingsStore>((set) => ({
    settings: createSettings(),
    setStore: (settings) => set({ settings }),
}));

export async function loadSettings() {
    const settings = await getSettings();
    useSettingsStore.getState().setStore(settings);
}

async function setTutorialDone() {
    const current = useSettingsStore.getState().settings;
    current["hasDoneTutorial"] = true;
    useSettingsStore.getState().setStore(current);
    await setSettings(current);
}

async function resetTutorial() {
    const current = useSettingsStore.getState().settings;
    current["hasDoneTutorial"] = true;
    useSettingsStore.getState().setStore(current);
    await setSettings(current);
}

export function useTutorial() {
    const done = useSettingsStore((s) => s.settings["hasDoneTutorial"]);
    return { done, setTutorialDone, resetTutorial };
}
