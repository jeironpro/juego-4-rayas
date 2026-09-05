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

// Devuelve los extremos de la línea que tacha la combinación ganadora en
// unidades de celda. La línea parte del borde de la primera bolita y llega
// al borde de la última, pasando por el centro de todas ellas
function getStrikeEnds(line) {
    const first = line[0];
    const last = line[line.length - 1];
    // dirección unitaria de la línea ganadora; el margen sobrepasa el radio
    // (0.42 de celda) de las bolitas extremas para tacharlas por completo
    const steps = line.length - 1;
    const stepRow = (last.row - first.row) / steps;
    const stepCol = (last.col - first.col) / steps;
    const margin = 0.5;
    return {
        x1: first.col + 0.5 - stepCol * margin,
        y1: first.row + 0.5 - stepRow * margin,
        x2: last.col + 0.5 + stepCol * margin,
        y2: last.row + 0.5 + stepRow * margin,
    };
}

// Tablero de 4 en raya: panel frontal con huecos, capa de bolitas detrás
// (z-index menor al tablero) y botones por columna para soltar bolitas
function Board({ board, winningLine, disabled = false, onDrop }) {
    // tolera winningLine null cuando la partida aún no terminó
    const line = winningLine ?? [];
    const isWinningCell = (row, col) => line.some((cell) => cell.row === row && cell.col === col);
    // extremos (en celdas) de la línea que tacha la combinación ganadora
    const strikeEnds = line.length >= 2 ? getStrikeEnds(line) : null;

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
            {strikeEnds !== null && (
                <svg
                    className="board__strike"
                    viewBox={`0 0 ${COLUMNS} ${ROWS}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                >
                    <line
                        x1={strikeEnds.x1}
                        y1={strikeEnds.y1}
                        x2={strikeEnds.x2}
                        y2={strikeEnds.y2}
                    />
                </svg>
            )}
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
