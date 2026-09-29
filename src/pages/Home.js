import { useEffect, useState } from "react";
import { Alert, Button, Link } from "@mui/material";
import {
    Confetti,
    Guess,
    GuessHeader,
    NameHint,
    ScoreGrid,
    SearchBar,
    ShareButton,
    WinDialog,
} from "../components";
import { useGame } from "../hooks/useGame";
import { scoreSummary } from "../util/results";
import logo from "../util/yu-gi-oh-logo.jpg";
import "./Home.css";

// Wait for the winning row's tiles to finish flipping before celebrating.
const WIN_DELAY_MS = 900;
const CONFETTI_MS = 3500;

const Home = (props) => {
    const {
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
    } = useGame();
    const [selected, setSelected] = useState(null);
    const [showWin, setShowWin] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const [justWon, setJustWon] = useState(false);

    useEffect(() => {
        if (!justWon) return;
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const show = setTimeout(
            () => {
                setShowWin(true);
                setCelebrating(true);
            },
            reduceMotion ? 0 : WIN_DELAY_MS
        );
        const stop = setTimeout(
            () => setCelebrating(false),
            WIN_DELAY_MS + CONFETTI_MS
        );
        return () => {
            clearTimeout(show);
            clearTimeout(stop);
        };
    }, [justWon]);

    const canSubmit =
        status === "ready" && !won && selected && !hasGuessed(selected);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        if (guess(selected)) setJustWon(true);
    };

    return (
        <div {...props} id="home">
            <img className="title" src={logo} alt={"yu-gi-oh"}></img>
            <div id="form-container">
                <div className="question">Enter a couple of Guesses</div>
                {status === "error" ? (
                    <Alert severity="error">
                        Couldn't load the card list. Check your connection and
                        refresh the page.
                    </Alert>
                ) : (
                    <>
                        {status === "ready" && !won && (
                            <NameHint
                                name={answer.name}
                                revealed={hints}
                                canHint={canHint}
                                onHint={takeHint}
                            />
                        )}
                        <SearchBar
                            monsters={monsters}
                            value={selected}
                            onChange={setSelected}
                            loading={status === "loading"}
                            actions={
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                >
                                    Submit
                                </Button>
                            }
                        />
                    </>
                )}
                {won && (
                    <div className="solved">
                        <div className="status-line">
                            Solved in {scoreSummary(guesses.length, hints)}.
                            Come back tomorrow for a new card!
                        </div>
                        <ScoreGrid guesses={guesses} answer={answer} />
                        <ShareButton
                            guesses={guesses}
                            answer={answer}
                            day={day}
                            hints={hints}
                            size="small"
                        />
                    </div>
                )}

                <div className="guess-container">
                    <GuessHeader />
                    {guesses.map((g, i) => (
                        <Guess
                            key={g.id}
                            monster={g}
                            answer={answer}
                            animate={i >= restoredCount}
                        />
                    ))}
                </div>
            </div>

            <WinDialog
                open={showWin}
                onClose={() => setShowWin(false)}
                guesses={guesses}
                answer={answer}
                day={day}
                hints={hints}
            />
            {celebrating && <Confetti />}

            <div className="footer">
                {"a side project by Jasper Mesenbrink "}
                <Link
                    component={Button}
                    href="https://github.com/jaspermsnbk/yugiohdle"
                    color={"primary"}
                    target="_blank"
                >
                    GitHub
                </Link>
            </div>
        </div>
    );
};

export default Home;
