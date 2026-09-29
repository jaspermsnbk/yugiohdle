import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { cardImageUrl } from "../util/cards";
import { scoreSummary } from "../util/results";
import ScoreGrid from "./ScoreGrid";
import ShareButton from "./ShareButton";
import "./WinDialog.css";

const WinDialog = ({
    open,
    onClose,
    guesses,
    answer,
    day,
    hints,
    generations,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle className="win__title">You won!</DialogTitle>
        <DialogContent className="win__content">
            {answer && (
                <img
                    className="win__card"
                    src={cardImageUrl(answer.id)}
                    alt={answer.name}
                    width={168}
                    height={246}
                />
            )}
            <div className="win__summary">
                <p>
                    Today's card was <b>{answer?.name}</b>. You found it in{" "}
                    {scoreSummary(guesses.length, hints)}.
                </p>
                <ScoreGrid guesses={guesses} answer={answer} />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            <ShareButton
                guesses={guesses}
                answer={answer}
                day={day}
                hints={hints}
                generations={generations}
            />
        </DialogActions>
    </Dialog>
);

export default WinDialog;
