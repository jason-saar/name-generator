import express from "express";

const app = express();
const PORT = 5553;

app.get("/generate", (req, res) => {
    const { kind, theme = "high_fantasy", count = "1", seed } = req.query;

    // TODO VALIDATION LOGIC
    // kind - required & === person/place/thing
    // theme - if present must be known wordlist
    // count - if present must parse 1-50
    // seed - if present, must parse to int

    // test res
    res.json({
        names: ["Placeholder"],
        theme: theme,
        seed: 12345
    })

})

app.listen(PORT, () =>{
    console.log(`Name Generator is running on port ${PORT}`);
});