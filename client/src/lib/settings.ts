import { create } from 'zustand';
import { getSettings, setSettings, Settings, createSettings, EnabledModules } from '@/lib/storage';
import { getAPI, postAPI } from './api/ApiManager';

type SettingsStore = {
    settings: Settings;
    setStore: (settings: Settings) => void;
};

const useSettingsStore = create<SettingsStore>((set) => ({
    settings: createSettings(),
    setStore: (settings) => set({ settings }),
}));

/**
 * Loads the server's settings state. Assumes that it is up to date, so overwrites the local settings page.
 *
 * @returns boolean signalling if the operation was a success
 */
export async function loadSettingsServer() {
    const res = await getAPI("/users/settings");
    if (res === null) {
        return false;
    }

    const b64Settings = res["settings"];
    const settings: Settings = JSON.parse(atob(b64Settings));

    setSettings(settings);
    return true;
}

/**
 * Saves the current locally stored settings to the server.
 *
 * @param [settings=null] settings to save to the server, if not provided will store what is on local storage.
 */
async function saveSettingsServer(settings: Settings | null = null) {
    if (settings === null) {
        settings = await getSettings();
    }

    const b64Settings = btoa(JSON.stringify(settings));
    postAPI("/users/settings", {settings: b64Settings});
}

/**
 * Stores settings to local storage and to the server database
 *
 * @param settings new settings to store
 */
async function setSyncSettings(settings: Settings) {
    try {
        saveSettingsServer(settings);
    } catch (error) {
        console.log(`saving settings to server failed, reason: ${error}`);
    }
    await setSettings(settings);
}

export async function loadSettings() {
    const settings = await getSettings();
    useSettingsStore.getState().setStore(settings);
    loadSettingsServer().then((success) => console.log(
        success ? "collected settings from server" : "failed to collect settings from server"
    ));
}

async function updateSettings<K extends keyof Settings>(key: K, value: Settings[K]) {
    console.log(`saving new value for setting ${key}: ${value}`);
    const current = useSettingsStore.getState().settings;
    current[key] = value;
    useSettingsStore.getState().setStore(current);
    await setSyncSettings(current)
}

async function setTutorialDone() {
    updateSettings("hasDoneTutorial", true);
}

async function resetTutorial() {
    //TODO reset also true?
    updateSettings("hasDoneTutorial", true);
}

export function useTutorial() {
    const done = useSettingsStore((s) => s.settings.hasDoneTutorial);
    return { done, setTutorialDone, resetTutorial };
}

export function savePetName(petName: string) {
    updateSettings("petName", petName);
}

export function saveUserName(userName: string) {
    updateSettings("userName", userName);
}

export function setActiveModules(modules: EnabledModules) {
    updateSettings("enabledModules", modules);
}

export function getActiveModules() {
    return useSettingsStore.getState().settings.enabledModules
}
