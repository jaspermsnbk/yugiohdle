import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import ContrastIcon from "@mui/icons-material/Contrast";
import { COLUMNS, compareGuess, RESULT_TILE } from "../util/results";
import "./Guess.css";

// Icons repeat what the tile color says, for colorblind players.
const ICONS = {
    match: CheckIcon,
    higher: KeyboardArrowUpIcon,
    lower: KeyboardArrowDownIcon,
    partial: ContrastIcon, // half right, e.g. Fusion vs Fusion Pendulum
    wrong: CloseIcon,
};

// Soft-hyphen break points for the longer Type and Frame words, so narrow
// tiles split them where it reads naturally, and only when they don't fit.
const BREAKS = {
    Creator: "Crea-tor",
    Cyberse: "Cy-berse",
    Dinosaur: "Dino-saur",
    Divine: "Di-vine",
    Dragon: "Dra-gon",
    Effect: "Ef-fect",
    Fusion: "Fu-sion",
    Illusion: "Illu-sion",
    Insect: "In-sect",
    Machine: "Ma-chine",
    Normal: "Nor-mal",
    Pendulum: "Pendu-lum",
    Psychic: "Psy-chic",
    Reptile: "Rep-tile",
    Ritual: "Ri-tual",
    Serpent: "Ser-pent",
    Spellcaster: "Spell-caster",
    Synchro: "Syn-chro",
    Thunder: "Thun-der",
    Warrior: "War-rior",
    Winged: "Wing-ed",
    Zombie: "Zom-bie",
};

const withBreaks = (text) =>
    String(text).replace(/[A-Za-z]+/g, (word) =>
        (BREAKS[word] ?? word).replace("-", "\u00AD")
    );

export const GuessHeader = () => (
    <div className="guess guess--header">
        {COLUMNS.map(({ key, label, short }) => (
            <div key={key} className="guess__label">
                {short ? (
                    <>
                        <span className="guess__label-long">{label}</span>
                        <span className="guess__label-short">{short}</span>
                    </>
                ) : (
                    label
                )}
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
                    <span className="tile__value">
                        {key === "race" || key === "frame"
                            ? withBreaks(label)
                            : label}
                    </span>
                    {key !== "name" && (
                        <Icon className="tile__icon" fontSize="small" />
                    )}
                </div>
            );
        })}
    </div>
);

export default Guess;
