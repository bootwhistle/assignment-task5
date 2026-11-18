import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import {
    useFonts,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import AppStack from './src/routes/AppStack';
import { StatusBar } from 'expo-status-bar';

/**
 * Root component of the Volunteam app.
 *
 * Responsibilities:
 * - Loads the four Nunito font weights used across every screen.
 * - Shows nothing (returns `null`) until the fonts are ready, so text never
 *   flashes in the system font first.
 * - Wraps the app in `ActionSheetProvider` so any screen can open a native
 *   action sheet, then renders the navigation stack (`AppStack`).
 *
 * @returns The status bar and navigation stack, or `null` while fonts load.
 */
export default function App() {
    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <>
                <StatusBar animated style="dark" />
                <ActionSheetProvider>
                    <AppStack />
                </ActionSheetProvider>
            </>
        );
    }
}
