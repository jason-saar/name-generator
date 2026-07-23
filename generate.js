import fs from "fs";
import path from "path";

const WORDLIST_DIR = "./wordlists";

// Templates per kind. Slot names must match wordlist keys
// No code change needed to add patterns
// Duplicate an entry to weight it
const patterns = {
    person: ["{given} {surname}", "{title} {given} {surname}"],
    place: ["{adjective}{noun}", "{adjective}{noun} {suffix}"],
    thing: ["{adjective} {noun}"]
};

// Load every wordlist in the directory at startup
// Add a theme by dropping a JSON file in ./wordlists
const themes = {};
for (const file of fs.readdirSync(WORDLIST_DIR)) {
    if (!file.endsWith(".json"))        // skip stray files
        continue;
    const name = path.basename(file, ".json");
    themes[name] = JSON.parse(fs.readFileSync(path.join(WORDLIST_DIR, file), "utf-8"));
}

// RNG is passed rather than using Math.random(), so the generator
// is reproducible from a seed. Every random choice goes through this.
function pick(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
}

export function generateName(kind, theme, rng) {
    const slots = themes[theme][kind];              // shorthand
    const pattern = pick(patterns[kind], rng);      // Pick random pattern

    // Replace each {slot} with a random word from that slot's array
    // e.g. match = "{given}", slot = "given"
    return pattern.replace(/\{(\w+)\}/g, (match, slot) => pick(slots[slot], rng));
}

// TODO: generateMany