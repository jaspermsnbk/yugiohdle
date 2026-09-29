// Compares a guess against the answer, column by column. Shared by the
// results table and anything else that summarizes a guess, so they agree.

// `short` labels are used on narrow screens.
export const COLUMNS = [
    { key: "name", label: "Name" },
    { key: "atk", label: "ATK" },
    { key: "def", label: "DEF" },
    { key: "attribute", label: "Attribute", short: "Attr" },
    { key: "level", label: "Level", short: "Lvl" },
    { key: "race", label: "Type" },
    { key: "frame", label: "Frame" },
];

/** Link monsters have a Link rating instead of a level; the two never compare equal. */
const rating = (monster) =>
    monster?.linkval != null
        ? { value: monster.linkval, link: true }
        : { value: monster?.level, link: false };

const display = (value) => value ?? "—";

/** The API uses -1 for a "?" ATK/DEF. */
export const stat = (value) => (value != null && value < 0 ? "?" : value);

/**
 * "match", "higher"/"lower" (the answer's value is higher/lower than the
 * guess), or "wrong". Missing values (e.g. a Link monster's DEF) never match,
 * and a "?" stat only matches another "?".
 */
const compare = (guess, answer, numeric) => {
    if (guess == null || answer == null) return "wrong";
    if (guess === answer) return "match";
    if (guess === "?" || answer === "?") return "wrong";
    if (numeric) return guess > answer ? "lower" : "higher";
    return "wrong";
};

/** The API's frameType, e.g. "synchro_pendulum", as "Synchro Pendulum". */
export const frameLabel = (frameType) =>
    frameType
        ?.split("_")
        .map((part) =>
            part === "xyz" ? "XYZ" : part[0].toUpperCase() + part.slice(1)
        )
        .join(" ");

/**
 * Card frames match exactly, or "partial" when they share a part: Fusion vs
 * Fusion Pendulum, or two different Pendulum frames.
 */
const compareFrame = (guess, answer) => {
    if (!guess || !answer) return "wrong";
    if (guess === answer) return "match";
    const answerParts = answer.split("_");
    return guess.split("_").some((part) => answerParts.includes(part))
        ? "partial"
        : "wrong";
};

/** Returns one { key, label, result } cell per column in COLUMNS. */
export const compareGuess = (monster, answer) => {
    const guessRating = rating(monster);
    const answerRating = rating(answer);

    return [
        {
            key: "name",
            label: monster.name,
            result: monster.id === answer.id ? "match" : "wrong",
        },
        {
            key: "atk",
            label: display(stat(monster.atk)),
            result: compare(stat(monster.atk), stat(answer.atk), true),
        },
        {
            key: "def",
            label: display(stat(monster.def)),
            result: compare(stat(monster.def), stat(answer.def), true),
        },
        {
            key: "attribute",
            label: display(monster.attribute),
            result: compare(monster.attribute, answer.attribute, false),
        },
        {
            key: "level",
            label: guessRating.link
                ? `LINK-${guessRating.value}`
                : display(guessRating.value),
            result: compare(
                guessRating.value,
                guessRating.link === answerRating.link
                    ? answerRating.value
                    : null,
                true
            ),
        },
        {
            key: "race",
            label: display(monster.race || null),
            result: compare(monster.race || null, answer.race || null, false),
        },
        {
            key: "frame",
            label: display(frameLabel(monster.frameType)),
            result: compareFrame(monster.frameType, answer.frameType),
        },
    ];
};

export const RESULT_TILE = {
    match: "match",
    higher: "close",
    lower: "close",
    partial: "close",
    wrong: "wrong",
};

const EMOJI = { match: "🟩", close: "🟨", wrong: "🟥" };

/** Tile kinds ("match" | "close" | "wrong") for every guess, one row each. */
export const scoreRows = (guesses, answer) =>
    guesses.map((g) =>
        compareGuess(g, answer).map(({ result }) => RESULT_TILE[result])
    );

export const guessCount = (n) => `${n} ${n === 1 ? "guess" : "guesses"}`;

export const hintCount = (n) => `${n} ${n === 1 ? "hint" : "hints"}`;

/** "3 guesses" or "3 guesses, 1 hint". */
export const scoreSummary = (guesses, hints) =>
    [guessCount(guesses), hints > 0 && hintCount(hints)]
        .filter(Boolean)
        .join(", ");

/**
 * Wordle-style text for sharing a finished game. `eras` names the chosen
 * generations when they aren't all of them, since the card differs then.
 */
export const shareText = ({ guesses, answer, day, hints = 0, eras }) =>
    [
        `Yugiohdle #${day}${eras ? ` (${eras})` : ""} — ${scoreSummary(
            guesses.length,
            hints
        )}`,
        ...scoreRows(guesses, answer).map((row) =>
            row.map((kind) => EMOJI[kind]).join("")
        ),
        window.location.origin,
    ].join("\n");
