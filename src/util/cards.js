import { callApi, getDbVersion } from "./api";
import { readJSON, removeKey, writeJSON } from "./storage";

// Bump the version when trim() keeps different fields, so old caches refetch.
const CACHE_KEY = "yugiohdle:monsters:v3";
const OLD_CACHE_KEYS = ["yugiohdle:monsters", "yugiohdle:monsters:v2"];

/** Small card artwork. YGOPRODeck asks that images load only when needed. */
export const cardImageUrl = (id) =>
    `https://images.ygoprodeck.com/images/cards_small/${id}.jpg`;

/** Keeps only the fields the game uses (~1 MB for every monster instead of ~14 MB). */
const trim = ({
    id,
    name,
    type,
    frameType,
    race,
    atk,
    def,
    level,
    linkval,
    attribute,
}) => ({
    id,
    name,
    type,
    frameType,
    race,
    atk,
    def,
    level,
    linkval,
    attribute,
});

/**
 * Returns every monster of the given types. The list is cached in
 * localStorage and only downloaded again when the API's database version
 * changes. If the version check fails, a cached list is used as-is.
 */
export const loadMonsters = async (types) => {
    const typeKey = types.join(",");
    const version = await getDbVersion().catch(() => null);
    const cached = readJSON(CACHE_KEY);

    if (
        cached?.types === typeKey &&
        (version === null || cached.version === version)
    ) {
        return cached.monsters;
    }

    const monsters = (await callApi({ type: typeKey })).map(trim);
    OLD_CACHE_KEYS.forEach(removeKey);
    writeJSON(CACHE_KEY, { version, types: typeKey, monsters });
    return monsters;
};

/**
 * Finds a card by id. Falls back to the API for ids that aren't in the list
 * (alternate artwork and old prerelease ids), then maps the result back to
 * the list's copy so it can be matched against guesses.
 */
export const findCard = async (id, monstersById) => {
    if (monstersById.has(id)) return monstersById.get(id);

    const [card] = await callApi({ id });
    return monstersById.get(card.id) ?? trim(card);
};
