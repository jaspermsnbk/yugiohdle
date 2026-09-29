import { useEffect, useRef, useState } from "react";
import {
    findCard,
    getNumberOfDays,
    loadMonsters,
    readJSON,
    writeJSON,
} from "../util";
import {
    ALL_GENERATIONS,
    loadGenerationSetting,
    normalizeGenerations,
    pickCardId,
    saveGenerationSetting,
} from "../util/generations";
import { letterCount } from "../util/hint";
import cardData from "../util/lineUp.json";

const { cardTypes, lineUp } = cardData;
const PROGRESS_KEY = "yugiohdle:progress";

/**
 * Game state for today's puzzle. Progress is saved as
 * { day, guessIds, won, hints, generations } and only restored on the same
 * day, so every day starts fresh. The generations a game started with stay
 * locked for the rest of that day.
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
        generations: ALL_GENERATIONS, // eras the daily card is picked from
    });
    const {
        status,
        monsters,
        answer,
        guesses,
        restoredCount,
        won,
        hints,
        generations,
    } = game;
    const byIdRef = useRef(new Map());
    const pickRef = useRef(0); // ignores stale picks when eras change quickly

    useEffect(() => {
        let cancelled = false;

        const setUp = async () => {
            const list = await loadMonsters(cardTypes);
            const byId = new Map(list.map((m) => [m.id, m]));
            byIdRef.current = byId;

            const saved = readJSON(PROGRESS_KEY);
            const today = saved?.day === day ? saved : null;
            // Progress from before the filter existed was played with all eras.
            const gens = today
                ? normalizeGenerations(today.generations ?? ALL_GENERATIONS)
                : loadGenerationSetting();
            const target = await findCard(pickCardId(lineUp, day, gens), byId);
            if (cancelled) return;

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
                generations: gens,
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
            generations,
        });
    };

    const started = guesses.length > 0 || hints > 0;
    const canChangeGenerations = status === "ready" && !started;

    /** Changes the eras for the daily card; only before today's game starts. */
    const setGenerations = async (ids) => {
        if (!canChangeGenerations) return;
        const gens = normalizeGenerations(ids);
        saveGenerationSetting(gens);
        const pick = ++pickRef.current;
        setGame((g) => ({ ...g, generations: gens }));
        try {
            const target = await findCard(
                pickCardId(lineUp, day, gens),
                byIdRef.current
            );
            if (pick === pickRef.current) {
                setGame((g) => ({ ...g, answer: target }));
            }
        } catch (error) {
            console.error(error);
            if (pick === pickRef.current) {
                setGame((g) => ({ ...g, status: "error" }));
            }
        }
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
        generations,
        canChangeGenerations,
        setGenerations,
    };
};
