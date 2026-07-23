const BASE = "http://localhost:5553/generate";

async function get(params) {
    const res = await fetch(`${BASE}?${new URLSearchParams(params)}`);
    return res.json();
}

// Test same seed
const a = await get({ kind: "person", seed: 77 });
const b = await get({ kind: "person", seed: 77 });
console.log("seeded:", a.names[0], "|", b.names[0], a.names[0] === b.names[0] ? "MATCH" : "MISMATCH");

// Test diff seed
const c = await get({ kind: "person" });
const d = await get({ kind: "person" });
console.log("unseeded", c.names[0], `(${c.seed})`, "|", d.names[0], `(${d.seed})`);

// Test patterns
const e = await get({ kind: "person" });
const f = await get({ kind: "place" });
const g = await get({ kind: "thing" });
console.log(e.names[0], "|", f.names[0], "|", g.names[0]);