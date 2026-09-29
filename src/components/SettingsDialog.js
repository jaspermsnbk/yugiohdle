import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import {
    ALL_GENERATIONS,
    GENERATION_COUNTS,
    GENERATIONS,
    isAllGenerations,
} from "../util/generations";
import "./SettingsDialog.css";

/** Choose which anime eras the daily card comes from. */
const SettingsDialog = ({ open, onClose, generations, onChange, locked }) => {
    const toggle = (id) => {
        const next = generations.includes(id)
            ? generations.filter((g) => g !== id)
            : [...generations, id];
        if (next.length) onChange(next); // at least one era stays chosen
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle className="settings__title">Settings</DialogTitle>
            <DialogContent>
                <h3 className="settings__heading">Daily card generations</h3>
                <p className="settings__note">
                    With every generation chosen you get the same card as
                    everyone else. Any other choice gives you your own daily
                    card.
                </p>
                {locked && (
                    <Alert severity="info" className="settings__locked">
                        Today's game has started, so this can change tomorrow.
                    </Alert>
                )}
                <FormGroup>
                    {GENERATIONS.map(({ id, name }) => (
                        <FormControlLabel
                            key={id}
                            disabled={locked}
                            control={
                                <Checkbox
                                    checked={generations.includes(id)}
                                    onChange={() => toggle(id)}
                                />
                            }
                            label={
                                <span>
                                    {name}{" "}
                                    <span className="settings__count">
                                        {(
                                            GENERATION_COUNTS[id] ?? 0
                                        ).toLocaleString()}{" "}
                                        cards
                                    </span>
                                </span>
                            }
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={locked || isAllGenerations(generations)}
                    onClick={() => onChange(ALL_GENERATIONS)}
                >
                    Select all
                </Button>
                <Button variant="contained" onClick={onClose}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;
