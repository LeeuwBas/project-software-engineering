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
    saveSettingsServer(settings).catch(
        (error) => console.log(`saving settings to server failed, reason: ${error}`)
    );
    await setSettings(settings);
}

/**
 * Loads the settings from the server, does not await a response.
 */
export async function loadSettings() {
    const settings = await getSettings();
    useSettingsStore.getState().setStore(settings);
    loadSettingsServer().then((success) => console.log(
        success ? "collected settings from server" : "failed to collect settings from server"
    ));
}

/**
 * Updates and saves a new value to the settings.
 *
 * @param key key of the Settings interface that needs to be updated.
 * @param value new value of the setting
 */
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

/**
 * Save a new name for the pet.
 * @param petName The new name
 */
export function savePetName(petName: string) {
    updateSettings("petName", petName);
}

/**
 * Save a new name for the user, used in the quotes.
 * @param userName The new name
 */
export function saveUserName(userName: string) {
    updateSettings("userName", userName);
}

/**
 * Set a new value for the active modules.
 * @param modules the modules that are active
 */
export function setActiveModules(modules: EnabledModules) {
    updateSettings("enabledModules", modules);
}

/**
 * Retrieves the status of all modules.
 * @returns Object containing the information about the modules.
 */
export function getActiveModules(): EnabledModules {
    return useSettingsStore.getState().settings.enabledModules
}

/**
 * Toggles a specific module on and off.
 * @param module the module anme that needs to be toggled.
 */
export function toggleActiveModule<K extends keyof EnabledModules>(module: K) {
    const current = getActiveModules();
    current[module] = !current[module];
    setActiveModules(current);
}
