import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { guessCount } from "../util/results";
import ScoreGrid from "./ScoreGrid";
import ShareButton from "./ShareButton";
import "./WinDialog.css";

const cardImage = (id) =>
    `https://images.ygoprodeck.com/images/cards_small/${id}.jpg`;

const WinDialog = ({ open, onClose, guesses, answer, day }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle className="win__title">You won!</DialogTitle>
        <DialogContent className="win__content">
            {answer && (
                <img
                    className="win__card"
                    src={cardImage(answer.id)}
                    alt={answer.name}
                    width={168}
                    height={246}
                />
            )}
            <div className="win__summary">
                <p>
                    Today's card was <b>{answer?.name}</b>. You found it in{" "}
                    {guessCount(guesses.length)}.
                </p>
                <ScoreGrid guesses={guesses} answer={answer} />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            <ShareButton guesses={guesses} answer={answer} day={day} />
        </DialogActions>
    </Dialog>
);

export default WinDialog;
