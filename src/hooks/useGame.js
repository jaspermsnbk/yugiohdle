import { useEffect, useState } from "react";
import {
    findCard,
    getNumberOfDays,
    loadMonsters,
    readJSON,
    writeJSON,
} from "../util";
import cardData from "../util/lineUp.json";

const { cardTypes, lineUp } = cardData;
const PROGRESS_KEY = "yugiohdle:progress";

/**
 * Game state for today's puzzle. Progress is saved as { day, guessIds, won }
 * and only restored on the same day, so every day starts fresh.
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
    });
    const { status, monsters, answer, guesses, restoredCount, won } = game;

    useEffect(() => {
        let cancelled = false;

        const setUp = async () => {
            const list = await loadMonsters(cardTypes);
            const byId = new Map(list.map((m) => [m.id, m]));
            const target = await findCard(lineUp[day % lineUp.length], byId);
            if (cancelled) return;

            const saved = readJSON(PROGRESS_KEY);
            const restored =
                saved?.day === day
                    ? saved.guessIds.map((id) => byId.get(id)).filter(Boolean)
                    : [];
            setGame({
                status: "ready",
                monsters: list,
                answer: target,
                guesses: restored,
                restoredCount: restored.length,
                won: saved?.day === day && saved.won,
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

    /** Records a guess and returns true if it was the answer. */
    const guess = (monster) => {
        if (status !== "ready" || won || !monster || hasGuessed(monster)) {
            return false;
        }
        const next = [...guesses, monster];
        const isWin = monster.id === answer.id;
        setGame((g) => ({ ...g, guesses: next, won: isWin }));
        writeJSON(PROGRESS_KEY, {
            day,
            guessIds: next.map((g) => g.id),
            won: isWin,
        });
        return isWin;
    };

    return {
        day,
        status,
        monsters,
        answer,
        guesses,
        restoredCount,
        won,
        guess,
        hasGuessed,
    };
};
