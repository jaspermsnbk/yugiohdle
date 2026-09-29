// The name hint: the answer's name with letters hidden, revealed left to
// right one hint at a time. Spaces and punctuation are always shown.

const isLetter = (ch) => /[\p{L}\p{N}]/u.test(ch);

export const letterCount = (name) => [...name].filter(isLetter).length;

/**
 * Splits the name into words of { ch, hidden } characters, with the first
 * `revealed` letters visible.
 */
export const maskName = (name, revealed) => {
    let seen = 0;
    return name.split(" ").map((word) =>
        [...word].map((ch) => {
            if (!isLetter(ch)) return { ch, hidden: false };
            seen += 1;
            return { ch, hidden: seen > revealed };
        })
    );
};
