import { API_ENDPOINT } from '@/lib/api/ApiEndpoint';
import { useAuth } from '@/lib/auth/AuthManager';

/**
 * Sends a GET request to the given API endpoint, authenticated with the current session.
 *
 * @param endpoint The endpoint to send a GET request to.
 * @param authenticate Weather or not the request should use authentication.
 * @returns the response json, or null if the network is offline or the user is not authenticated.
 * @throws Error when the request fails by any other means. (For example a 405 method not allowed).
 */
export async function getAPI(endpoint: string, authenticate: boolean = true) {
    const response = await queryApi(
        endpoint,
        {
            method: 'GET',
        },
        authenticate
    );

    if (!response) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return await response.json();
}

/**
 * Sends a POST request to the API at the given endpoint authenticated with the current user.
 *
 * @param endpoint The endpoint to POST to
 * @param json The JSON body to send with the POST request
 * @param authenticate Should this request be authenticated
 * @returns The response body of the request, or null if the request failed because of network or authentication.
 * @throws Error when the request has failed
 */
export async function postAPI(endpoint: string, json: any, authenticate: boolean = true) {
    const response = await queryApi(
        endpoint,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        },
        authenticate
    );

    // When we do not authenticate, we do not throw errors
    if (!response || (!authenticate && !response.ok)) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return await response.json();
}

/**
 * Make a request to the API.
 * If the access token is expired and auth is enabled,
 * it will automatically try to renew the token and retry the request.
 *
 * @param endpoint The API endpoint to call, e.g. "/users/me/"
 * @param init The request object, same as fetch().
 * @param authenticate Weather the request should be authenticated or not.
 * @param recurse_unauthenticated If a new token should be requested when it has expired.
 * @return the response of the server, or null if the network is offline or the user is not authenticated.
 */
export async function queryApi(
    endpoint: string,
    init: RequestInit = {},
    authenticate: boolean = true,
    recurse_unauthenticated: boolean = true
): Promise<Response | null> {
    const auth = useAuth();
    const ENDPOINT = `${API_ENDPOINT}${endpoint}`;

    if (authenticate && (!auth || auth.isLoading)) {
        return null;
    }

    let res;
    try {
        const request = authenticate
            ? {
                  ...init,
                  headers: {
                      Authorization: `Bearer ${auth?.accessToken}`,
                      ...init.headers,
                  },
              }
            : init;

        res = await fetch(ENDPOINT, request);
    } catch (error) {
        if (!(error instanceof TypeError)) {
            throw error;
        }

        // Network error (most likely no internet)
        console.log('Server is unreachable');
        return null;
    }

    if (authenticate && res.status === 401) {
        if (!recurse_unauthenticated) {
            // Do not try to re-authenticate
            // This can prevent infinite recursion when the backend fails.
            return null;
        }

        try {
            await auth?.renewToken();
        } catch (err) {
            await auth?.signOut();
            return null;
        }

        return queryApi(endpoint, init, false);
    }
    return res;
}
