import { getSettings, setSettings, Settings } from '@/lib/storage';
import { create } from 'zustand';

type SettingsStore = {
    settings: Settings;
    setStore: (settings: Settings) => void;
};

const useSettingsStore = create<SettingsStore>((set) => ({
    settings: { chosenPet: '', has_done_tutorial: false },
    setStore: (settings) => set({ settings }),
}));

export async function loadSettings() {
    const settings = await getSettings();
    useSettingsStore.getState().setStore(settings);
}

async function setTutorialDone() {
    const current = useSettingsStore.getState().settings;
    const updated = { ...current, has_done_tutorial: true };
    useSettingsStore.getState().setStore(updated);
    await setSettings(updated);
}

async function resetTutorial() {
    const current = useSettingsStore.getState().settings;
    const updated = { ...current, has_done_tutorial: false };
    useSettingsStore.getState().setStore(updated);
    await setSettings(updated);
}

export function useTutorial() {
    const done = useSettingsStore((s) => s.settings.has_done_tutorial);
    return { done, setTutorialDone, resetTutorial };
}

export function savePetName(petName: string) {
    console.log(`not yet implemented, but ${petName} is a good name`);
}

export function saveUserName(userName: string) {
    console.log(`not yet implemented, but ${userName} is an okay name`);
}

export function setActiveModules(modules: any) {
    console.log(`you selected ${modules}`);
}

export function getActiveModules() {
    return {
        stress: true,
        water: true,
        steps: true, // step counter is scary
        sleep: true,
        food: true,
    };
}
