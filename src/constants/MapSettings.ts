import { EdgePadding, LatLng, Region } from 'react-native-maps';

/**
 * Shared map settings for the events map.
 */

/** Where the map is centred before any events load: Calgary, Alberta. */
export const DEFAULT_POSITION: LatLng = {
    latitude: 51.03,
    longitude: -114.093,
};

/** Zoom level: how many degrees of latitude/longitude fit on screen (about 900 m). */
export const DEFAULT_DELTA = { latitudeDelta: 0.008, longitudeDelta: 0.008 };

/** Starting region for the map: the default position at the default zoom. */
export const DEFAULT_REGION: Region = {
    ...DEFAULT_POSITION,
    ...DEFAULT_DELTA,
};

/**
 * Space in pixels kept clear at each edge when the map zooms to fit the event
 * markers, so markers are not hidden under the logout button (top) or the
 * footer bar (bottom).
 */
export const EDGE_PADDING: EdgePadding = {
    top: 64,
    right: 16,
    bottom: 104,
    left: 16,
};
