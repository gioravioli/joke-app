const express = require("express");
const fetch = require('node-fetch');

const PORT = 3001;
const JOKE_API = "https://icanhazdadjoke.com/";
const HEADERS = { "Accept": "application/json" };
const NUM_RETRIES = 10;

const JOKES = {};

const app = express();
app.use(express.json());

app.get("/randomjokes/:n", async (req, res) => {
  let numTries = 0;
  const jokes = [];
  const uniqueIds = new Set();
  while (jokes.length < req.params.n && numTries < NUM_RETRIES) {
    const { joke, id } = await fetch(JOKE_API, { headers: HEADERS })
      .then(res => res.json());
    if (id && joke && !uniqueIds.has(id)) {
      jokes.push({ joke, id });
      uniqueIds.add(id);
    } else {
      numTries ++;
    }
  }
  res.json({ jokes });
});

app.get("/jokes", (req, res) => {
  res.json({ jokes: JOKES });
});

app.post("/upvote", (req, res) => {
  const { id } = req.body;
  JOKES[id] = incrementCount(JOKES[id] || {}, req.body, 'upCount');
  res.status(201).end();
});

app.post("/downvote", (req, res) => {
  const { id } = req.body;
  JOKES[id] = incrementCount(JOKES[id] || {}, req.body, 'downCount');
  res.status(201).end();
});

function incrementCount(serverJokeObject, clientJokeObject, label) {
  const { id, joke } = clientJokeObject;
  const upCount = serverJokeObject.upCount || 0;
  const downCount = serverJokeObject.downCount || 0;
  const newJokeObject = { id, joke, upCount, downCount };
  newJokeObject[label]++;
  return newJokeObject;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
