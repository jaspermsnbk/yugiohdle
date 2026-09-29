import { useState } from "react";
import {
    Alert,
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    TextField,
} from "@mui/material";
import { Guess, GuessHeader } from "../components";
import { useGame } from "../hooks/useGame";
import logo from "../util/yu-gi-oh-logo.jpg";
import "./Home.css";

const guessCount = (n) => `${n} ${n === 1 ? "guess" : "guesses"}`;

const Home = (props) => {
    const {
        status,
        monsters,
        answer,
        guesses,
        restoredCount,
        won,
        guess,
        hasGuessed,
    } = useGame();
    const [selected, setSelected] = useState(null);
    const [showWin, setShowWin] = useState(false);

    const canSubmit =
        status === "ready" && !won && selected && !hasGuessed(selected);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        if (guess(selected)) setShowWin(true);
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
                        <Autocomplete
                            disablePortal
                            loading={status === "loading"}
                            loadingText="Loading"
                            options={monsters}
                            getOptionLabel={(m) => m.name}
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            value={selected}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Monster" />
                            )}
                            onChange={(_, v) => setSelected(v)}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            style={{ margin: "10px" }}
                        >
                            Submit
                        </Button>
                    </>
                )}
                {won && (
                    <div className="status-line">
                        Solved in {guessCount(guesses.length)}. Come back
                        tomorrow for a new card!
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

            <Dialog open={showWin} onClose={() => setShowWin(false)}>
                <DialogTitle>You won!</DialogTitle>
                <DialogContent>
                    Today's card was <b>{answer?.name}</b>. You found it in{" "}
                    {guessCount(guesses.length)}.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowWin(false)}>Close</Button>
                </DialogActions>
            </Dialog>

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
