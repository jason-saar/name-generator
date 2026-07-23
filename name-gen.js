import express from "express";
import { splitmix32 } from "./rng.js";
import { generateName } from "./generate.js";

const app = express();
const PORT = 5553;

app.get("/generate", (req, res) => {
    const { kind, theme = "high_fantasy", count = "1", seed } = req.query;

    // TODO VALIDATION LOGIC
    // kind - required & === person/place/thing
    // theme - if present must be known wordlist
    // count - if present must parse 1-50
    // seed - if present, must parse to int

    const actualSeed = seed ? parseInt(seed) : Math.floor(Math.random() * 2 ** 32);
    const rng = splitmix32(actualSeed);

    // test res
    res.json({
        names: [generateName(kind, theme, rng)],
        theme: theme,
        seed: actualSeed
    })

})

app.listen(PORT, () =>{
    console.log(`Name Generator is running on port ${PORT}`);
});