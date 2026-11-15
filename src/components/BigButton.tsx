import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

/**
 * Props for {@link BigButton}.
 *
 * @property label - Text shown on the button.
 * @property color - Background colour as a 6-digit hex string (for example `#FF8700`).
 * @property style - Extra styles merged over the default button style (margins, width).
 * @property featherIconName - Optional Feather icon shown to the left of the label.
 * @property disabled - When true the button is drawn at 50% opacity. It only changes
 *                      the look; `onPress` is still called, so the parent must also
 *                      guard the action.
 * @property onPress - Called when the button is tapped.
 */
interface BigButtonProps {
    label: string;
    color: string;
    style?: {};
    featherIconName?: keyof typeof Feather.glyphMap;
    disabled?: boolean;
    onPress: () => void;
}

/**
 * Full-width, rounded call-to-action button used for the main action on a
 * screen (for example "Log in").
 *
 * @param props - See {@link BigButtonProps}.
 * @returns A pressable button with an optional icon and a label.
 */
export default function BigButton(props: BigButtonProps) {
    const styles = styling(props);
    const { featherIconName, label, style, onPress } = props;

    return (
        <RectButton style={[styles.button, style]} onPress={onPress}>
            {featherIconName && <Feather style={styles.icon} name={featherIconName} size={24} color="#FFF" />}
            <Text style={styles.label}>{label}</Text>
        </RectButton>
    );
}

/**
 * Builds the button styles from the props, because the background colour
 * depends on `color` and `disabled`. Adding `80` to the hex colour sets the
 * alpha channel to 50%.
 *
 * @param props - The button's `color` and `disabled` values.
 * @returns A StyleSheet with `button`, `icon` and `label` styles.
 */
const styling = ({ color, disabled }: BigButtonProps) =>
    StyleSheet.create({
        button: {
            paddingVertical: 14,
            paddingHorizontal: 32,
            backgroundColor: disabled ? color + '80' : color,
            borderRadius: 16,
            maxHeight: 56,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },

        icon: {
            marginRight: 8,
        },

        label: {
            fontFamily: 'Nunito_800ExtraBold',
            color: '#FFF',
            fontSize: 15,
        },
    });
