import { createContext } from 'react';
import { User } from '../types/User';

/**
 * What the authentication context holds.
 *
 * @property value - The user who is logged in, or `undefined` when nobody is.
 * @property setValue - Saves a new user after login, or `undefined` on logout.
 */
export type AuthenticationContextObject = {
    value: User;
    setValue: (newValue: User | undefined) => void;
};

/**
 * React context that shares the logged-in user with every screen.
 *
 * It is provided in `AppStack` and read with
 * `useContext(AuthenticationContext)`. It is `null` only if a component is
 * rendered outside the provider.
 */
export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
