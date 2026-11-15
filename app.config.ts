import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Expo app configuration (replaces a static app.json).
 *
 * Written as a function so it can read environment variables when the app is
 * started or built. `IMGBB_API_KEY` is copied from the environment into
 * `extra`, where the app reads it at runtime with `getEnvironentVariable`.
 *
 * @param config - The base config Expo passes in (from app.json, if one exists).
 * @returns The full Expo config: app name, icons, splash screen, native
 *          plugins and their permission messages, and the `extra` values.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'volunteam',
    slug: 'volunteam',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
    },
    web: {
        favicon: './assets/favicon.png',
    },
    plugins: [
        '@react-native-community/datetimepicker',
        'expo-font',
        'expo-status-bar',
        [
            'expo-splash-screen',
            {
                image: './assets/splash.png',
                resizeMode: 'cover',
                backgroundColor: '#031A62',
            },
        ],
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you add them to events.',
                cameraPermission: 'The app accesses your camera to let you add pictures to events.',
            },
        ],
    ],
    extra: {
        eas: {
            projectId: '954f3b8e-1155-4f8f-8601-a2b3126da39e',
        },
        IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    },
});
