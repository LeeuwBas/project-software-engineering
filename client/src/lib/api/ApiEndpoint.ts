/** The API endpoint, stored in one place so it can easily be changed everyone at once or with enviornment variables */
export const API_ENDPOINT: string =
    process.env.EXPO_PUBLIC_SERVER_ENDPOINT ?? 'https://api.virtuopet.app';
