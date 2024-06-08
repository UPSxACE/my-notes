// Allows Alphanumeric and _.- if it's not on start or end
export const REGEX_USERNAME = /^[a-z0-9]?([a-z0-9_.-]*[a-z0-9])?$/;
// Allows Ascii from 32 to 255 (printable + extended)
export const REGEX_PASSWORD = /^[\x20-\xFF]*$/;
