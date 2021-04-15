import { Fragment } from "react";
import Joke from "./Joke.js";

function JokeList({ title, jokes, onUpVote, onDownVote }) {
  return (
    <Fragment>
      <h2 className="Title">{title}</h2>
      <table className="JokeList" cellSpacing="0">
        <tbody>
          {jokes.map(jokeObject => {
          const { id, joke, upCount, downCount } = jokeObject;
          return (
            <Joke
              key={id}
              joke={joke}
              upCount={upCount || 0}
              downCount={downCount || 0}
              onUpVote={() => onUpVote(jokeObject)}
              onDownVote={() => onDownVote(jokeObject)}
            />
          );
        })}
        </tbody>
      </table>
    </Fragment>
  );
}

export default JokeList;
