# yugiohdle

its wordle but Yu Gi oH! enough said
https://yugiohdle.netlify.app/

accepted card types:
"Normal Monster",
"Normal Tuner Monster",
"Effect Monster",
"Tuner Monster",
"Flip Monster",
"Flip Effect Monster",
"Flip Tuner Effect Monster",
"Spirit Monster",
"Union Effect Monster",
"Gemini Monster",
"Pendulum Effect Monster",
"Pendulum Normal Monster",
"Pendulum Tuner Effect Monster",
"Ritual Monster",
"Ritual Effect Monster",
"Toon Monster",
"Fusion Monster",
"Synchro Monster",
"Synchro Tuner Monster",
"Synchro Pendulum Effect Monster",
"XYZ Monster",
"XYZ Pendulum Effect Monster",
"Link Monster",
"Pendulum Flip Effect Monster",
"Pendulum Effect Fusion Monster"

### daily card generations

`src/util/lineUpGenerations.json` tags each card in `lineUp.json` with its anime
era, so players can pick which generations the daily card comes from. The era
date ranges are in `src/util/generations.json`. After changing either file, run:

```
npm run lineup
```

and commit the regenerated `lineUpGenerations.json`.

### todo list:

-   [x] autocomplete search bar
-   [x] guess component
-   [x] save progress in localStorage
-   [x] refactor
