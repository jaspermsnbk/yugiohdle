import {
    Button,
    Chip,
    Slider,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import {
    ATTRIBUTES,
    CARD_TYPES,
    EMPTY_FILTERS,
    LEVEL_RANGE,
} from "../util/filters";
import "./FilterPanel.css";

const toggle = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const ChipGroup = ({ label, values, selected, onChange }) => (
    <fieldset className="filters__group">
        <legend>{label}</legend>
        <div className="filters__chips">
            {values.map((value) => {
                const on = selected.includes(value);
                return (
                    <Chip
                        key={value}
                        label={value}
                        size="small"
                        color={on ? "primary" : "default"}
                        variant={on ? "filled" : "outlined"}
                        aria-pressed={on}
                        onClick={() => onChange(toggle(selected, value))}
                    />
                );
            })}
        </div>
    </fieldset>
);

const FilterPanel = ({ filters, onChange, matchCount }) => {
    const set = (changes) => onChange({ ...filters, ...changes });

    return (
        <div className="filters">
            <ChipGroup
                label="Attribute"
                values={ATTRIBUTES}
                selected={filters.attributes}
                onChange={(attributes) => set({ attributes })}
            />
            <ChipGroup
                label="Card type"
                values={CARD_TYPES}
                selected={filters.types}
                onChange={(types) => set({ types })}
            />
            <fieldset className="filters__group">
                <legend>Link monsters</legend>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={filters.link}
                    onChange={(_, link) => link && set({ link })}
                >
                    <ToggleButton value="any">Any</ToggleButton>
                    <ToggleButton value="other">Not Link</ToggleButton>
                    <ToggleButton value="link">Link only</ToggleButton>
                </ToggleButtonGroup>
            </fieldset>
            <fieldset className="filters__group">
                <legend>
                    Level / Rank / Link rating: {filters.levels[0]}–
                    {filters.levels[1]}
                </legend>
                <Slider
                    size="small"
                    min={LEVEL_RANGE[0]}
                    max={LEVEL_RANGE[1]}
                    step={1}
                    marks
                    value={filters.levels}
                    onChange={(_, levels) => set({ levels })}
                    valueLabelDisplay="auto"
                    getAriaLabel={(i) => (i === 0 ? "Minimum" : "Maximum")}
                />
            </fieldset>
            <div className="filters__footer">
                <span>
                    {matchCount} {matchCount === 1 ? "monster" : "monsters"}{" "}
                    match
                </span>
                <Button size="small" onClick={() => onChange(EMPTY_FILTERS)}>
                    Clear filters
                </Button>
            </div>
        </div>
    );
};

export default FilterPanel;
