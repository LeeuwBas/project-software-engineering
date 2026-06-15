// This file implements JWT token storage for the web, using local storage.
// expo-secure-store does not have a web implementation, but I would like
// to keep running the web dev server.
//
// KEY NOTE: This is NOT secure, local storage does not encrypt by default.
// But because this is only for development, that's fine.

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export const tokenStorage = {
    getAccessToken: async () => localStorage.getItem(ACCESS_TOKEN),
    getRefreshToken: async () => localStorage.getItem(REFRESH_TOKEN),

    setTokens: async (access: string, refresh: string) => {
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
    },

    clear: async () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    },
};
