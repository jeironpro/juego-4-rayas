import { describe, it, expect } from 'vitest';
import { createBoard } from './board.js';
import { PLAYER_1, PLAYER_2 } from './constants.js';
import { getWinningLine, checkWin } from './wins.js';

// Tablero con una línea horizontal en la fila 2 (columnas 1 a 4)
function boardWithLine(place) {
  const board = createBoard();
  place(board);
  return board;
}

// Pruebas de detección de victorias en las cuatro direcciones
describe('wins', () => {
  it('detecta cuatro en raya horizontal', () => {
    const board = boardWithLine((b) => {
      for (let col = 1; col <= 4; col += 1) {
        b[2][col] = PLAYER_1;
      }
    });
    expect(checkWin(board, PLAYER_1)).toBe(true);
    expect(getWinningLine(board, PLAYER_1)).toHaveLength(4);
  });

  it('detecta cuatro en raya vertical', () => {
    const board = boardWithLine((b) => {
      for (let row = 2; row <= 5; row += 1) {
        b[row][3] = PLAYER_1;
      }
    });
    expect(checkWin(board, PLAYER_1)).toBe(true);
  });

  it('detecta cuatro en raya en diagonal ascendente', () => {
    const board = boardWithLine((b) => {
      for (let step = 0; step < 4; step += 1) {
        b[3 - step][1 + step] = PLAYER_1;
      }
    });
    expect(checkWin(board, PLAYER_1)).toBe(true);
  });

  it('detecta cuatro en raya en diagonal descendente', () => {
    const board = boardWithLine((b) => {
      for (let step = 0; step < 4; step += 1) {
        b[2 + step][2 + step] = PLAYER_1;
      }
    });
    expect(checkWin(board, PLAYER_1)).toBe(true);
  });

  it('no detecta victoria con solo tres bolitas', () => {
    const board = boardWithLine((b) => {
      for (let col = 1; col <= 3; col += 1) {
        b[2][col] = PLAYER_1;
      }
    });
    expect(checkWin(board, PLAYER_1)).toBe(false);
  });

  it('ignora bolitas del rival en la misma línea', () => {
    const board = boardWithLine((b) => {
      for (let col = 0; col < 4; col += 1) {
        b[2][col] = PLAYER_1;
      }
      b[2][4] = PLAYER_2;
    });
    expect(checkWin(board, PLAYER_2)).toBe(false);
    expect(checkWin(board, PLAYER_1)).toBe(true);
  });

  it('devuelve las celdas exactas de la línea ganadora', () => {
    const board = boardWithLine((b) => {
      for (let col = 3; col <= 6; col += 1) {
        b[5][col] = PLAYER_1;
      }
    });
    const line = getWinningLine(board, PLAYER_1);
    expect(line).toEqual([
      { row: 5, col: 3 },
      { row: 5, col: 4 },
      { row: 5, col: 5 },
      { row: 5, col: 6 },
    ]);
  });
});
