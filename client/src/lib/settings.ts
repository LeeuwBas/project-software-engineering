import {
    createEnabledModules,
    EnabledModules,
    getSettings,
    setSettings,
    Settings,
} from '@/lib/storage';
import { create } from 'zustand';
import { getAPI, postAPI } from './api/ApiManager';
import { internalAuth } from '@/lib/auth/AuthService';

type SettingsStore = {
    settings: Settings | null;
    setStore: (settings: Settings) => void;
};

const useSettingsStore = create<SettingsStore>((set) => ({
    settings: null,
    setStore: (settings) => set({ settings }),
}));

/**
 * Loads the server's settings state. Assumes that it is up to date, so overwrites the local settings page.
 *
 * @returns boolean signalling if the operation was a success
 */
export async function loadSettingsServer() {
    const res = await getAPI('/users/settings');
    if (res === null) {
        return false;
    }

    const b64Settings = res['settings'];
    const settings: Settings = JSON.parse(atob(b64Settings));

    await setSettings(settings);
    return true;
}

/**
 * Saves the current locally stored settings to the server.
 *
 * @param [settings=null] settings to save to the server, if not provided will store what is on local storage.
 */
async function saveSettingsServer(settings: Settings | null = null) {
    if (internalAuth.isGuest || internalAuth.accessToken === null) {
        return;
    }

    if (settings === null) {
        settings = await getSettings();
    }

    const b64Settings = btoa(JSON.stringify(settings));
    postAPI('/users/settings', { settings: b64Settings }).then();
}

/**
 * Stores settings to local storage and to the server database
 *
 * @param settings new settings to store
 */
async function setAndSyncSettings(settings: Settings) {
    // Does not await a response from the server, because there will be no error handling if the server fails anyways.
    saveSettingsServer(settings).catch((error) =>
        console.log(`saving settings to server failed, reason: ${error}`)
    );
    await setSettings(settings);
}

/**
 * Loads the settings from the server, does not await a response.
 */
export async function loadSettings() {
    const settings = await getSettings();
    useSettingsStore.getState().setStore(settings);

    if (internalAuth.isGuest) return;
    // Does not await a response from the server, because there will be no error handling if the server fails anyways.
    loadSettingsServer().then((success) =>
        console.log(
            success ? 'collected settings from server' : 'failed to collect settings from server'
        )
    );
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

    if (current === null) {
        console.log('Attempted settings save before they were loaded!');
        return;
    }

    current[key] = value;
    useSettingsStore.getState().setStore(current);
    await setAndSyncSettings(current);
}

async function setTutorialDone() {
    updateSettings('hasDoneTutorial', true);
}

async function resetTutorial() {
    updateSettings('hasDoneTutorial', false);
}

export function useTutorial() {
    const done = useSettingsStore((s) => s.settings?.hasDoneTutorial ?? null);
    return { done, setTutorialDone, resetTutorial };
}

/**
 * Save a new name for the pet.
 * @param petName The new name
 */
export function savePetName(petName: string) {
    updateSettings('petName', petName);
}

/**
 * Retrieves the stored pet name
 * @returns the saved pet name
 */
export function getPetName() {
    return useSettingsStore.getState().settings?.petName ?? '';
}

/**
 * Save a new name for the user, used in the quotes.
 * @param userName The new name
 */
export function saveUserName(userName: string) {
    updateSettings('userName', userName);
}

/**
 * Retrieves the stored username
 * @returns The saved username
 */
export function getUserName() {
    return useSettingsStore.getState().settings?.userName ?? '';
}

/**
 * Set a new value for the active modules.
 * @param modules the modules that are active
 */
export function setActiveModules(modules: EnabledModules) {
    updateSettings('enabledModules', modules);
}

/**
 * Retrieves the status of all modules.
 * @returns Object containing the information about the modules.
 */
export function getActiveModules(): EnabledModules {
    return useSettingsStore.getState().settings?.enabledModules ?? createEnabledModules();
}

/**
 * Toggles a specific module on and off.
 * @param module the module name that needs to be toggled.
 */
export function toggleActiveModule<K extends keyof EnabledModules>(module: K) {
    const current = getActiveModules();
    current[module] = !current[module];
    setActiveModules(current);
}

/**
 * Change the selected pet ID.
 * @param petID ID of the chosen pet
 */
export function setPetID(petID: number) {
    updateSettings('chosenPet', petID);
}

/**
 * Retrieves the stored pet ID.
 * @returns The ID of the stored pet
 */
export function getPetID() {
    const ID = useSettingsStore((state) => state.settings)?.chosenPet ?? null;
    if (ID === undefined) {
        console.warn('Undefined pet ID loaded!');
    }
    return ID;
}
