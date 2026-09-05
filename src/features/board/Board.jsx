import { COLUMNS, ROWS } from '@/features/game/constants.js';
import { isColumnFull } from '@/features/game/board.js';
import Ball from './Ball.jsx';
import './Board.css';

// Convierte el tablero en la lista de bolitas colocadas (fila, columna y jugador)
function listBalls(board) {
  const balls = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      const player = board[row][col];
      if (player !== null) {
        balls.push({ row, col, player });
      }
    }
  }
  return balls;
}

// Tablero de 4 en raya: panel frontal con huecos, capa de bolitas detrás
// (z-index menor al tablero) y botones por columna para soltar bolitas
function Board({ board, winningLine = [], disabled = false, onDrop }) {
  const isWinningCell = (row, col) =>
    winningLine.some((cell) => cell.row === row && cell.col === col);

  return (
    <div className="board">
      <div className="board__back" />
      <div className="board__balls">
        {listBalls(board).map(({ row, col, player }) => (
          <Ball
            key={`${row}-${col}`}
            player={player}
            winning={isWinningCell(row, col)}
            row={row}
            col={col}
          />
        ))}
      </div>
      <div className="board__front" aria-hidden="true" />
      <div className="board__columns">
        {Array.from({ length: COLUMNS }, (_, col) => (
          <button
            key={col}
            type="button"
            className="board__column"
            aria-label={`Columna ${col + 1}`}
            disabled={disabled || isColumnFull(board, col)}
            onClick={() => onDrop(col)}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
