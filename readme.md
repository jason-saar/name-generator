# Name Generator Microservice

## Description

A headless microservice that generates fantasy-style names (people, places, or things) from theme-based wordlists. The service is stateless and every response includes the seed used to generate it, so the callers can reproduce identical results on demand.

## Communication Contract

### Requesting Data

Send an HTTP GET to /generate with query paramaters:

| Parameter | Type | Description |
|---|---|---|
| kind | string | Type of name to generate (e.g. 'person', 'place, 'thing' **required** |
| theme | string | Wordlist to pull from (defaults to high_fantasy) |
| count | integer | How many names to return, 1-50 (defaults to 1) |
| seed | integer | Seeds the generator so the same seed reproduces the same results |

Only kind is required. The service is stateless and stores nothing between requests. Supplying the same seed with identical parameters reproduces identical results. Omitting seed produces random results each call.

```javascript
const params = new URLSearchParams({ theme: "nautical", count: 3 });
const res = await fetch(`http://localhost:5553/generate?${params}`);
```

### Receiving Data

The microservice responds with a JSON object: a names array of generated strings, plus the theme and seed that were used. If a seed is not provided, the service generates one and uses it to produce the results. Returning the seed is crucial to allow results to be replicable. The respone always includes an array regardless of how many names were returned, so the caller doesn't need to handle different response shapes.

If kind is missing, the requested theme worldlist doesn't exist, count is out of range [1, 50], or seed is not a valid integer, the service returns 400 with a JSON error object.

```json
{
    "names": ["Harrowport", "Palpagos Islands", "Mystery Island"],
    "theme": "nautical",
    "seed": 853732
}
```
 
```javascript
if (res.status === 200) {
    const data = await res.json();
    data.names.forEach(name => console.log(name));
} else {
    const err = await res.json();
    console.log("Generation failed: ", err.error);
}
```

### UML Sequence Diagram

See name_gen.png in this repo