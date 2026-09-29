// Optional stat filters that narrow the search list.

import { stat } from "./results";

export const ATTRIBUTES = ["DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"];

// Words that appear in the API's type strings, e.g. "Synchro Tuner Monster".
export const CARD_TYPES = [
    "Normal",
    "Effect",
    "Ritual",
    "Fusion",
    "Synchro",
    "XYZ",
    "Pendulum",
    "Link",
    "Tuner",
    "Flip",
    "Spirit",
    "Union",
    "Gemini",
    "Toon",
];

export const LEVEL_RANGE = [0, 13];

export const EMPTY_FILTERS = {
    attributes: [],
    types: [],
    link: "any", // any | link | other
    levels: LEVEL_RANGE,
};

/** Level, Rank or Link rating, whichever the monster has. */
export const ratingOf = (monster) => monster.linkval ?? monster.level;

/** How many filters are set, for the Filters button badge. */
export const activeFilterCount = (filters) =>
    [
        filters.attributes.length > 0,
        filters.types.length > 0,
        filters.link !== "any",
        filters.levels[0] !== LEVEL_RANGE[0] ||
            filters.levels[1] !== LEVEL_RANGE[1],
    ].filter(Boolean).length;

/** Within one filter any selected value matches; across filters all must match. */
export const matchesFilters = (monster, filters) => {
    const { attributes, types, link, levels } = filters;
    if (attributes.length && !attributes.includes(monster.attribute)) {
        return false;
    }
    if (types.length) {
        const words = monster.type?.split(" ") ?? [];
        if (!types.some((t) => words.includes(t))) return false;
    }
    const isLink = monster.linkval != null;
    if (link === "link" && !isLink) return false;
    if (link === "other" && isLink) return false;

    if (levels[0] !== LEVEL_RANGE[0] || levels[1] !== LEVEL_RANGE[1]) {
        const rating = ratingOf(monster);
        if (rating == null || rating < levels[0] || rating > levels[1]) {
            return false;
        }
    }
    return true;
};

/** Short summary for search results, e.g. "2500 / 2100 · Lv 7 · DARK · Spellcaster". */
export const statLine = (monster) => {
    const rating =
        monster.linkval != null
            ? `LINK-${monster.linkval}`
            : `${monster.type?.includes("XYZ") ? "Rank" : "Lv"} ${
                  monster.level ?? "?"
              }`;
    const def =
        monster.linkval != null ? "" : ` / ${stat(monster.def) ?? "?"}`;
    return [
        `${stat(monster.atk) ?? "?"}${def}`,
        rating,
        monster.attribute,
        monster.race,
    ]
        .filter(Boolean)
        .join(" · ");
};
