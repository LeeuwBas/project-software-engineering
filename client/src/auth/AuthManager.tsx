import { tokenStorage} from "@/auth/TokenStorage";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type Auth = {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    renewToken: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true);

    const isAuthenticated = !!accessToken;

    useEffect(() => {
        async function init(){
            const storedAccessToken = await tokenStorage.getAccessToken();
            const storedRefreshToken = await tokenStorage.getRefreshToken();

            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
            }

            setLoading(false);
                console.log("Successfully loaded tokens from storage")
            }

        init();
    }, []);

    async function renewToken() {
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/auth/token/refresh`, {
            method: "POST",
            body: JSON.stringify({"refresh": refreshToken}),
        });

        if (!res.ok) {
            throw new Error("Session expired");
        }

        const data = await res.json();

        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
    }

    async function signIn(email: string, password: string) {
        const res = await fetch(`${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/auth/token`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();

        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
    }

    async function signOut()  {
        await tokenStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                isAuthenticated,
                isLoading,
                renewToken,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(){
    return useContext(AuthContext)
}