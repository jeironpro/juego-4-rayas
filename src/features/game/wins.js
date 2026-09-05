import { COLUMNS, ROWS, WIN_LENGTH, DIRECTIONS } from './constants.js';

// Devuelve las celdas que forman una línea ganadora de un jugador, o null si no hay
export function getWinningLine(board, player) {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      if (board[row][col] !== player) {
        continue;
      }
      for (const { row: dr, col: dc } of DIRECTIONS) {
        const line = [];
        for (let step = 0; step < WIN_LENGTH; step += 1) {
          const nextRow = row + dr * step;
          const nextCol = col + dc * step;
          if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLUMNS) {
            break;
          }
          if (board[nextRow][nextCol] !== player) {
            break;
          }
          line.push({ row: nextRow, col: nextCol });
        }
        if (line.length === WIN_LENGTH) {
          return line;
        }
      }
    }
  }
  return null;
}

// Indica si un jugador tiene cuatro bolitas en raya
export function checkWin(board, player) {
  return getWinningLine(board, player) !== null;
}
