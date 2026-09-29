import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import "./Guess.css";
import { red, yellow } from "@mui/material/colors";

const HEADER = {
    name: "NAME",
    atk: "ATK",
    def: "DEF",
    attribute: "ATTR",
    level: "LVL",
};

/**
 * Icon comparing a guessed value to the answer: check on a match, an arrow
 * pointing toward the answer for numeric stats, otherwise a cross. Missing
 * values (e.g. a Link monster's DEF) never match.
 */
const CompareIcon = ({ guess, answer, numeric }) => {
    if (guess == null || answer == null)
        return <CloseIcon sx={{ color: red[600] }} />;
    if (guess === answer) return <CheckIcon color="success" />;
    if (numeric && guess > answer)
        return <KeyboardArrowDownIcon sx={{ color: yellow[600] }} />;
    if (numeric && guess < answer)
        return <KeyboardArrowUpIcon sx={{ color: yellow[600] }} />;
    return <CloseIcon sx={{ color: red[600] }} />;
};

/** Link monsters have a Link rating instead of a level; the two never compare equal. */
const rating = (monster) =>
    monster?.linkval != null
        ? { value: monster.linkval, link: true }
        : { value: monster?.level, link: false };

const display = (value) => value ?? "—";

/** One row of the results table. Renders the column headers when isTitle is set. */
const Guess = ({ isTitle, monster, answer }) => {
    if (isTitle) {
        return (
            <div className="guess">
                {Object.entries(HEADER).map(([key, label]) => (
                    <div key={key} className={`guesschild ${key}`}>
                        {label}
                    </div>
                ))}
            </div>
        );
    }

    const guessRating = rating(monster);
    const answerRating = rating(answer);

    return (
        <div className="guess">
            <div className="guesschild name">{monster.name}</div>
            <div className="guesschild atk">
                {display(monster.atk)}
                <CompareIcon guess={monster.atk} answer={answer.atk} numeric />
            </div>
            <div className="guesschild def">
                {display(monster.def)}
                <CompareIcon guess={monster.def} answer={answer.def} numeric />
            </div>
            <div className="guesschild attr">
                {display(monster.attribute)}
                <CompareIcon
                    guess={monster.attribute}
                    answer={answer.attribute}
                />
            </div>
            <div className="guesschild lvl">
                {guessRating.link
                    ? `LINK-${guessRating.value}`
                    : display(guessRating.value)}
                <CompareIcon
                    guess={guessRating.value}
                    answer={
                        guessRating.link === answerRating.link
                            ? answerRating.value
                            : null
                    }
                    numeric
                />
            </div>
        </div>
    );
};

export default Guess;
