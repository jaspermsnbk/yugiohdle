# Plan: next features

Build in this order: styling, then the win screen, then search, then the
generation filter. Each step builds on the one before, and the generation
filter needs the most data work.

Verified against the live API (2026-09-28):

- **Card images** load from
  `https://images.ygoprodeck.com/images/cards_small/{id}.jpg`, so the image
  address can be built from the card ID.
- **Release dates:** `cardinfo.php?misc=yes` returns both `tcg_date` and
  `ocg_date`. They can be far apart (Soul Hunter: OCG 1999, TCG 2015), so use
  the earlier of the two to decide a card's generation.

## 1. Typography and consistent rows (small)

- **Design tokens:** CSS variables on `:root` in a new `src/index.css` for the
  font, text sizes, spacing, border radius and the three result colors (match,
  close, wrong). Move the leftover `public/` styles into that file.
- **Font:** a single font. A system font stack costs nothing to load; one
  Google Font like Inter is the alternative. Set sizes for the title, prompt,
  table header and rows.
- **Aligned rows:** the header and every guess share one grid with fixed column
  widths, so long names never shift the columns. Style the header row
  differently from guesses.
- **Colored cells:** color each result cell as a tile (green, yellow or red) as
  well as showing the icon.
- **New rows:** fade or flip each new row in, with the animation turned off
  under `prefers-reduced-motion`.
- **Mobile:** remove the fixed `min-width` rules (700, 480 and 280px) in
  `Guess.css`, which cause horizontal scrolling on phones. Let the grid shrink
  to fit instead.

## 2. Win screen with score tiles (small to medium)

- **Score grid:** a Wordle-style grid from the saved guesses. Each guess
  becomes one row of 🟩 (match), 🟨 (higher/lower), 🟥 (wrong):

  ```
  Yugiohdle #1536 — 3 guesses
  🟥🟨🟥🟩🟥
  🟨🟨🟨🟩🟨
  🟩🟩🟩🟩🟩
  ```

- **Popup:** the grid, the answer's card image and a Share button in the
  existing dialog. Share uses `navigator.share` where available and copies to
  the clipboard otherwise.
- **Animation:** flip the winning row's tiles in turn, then a short confetti
  burst in plain CSS, with no new library.
- **After a reload:** show the grid inline next to the "Solved in N guesses"
  line.
- **Code:** put the grid logic in a small `results.js` shared by the table and
  the popup, so the colors and emoji always agree.

## 3. Better search (medium)

- **Stats in the dropdown:** use Autocomplete's `renderOption` to show ATK/DEF,
  level or `LINK-N`, and attribute next to each name. The cached card data
  already has these fields.
- **Image preview:** a small image of the highlighted or selected card beside
  the search box, loaded only when needed, because YGOPRODeck discourages heavy
  use of its images.
- **Stat filters:** optional filter chips for attribute, level range, Link or
  not, and card type. Card type needs `type` added to the cached fields, so the
  cache key must change to force older caches to refetch.
- **Name hint:** show the answer's name as blanks (`_ _ _ _   _ _ _ _ _ _`).
  Reveal letters after a set number of guesses or through a Hint button. Save
  hint use with today's progress and show it on the share grid.

## 4. Choose which generations the daily card comes from (largest)

- **Data:** a `scripts/buildLineUp.js` that runs once at build time. It fetches
  `misc=yes` data for the lineUp IDs and writes each card's generation into
  `lineUp.json`, so players never download release dates.
- **Generations:** a small table of date ranges maps release dates to the anime
  eras players know: Duel Monsters, GX, 5D's, ZEXAL, ARC-V, VRAINS, SEVENS and
  Go Rush!!.
- **Picking the card:** pick from only the chosen generations, using the same
  day count (`day % filtered.length`). Everyone with the same filter still gets
  the same card on the same day. Only the default "All generations" setting is
  shared by everyone; the settings screen should say so.
- **Saved progress:** store the chosen filter with today's progress, so
  switching filters mid-day doesn't mix guesses from two different answers.
  Lock the filter once today's game has started.
- **Settings:** a settings dialog with a checkbox per generation, remembered in
  localStorage.
- **Optional:** also limit the search list to those generations so guessing
  stays fair. This needs release dates for all ~9,400 monsters, which is a
  heavier version of the same build script.

## Before starting

Commit the current implementation work first, so each of these features starts
from a clean base.
