import AsyncStorage from '@react-native-async-storage/async-storage';

/*
 * Small wrapper around AsyncStorage (the phone's on-device key/value storage)
 * so data can be kept between app launches and used offline.
 */

/**
 * "Network first" strategy: try the request, and fall back to the last cached
 * copy when the request fails (for example, no connection).
 *
 * A successful response is also saved to the cache for next time.
 *
 * @param key - Cache key to save under and read from.
 * @param request - The pending network request.
 * @returns The fresh response, or the cached value if the request failed.
 *          Rejects if the request failed and nothing is cached under `key`.
 */
export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        setInCache(key, response);
        return response;
    } catch (e) {
        return getFromCache<T>(key);
    }
};

/**
 * Saves a value in the cache as JSON.
 *
 * @param key - Cache key.
 * @param value - Any JSON-serialisable value.
 * @returns A promise that resolves once the value is written.
 */
export const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

/**
 * Reads a value from the cache.
 *
 * @param key - Cache key.
 * @returns The parsed value. Rejects with a message if nothing is stored under `key`.
 */
export const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
