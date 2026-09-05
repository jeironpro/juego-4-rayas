import { describe, it, expect } from 'vitest';
import { COLUMNS, ROWS, EMPTY, PLAYER_1 } from './constants.js';
import { createBoard, cloneBoard, getLowestEmptyRow, isColumnFull, isBoardFull } from './board.js';

// Pruebas de las utilidades del tablero
describe('board', () => {
    it('crea un tablero vacío de 7 columnas por 6 filas', () => {
        const board = createBoard();
        expect(board).toHaveLength(ROWS);
        expect(board[0]).toHaveLength(COLUMNS);
        expect(board.flat().every((cell) => cell === EMPTY)).toBe(true);
    });

    it('clona el tablero sin compartir referencias', () => {
        const board = createBoard();
        board[0][0] = PLAYER_1;
        const copy = cloneBoard(board);
        copy[0][0] = EMPTY;
        expect(board[0][0]).toBe(PLAYER_1);
    });

    it('devuelve la fila más baja libre de una columna', () => {
        const board = createBoard();
        board[ROWS - 1][2] = PLAYER_1;
        expect(getLowestEmptyRow(board, 2)).toBe(ROWS - 2);
        expect(getLowestEmptyRow(board, 0)).toBe(ROWS - 1);
    });

    it('detecta columnas llenas', () => {
        const board = createBoard();
        for (let row = 0; row < ROWS; row += 1) {
            board[row][0] = PLAYER_1;
        }
        expect(isColumnFull(board, 0)).toBe(true);
        expect(isColumnFull(board, 1)).toBe(false);
    });

    it('detecta cuando el tablero está lleno', () => {
        const board = createBoard();
        expect(isBoardFull(board)).toBe(false);
        const full = createBoard().map((row) => row.map(() => PLAYER_1));
        expect(isBoardFull(full)).toBe(true);
    });
});
