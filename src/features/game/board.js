import { COLUMNS, ROWS, EMPTY } from './constants.js';

// Crea un tablero vacío de 7x6 (filas x columnas)
export function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
}

// Devuelve una copia independiente del tablero
export function cloneBoard(board) {
    return board.map((row) => [...row]);
}

// Devuelve la fila más baja libre de una columna, o -1 si la columna está llena
export function getLowestEmptyRow(board, column) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
        if (board[row][column] === EMPTY) {
            return row;
        }
    }
    return -1;
}

// Indica si una columna ya no acepta más bolitas
export function isColumnFull(board, column) {
    return getLowestEmptyRow(board, column) === -1;
}

// Indica si el tablero no tiene celdas vacías (empate)
export function isBoardFull(board) {
    return board.every((row) => row.every((cell) => cell !== EMPTY));
}
