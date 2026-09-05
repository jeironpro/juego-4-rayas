import { PLAYER_1, PLAYER_2 } from './constants.js';
import { cloneBoard, createBoard, getLowestEmptyRow, isBoardFull } from './board.js';
import { getWinningLine } from './wins.js';

// Estados posibles de la partida
export const GAME_STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  DRAW: 'draw',
};

// Crea una partida nueva: tablero vacío, turno del jugador 1 y sin ganador
export function createGame() {
  return {
    board: createBoard(),
    turn: PLAYER_1,
    status: GAME_STATUS.PLAYING,
    winner: null,
    winningLine: null,
    lastMove: null,
  };
}

// Aplica una jugada en la columna indicada y devuelve la partida resultante.
// Si la columna está llena o la partida terminó, devuelve la partida sin cambios.
export function applyMove(game, column) {
  if (game.status !== GAME_STATUS.PLAYING) {
    return game;
  }
  const row = getLowestEmptyRow(game.board, column);
  if (row === -1) {
    return game;
  }

  const board = cloneBoard(game.board);
  board[row][column] = game.turn;

  const winningLine = getWinningLine(board, game.turn);
  if (winningLine !== null) {
    return {
      ...game,
      board,
      status: GAME_STATUS.WON,
      winner: game.turn,
      winningLine,
      lastMove: { row, column },
    };
  }

  const nextTurn = game.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
  return {
    ...game,
    board,
    turn: nextTurn,
    status: isBoardFull(board) ? GAME_STATUS.DRAW : GAME_STATUS.PLAYING,
    lastMove: { row, column },
  };
}
