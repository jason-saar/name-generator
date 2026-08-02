import express from "express";
import { splitmix32 } from "./rng.js";
import { generateName, themes } from "./generate.js";

const app = express();
const PORT = 5553;

const VALID_KINDS = ["person", "place", "thing"];
const MIN_COUNT = 1;
const MAX_COUNT = 50;

app.get("/generate", (req, res) => {
    const { kind, theme = "high_fantasy", count = "1", seed } = req.query;

    // kind validation
    if (!kind || !VALID_KINDS.includes(kind)) {
        return res.status(400).json({
            error: `kind is required and must be one of: ${VALID_KINDS.join(", ")}`
        });
    }

    // theme validation
    if (!themes[theme]) {
        return res.status(400).json({
            error: `unknown theme "${theme}". Available themes: ${Object.keys(themes).join(", ")}`
        });
    }

    // count validation
    const parsedCount = parseInt(count, 10);
    if (!Number.isInteger(parsedCount) || parsedCount < MIN_COUNT || parsedCount > MAX_COUNT) {
        return res.status(400).json({
            error: `count must be an integer between ${MIN_COUNT} and ${MAX_COUNT}`
        })
    }

    // seed validation
    let actualSeed;
    if (seed !== undefined) {
        // parse int base 10
        const parsedSeed = parseInt(seed, 10);
        if (!Number.isInteger(parsedSeed)) {
            return res.status(400).json({
                error: "seed must be an integer"
            });
        }
        actualSeed = parsedSeed;
    } else {
        actualSeed = Math.floor(Math.random() * 2 ** 32);
    }

    const rng = splitmix32(actualSeed);

    // names array, for loop pushes generated names count times
    const names = [];

    for (let i = 0; i < parsedCount; i++) {
        names.push(generateName(kind, theme, rng));
    }

    res.json({
        names: names,
        theme: theme,
        seed: actualSeed
    })

})

app.listen(PORT, () =>{
    console.log(`Name Generator is running on port ${PORT}`);
});