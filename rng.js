// SplitMix32 PRNG — public domain (bryc, https://github.com/bryc/code/blob/master/jshash/PRNGs.md)
//
// Math.random() can't be seeded, so we need a deterministic generator to support
// the reproducible-results guarantee in the communication contract. Chose this
// over Mulberry32, which is documented as skipping roughly a third of all
// 32-bit values.

export function splitmix32(seed) {
    return function() {
        // Advance state by an odd constant (Weyl sequence).
        // Guarantees all 2^32 states are visited before repeating.
        seed |= 0;
        seed = seed + 0x9e3779b9 | 0;

        // Hash the state through alternating XOR-shift and multiply rounds,
        // so consecutive states produce unrelated outputs.
        let t = seed ^ seed >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        t = t ^ t >>> 15;
        return (t >>> 0) / 4294967296;      // unsigned 32-bit -> [0, 1)
    }
}