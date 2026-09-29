// Compares a guess against the answer, column by column. Shared by the
// results table and anything else that summarizes a guess, so they agree.

export const COLUMNS = [
    { key: "name", label: "Name" },
    { key: "atk", label: "ATK" },
    { key: "def", label: "DEF" },
    { key: "attribute", label: "Attribute" },
    { key: "level", label: "Level" },
];

/** Link monsters have a Link rating instead of a level; the two never compare equal. */
const rating = (monster) =>
    monster?.linkval != null
        ? { value: monster.linkval, link: true }
        : { value: monster?.level, link: false };

const display = (value) => value ?? "—";

/**
 * "match", "higher"/"lower" (the answer's value is higher/lower than the
 * guess), or "wrong". Missing values (e.g. a Link monster's DEF) never match.
 */
const compare = (guess, answer, numeric) => {
    if (guess == null || answer == null) return "wrong";
    if (guess === answer) return "match";
    if (numeric) return guess > answer ? "lower" : "higher";
    return "wrong";
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
            label: display(monster.atk),
            result: compare(monster.atk, answer.atk, true),
        },
        {
            key: "def",
            label: display(monster.def),
            result: compare(monster.def, answer.def, true),
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
    ];
};

export const RESULT_TILE = {
    match: "match",
    higher: "close",
    lower: "close",
    wrong: "wrong",
};

const EMOJI = { match: "🟩", close: "🟨", wrong: "🟥" };

/** Tile kinds ("match" | "close" | "wrong") for every guess, one row each. */
export const scoreRows = (guesses, answer) =>
    guesses.map((g) =>
        compareGuess(g, answer).map(({ result }) => RESULT_TILE[result])
    );

export const guessCount = (n) => `${n} ${n === 1 ? "guess" : "guesses"}`;

/** Wordle-style text for sharing a finished game. */
export const shareText = (guesses, answer, day) =>
    [
        `Yugiohdle #${day} — ${guessCount(guesses.length)}`,
        ...scoreRows(guesses, answer).map((row) =>
            row.map((kind) => EMOJI[kind]).join("")
        ),
        window.location.origin,
    ].join("\n");
