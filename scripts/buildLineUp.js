// Tags every card in src/util/lineUp.json with the generation (anime era) it
// was released in, so the app can pick the daily card from chosen eras
// without players downloading release dates.
//
// Run it after changing the lineUp or the era table, then commit the result:
//   npm run lineup
//
// It writes src/util/lineUpGenerations.json: an array parallel to `lineUp`
// holding each card's generation id, or null when the API has no release
// date. It's a separate file so the hand-formatted lineUp.json stays as is.

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
const LINEUP_PATH = path.join(__dirname, "../src/util/lineUp.json");
const OUT_PATH = path.join(__dirname, "../src/util/lineUpGenerations.json");
const { generations } = require("../src/util/generations.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Earlier of the TCG and OCG release dates, as "YYYY-MM-DD". */
const releaseDate = (card) => {
    const { tcg_date, ocg_date } = card.misc_info?.[0] ?? {};
    return [tcg_date, ocg_date].filter(Boolean).sort()[0] ?? null;
};

const generationOf = (date) => {
    if (!date) return null;
    let id = null;
    for (const g of generations) if (date >= g.from) id = g.id;
    return id;
};

const main = async () => {
    const data = JSON.parse(fs.readFileSync(LINEUP_PATH, "utf8"));

    console.log("Fetching release dates for all monsters…");
    const { data: all } = await axios.get(API, {
        params: { type: data.cardTypes.join(","), misc: "yes" },
    });
    const dates = new Map(all.data.map((c) => [c.id, releaseDate(c)]));

    // Alternate-art and old prerelease ids aren't in the list; the API maps
    // them to the real card. Stay well under its 20 requests/second limit.
    const missing = data.lineUp.filter((id) => !dates.has(id));
    console.log(`Looking up ${missing.length} ids individually…`);
    for (const id of missing) {
        const { data: one } = await axios.get(API, {
            params: { id, misc: "yes" },
        });
        dates.set(id, releaseDate(one.data[0]));
        await sleep(100);
    }

    const result = data.lineUp.map((id) => generationOf(dates.get(id)));
    // One entry per line, so regenerating gives a readable diff.
    const lines = result.map((g) => "    " + JSON.stringify(g));
    fs.writeFileSync(OUT_PATH, "[\n" + lines.join(",\n") + "\n]\n");

    const counts = {};
    result.forEach((g) => (counts[g] = (counts[g] ?? 0) + 1));
    console.log("Cards per generation:", counts);
};

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
