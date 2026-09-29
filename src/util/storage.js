// localStorage can be unavailable (private browsing, blocked site data) or
// full, so every access fails soft: reads return null and writes are skipped.

export const readJSON = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
};

export const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore; the game still works, it just won't remember anything
    }
};
