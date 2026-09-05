// Constantes del tablero y de los jugadores
export const COLUMNS = 7;
export const ROWS = 6;
export const WIN_LENGTH = 4;

// Celdas vacías y jugadores (el jugador 1 es humano, el 2 es el bot)
export const EMPTY = null;
export const PLAYER_1 = 'player1';
export const PLAYER_2 = 'player2';

// Direcciones para detectar victorias: horizontal, vertical y diagonales
export const DIRECTIONS = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
];
