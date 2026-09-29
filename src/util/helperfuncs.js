const START_DATE = new Date(2022, 6, 15, 0, 0, 1);
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

/** Whole days elapsed since the game's start date; picks the card of the day. */
export const getNumberOfDays = () =>
    Math.floor((Date.now() - START_DATE.getTime()) / ONE_DAY_MS);
