import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const LOGIN_ID = 'login_id';
const LOGIN_EMAIL = 'login_email';

/** TODO (LeeuwBas): docstring */
export const tokenStorage = {
    getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN),
    getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN),

    setTokens: async (access: string, refresh: string) => {
        await SecureStore.setItemAsync(ACCESS_TOKEN, access);
        await SecureStore.setItemAsync(REFRESH_TOKEN, refresh);
    },

    clear: async () => {
        return Promise.all([
            SecureStore.deleteItemAsync(ACCESS_TOKEN),
            SecureStore.deleteItemAsync(REFRESH_TOKEN),
        ]);
    },

    setLoginID: async (loginId: string, email: string) => {
        await SecureStore.setItemAsync(LOGIN_ID, loginId);
        await SecureStore.setItemAsync(LOGIN_EMAIL, email);
    },

    removeLoginId: async () => {
        if (!(await SecureStore.getItemAsync(LOGIN_EMAIL))) {
            return Promise.reject('No loginId to delete!');
        }
        return Promise.all([
            SecureStore.deleteItemAsync(LOGIN_ID),
            SecureStore.deleteItemAsync(LOGIN_EMAIL),
        ]);
    },

    isCachedLogin: async (loginId: string, email: string) => {
        const local_id = await SecureStore.getItemAsync(LOGIN_ID);
        const local_email = await SecureStore.getItemAsync(LOGIN_EMAIL);

        if (!local_id || !local_email) {
            return false;
        }

        return +loginId <= +local_id + 1 && local_email === email;
    },
};
