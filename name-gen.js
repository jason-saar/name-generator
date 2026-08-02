import express from "express";
import { splitmix32 } from "./rng.js";
import { generateName, themes } from "./generate.js";

const app = express();
const PORT = 5553;

const VALID_KINDS = ["person,", "place", "thing"];

app.get("/generate", (req, res) => {
    const { kind, theme = "high_fantasy", count = "1", seed } = req.query;

    // kind validation
    if (!kind || !VALID_KINDS.includes(kind)) {
        return res.status(400).json({
            error: `kind is required and must be one of: ${VALID_KINDS.join(", ")}`
        });
    }

    if (!themes[theme]) {
        return res.status(400).json({
            error: `unknown theme "${theme}". Available themes: ${Object.keys(themes).join(", ")}`
        });
    }

    let actualSeed;
    if (seed !== undefined) {
        // parse int base 10
        const parsedSeed = parseInt(seed, 10);
        if (!Number.isInteger(parsedSeed)) {
            return res.status(400).json({
                error: "seed must be an intenger"
            });
        }
        actualSeed = parsedSeed;
    } else {
        actualSeed = Math.floor(Math.random() * 2 ** 32);
    }

    const rng = splitmix32(actualSeed);

    // TODO: names array, for loop pushes generated names count times
    // update res.json to return names array

    res.json({
        names: [generateName(kind, theme, rng)],
        theme: theme,
        seed: actualSeed
    })

})

app.listen(PORT, () =>{
    console.log(`Name Generator is running on port ${PORT}`);
});