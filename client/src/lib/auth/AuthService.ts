type AuthService = {
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    renewToken: () => Promise<void>;
    signOut: () => Promise<void>;
};

export const internalAuth: AuthService = {
    accessToken: null,
    refreshToken: null,
    isLoading: true,

    renewToken: async () => {},
    signOut: async () => {},
};
