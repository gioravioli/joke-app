function Joke({ joke, upCount, downCount, onUpVote, onDownVote }) {
  return (
    <tr className="Joke">
      <td className="Content">{joke}</td>
      <td className="UpButton"><button onClick={onUpVote}>Like</button>({upCount})</td>
      <td className="DownButton"><button onClick={onDownVote}>Dislike</button>({downCount})</td>
    </tr>
  );
}

export default Joke;
