import { describe, it, expect } from 'vitest';
import { PLAYER_1, PLAYER_2, ROWS } from '@/features/game/constants.js';
import { createGame, GAME_STATUS } from '@/features/game/game.js';
import { applyMove } from '@/features/game/game.js';
import { chooseMove, getLegalMoves } from './bot.js';
import { DIFFICULTY_DEPTHS } from './difficulty.js';

// Coloca bolitas en el tablero de una partida nueva
function gameWithMoves(moves) {
    let game = createGame();
    for (const column of moves) {
        game = applyMove(game, column);
    }
    return game;
}

// Tablero con una fila inferior casi completa del jugador indicado
function boardWithThreeInARow(board, player, columns) {
    for (const column of columns) {
        board[ROWS - 1][column] = player;
    }
    return board;
}

// Pruebas del bot
describe('bot', () => {
    it('define profundidades crecientes por dificultad', () => {
        expect(DIFFICULTY_DEPTHS.facil).toBeLessThan(DIFFICULTY_DEPTHS.medio);
        expect(DIFFICULTY_DEPTHS.medio).toBeLessThan(DIFFICULTY_DEPTHS.dificil);
    });

    it('devuelve null cuando la partida terminó', () => {
        const game = { ...createGame(), status: GAME_STATUS.WON, winner: PLAYER_1 };
        expect(chooseMove(game, 'dificil')).toBeNull();
    });

    it('devuelve null cuando no hay columnas libres', () => {
        const board = Array.from({ length: ROWS }, () => Array(7).fill(PLAYER_1));
        const game = { ...createGame(), board };
        expect(getLegalMoves(board)).toHaveLength(0);
        expect(chooseMove(game, 'dificil')).toBeNull();
    });

    it('elige la jugada ganadora inmediata en dificultad difícil', () => {
        const game = createGame();
        // El bot (jugador 2) tiene tres en la fila inferior apoyadas en el borde
        // (columnas 4 a 6): solo la columna 3 completa el cuatro
        boardWithThreeInARow(game.board, PLAYER_2, [4, 5, 6]);
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'dificil', () => 0);
        expect(column).toBe(3);
    });

    it('bloquea la victoria inmediata del rival en dificultad difícil', () => {
        const game = createGame();
        // El rival (jugador 1) tiene tres en la fila inferior apoyadas en el borde
        // (columnas 0 a 2): solo la columna 3 las tapa, y el bot no tiene jugada ganadora
        boardWithThreeInARow(game.board, PLAYER_1, [0, 1, 2]);
        boardWithThreeInARow(game.board, PLAYER_2, [4, 5]);
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'dificil', () => 0);
        expect(column).toBe(3);
    });

    it('elige la jugada ganadora inmediata también en dificultad media', () => {
        const game = createGame();
        boardWithThreeInARow(game.board, PLAYER_2, [4, 5, 6]);
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'medio', () => 0);
        expect(column).toBe(3);
    });

    it('bloquea la victoria inmediata del rival también en dificultad media', () => {
        const game = createGame();
        boardWithThreeInARow(game.board, PLAYER_1, [0, 1, 2]);
        boardWithThreeInARow(game.board, PLAYER_2, [4, 5]);
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'medio', () => 0);
        expect(column).toBe(3);
    });

    it('fuerza una victoria en dos jugadas en dificultad difícil', () => {
        const game = createGame();
        // El bot tiene dos bolitas separadas por un hueco (columnas 2 y 4): jugar
        // la columna 3 crea un tres en raya abierto por ambos extremos que el
        // rival no puede tapar por completo (solo bloquea un lado)
        boardWithThreeInARow(game.board, PLAYER_2, [2]);
        boardWithThreeInARow(game.board, PLAYER_2, [4]);
        boardWithThreeInARow(game.board, PLAYER_1, [0]);
        boardWithThreeInARow(game.board, PLAYER_1, [6]);
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'dificil', () => 0);
        expect(column).toBe(3);
    });

    it('elige el centro en un tablero vacío en dificultad difícil', () => {
        const game = createGame();
        game.turn = PLAYER_2;
        expect(chooseMove(game, 'dificil', () => 0)).toBe(3);
    });

    it('nunca elige una columna llena', () => {
        const game = gameWithMoves([3, 3, 3, 3, 3, 3]);
        game.turn = PLAYER_2;
        for (let i = 0; i < 10; i += 1) {
            const column = chooseMove(game, 'medio', () => 0);
            expect(column).not.toBe(3);
            expect(getLegalMoves(game.board)).toContain(column);
        }
    });

    it('elige una jugada legal en dificultad fácil', () => {
        const game = createGame();
        game.turn = PLAYER_2;
        const column = chooseMove(game, 'facil', () => 0.9);
        expect(getLegalMoves(game.board)).toContain(column);
    });
});
