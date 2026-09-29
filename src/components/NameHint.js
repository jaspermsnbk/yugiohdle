import { Button } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { maskName } from "../util/hint";
import "./NameHint.css";

/** The answer's name as blanks, plus a button that reveals the next letter. */
const NameHint = ({ name, revealed, canHint, onHint }) => (
    <div className="name-hint">
        <div
            className="name-hint__name"
            aria-label={`Name hint: ${revealed} letters revealed`}
        >
            {maskName(name, revealed).map((word, w) => (
                <span key={w} className="name-hint__word">
                    {word.map(({ ch, hidden }, i) => (
                        <span
                            key={i}
                            className={`name-hint__char${
                                hidden ? " name-hint__char--hidden" : ""
                            }`}
                        >
                            {hidden ? "" : ch}
                        </span>
                    ))}
                </span>
            ))}
        </div>
        <Button
            size="small"
            startIcon={<LightbulbOutlinedIcon />}
            onClick={onHint}
            disabled={!canHint}
        >
            Hint
        </Button>
    </div>
);

export default NameHint;
