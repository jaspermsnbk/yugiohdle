import { useState } from "react";
import { Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { shareText } from "../util/results";

/**
 * Opens the device share sheet where there is one, otherwise copies the
 * result to the clipboard and says so on the button.
 */
const ShareButton = ({ guesses, answer, day, hints, ...props }) => {
    const [label, setLabel] = useState("Share");

    const share = async () => {
        const text = shareText(guesses, answer, day, hints);
        if (navigator.share) {
            try {
                await navigator.share({ text });
                return;
            } catch (error) {
                if (error.name === "AbortError") return; // closed the sheet
            }
        }
        try {
            await navigator.clipboard.writeText(text);
            setLabel("Copied!");
        } catch {
            setLabel("Couldn't copy");
        }
        setTimeout(() => setLabel("Share"), 2000);
    };

    return (
        <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={share}
            {...props}
        >
            {label}
        </Button>
    );
};

export default ShareButton;
