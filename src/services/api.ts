import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// json-server runs on the same computer as the Expo dev server, so its IP address
// is taken from the dev server's host URI (e.g. "192.168.1.20:8081").
// Start json-server with:
// `npx json-server --watch db.json --port 3333 --host 0.0.0.0 -m ./node_modules/json-server-auth`
//
// To access your server online without running json-server locally,
// you can set your baseURL to:
// `https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
//
// To use `my-json-server`, make sure your `db.json` is located at the repo root.
const devServerIp = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

/** HTTP client for the Volunteam API (json-server with json-server-auth). */
const api = axios.create({
    baseURL: `http://${devServerIp}:3333`,
});

/**
 * Logs a user in through json-server-auth's `POST /login` route.
 *
 * @param email - The user's email address (already trimmed and lower-cased).
 * @param password - The user's password.
 * @returns A promise that resolves with the response. `response.data` holds
 *          `accessToken` (a JWT valid for one hour) and `user` (see `User`).
 *          It rejects with a 400 response and an error message when the email
 *          or password is wrong.
 */
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};
