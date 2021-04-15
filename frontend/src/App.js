import { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import JokeList from './JokeList';
import './App.css';

function App() {
  const [jokes, setJokes] = useState({});
  const [randomJokes, setRandomJokes] = useState([]);
  const [loadingRandomJokes, setLoadingRandomJokes] = useState(false);
  
  const fetchRandomJokes = () => {
    setLoadingRandomJokes(true);
    axios.get("/randomjokes/20")
      .then(res => {
        setRandomJokes(res.data.jokes);
        setLoadingRandomJokes(false);
      });
  };

  const fetchJokes = () => {
    axios.get("/jokes").then(res => setJokes(res.data.jokes));
  };

  const incrementVote = (jokeObject, label) => {
    const { id } = jokeObject;
    const newValue = ((jokes[id] || {})[label] || 0) + 1;
    const newJokeObject = {
      ...jokeObject,
      [label]: newValue
    };
    setJokes({
      ...jokes,
      [id]: newJokeObject
    });
  };

  const upVote = jokeObject => {
    axios.post("/upvote", jokeObject);
    incrementVote(jokeObject, "upCount");
  };

  const downVote = jokeObject => {
    axios.post("/downvote", jokeObject);
    incrementVote(jokeObject, "downCount");
  };

  const randomJokesWithVoteCounts = randomJokes.map(jokeObject => {
    const { id } = jokeObject;
    const upCount = (jokes[id] || {}).upCount || 0;
    const downCount = (jokes[id] || {}).downCount || 0;
    return {
      ...jokeObject,
      upCount,
      downCount
    };
  });

  const getTopJokes = (n, label) => (
    Object.values(jokes).filter((jokeObject) => jokeObject[label] > 0)
      .sort((a, b) => b[label] - a[label]).slice(0, n)
  );

  const fetchAllJokes = () => {
    fetchRandomJokes();
    fetchJokes();
  }

  useEffect(fetchAllJokes, []);

  return (
    <Fragment>
      <JokeList title="Most Liked Jokes" jokes={getTopJokes(5, "upCount")} onUpVote={upVote} onDownVote={downVote}/>
      <JokeList title="Most Disliked Jokes" jokes={getTopJokes(5, "downCount")} onUpVote={upVote} onDownVote={downVote}/>
      <button className="RefreshButton" onClick={fetchJokes}>Refresh Top Jokes</button>
      <JokeList title="Random Jokes" jokes={randomJokesWithVoteCounts} onUpVote={upVote} onDownVote={downVote}/>
      <button className="RefreshButton" onClick={fetchAllJokes} disabled={loadingRandomJokes}>
        {loadingRandomJokes ? "Loading..." : "Get New Jokes"}
      </button>
    </Fragment>
  );
}

export default App;
