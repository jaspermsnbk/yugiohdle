// Which anime eras the daily card is picked from.

import eraData from "./generations.json";
import lineUpGenerations from "./lineUpGenerations.json";
import { readJSON, writeJSON } from "./storage";

export const GENERATIONS = eraData.generations;
export const ALL_GENERATIONS = GENERATIONS.map((g) => g.id);

const SETTINGS_KEY = "yugiohdle:settings";

export const isAllGenerations = (ids) =>
    ALL_GENERATIONS.every((id) => ids.includes(id));

/** Keeps known ids in table order; an empty or invalid choice means all. */
export const normalizeGenerations = (ids) => {
    const valid = ALL_GENERATIONS.filter((id) => ids?.includes(id));
    return valid.length ? valid : ALL_GENERATIONS;
};

/** Number of daily-card candidates per generation id. */
export const GENERATION_COUNTS = lineUpGenerations.reduce((counts, id) => {
    counts[id] = (counts[id] ?? 0) + 1;
    return counts;
}, {});

/** "GX + 5D's", or null when every generation is chosen. */
export const generationLabel = (ids) =>
    isAllGenerations(ids)
        ? null
        : GENERATIONS.filter((g) => ids.includes(g.id))
              .map((g) => g.name)
              .join(" + ");

/**
 * Today's card id: the day-th card of the lineUp, counting only the chosen
 * generations. With every generation chosen it's the card everyone gets.
 */
export const pickCardId = (lineUp, day, ids) => {
    if (isAllGenerations(ids)) return lineUp[day % lineUp.length];
    const pool = lineUp.filter((_, i) => ids.includes(lineUpGenerations[i]));
    return pool[day % pool.length];
};

export const loadGenerationSetting = () =>
    normalizeGenerations(readJSON(SETTINGS_KEY)?.generations);

export const saveGenerationSetting = (ids) =>
    writeJSON(SETTINGS_KEY, { generations: ids });
