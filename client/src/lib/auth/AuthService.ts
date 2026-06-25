/**
 * All functions/variables available in the backend related to authentication.
 */
type AuthService = {
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isGuest: boolean;
    renewToken: () => Promise<void>;
    signOut: () => Promise<void>;
};

/**
 * The current backend authentication service,
 */
export const internalAuth: AuthService = {
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isGuest: false,

    renewToken: async () => {},
    signOut: async () => {},
};
