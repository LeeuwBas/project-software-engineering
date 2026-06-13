import { API_ENDPOINT } from "@/lib/api/ApiManager";
import { tokenStorage } from "@/lib/auth/TokenStorage";
import { Redirect } from "expo-router";
import { createContext, JSX, ReactNode, useContext, useEffect, useState } from "react";

type Auth = {
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;

    renewToken: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
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

        const res = await fetch(`${API_ENDPOINT}/auth/token/refresh`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
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
        let res;
        res = await fetch(`${API_ENDPOINT}/auth/token/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        if (!res.ok) {
            console.log("signIn() failed");
            return false;
        }

        const data = await res.json();

        const receivedAccessToken = data.access;
        const receivedRefreshToken = data.refresh;

        await tokenStorage.setTokens(receivedAccessToken, receivedRefreshToken);
        setAccessToken(receivedAccessToken);
        setRefreshToken(receivedRefreshToken);
        console.log("Successfully logged in");
        return true;
    }

    async function signOut() {
        await tokenStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
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

export function requireNoAuth(element: JSX.Element) {
    const auth = useAuth();
    if (auth?.isLoading) return null;

    if (auth?.accessToken) {
        return <Redirect href="/"/>;
    }

    return element;
}

export function requireAuth(element: JSX.Element) {
    const auth = useAuth();
    if (process.env.EXPO_PUBLIC_DISABLE_AUTH === 'True') return element;
    if (auth?.isLoading) return null;

    if (!auth?.accessToken) {
        return <Redirect href="/login"/>;
    }

    return element;
}

export function useAuth() {
    return useContext(AuthContext)
}