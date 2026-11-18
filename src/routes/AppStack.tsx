import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import Login from '../pages/Login';
import EventsMap from '../pages/EventsMap';
import { AuthenticationContext, AuthenticationContextObject } from '../context/AuthenticationContext';
import { User } from '../types/User';

/**
 * Navigation stack for the whole app, plus the authentication context.
 *
 * Responsibilities:
 * - Keeps the logged-in user in state and shares it through
 *   `AuthenticationContext`, so every screen can read or change it.
 * - Registers the screens, `Login` and `EventsMap`. The first one (`Login`)
 *   is shown when the app opens.
 * - Hides the default header (each screen draws its own) and sets the shared
 *   light-grey background.
 *
 * @returns The navigation container with all screens registered.
 */
export default function Routes() {
    const [authenticatedUser, setAuthenticatedUser] = useState<User>();

    const authenticationContextObj: AuthenticationContextObject = {
        value: authenticatedUser as User,
        setValue: setAuthenticatedUser,
    };

    return (
        <AuthenticationContext.Provider value={authenticationContextObj}>
            <NavigationContainer>
                <Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: '#F2F3F5' },
                    }}
                >
                    <Screen name="Login" component={Login} />

                    <Screen name="EventsMap" component={EventsMap} />
                </Navigator>
            </NavigationContainer>
        </AuthenticationContext.Provider>
    );
}
