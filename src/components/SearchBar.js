import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Autocomplete,
    Button,
    createFilterOptions,
    TextField,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { cardImageLargeUrl, cardImageUrl } from "../util/cards";
import {
    activeFilterCount,
    EMPTY_FILTERS,
    matchesFilters,
    statLine,
} from "../util/filters";
import FilterPanel from "./FilterPanel";
import "./SearchBar.css";

// Rendering thousands of rich options at once is slow; typing narrows it down.
const filterOptions = createFilterOptions({
    limit: 100,
    stringify: (m) => m.name,
});

// Only load a preview once the highlight settles, so arrowing through the
// list doesn't request an image per row.
const PREVIEW_DELAY_MS = 250;

const useSettled = (value, delay) => {
    const [settled, setSettled] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setSettled(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return settled;
};

const ZOOM_MARGIN = 8; // keep the enlarged card this far inside the window

/**
 * Hovering or focusing the preview shows the full-size card, big enough to
 * read, centered over the thumbnail but kept inside the window. The large
 * image only loads then; the small one fills in while it does.
 */
const CardPreview = ({ card }) => {
    const [zoomed, setZoomed] = useState(false);
    const thumbRef = useRef(null);
    const zoomRef = useRef(null);
    const show = () => setZoomed(true);
    const hide = () => setZoomed(false);

    // Position before paint. offsetWidth/Height ignore the zoom-in animation's
    // scale, so this measures the card's final size.
    useLayoutEffect(() => {
        const thumb = thumbRef.current;
        const zoom = zoomRef.current;
        if (!thumb || !zoom) return;
        const t = thumb.getBoundingClientRect();
        const place = (center, size, room) =>
            Math.min(
                Math.max(center - size / 2, ZOOM_MARGIN),
                room - size - ZOOM_MARGIN
            );
        zoom.style.left = `${place(
            t.left + t.width / 2,
            zoom.offsetWidth,
            window.innerWidth
        )}px`;
        zoom.style.top = `${place(
            t.top + t.height / 2,
            zoom.offsetHeight,
            window.innerHeight
        )}px`;
    }, [zoomed, card?.id]);

    if (!card) {
        return (
            <div className="search__preview">
                <span aria-hidden="true">?</span>
            </div>
        );
    }
    return (
        <div
            ref={thumbRef}
            className="search__preview search__preview--card"
            tabIndex={0}
            aria-label={`${card.name}: hover or focus to enlarge`}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            <img
                key={card.id}
                src={cardImageUrl(card.id)}
                alt={card.name}
                width={84}
                height={123}
            />
            {zoomed && (
                <div
                    ref={zoomRef}
                    className="card-zoom"
                    style={{
                        backgroundImage: `url(${cardImageUrl(card.id)})`,
                    }}
                    aria-hidden="true"
                >
                    <img key={card.id} src={cardImageLargeUrl(card.id)} alt="" />
                </div>
            )}
        </div>
    );
};

/**
 * Monster search with stat details, a card preview and optional filters.
 * `actions` (e.g. a submit button) sit next to the Filters button.
 */
const SearchBar = ({ monsters, value, onChange, loading, actions }) => {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [showFilters, setShowFilters] = useState(false);
    const [highlighted, setHighlighted] = useState(null);
    const preview = useSettled(highlighted ?? value, PREVIEW_DELAY_MS);

    const options = useMemo(
        () => monsters.filter((m) => matchesFilters(m, filters)),
        [monsters, filters]
    );
    const filterCount = activeFilterCount(filters);

    const changeFilters = (next) => {
        setFilters(next);
        // Drop a selection that the new filters exclude.
        if (value && !matchesFilters(value, next)) onChange(null);
    };

    return (
        <div className="search">
            <div className="search__row">
                <CardPreview card={preview} />
                <div className="search__controls">
                    <Autocomplete
                        disablePortal
                        loading={loading}
                        loadingText="Loading"
                        options={options}
                        filterOptions={filterOptions}
                        getOptionLabel={(m) => m.name}
                        isOptionEqualToValue={(a, b) => a.id === b.id}
                        value={value}
                        onChange={(_, v) => onChange(v)}
                        onHighlightChange={(_, m) => setHighlighted(m)}
                        onClose={() => setHighlighted(null)}
                        renderOption={(props, m) => (
                            <li {...props} key={m.id}>
                                <div className="search__option">
                                    <span className="search__option-name">
                                        {m.name}
                                    </span>
                                    <span className="search__option-stats">
                                        {statLine(m)}
                                    </span>
                                </div>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Monster" />
                        )}
                    />
                    <div className="search__actions">
                        <Button
                            size="small"
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowFilters((s) => !s)}
                            aria-expanded={showFilters}
                        >
                            Filters{filterCount > 0 && ` (${filterCount})`}
                        </Button>
                        {actions}
                    </div>
                </div>
            </div>
            {showFilters && (
                <FilterPanel
                    filters={filters}
                    onChange={changeFilters}
                    matchCount={options.length}
                    onClose={() => setShowFilters(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;
