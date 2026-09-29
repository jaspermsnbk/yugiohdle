import { useEffect, useState } from "react";
import {
    findCard,
    getNumberOfDays,
    loadMonsters,
    readJSON,
    writeJSON,
} from "../util";
import { letterCount } from "../util/hint";
import cardData from "../util/lineUp.json";

const { cardTypes, lineUp } = cardData;
const PROGRESS_KEY = "yugiohdle:progress";

/**
 * Game state for today's puzzle. Progress is saved as
 * { day, guessIds, won, hints } and only restored on the same day, so every
 * day starts fresh.
 */
export const useGame = () => {
    const [day] = useState(getNumberOfDays);
    // One state object so a restored game renders in a single update; React 17
    // doesn't batch setState calls made after an await.
    const [game, setGame] = useState({
        status: "loading", // loading | ready | error
        monsters: [],
        answer: null,
        guesses: [],
        restoredCount: 0, // guesses loaded from a previous visit today
        won: false,
        hints: 0, // name-hint letters revealed
    });
    const { status, monsters, answer, guesses, restoredCount, won, hints } =
        game;

    useEffect(() => {
        let cancelled = false;

        const setUp = async () => {
            const list = await loadMonsters(cardTypes);
            const byId = new Map(list.map((m) => [m.id, m]));
            const target = await findCard(lineUp[day % lineUp.length], byId);
            if (cancelled) return;

            const saved = readJSON(PROGRESS_KEY);
            const today = saved?.day === day ? saved : null;
            const restored = (today?.guessIds ?? [])
                .map((id) => byId.get(id))
                .filter(Boolean);
            setGame({
                status: "ready",
                monsters: list,
                answer: target,
                guesses: restored,
                restoredCount: restored.length,
                won: Boolean(today?.won),
                hints: today?.hints ?? 0,
            });
        };

        setUp().catch((error) => {
            console.error(error);
            if (!cancelled) setGame((g) => ({ ...g, status: "error" }));
        });
        return () => {
            cancelled = true;
        };
    }, [day]);

    const hasGuessed = (monster) => guesses.some((g) => g.id === monster?.id);

    const update = (changes) => {
        const next = { guesses, won, hints, ...changes };
        setGame((g) => ({ ...g, ...changes }));
        writeJSON(PROGRESS_KEY, {
            day,
            guessIds: next.guesses.map((g) => g.id),
            won: next.won,
            hints: next.hints,
        });
    };

    /** Records a guess and returns true if it was the answer. */
    const guess = (monster) => {
        if (status !== "ready" || won || !monster || hasGuessed(monster)) {
            return false;
        }
        const isWin = monster.id === answer.id;
        update({ guesses: [...guesses, monster], won: isWin });
        return isWin;
    };

    const canHint =
        status === "ready" && !won && hints < letterCount(answer.name);

    /** Reveals one more letter of the answer's name. */
    const takeHint = () => {
        if (canHint) update({ hints: hints + 1 });
    };

    return {
        day,
        status,
        monsters,
        answer,
        guesses,
        restoredCount,
        won,
        hints,
        guess,
        hasGuessed,
        canHint,
        takeHint,
    };
};
