import { scoreRows } from "../util/results";
import "./ScoreGrid.css";

/** Small colored squares, one row per guess — the visual version of the share text. */
const ScoreGrid = ({ guesses, answer }) => (
    <div className="score-grid" aria-label="Score grid">
        {scoreRows(guesses, answer).map((row, r) => (
            <div key={r} className="score-grid__row">
                {row.map((kind, c) => (
                    <span
                        key={c}
                        className={`score-grid__cell tile--${kind}`}
                    />
                ))}
            </div>
        ))}
    </div>
);

export default ScoreGrid;
