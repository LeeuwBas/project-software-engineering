import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const tokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN),

  setTokens: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN, refresh);
  },

  clear: async () => {
    return Promise.all(
        [
            SecureStore.deleteItemAsync(ACCESS_TOKEN),
            SecureStore.deleteItemAsync(REFRESH_TOKEN),
        ]
    )
  },
};