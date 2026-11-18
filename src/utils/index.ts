import Constants from 'expo-constants';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Platform } from 'react-native';
import { LatLng } from 'react-native-maps';

/*
 * Helper functions shared by the screens: formatting, validation, dates,
 * configuration and token checks. None of them change app state.
 */

/**
 * Turns a number of bytes into a readable size, e.g. `1536` -> `"1.5 KB"`.
 *
 * @param bytes - Size in bytes.
 * @param decimals - Maximum decimal places to show (default 2, negatives count as 0).
 * @returns The size with the largest fitting unit, or `"0 Bytes"` for 0 or a non-number.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Formats the time of a date in 12-hour style, e.g. `"9:05 pm"`.
 *
 * @param date - The date (a Date or anything `new Date()` accepts).
 * @returns The time as `h:mm am|pm`, in the phone's time zone.
 */
export const formatAMPM = (date: Date): string => {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const newHours = hours % 12 ? hours : 12; // the hour '0' should be '12'
    const newMinutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = newHours + ':' + newMinutes + ' ' + ampm;
    return strTime;
};

/**
 * Adds hours to a date without changing the original.
 *
 * @param dateTime - The starting date and time.
 * @param hoursToAdd - Hours to add (can be negative or a fraction).
 * @returns A new Date that is `hoursToAdd` hours later.
 */
export const addHours = (dateTime: Date, hoursToAdd: number) => {
    const milisecondsToAdd = hoursToAdd * 60 * 60 * 1000;
    const newDate = new Date(dateTime);
    return new Date(newDate.setTime(newDate.getTime() + milisecondsToAdd));
};

/**
 * Keeps the day of one date and takes the time from another. Used when the
 * user picks a date and a time with separate pickers.
 *
 * @param existingDate - Supplies the year, month and day.
 * @param newTime - Supplies the hours and minutes (seconds are set to 0).
 * @returns A new Date combining both.
 */
export const updateDateWithNewTime = (existingDate: Date, newTime: Date): Date => {
    const newDate = new Date(new Date(existingDate).setHours(newTime.getHours(), newTime.getMinutes(), 0, 0));
    return newDate;
};

/**
 * Cleans an email address before it is sent to the API.
 *
 * @param email - The email as typed.
 * @returns The email without surrounding spaces, in lower case.
 */
export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

/**
 * Checks whether text looks like an email address (`name@domain.ext`).
 *
 * Known limitation: the last part of the domain must be exactly 3 letters,
 * so `.com` and `.org` pass but `.ca`, `.it`, `.info` and `.com.br` fail.
 * Two seed users (`luigi@carluccio.it`, `john@silva.com.br`) are rejected
 * because of this.
 *
 * @param email - The email to check (spaces and case are ignored).
 * @returns `true` if the email matches the pattern, `false` if not or if it is empty.
 */
export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/;
    const sanitizedEmail = email.trim().toLowerCase();
    const result = sanitizedEmail.match(regex);
    return !!result?.[0];
};

/**
 * JSON has no date type, so dates arrive from the API as strings. This turns
 * one field of every object in a list back into a Date.
 *
 * @param array - Objects from an API response. They are changed in place.
 * @param fieldName - Name of the date field, e.g. `"dateTime"`.
 * @returns The same objects, with `fieldName` converted to a Date.
 */
export const parseDateFieldFromJSONResponse = (array: [], fieldName: string): any[] => {
    return array.map((x: any) => {
        x[fieldName] = new Date(x[fieldName]);
        return x;
    });
};

/**
 * Converts text from an input (for example "volunteers needed") to a number.
 *
 * @param text - The text to convert.
 * @returns The number, `0` for empty text, or `NaN` if it is not a number.
 */
export const castToNumber = (text: string) => {
    return Number(text);
};

/**
 * Reads a value that `app.config.ts` placed in `extra`, such as `IMGBB_API_KEY`.
 *
 * @param variableName - Name of the value in `extra`.
 * @returns The value, or `undefined` (with a console warning) if it is not set.
 */
export const getEnvironentVariable = (variableName: string) => {
    try {
        const value = Constants.expoConfig?.extra?.[variableName];
        if (value != null) {
            return value;
        } else {
            throw new Error(`${variableName} not found.`);
        }
    } catch (e) {
        console.warn(e);
    }
};

/**
 * Builds a link that opens the phone's maps app at a location.
 *
 * @param coordinates - Latitude and longitude to show.
 * @returns A `maps:` link on iOS (Apple Maps) or a `geo:` link on Android.
 */
export const getMapsUrl = (coordinates: LatLng): string => {
    const { latitude, longitude } = coordinates;
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    return Platform.OS === 'ios' ? `maps:0,0?q=${label}@${latLng}` : `geo:0,0?q=${latLng}(${label})`;
};

/**
 * Checks whether a saved login token (JWT) has expired, by reading its `exp`
 * (expiry time) claim. The signature is not checked; that is the server's job.
 *
 * @param token - The access token returned at login.
 * @returns `true` if the expiry time has passed, otherwise `false`.
 *          Throws if the text is not a valid JWT.
 */
export const isTokenExpired = (token: string) => {
    const decodedToken = jwtDecode(token) as JwtPayload;
    const currentDate = Date.now();
    if ((decodedToken.exp as number) * 1000 < currentDate) {
        return true;
    } else {
        return false;
    }
};
