import {useAuth} from "@/auth/AuthManager";


export const API_ENDPOINT: string = process.env.EXPO_PUBLIC_SERVER_ENDPOINT ?? "https://api.virtuopet.app";

/**
 * Make a request to the API which requires authentication.
 * If the access token is expired, it will automatically try to renew the token and retry the request.
 *
 * @param endpoint The API endpoint to call, e.g. "/users/me/"
 * @param init The request object, same as fetch().
 * @throws Error if the request fails and the token cannot be renewed.
 */
export async function queryApi(endpoint: string, init: RequestInit = {}) {
    const auth = useAuth()
    const ENDPOINT = `${API_ENDPOINT}${endpoint}`;

    const res = await fetch(ENDPOINT, {
        ...init,
        headers: {
            "Authorization": `Bearer ${auth?.accessToken}`,
            ...init.headers,
        },
    });

    if (res.status === 401) {
        try {
            await auth?.renewToken();
        } catch (err) {
            throw new Error("Session expired");
        }

        return queryApi(endpoint, init);
    }
    return res;
}
