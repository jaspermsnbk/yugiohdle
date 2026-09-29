import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { COLUMNS, compareGuess, RESULT_TILE } from "../util/results";
import "./Guess.css";

// Icons repeat what the tile color says, for colorblind players.
const ICONS = {
    match: CheckIcon,
    higher: KeyboardArrowUpIcon,
    lower: KeyboardArrowDownIcon,
    wrong: CloseIcon,
};

export const GuessHeader = () => (
    <div className="guess guess--header">
        {COLUMNS.map(({ key, label }) => (
            <div key={key} className="guess__label">
                {label}
            </div>
        ))}
    </div>
);

/** One row of the results table. `animate` flips the tiles in, for new guesses. */
const Guess = ({ monster, answer, animate }) => (
    <div className={`guess${animate ? " guess--new" : ""}`}>
        {compareGuess(monster, answer).map(({ key, label, result }, i) => {
            const Icon = ICONS[result];
            return (
                <div
                    key={key}
                    className={`tile tile--${key} tile--${RESULT_TILE[result]}`}
                    style={{ "--i": i }}
                >
                    <span className="tile__value">{label}</span>
                    {key !== "name" && (
                        <Icon className="tile__icon" fontSize="small" />
                    )}
                </div>
            );
        })}
    </div>
);

export default Guess;
