import { useState, useEffect } from "react";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        cells: lines[i],
        winner: squares[a],
      };
    }
  }
  return null;
}

function isGameEndedWithoutAWinner() {
  const squares = document.getElementsByClassName("square");
  return [...squares].filter(
    (square) => square.textContent === ""
  ).length > 0 ? false : true;
}

function Square({ value, id, onSquareClick }) {
  return (
    <button className="square" id={id} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gameEndedWithoutAWinner }) {
  let status;
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const getWinner = calculateWinner(squares);
   if (getWinner?.winner) {
    getWinner?.cells.forEach((square) => {
      document.getElementById(square).classList.add("win");
    });
    status = "Winner: " + getWinner?.winner[0];
  } else if (!getWinner?.winner && gameEndedWithoutAWinner) {
    status = "No Winner, start all over";
  } else {
    const squares = document.getElementsByClassName("square");
    [...squares].forEach((square) => {
      square.classList.remove("win");
    });
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[1, 2, 3].map((val, index) => (
        <div className="board-row" key={index}>
          {[0, 1, 2].map((value) => (
            <Square
              key={val + index * 2 + value - 1}
              id={val + index * 2 + value - 1}
              value={squares[val + index * 2 + value - 1]}
              onSquareClick={() => handleClick(val + index * 2 + value - 1)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isMovesInAsc, setMovesInAsc] = useState(true);
  const [gameEndedWithoutAWinner, setGameEndedWithoutAWinner] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  useEffect(() => {
    if (isGameEndedWithoutAWinner()) {
      setGameEndedWithoutAWinner(true)
    } else {
      setGameEndedWithoutAWinner(false)
    }
  }, [currentMove, history]);

  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function formatMoves(move) {
    let description;
    if (move === history.length - 1) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  }

  const movesInAsc = history.map((_, move) => formatMoves(move));
  const movesInDesc = function () {
    const rows = [];
    let historyLength = history.length - 1;
    for (let i = historyLength; i >= 0; i--) {
      rows.push(formatMoves(i));
    }
    return rows;
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          gameEndedWithoutAWinner={gameEndedWithoutAWinner}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setMovesInAsc(!isMovesInAsc)}>
          Sort moves in {isMovesInAsc ? "DESC" : "ASC"}
        </button>
        <ol>{isMovesInAsc ? movesInAsc : movesInDesc()}</ol>
      </div>
    </div>
  );
}

export default App;
