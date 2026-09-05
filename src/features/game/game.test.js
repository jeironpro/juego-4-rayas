import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2, ROWS, COLUMNS } from './constants.js';
import { createGame, applyMove, GAME_STATUS } from './game.js';

// Secuencia que da la victoria al jugador 1 en la fila inferior (columnas 0 a 3)
const PLAYER_1_WIN_MOVES = [0, 6, 1, 6, 2, 6, 3];

// Pruebas del ciclo de vida de una partida
describe('game', () => {
    it('crea una partida vacía en curso', () => {
        const game = createGame();
        expect(game.turn).toBe(PLAYER_1);
        expect(game.status).toBe(GAME_STATUS.PLAYING);
        expect(game.winner).toBeNull();
        expect(game.winningLine).toBeNull();
    });

    it('alterna el turno tras cada jugada válida', () => {
        let game = createGame();
        game = applyMove(game, 3);
        expect(game.turn).toBe(PLAYER_2);
        game = applyMove(game, 0);
        expect(game.turn).toBe(PLAYER_1);
    });

    it('deja caer la bolita en la fila más baja de la columna', () => {
        let game = createGame();
        game = applyMove(game, 3);
        expect(game.board[ROWS - 1][3]).toBe(PLAYER_1);
        game = applyMove(game, 3);
        expect(game.board[ROWS - 2][3]).toBe(PLAYER_2);
        expect(game.lastMove).toEqual({ row: ROWS - 2, column: 3 });
    });

    it('ignora jugadas en columnas llenas', () => {
        let game = createGame();
        for (let row = 0; row < ROWS; row += 1) {
            game = applyMove(game, 1);
        }
        const before = game;
        expect(applyMove(game, 1)).toBe(before);
    });

    it('detecta la victoria y guarda al ganador con su línea', () => {
        let game = createGame();
        for (const column of PLAYER_1_WIN_MOVES) {
            game = applyMove(game, column);
        }
        expect(game.status).toBe(GAME_STATUS.WON);
        expect(game.winner).toBe(PLAYER_1);
        expect(game.winningLine).toHaveLength(4);
    });

    it('no permite jugar cuando la partida terminó', () => {
        let game = createGame();
        for (const column of PLAYER_1_WIN_MOVES) {
            game = applyMove(game, column);
        }
        const finished = game;
        expect(applyMove(finished, 4)).toBe(finished);
    });

    it('detecta el empate cuando el tablero se llena', () => {
        // Tablero completo verificado sin 4 en raya para ningún jugador,
        // con la celda (5, 0) vacía para que la última jugada lo llene
        const drawBoard = [
            [PLAYER_1, PLAYER_2, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_2, PLAYER_2],
            [PLAYER_2, PLAYER_2, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_1, PLAYER_2],
            [PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_1],
            [PLAYER_1, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_1],
            [PLAYER_1, PLAYER_2, PLAYER_1, PLAYER_1, PLAYER_1, PLAYER_2, PLAYER_2],
            [null, PLAYER_2, PLAYER_2, PLAYER_1, PLAYER_2, PLAYER_1, PLAYER_1],
        ];
        let game = { ...createGame(), board: drawBoard, turn: PLAYER_1 };
        game = applyMove(game, 0);
        expect(game.status).toBe(GAME_STATUS.DRAW);
        expect(game.winner).toBeNull();
        expect(game.winningLine).toBeNull();
    });

    it('termina la partida con victoria del jugador 2 en vertical', () => {
        let game = createGame();
        // Jugador 1: columnas 0, 2, 4, 3 — Jugador 2: columna 1 cuatro veces
        const moves = [0, 1, 2, 1, 4, 1, 3, 1];
        for (const column of moves) {
            game = applyMove(game, column);
        }
        expect(game.status).toBe(GAME_STATUS.WON);
        expect(game.winner).toBe(PLAYER_2);
        expect(game.winningLine).toHaveLength(4);
    });
});
