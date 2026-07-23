import fs from "fs";
import path from "path";

const WORDLIST_DIR = "./wordlists";

// Load every wordlist in the directory at startup
// Adding a theme by dropping a JSON file in ./wordlists
const themes = {};
for (const file of fs.readdirSync(WORDLIST_DIR)) {
    if (!file.endsWith(".json"))        // skip stray files
        continue;
    const name = path.basename(file, ".json");
    themes[name] = JSON.parse(fs.readFileSync(path.join(WORDLIST_DIR, file), "utf-8"));
}