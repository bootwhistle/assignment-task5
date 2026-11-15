/**
 * A Volunteam user, as returned by the API (see `users` in db.json).
 *
 * @property name - First and last name.
 * @property email - Email address used to log in.
 * @property id - Unique user ID.
 * @property mobile - Mobile phone number.
 */
export interface User {
    name: {
        first: string;
        last: string;
    };
    email: string;
    id: string;
    mobile: string;
}
