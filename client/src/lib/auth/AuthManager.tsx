import { API_ENDPOINT } from '@/lib/api/ApiEndpoint';
import { tokenStorage } from '@/lib/auth/TokenStorage';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Auth = {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  renewToken: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      console.log('Successfully loaded tokens from storage');
    }

    init();
  }, []);

  async function renewToken() {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const res = await fetch(`${API_ENDPOINT}/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      throw new Error('Session expired');
    }

    const data = await res.json();

    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
  }

  async function signIn(email: string, password: string) {
    let res;
    res = await fetch(`${API_ENDPOINT}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.log('signIn() failed');
      return false;
    }

    const data = await res.json();

    const receivedAccessToken = data.access;
    const receivedRefreshToken = data.refresh;

    await tokenStorage.setTokens(receivedAccessToken, receivedRefreshToken);
    setAccessToken(receivedAccessToken);
    setRefreshToken(receivedRefreshToken);
    console.log('signIn() success');
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// - Functions - //

/**
 * @peram auth should be the auth context.
 * @returns `true` if the user is logged in.
 */
export function isAuth(auth: Auth) {
  if (process.env.EXPO_PUBLIC_DISABLE_AUTH === 'True') return true;
  if (auth?.accessToken) return true;
  return false;
}

// - Hooks - //

/**
 * This wrapper allows us to treat the auth context as `Auth` instead of `Auth | null`.
 *
 * @returns The auth context for the app.
 */
export function useAuth(): Auth {
  const authCtx = useContext(AuthContext);
  if (authCtx == null) {
    throw new Error('AuthProvider returned null');
  }
  return authCtx;
}

/**
 * This is the hook version, see {@link isAuth} for the function.
 *
 * @returns `true` if the user is logged in.
 */
export function useIsAuth(): boolean {
  const auth = useAuth();
  return isAuth(auth);
}

/**
 *
 * @returns `true` if auth is loading.
 */
export function useIsLoading(): boolean {
  const auth = useAuth();
  return auth.isLoading;
}

/**
 * A hook that functions as a flexible root for signin state logic.
 *
 * @returns A callback function with a flexible type that looks similar to:
 * ```ts
 * (authElement: A, noAuthElement: B, loadingElement: C) => A | B | C | null
 * ```
 * that returns values based off auth state.
 *
 * @example // you always have to call the hook first at top level of component
 * const authSwitch = useAuthSwitch();
 * // then use callback anywhere:
 * authSwitch(<Dashboard />, <Login />, <Spinner />);
 * // when returning a Component, null causes nothing to be rendered
 * authSwitch(<Profile />, <Redirect />, null); // return nothing while loading, then redierect if the result is not logged in
 * // typescript has no keyword arguments so if you want something only while logged out:
 * authSwitch(null, <Login />);
 */
export function useAuthSwitch() {
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  // the callback function:
  return <T, U = null, V = null>(
    authElement: T,
    noAuthElement: U = null as any,
    loadingElement: V = null as any
  ) => {
    if (isLoading) return loadingElement as any;
    return isAuth ? (authElement as any) : (noAuthElement as any);
  };
}

/**
 * A 2 arg version of {@link useAuthSwitch} that shows the logged out argument when loading instead of a third argument.
 *
 * @returns A callback function with a flexible type that looks similar to:
 * ```ts
 * (authElement: A, noAuthElement: B) => A | B | null
 * ```
 * that returns values based off auth state.
 *
 * @example // you always have to call the hook first at top level of component
 * const authSwitchL = useAuthSwitchNoLoading();
 * // then use callback anywhere:
 * authSwitchL(<Dashboard />, <Login />);
 * // when returning a Component, null causes nothing to be rendered,
 * // typescript has no keyword arguments so if you want something only while logged out:
 * authSwitchL(null, <Login />);
 */
export function useAuthSwitchNoLoading() {
  const authSwitch = useAuthSwitch();

  return <T, U = null>(authElement: T, noAuthElement: U = null as any) =>
    authSwitch(authElement, noAuthElement, noAuthElement);
}

/**
 *
 * @param defaultPath Use to set the path to route to
 * @returns A callback functoin that takes a `path` to route to, uses `defaultPath` as default value
 *
 * @example
 * // set route when calling hook:
 * const signOut = useSignOutAndRouteTo('/login');
 * signoOut();
 * // OR set route when calling callback
 * const signOut = useSignOutAndRouteTo();
 * signoOut('/login'); // callback peram takes precidence if you do both
 */
export function useSignOutAndRouteTo(defaultPath: string = '/login') {
  const auth = useAuth();
  const router = useRouter();
  return (path: string = defaultPath) => {
    auth.signOut();
    router.replace(path);
  };
}
