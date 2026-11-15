import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';

/**
 * Events map screen, shown after login.
 *
 * Responsibilities:
 * - Shows a Google map with a marker for each volunteer event, and zooms to
 *   fit all markers when the map first appears.
 * - Footer bar with the number of events and a "+" button to create an event.
 * - Logout button (top right) that clears the cached session and returns to Login.
 *
 * Current state: the events are the sample list at the bottom of this file
 * (not loaded from the API yet), the footer text is a placeholder ("X event(s)
 * found"), and the "+" button and markers don't navigate anywhere yet.
 *
 * @param props - Navigation props from the stack navigator; `navigation` is
 *                used to go back to Login on logout.
 * @returns The map, footer and logout button.
 */
export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const authenticationContext = useContext(AuthenticationContext);
    const mapViewRef = useRef<MapView>(null);

    /** Will open the "create event" screen. Not implemented yet. */
    const handleNavigateToCreateEvent = () => {};

    /** Will open the details of the tapped event. Not implemented yet. */
    const handleNavigateToEventDetails = () => {};

    /**
     * Logs the user out: removes the cached user and token from the phone,
     * clears the user from `AuthenticationContext`, and returns to Login.
     */
    const handleLogout = async () => {
        AsyncStorage.multiRemove(['userInfo', 'accessToken']).then(() => {
            authenticationContext?.setValue(undefined);
            navigation.navigate('Login');
        });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={MapSettings.DEFAULT_REGION}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
                showsMyLocationButton={false}
                showsUserLocation={true}
                rotateEnabled={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                mapPadding={MapSettings.EDGE_PADDING}
                onLayout={() =>
                    mapViewRef.current?.fitToCoordinates(
                        events.map(({ position }) => ({
                            latitude: position.latitude,
                            longitude: position.longitude,
                        })),
                        { edgePadding: MapSettings.EDGE_PADDING }
                    )
                }
            >
                {events.map((event) => {
                    return (
                        <Marker
                            key={event.id}
                            coordinate={{
                                latitude: event.position.latitude,
                                longitude: event.position.longitude,
                            }}
                            onPress={handleNavigateToEventDetails}
                        >
                            <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={mapMarkerImg} />
                        </Marker>
                    );
                })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>X event(s) found</Text>
                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
            <RectButton
                style={[styles.logoutButton, styles.smallButton, { backgroundColor: '#4D6F80' }]}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#FFF" />
            </RectButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    mapStyle: {
        ...StyleSheet.absoluteFill,
    },

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,

        elevation: 3,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,

        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },
});

/**
 * Minimal event shape used by this screen: an ID and a map position.
 * The full event record in db.json also has a name, description, date,
 * organizer and volunteer details.
 */
interface event {
    id: string;
    position: {
        latitude: number;
        longitude: number;
    };
}

/**
 * Sample events, copied from db.json, so the map has markers to show
 * until events are fetched from the API.
 */
const events: event[] = [
    {
        id: 'e3c95682-870f-4080-a0d7-ae8e23e2534f',
        position: {
            latitude: 51.105761,
            longitude: -114.106943,
        },
    },
    {
        id: '98301b22-2b76-44f1-a8da-8c86c56b0367',
        position: {
            latitude: 51.04112,
            longitude: -114.069325,
        },
    },
    {
        id: 'd7b8ea73-ba2c-4fc3-9348-9814076124bd',
        position: {
            latitude: 51.01222958257112,
            longitude: -114.11677222698927,
        },
    },
    {
        id: 'd1a6b9ea-877d-4711-b8d7-af8f1bce4d29',
        position: {
            latitude: 51.010801915407036,
            longitude: -114.07823592424393,
        },
    },
];
