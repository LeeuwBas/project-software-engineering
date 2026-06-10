import {useAuth} from "@/lib/auth/AuthManager";


export const API_ENDPOINT: string = process.env.EXPO_PUBLIC_SERVER_ENDPOINT ?? "https://api.viruopet.app";

/**
 * Sends a GET request to the given API endpoint, authenticated with the current session.
 *
 * @param endpoint The endpoint to send a GET request to.
 * @returns the response json, or null if the network is offline or the user is not authenticated.
 * @throws Error when the request fails by any other means. (For example a 405 method not allowed).
 */
export async function getAPI(endpoint: string) {
    const response = await queryApi(endpoint, {
        method: "GET",
    })

    if (!response) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Request failed")
    }

    return await response.json();
}

/**
 * Sends a POST request to the API at the given endpoint authenticated with the current user.
 *
 * @param endpoint The endpoint to POST to
 * @param json The JSON body to send with the POST request
 * @returns The response body of the request, or null if the request failed because of network or authentication.
 * @throws Error when the request has failed
 */
export async function postAPI(endpoint: string, json: any) {
    const response = await queryApi(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
    });

    if (!response) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Request failed")
    }

    return await response.json();
}

/**
 * Make a request to the API which requires authentication.
 * If the access token is expired, it will automatically try to renew the token and retry the request.
 *
 * @param endpoint The API endpoint to call, e.g. "/users/me/"
 * @param init The request object, same as fetch().
 * @return the response of the server, or null if the network is offline or the user is not authenticated.
 */
export async function queryApi(endpoint: string, init: RequestInit = {}, recurse_unauthenticated: boolean = true): Promise<Response|null> {
    const auth = useAuth()
    const ENDPOINT = `${API_ENDPOINT}${endpoint}`;

    if (!auth || auth.isLoading) {
        return null;
    }

    let res;
    try {
         res = await fetch(ENDPOINT, {
            ...init,
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`,
                ...init.headers,
            },
        });
    } catch (error) {
        if (!(error instanceof TypeError)) {
            throw error
        }

        // Network error (most likely no internet)
        console.log("Server is unreachable")
        return null;
    }

    if (res.status === 401) {

        if (!recurse_unauthenticated) {
            // Do not try to re-authenticate
            // This can prevent infinite recursion when the backend fails.
            return null;
        }

        try {
            await auth.renewToken();
        } catch (err) {
            await auth.signOut();
            return null;
        }

        return queryApi(endpoint, init, false);
    }
    return res;
}