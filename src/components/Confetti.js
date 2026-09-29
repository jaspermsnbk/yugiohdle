import { useMemo } from "react";
import "./Confetti.css";

const COLORS = ["var(--match)", "var(--close)", "var(--wrong)", "#2d6cdf", "#9b4dca"];
const PIECES = 60;

/** A one-off burst of falling paper, in plain CSS. Hidden under reduced motion. */
const Confetti = () => {
    // Random per piece, fixed for the life of the burst.
    const pieces = useMemo(
        () =>
            Array.from({ length: PIECES }, (_, i) => ({
                "--x": `${Math.random() * 100}vw`,
                "--drift": `${(Math.random() - 0.5) * 30}vw`,
                "--spin": `${(Math.random() - 0.5) * 1440}deg`,
                "--delay": `${Math.random() * 400}ms`,
                "--duration": `${1600 + Math.random() * 1200}ms`,
                background: COLORS[i % COLORS.length],
            })),
        []
    );

    return (
        <div className="confetti" aria-hidden="true">
            {pieces.map((style, i) => (
                <span key={i} className="confetti__piece" style={style} />
            ))}
        </div>
    );
};

export default Confetti;
