import React from 'react';
import { View } from 'react-native';

/**
 * Props for {@link Spacer}.
 *
 * @property size - Gap in pixels. Defaults to 8.
 * @property horizontal - `true` for a horizontal gap (width) between items in a row,
 *                        `false` (default) for a vertical gap (height).
 */
interface SpacerProps {
    size?: number;
    horizontal?: boolean;
}

/**
 * Empty view that adds a fixed gap between two elements, so screens don't
 * need one-off margins.
 *
 * @param props - See {@link SpacerProps}.
 * @returns An invisible `View` of the requested size.
 *
 * @example
 * <Spacer size={80} />            // 80 px vertical gap
 * <Spacer size={16} horizontal /> // 16 px horizontal gap
 */
export default function Spacer({ size = 8, horizontal = false }: SpacerProps) {
    return (
        <View
            style={{
                width: horizontal ? size : 'auto',
                height: !horizontal ? size : 'auto',
            }}
        />
    );
}
